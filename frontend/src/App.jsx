import { useState, useEffect, useRef } from 'react'
import Navbar from './navbar/Navbar.jsx'
import DpsForm from './dpsForm/DpsForm.jsx'
import PokemonCard from './pokemonCard/PokemonCard.jsx'
import './App.css'

function App() {

  const [PoGOAPI, setPoGOAPI] = useState("https://pogoapi.net");
  const [currentPokemonMoves, setCurrentPokemonMoves] = useState("/api/v1/current_pokemon_moves.json");
  const [shadowPokemonEndpoint, setShadowPokemonEndpoint] = useState("/api/v1/shadow_pokemon.json");
  const megaPokemonEndpoint = "/api/v1/mega_pokemon.json";

  // const pokemonData = [];

  const [validForms, setValidForms] = useState(['Normal', 'Alola', 'Galarian', 'Hisuian', 'Origin', 'Altered']);

  const [loading, setLoading] = useState(true);
  const [shadowPokemonList, setShadowPokemonList] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  async function fetchData() {

    try {
      const currentMovesResponse = await fetch(PoGOAPI + currentPokemonMoves);
      const shadowPokemonResponse = await fetch(PoGOAPI + shadowPokemonEndpoint);
      const megaPokemonResponse = await fetch(PoGOAPI + megaPokemonEndpoint);
  
      if (!currentMovesResponse.ok || !shadowPokemonResponse || !megaPokemonResponse) {
        throw new Error("Could not fetch data");
      }
  
      const currentMovesData = await currentMovesResponse.json()
      const shadowPokemonData = await shadowPokemonResponse.json()
      const megaPokemonData = await megaPokemonResponse.json()
      
      setPokemonData([])
      setShadowPokemonList([]);

      // Assemble all moves and pokemon names from current moves data
      for (let index = 0; index < currentMovesData.length; index++) {
        const pokemon = currentMovesData[index]
        if (validForms.includes(pokemon.form)) {
          setPokemonData(prevPokemonData => ([...prevPokemonData, 
            [pokemon.form === 'Normal' ? pokemon.pokemon_name : pokemon.form + " " + pokemon.pokemon_name,
            pokemon.fast_moves.concat(pokemon.elite_fast_moves),
            pokemon.charged_moves.concat(pokemon.elite_charged_moves)]
          ]))
        }
      }

      // Assemble possible shadow pokemon list
      for (let index = 1; index < 592; index++) {
        const pokemon = shadowPokemonData[index]
        if (pokemon) {
          setShadowPokemonList(prevShadowPokemonList => ([...prevShadowPokemonList, pokemon.name]));
        }
      }

      megaPokemonData.forEach(pokemon => {
        for (let index = 0; index < currentMovesData.length; index++) {
          const data = currentMovesData[index];
          if (pokemon.pokemon_id === data.pokemon_id) {
            setPokemonData(prevPokemonData => (
              [...prevPokemonData, [
                pokemon.mega_name,
                data.fast_moves.concat(pokemon.elite_fast_moves),
                data.charged_moves.concat(pokemon.elite_charged_moves)
              ]]
            ))
          }
        }
      })

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
      setPokemonData([]);
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
