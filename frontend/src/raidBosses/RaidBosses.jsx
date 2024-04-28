import { useState, useEffect } from 'react'
import './RaidBosses.css'

function RaidBosses(props) {

    const [searchValue, setSearchValue] = useState("");
    const [pokemonList, setPokemonList] = useState(props.pokemonList);
    const [raidBosses, setRaidBosses] = useState(props.pokemonList);

    useEffect(() => {
        setPokemonList(props.pokemonList);
        setRaidBosses(props.pokemonList);
    }, [props.pokemonList])

    function handleSearchValueChange(event) {
        const newSearchValue = event.target.value
        console.log(newSearchValue);

        const newPokemonList = pokemonList.filter(pokemon => (
            newSearchValue.length > 0
                ?
                pokemon.toLowerCase().includes(newSearchValue.toLowerCase())
                : pokemonList
        ))

        setSearchValue(newSearchValue);
        setRaidBosses(newPokemonList);
    }

    const raidBossesDisplayed = raidBosses.map((boss, index) => (
        <div key={index} className="raid-boss">
            {boss}
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