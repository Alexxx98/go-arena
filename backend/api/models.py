from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Pokemon(models.Model):
    name = models.CharField(max_length=64)
    level = models.FloatField(blank=True)
    types = ArrayField(models.CharField(max_length=10), size=2, default=list)
    iv = ArrayField(models.IntegerField(default=15), size=3, default=list)
    cp = models.IntegerField(default=None, blank=True)
    fast_move = models.CharField(max_length=64)
    charged_move = models.CharField(max_length=64)
    dps = models.FloatField(blank=True)
    image = models.URLField(blank=True)
    is_shiny = models.BooleanField(default=False)
    is_shadow = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.name}'
    
