import { useState, useEffect, useRef } from 'react'
import Navbar from './navbar/Navbar.jsx'
import DpsForm from './dpsForm/DpsForm.jsx'
import PokemonCard from './pokemonCard/PokemonCard.jsx'
import './App.css'

const PoGOAPI = "https://pogoapi.net";
const currentPokemonMoves = "/api/v1/current_pokemon_moves.json";
const shadowPokemonEndpoint = "/api/v1/shadow_pokemon.json";

const pokemonData = [];

const validForms = ['Normal', 'Alola', 'Galarian', 'Hisuian', 'Origin', 'Altered']

function App() {

  const [loading, setLoading] = useState(true);
  const [shadowPokemonList, setShadowPokemonList] = useState([]);

  async function fetchData() {

    try {
      const currentMovesResponse = await fetch(PoGOAPI + currentPokemonMoves);
      const shadowPokemonResponse = await fetch(PoGOAPI + shadowPokemonEndpoint);
  
      if (!currentMovesResponse.ok || !shadowPokemonResponse) {
        throw new Error("Could not fetch data");
      }
  
      const currentMovesData = await currentMovesResponse.json()
      const shadowPokemonData = await shadowPokemonResponse.json()
  
      // Assemble all moves and pokemon names from current moves data
      for (let index = 0; index < currentMovesData.length; index++) {
        let pokemon = currentMovesData[index]
        if (validForms.includes(pokemon.form)) {
          pokemonData.push([
            pokemon.form === 'Normal' ? pokemon.pokemon_name : pokemon.form + " " + pokemon.pokemon_name,
            pokemon.fast_moves.concat(pokemon.elite_fast_moves),
            pokemon.charged_moves.concat(pokemon.elite_charged_moves)
          ])
        }
      }

      // Assemble possible shadow pokemon list
        for (let index = 1; index < 592; index++) {
          const pokemon = shadowPokemonData[index]
          if (pokemon) {
            setShadowPokemonList(prevShadowPokemonList => ([...prevShadowPokemonList, pokemon.name]));
          }
        }

    }
  
    catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData().then(() => {
      setLoading(false)
    });
    
    return () => {
      pokemonData.slice(0, pokemonData.length);
      setShadowPokemonList([]);
    }
  }, [])

  function moveToTheTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <>
      <div id="dps-container" className="dps-container">
        {!loading && <DpsForm pokemonData={pokemonData} shadowPokemonList={shadowPokemonList}/>}
        {!loading && <PokemonCard />}
        <button id="up-we-go" onClick={moveToTheTop}>&#8249;</button>
      </div>
    </>
  )
}

export default App
