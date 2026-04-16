"""API views for the Prompts app — plain Django views returning JSON."""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

from .models import Prompt, Tag
from .validators import validate_prompt_data
from .redis_client import increment_view_count, get_view_count


def serialize_prompt(prompt, include_content=False, include_view_count=False):
    """Serialize a Prompt instance to a dict."""
    data = {
        'id': prompt.id,
        'title': prompt.title,
        'complexity': prompt.complexity,
        'created_at': prompt.created_at.isoformat(),
        'tags': list(prompt.tags.values_list('name', flat=True)),
    }
    if include_content:
        data['content'] = prompt.content
    if include_view_count:
        data['view_count'] = get_view_count(prompt.id)
    return data


@csrf_exempt
@require_http_methods(["GET", "POST"])
def prompt_list_create(request):
    """
    GET  /api/prompts/       → List all prompts (with optional ?tag= filter)
    POST /api/prompts/       → Create a new prompt (auth required in bonus)
    """
    if request.method == "GET":
        prompts = Prompt.objects.all()

        # Bonus B: filter by tag
        tag_filter = request.GET.get('tag')
        if tag_filter:
            prompts = prompts.filter(tags__name__iexact=tag_filter)

        data = [serialize_prompt(p) for p in prompts]
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        # Parse JSON body
        try:
            body = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse(
                {'error': 'Invalid JSON body.'},
                status=400
            )

        # Validate
        errors = validate_prompt_data(body)
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Create prompt
        prompt = Prompt.objects.create(
            title=body['title'].strip(),
            content=body['content'].strip(),
            complexity=int(body['complexity']),
        )

        # Bonus B: handle tags
        tags_input = body.get('tags', [])
        if isinstance(tags_input, str):
            tags_input = [t.strip() for t in tags_input.split(',') if t.strip()]
        if tags_input:
            for tag_name in tags_input:
                tag, _ = Tag.objects.get_or_create(name=tag_name.lower().strip())
                prompt.tags.add(tag)

        return JsonResponse(
            serialize_prompt(prompt, include_content=True),
            status=201
        )


@require_http_methods(["GET"])
def prompt_detail(request, pk):
    """
    GET /api/prompts/:id/    → Retrieve a single prompt + increment view count
    """
    try:
        prompt = Prompt.objects.get(pk=pk)
    except Prompt.DoesNotExist:
        return JsonResponse({'error': 'Prompt not found.'}, status=404)

    # Increment view count in Redis (source of truth)
    view_count = increment_view_count(prompt.id)

    data = serialize_prompt(prompt, include_content=True)
    data['view_count'] = view_count

    return JsonResponse(data)


# ─── Bonus A: Authentication Views ───────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """POST /api/auth/login/ → Authenticate user and create session."""
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    username = body.get('username', '')
    password = body.get('password', '')

    if not username or not password:
        return JsonResponse(
            {'error': 'Username and password are required.'},
            status=400
        )

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({
            'message': 'Login successful.',
            'user': {
                'id': user.id,
                'username': user.username,
            }
        })
    else:
        return JsonResponse(
            {'error': 'Invalid credentials.'},
            status=401
        )


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """POST /api/auth/logout/ → End user session."""
    logout(request)
    return JsonResponse({'message': 'Logged out successfully.'})


@require_http_methods(["GET"])
def session_view(request):
    """GET /api/auth/session/ → Check if user is authenticated."""
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
            }
        })
    return JsonResponse({'authenticated': False})


# ─── Tags list endpoint ──────────────────────────────────────────────────────

@require_http_methods(["GET"])
def tag_list(request):
    """GET /api/tags/ → List all tags."""
    tags = Tag.objects.all().values_list('name', flat=True)
    return JsonResponse(list(tags), safe=False)
