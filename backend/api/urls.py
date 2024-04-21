from django.urls import path
from . import views

urlpatterns = [
    path("pokemon/", views.PokemonCardCreate.as_view(), name="pokemon_card")
]