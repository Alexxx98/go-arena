import { useState, useEffect } from 'react'
import Navbar from './navbar/Navbar.jsx'
import DpsForm from './dpsForm/DpsForm.jsx'

const apiUrl = "https://pogoapi.net"
const currentPokemonMoves = "/api/v1/current_pokemon_moves.json"

const pokemonData = [];

const validForms = ['Normal', 'Alola', 'Galarian', 'Hisuian', 'Origin', 'Altered', 'Galarian_standard', 'Galrian_zen']

async function fetchData() {

  try {
    const response = await fetch(apiUrl + currentPokemonMoves)

    if (!response.ok) {
      throw new Error("Could not fetch data");
    }

    const data = await response.json()

    for (let index = 0; index < data.length; index++) {
      let pokemon = data[index]
      if (validForms.includes(pokemon.form)) {
        pokemonData.push([
          pokemon.form === 'Normal' ? pokemon.pokemon_name : pokemon.form + " " + pokemon.pokemon_name,
          pokemon.fast_moves.concat(pokemon.elite_fast_moves),
          pokemon.charged_moves.concat(pokemon.elite_charged_moves)
        ])
      }
    }
  }

  catch(error){
    console.error(error);
  }
}

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(() => {
      setLoading(false)
    });
    
    return () => {
      pokemonData.slice(0, pokemonData.length);
    }
  }, [])

  return (
    <>
      <Navbar />
      {!loading && <DpsForm pokemonData = {pokemonData} />}
    </>
  )
}

export default App
