import { useState, useEffect, useRef } from 'react'
import Navbar from './navbar/Navbar.jsx'
import DpsForm from './dpsForm/DpsForm.jsx'
import PokemonCard from './pokemonCard/PokemonCard.jsx'
import ErrorMessage from './errorMessage/ErrorMessage.jsx'
import RaidEggs from './raidEggs/RaidEggs.jsx'
import darkrai from './assets/Darkrai.png'
import './App.css'

function App() {

  const [PoGOAPI, setPoGOAPI] = useState("https://pogoapi.net");
  const [currentPokemonMoves, setCurrentPokemonMoves] = useState("/api/v1/current_pokemon_moves.json");
  const [shadowPokemonEndpoint, setShadowPokemonEndpoint] = useState("/api/v1/shadow_pokemon.json");
  const [megaPokemonEndpoint, setMegaPokemonEndpoint] = useState("/api/v1/mega_pokemon.json");

  const [validForms, setValidForms] = useState(['Normal', 'Alola', 'Galarian', 'Hisuian', 'Origin', 'Altered', 'Standard', 'Galarian_standard']);

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
        const pokemonChargedMoves = pokemon.charged_moves.concat(pokemon.elite_charged_moves)
        const pokemonName = ['Normal', 'Standard'].includes(pokemon.form)
          ? pokemon.pokemon_name
          : pokemon.form === 'Galarian_standard'
            ? 'Galarian' + " " + pokemon.pokemon_name
            : pokemon.form + " " + pokemon.pokemon_name
        pokemon.pokemon_name === 'Rayquaza' && pokemonChargedMoves.push('Dragon Ascent')
        if (validForms.includes(pokemon.form)) {
          setPokemonData(prevPokemonData => ([...prevPokemonData,
          [pokemonName,
            pokemon.fast_moves.concat(pokemon.elite_fast_moves),
            pokemonChargedMoves]
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

      setShadowPokemonList(prevShadowPokemonList => ([...prevShadowPokemonList, 'Darumaka']))
      setShadowPokemonList(prevShadowPokemonList => ([...prevShadowPokemonList, 'Darmanitan']))

      const pokemonMegaNamesList = [];
      megaPokemonData.forEach(pokemon => {
        for (let index = 0; index < currentMovesData.length; index++) {
          const data = currentMovesData[index];
          const pokemonChargedMoves = data.charged_moves.concat(data.elite_charged_moves);
          pokemon.mega_name === 'Mega Rayquaza' && pokemonChargedMoves.push('Dragon Ascent');
          if (pokemon.pokemon_name === data.pokemon_name && !pokemonMegaNamesList.includes(pokemon.mega_name)) {
            pokemonMegaNamesList.push(pokemon.mega_name);
            setPokemonData(prevPokemonData => ([...prevPokemonData, [
              pokemon.mega_name,
              data.fast_moves.concat(data.elite_fast_moves),
              pokemonChargedMoves
            ]]
            ))
          }
        }
      })
    }


    catch (error) {
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
    <div id="app-container">
      <Navbar />
      <div id="dps-container" className="dps-container">
        {!loading && <ErrorMessage />}
        {!loading && <DpsForm pokemonData={pokemonData} shadowPokemonList={shadowPokemonList} />}
        {!loading && <PokemonCard />}
        <div id="up-we-go-container">
          <button id="up-we-go" onClick={moveToTheTop}>&#8249;</button>
        </div>
      </div>
      <div id="raid-teams-container">
        <img id="darkrai" src={darkrai} alt="Darkrai" />
        <h1>Raid Teams</h1>
        <RaidEggs />
      </div>
    </div>
  )
}

export default App
