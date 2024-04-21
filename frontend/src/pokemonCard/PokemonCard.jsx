import React from 'react'
import { useState, useEffect } from 'react'
import typesColors from './assets/types-colors.json'
import typesImages from './assets/types-images.json'
// import shadowFog from 'assets/shadow-fog1.png'
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

    function hideSprite(event) {
        const sprite = event.target.previousElementSibling;
        const deleteButton = sprite.previousElementSibling; 
        
        if (sprite.style.display === 'none') {
            sprite.className = 'sprite show-sprite';
            sprite.style.display = 'block';
            deleteButton.style.display = 'block';
        } else {
            sprite.className = 'sprite hide-sprite';
            setTimeout(() => {
                sprite.style.display = 'none';
            }, 300);
        }
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
        <div id={pokemon.key} key={index} className="card-container">
            <div className="upper-part" style={
                pokemon.data.types.length > 1 
                ? {background: `linear-gradient(to right, ${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}, ${typesColors[`${pokemon.data.types[1].toLowerCase()}`]})`}
                : {backgroundColor: `${typesColors[`${pokemon.data.types[0].toLowerCase()}`]}`}
                }>
                <span onClick={deletePokemon}>&#10005;</span>
                <img className="sprite" src={`${pokemon.data.image}`} alt={`${pokemon.data.name}`} />
                <p onClick={hideSprite} className={
                    pokemon.data.is_shadow ? "shadow-fog" : ""
                    }>{`${pokemon.data.name}`}</p>
                <img className="type-one-img" src={typesImages[`${pokemon.data.types[0].toLowerCase()}`]} alt="type_one" />
                {pokemon.data.types.length > 1 && <img className="type-two-img" src={typesImages[`${pokemon.data.types[1].toLowerCase()}`]} alt="type_two" />}
            </div>
            <div id="card-lower-part" className="lower-part">
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
    ))

    return(
        <div id="cards-container" className="cards-container">
            {pokemonList.length > 0 && <button onClick={removeAllPokemonCards}>Remove All</button>}
            {pokemonCardsList}
        </div>
    )
}

export default PokemonCard