from django.db import models


class Tag(models.Model):
    """Tag model for categorizing prompts (Bonus B)."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Prompt(models.Model):
    """AI Image Generation Prompt model."""
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, related_name='prompts', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
