from .serializers import PokemonSerializer
from .models import Pokemon
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .utils import (
    set_session_data,
    get_pokemon_types,
    get_pokemon_dps,
    get_pokemon_sprite,
    calculate_level,
    calculate_cp,
    get_pokemon_stats,
    get_fast_move,
    get_charged_move
    )


# Create your views here.
class PokemonCardCreate(generics.ListCreateAPIView):
    serializer_class = PokemonSerializer

    def get_queryset(self):
        set_session_data(self.request)
        queryset = self.request.session.get('pokemon_data')

        return queryset
    
    def perform_create(self, serializer):
        if not self.request.session.get('pokemon_data'):
            set_session_data(self.request)

        data = serializer.validated_data
        pokemon_name = data['name']
        pokemon_iv = data['iv']
        pokemon_fast_move = data['fast_move']
        pokemon_charged_move = data['charged_move']
        pokemon_stats = get_pokemon_stats(self.request, pokemon_name)

        try: 
            data['cp']
        except KeyError:
            data['cp'] = calculate_cp(pokemon_stats, pokemon_iv, data['level'])

        try:
            data['level']
        except KeyError:
            data['level'] = calculate_level(pokemon_stats, pokemon_iv, data['cp'])

        data['types'] = get_pokemon_types(self.request, pokemon_name)
        
        data['image'] = get_pokemon_sprite(pokemon_name, data['is_shiny'])

        data['dps'] = get_pokemon_dps(self.request, pokemon_name, pokemon_fast_move, pokemon_charged_move, pokemon_iv[0], data['level'], data['types'], data['is_shadow'])

        fast_move_data = get_fast_move(self.request, pokemon_fast_move)
        charged_move_data = get_charged_move(self.request, pokemon_charged_move)

        data['fast_move'] = f'"name": "{pokemon_fast_move}", "type": "{fast_move_data["type"]}"'
        data['charged_move'] = f'"name": "{pokemon_charged_move}", "type": "{charged_move_data["type"]}"'

        if not self.request.session.get('pokemon_data'):
            self.request.session['pokemon_data'] = []

        session_data = self.request.session.get('pokemon_data')
        session_data.append(data)
        self.request.session['pokemon_data'] = session_data

        return Response(data, status=status.HTTP_201_CREATED)
    

class PokemonCardDelete(generics.DestroyAPIView):
    serializer_class = PokemonSerializer

    def get_queryset(self):
        queryset = self.requests.session.get('pokemon_data')

        return queryset
