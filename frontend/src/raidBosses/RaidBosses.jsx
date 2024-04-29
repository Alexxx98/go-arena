import { useState, useEffect } from 'react'
import './RaidBosses.css'

function RaidBosses(props) {

    const [searchValue, setSearchValue] = useState("");

    const [pokemonList, setPokemonList] = useState([]);
    const [raidBosses, setRaidBosses] = useState([]);

    useEffect(() => {
        props.pokemonList.map((pokemon, index) => (
            setPokemonList(prev => ([...prev, { name: pokemon.replace('\r', ''), sprite: props.pokemonSprites[index] }]))
        ))

        return () => {
            setPokemonList([])
        }

    }, [props.pokemonList, props.spritesList])

    useEffect(() => {
        setRaidBosses(pokemonList);

        return () => {
            setRaidBosses([]);
        }

    }, [pokemonList])

    function handleSearchValueChange(event) {
        const newSearchValue = event.target.value

        const newPokemonList = pokemonList.filter(pokemon => (
            newSearchValue.length > 0
                ?
                pokemon.name.toLowerCase().includes(newSearchValue.toLowerCase())
                : pokemonList
        ))

        setSearchValue(newSearchValue);
        setRaidBosses(newPokemonList);
    }

    console.log(raidBosses);

    const raidBossesDisplayed = raidBosses.map((boss, index) => (
        <div key={index} className="raid-boss">
            <img src={boss.sprite} alt={boss.name} />
            <p>{boss.name}</p>
        </div>
    ))

    return (
        <>
            <div id="input-container">
                <div>
                    <input id="search-bar" type="text" value={searchValue} onChange={handleSearchValueChange} onBlur={() => setSearchValue("")} />
                    <label htmlFor="search-bar">Search Raid Boss:</label>
                    <span>&#9740;</span>
                </div>
            </div>
            <div id="raid-bosses">
                {raidBossesDisplayed}
            </div>
        </>
    )
}

export default RaidBosses