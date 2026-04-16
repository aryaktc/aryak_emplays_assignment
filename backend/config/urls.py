"""URL configuration for the AI Prompt Library project."""

from django.contrib import admin
from django.urls import path, include
from prompts.views import tag_list

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/prompts/', include('prompts.urls')),
    path('api/auth/', include('prompts.auth_urls')),
    path('api/tags/', tag_list, name='tag-list'),
]
