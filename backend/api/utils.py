import requests
import os
import math
from typing import List

# API urls
POGOAPI= "https://pogoapi.net"
POKEAPI = "https://pokeapi.co/api/v2/pokemon/"

# Endpoints
# PoGoAPI
STATS = "/api/v1/pokemon_stats.json"
FAST_MOVES = "/api/v1/fast_moves.json"
CHARGED_MOVES = "/api/v1/charged_moves.json"
TYPES = "/api/v1/pokemon_types.json"
MEGA_POKEMON_DATA = "/api/v1/mega_pokemon.json"

# Const varaibles
DEFENSE = 200


def set_session_data(request):
    if not (
        request.session.get('types')
        and request.session.get('fast_moves')
        and request.session.get('charged_moves')
        and request.session.get('stats')
        and request.session.get('mega_data')
    ):
        # Fetch data
        types_data = requests.get(POGOAPI + TYPES).json()
        stats_data = requests.get(POGOAPI + STATS).json()
        fast_moves_data = requests.get(POGOAPI + FAST_MOVES).json()
        charged_moves_data = requests.get(POGOAPI + CHARGED_MOVES).json()
        mega_pokemon_data = requests.get(POGOAPI + MEGA_POKEMON_DATA).json()

        # Save data in session storage
        request.session['types'] = types_data
        request.session['stats'] = stats_data
        request.session['fast_moves'] = fast_moves_data
        request.session['charged_moves'] = charged_moves_data
        request.session['mega_data'] = mega_pokemon_data


def handle_pokemon_name(pokemon_name: str) -> List[str]:
    name_list = pokemon_name.split()
    if len(name_list) == 2 and name_list[1] != 'Darmanitan':
        return name_list[0], name_list[1]
    elif len(name_list) == 2 and name_list[1] == 'Darmanitan':
        return 'Galarian_standard', 'Darmanitan'
    elif len(name_list) == 1 and name_list[0] == 'Darmanitan':
        return 'Standard', 'Darmanitan'
    return ["Normal", pokemon_name]


def get_pokemon_types(request, original_pokemon_name):
    data = request.session.get('types')
    mega_data = request.session.get('mega_data')

    pokemon_name_length = len(original_pokemon_name.split()) 
    if pokemon_name_length <= 2: 
        pokemon_form, pokemon_name = handle_pokemon_name(original_pokemon_name)

    if not 'Primal' in original_pokemon_name and not 'Mega' in original_pokemon_name:
        for pokemon in data:
            if pokemon['pokemon_name'] == pokemon_name and pokemon['form'] == pokemon_form:
                return pokemon['type']
    else:
        for pokemon in mega_data:
            if pokemon['mega_name'] == original_pokemon_name:
                return pokemon['type']

        
def get_pokemon_stats(request, original_pokemon_name):
    data = request.session.get('stats')
    mega_data = request.session.get('mega_data')

    if len(original_pokemon_name.split()) <= 2:
        pokemon_form, pokemon_name = handle_pokemon_name(original_pokemon_name)

    if not 'Primal' in original_pokemon_name and not 'Mega' in original_pokemon_name:
        for pokemon in data:
            if pokemon['pokemon_name'] == pokemon_name and pokemon['form'] == pokemon_form:
                return [pokemon['base_attack'], pokemon['base_defense'], pokemon['base_stamina']]
    else:
        for pokemon in mega_data:
            if pokemon['mega_name'] == original_pokemon_name:
                return [pokemon['stats']['base_attack'], pokemon['stats']['base_defense'], pokemon['stats']['base_stamina']]
        

def get_pokemon_sprite(original_pokemon_name, is_shiny):
    name_list = original_pokemon_name.split()

    if len(name_list) < 2:
        if original_pokemon_name == 'Darmanitan':
            pokemon_name = 'darmanitan-standard'
        else: 
            pokemon_name = original_pokemon_name
    else:
        if name_list[0] == 'Origin':
            pokemon_name = f'{name_list[1]}-origin'
        elif original_pokemon_name == 'Galarian Darmanitan':
            pokemon_name = 'darmanitan-galar-standard'
        elif name_list[0] == 'Galarian' and name_list[1] != 'Darmanitan':
            pokemon_name = f'{name_list[1]}-galar'
        elif name_list[0] == 'Alola':
            pokemon_name = f'{name_list[1]}-alola'
        elif name_list[0] in ('Primal', 'Mega') and len(name_list) == 2:
            pokemon_name = f'{name_list[1]}-{name_list[0]}'
        elif name_list[0] in ('Primal', 'Mega') and len(name_list) > 2: 
            pokemon_name = f'{name_list[1]}-{name_list[0]}-{name_list[2]}'

    pokemon_data = requests.get(POKEAPI + pokemon_name.lower()).json()
    if is_shiny:
        pokemon_sprite = pokemon_data['sprites']['other']['official-artwork']['front_shiny']
    else: 
        pokemon_sprite = pokemon_data['sprites']['other']['official-artwork']['front_default']

    return pokemon_sprite


