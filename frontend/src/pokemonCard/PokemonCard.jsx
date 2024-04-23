import React from 'react'
import { useState, useEffect } from 'react'
import typesColors from './assets/types-colors.json'
import typesImages from './assets/types-images.json'
import shadowFog from './assets/shadow-fog1.png'
import './PokemonCard.css'

function PokemonCard() {

    const [pokemonList, setPokemonList] = useState([])

    useEffect(() => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const pokemonData = JSON.parse(localStorage.getItem(key));
            setPokemonList(prevPokemonList => ([...prevPokemonList, {key: key, data: pokemonData}]))
        }

        return () => {
            setPokemonList([]);
        }

    }, [])

    function removeAllPokemonCards() {
        localStorage.clear()
        
        setPokemonList([])

        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.style.display = 'none';


    }

    function deletePokemon(event) {
        const container = event.target.parentElement.parentElement;
        const pokemonId = container.id

        const updatedPokemonList = pokemonList.filter(pokemon => 
            pokemon.key !== pokemonId
        )

        setPokemonList(updatedPokemonList);

        localStorage.removeItem(pokemonId);
    }

    const pokemonCardsList = pokemonList.map((pokemon, index) => (
        <div key={index} className="card-box">
        <div className="card-shadow-box" style={
            pokemon.data.types.length > 1 
            ? {background: `linear-gradient(to right, ${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}, ${typesColors[`${pokemon.data.types[1].toLowerCase()}`]})`}
            : {backgroundColor: `${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}`}
        }>
        </div>
        <div id={pokemon.key} className="card-container">
            <div className="upper-part" style={
                pokemon.data.types.length > 1 
                ? {background: `linear-gradient(to right, ${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}, ${typesColors[`${pokemon.data.types[1].toLowerCase()}`]})`}
                : {backgroundColor: `${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}`}
                }>
                <span onMouseEnter={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '1'} onClick={deletePokemon}>&#10005;</span>
                <span className="for-hover" onMouseEnter={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '1'}
                    onMouseLeave={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '0'}></span>
                <img className="sprite" src={`${pokemon.data.image}`} alt={`${pokemon.data.name}`} />
                {pokemon.data.is_shadow 
                && <img className="shadow-fog" src={shadowFog} alt="Shadow_Fog" />}
                <p onMouseEnter={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '1'}>
                    {`${pokemon.data.name}`}
                </p>
                <img className="type-one-img" src={typesImages[`${pokemon.data.types[0].toLowerCase()}`]} alt="type_one" />
                {pokemon.data.types.length > 1 && <img className="type-two-img" src={typesImages[`${pokemon.data.types[1].toLowerCase()}`]} alt="type_two" />}
            </div>
            <div id="card-lower-part" className="lower-part">
                <span className="for-hover" onMouseEnter={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '1'}
                    onMouseLeave={(event) => event.target.parentElement.parentElement.previousElementSibling.style.opacity = '0'}></span>
                <p>{`${pokemon.data.cp}`} CP</p>
                <p>{`${pokemon.data.level}`} LVL</p>
                <p>{`${pokemon.data.iv[0]}/${pokemon.data.iv[1]}/${pokemon.data.iv[2]}`} Iv</p>
                <p>{`${pokemon.data.dps}`} DPS</p>
                <p style={
                    {backgroundColor: typesColors[`${pokemon.data.fast_move.type.toLowerCase()}`]}
                }>
                    {`${pokemon.data.fast_move.name}`}
                </p>
                <p style={
                    {backgroundColor: typesColors[`${pokemon.data.charged_move.type.toLowerCase()}`]}
                }>
                    {`${pokemon.data.charged_move.name}`}
                </p>
             </div>
        </div>
        </div>
    ))

    return(
        <>
            <div id="button-container">
                {pokemonList.length > 0 && <button onClick={removeAllPokemonCards}>Remove All</button>}
            </div>
            <div id="cards-container" className="cards-container">
                {pokemonCardsList}
            </div>
        </>
    )
}

export default PokemonCard