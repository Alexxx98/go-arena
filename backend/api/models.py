from django.db import models

# Create your models here.
class Pokemon(models.Model):
    name = models.CharField(max_length=64)
    level = models.IntegerField()
    type_one = models.CharField(max_length=16)
    type_two = models.CharField(default=None, max_length=16)
    fast_move = models.CharField(max_length=64)
    charged_move = models.CharField(max_length=64)
    image = models.URLField()

    def __str__(self):
        return f'{self.name}'
    
