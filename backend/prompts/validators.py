"""Validation utilities for prompt data."""


def validate_prompt_data(data):
    """
    Validate prompt creation data.
    Returns a dict of field errors, or None if valid.
    """
    errors = {}

    # Title validation
    title = data.get('title', '')
    if not title or not isinstance(title, str):
        errors['title'] = 'Title is required.'
    elif len(title.strip()) < 3:
        errors['title'] = 'Title must be at least 3 characters.'
    elif len(title.strip()) > 255:
        errors['title'] = 'Title must not exceed 255 characters.'

    # Content validation
    content = data.get('content', '')
    if not content or not isinstance(content, str):
        errors['content'] = 'Content is required.'
    elif len(content.strip()) < 20:
        errors['content'] = 'Content must be at least 20 characters.'

    # Complexity validation
    complexity = data.get('complexity')
    if complexity is None:
        errors['complexity'] = 'Complexity is required.'
    else:
        try:
            complexity = int(complexity)
            if complexity < 1 or complexity > 10:
                errors['complexity'] = 'Complexity must be between 1 and 10.'
        except (ValueError, TypeError):
            errors['complexity'] = 'Complexity must be a valid integer.'

    return errors if errors else None