def get_combat_power_multiplier(level):
    filename = 'api/multiplier.json'
    level = float(level)
    with open(filename, 'r') as file:
        content = [line for line in file]
        for index, line in enumerate(content):
            if str(level) in line:
                return float(content[index + 1].split()[1])
            

def get_level(cpm):
    filename = 'api/multiplier.json'
    with open(filename, 'r') as file:
        content = [line for line in file]
        for index, line in enumerate(content):
            if "multiplier" in line:
                num = f'{float(line.split()[1]):.3f}'
                if f'{cpm:.3f}' == num:
                    return float(content[index - 1].split()[1].replace(',', ''))
                

def get_fast_move(request, fast_move_name):
    fast_moves_data = request.session.get('fast_moves')

    for move_data in fast_moves_data:
        if move_data['name'] == fast_move_name:
            return move_data
        

def get_charged_move(request, charged_move_name):
    charged_moves_data = request.session.get('charged_moves')

    for move_data in charged_moves_data:
        if move_data['name'] == charged_move_name:
            return move_data
                    

def get_pokemon_dps(request, pokemon_name, fast_move_name, charged_move_name, iv_attack, level, types, is_shadow):
    # Get require data
    base_attack = get_pokemon_stats(request, pokemon_name)[0]
    fast_move = get_fast_move(request, fast_move_name)
    charged_move = get_charged_move(request, charged_move_name)

    attacker_cpm = get_combat_power_multiplier(level)
    defender_cpm = get_combat_power_multiplier(40)
    attack = (base_attack + iv_attack) * attacker_cpm
    defense = DEFENSE * defender_cpm

    # Calculate modifiers for both moves
    fast_move_modifier = 1
    charged_move_modifier = 1
    if is_shadow:
        fast_move_modifier *= 1.2
        charged_move_modifier *= 1.2
    if fast_move['type'] in types:
        fast_move_modifier *= 1.2
    if charged_move['type'] in types:
        charged_move_modifier *= 1.2


    # Moves power
    # fast_move_power = (0.5 * attack / defense * fast_move['power'] * fast_move_modifier) + 0.5
    # charged_move_power = (0.5 * attack / defense * charged_move['power'] * charged_move_modifier) + 0.5

    fast_move_power = (0.5 * attack / defense * fast_move['power'] * fast_move_modifier) + 1
    charged_move_power = (0.5 * attack / defense * charged_move['power'] * charged_move_modifier) + 1

    # fast_move_power = math.floor(0.5 * attack / defense * fast_move['power'] * fast_move_modifier) + 1
    # charged_move_power = math.floor(0.5 * attack / defense * charged_move['power'] * charged_move_modifier) + 1

    # Move damage per second
    fast_move_dps = fast_move_power / fast_move['duration'] * 1000
    charged_move_dps = charged_move_power / charged_move['duration'] * 1000

    # Moves energy cost per second
    fast_move_eps = fast_move['energy_delta'] / fast_move['duration'] * 1000
    if charged_move['energy_delta'] * -1 >= 100:
        charged_move_eps = (charged_move['energy_delta'] * -1 + 0.5 * fast_move['energy_delta']) / charged_move['duration'] * 1000
    else:
        charged_move_eps = charged_move['energy_delta'] * -1 / charged_move['duration'] * 1000

    dps = (fast_move_dps * charged_move_eps + charged_move_dps * fast_move_eps) / (charged_move_eps + fast_move_eps)

    return f'{dps:.2f}'
    

def calculate_cp(stats, iv, level):
    attack, defense, stamina = stats
    attack_iv, defense_iv, stamina_iv = iv

    attack += attack_iv
    defense += defense_iv
    stamina += stamina_iv

    cp_multiplier = get_combat_power_multiplier(level)
    return attack * defense**0.5 * stamina**0.5 * cp_multiplier**2 / 10


def calculate_level(stats, iv, cp):
    attack, defense, stamina = stats
    attack_iv, defense_iv, stamina_iv = iv

    attack += attack_iv
    defense += defense_iv
    stamina += stamina_iv

    cp_multiplier = (10 * cp / (attack * defense ** 0.5 * stamina ** 0.5)) ** 0.5 
    return get_level(cp_multiplier)

