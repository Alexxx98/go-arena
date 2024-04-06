import { useState, useEffect } from 'react'
import './DpsForm.css'

function DpsForm(props) {

    const pokemonData = props.pokemonData;

    // variables for input values
    const [pokemonName, setPokemonName] = useState("");
    const [fastMove, setFastMove] = useState("");
    const [chargedMove, setChargedMove] = useState("");

    // Suggestions
    const pokemonNamesList = props.pokemonData.map(data => data[0])

    const [nameSuggestions, setNameSuggestions] = useState(pokemonNamesList);
    const [fastMoveSuggestions, setFastMoveSuggestions] = useState([]);
    const [chargedMoveSuggestions, setChargedMoveSuggestions] = useState([]);
    const [level, setLevel] = useState("Select Level");

    const [fastMoveSuggestionsList, setFastMoveSuggestionsList] = useState("");
    const [chargedMoveSuggestionsList, setChargedMoveSuggestionsList] = useState("")


    useEffect(() => {

        if (fastMoveSuggestions.length > 0 && chargedMoveSuggestions.length > 0) {
            setFastMoveSuggestionsList(fastMoveSuggestions.map((move, index) => (
                <div key={index} className="suggestion" onClick={changeFastMove}>
                    {move}
                </div>
            )));

            setChargedMoveSuggestionsList(chargedMoveSuggestions.map((move, index) => (
                <div key={index} className="suggestion" onClick={changeChargedMove}>
                    {move}
                </div>
            )));
        }
        
    }, [fastMoveSuggestions, chargedMoveSuggestions]);

    function showSuggestions(event) {
        const suggestions = event.target.nextSibling;
        suggestions.style.display = "block";
    }

    function showLevels() {
        const levels = document.getElementById("level-suggestions");
        levels.style.display = 'block';
    }

    function hideSuggestions(event) {
        const levels = document.getElementById("level-suggestions");
        console.log(event);
    }

    function handlePokemonNameChange(event) {
        setPokemonName(event.target.value);

        const newSuggestions = pokemonNamesList.filter(
            name => pokemonName.length > 0 ? 
            name.includes(pokemonName) :
            pokemonNamesList
        );

        setNameSuggestions(newSuggestions);
    }

    function handleFastMovecChange(event) {
        setFastMove(event.target.value);
    }

    function handleChargedMoveChange(event) {
        setChargedMove(event.target.value);
    }

    function changePokemonName(event) {
        const suggestions = document.getElementById("name-suggestions");
        const pokemonName = event.target.innerText;

        const pokemon = pokemonData.filter(pokemon => (
            pokemon[0] === pokemonName
        ));

        console.log(pokemon[0])

        setFastMove("");
        setChargedMove("");

        setFastMoveSuggestions(pokemon[0][1]);
        setChargedMoveSuggestions(pokemon[0][2]);

        setPokemonName(pokemonName);

        suggestions.style.display = "none";
        
    }

    function changeFastMove(event) {
        
        setFastMove(event.target.innerText);
        
        const suggestions = document.getElementById("fast-move-suggestions");
        suggestions.style.display = "none";

    }

    function changeChargedMove(event) {

        setChargedMove(event.target.innerText);

        const suggestions = document.getElementById("charged-move-suggestions");
        suggestions.style.display = "none";

    }

    function changeLevel(event) {

        setLevel(event.target.innerText);

        const levels = document.getElementById("level-suggestions");
        levels.style.display = "none";

    }
    
    const nameSuggestionsList = nameSuggestions.map((name, index) => (
        <div key={index} className="suggestion" onClick={changePokemonName}>
            {name}
        </div>
    ));

    const levels = [];
    for (let level = 51; level > 0.5; level -= 0.5) {
        levels.push(level)
    };

    const levelsList = levels.map((level, index) => (
        <div key={index} className="level" onClick={changeLevel}>{level}</div>
    ))

    return(
        <div className="form-container" onClick={hideSuggestions}>
            <div className="form">
                <label>Dps Calculator</label><br /><br />
                <div className="input-container">
                    <input type="text" placeholder="Pokemon Name" value={pokemonName} onChange={handlePokemonNameChange} onFocus={showSuggestions} />
                    <div id="name-suggestions" className="suggestions">
                        {nameSuggestionsList}
                    </div> 
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Fast Move" value={fastMove} onChange={handleFastMovecChange} onFocus={showSuggestions} />
                    <div id="fast-move-suggestions" className="suggestions">
                        {fastMoveSuggestionsList}
                    </div>
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Charged Move" value={chargedMove} onChange={handleChargedMoveChange} onFocus={showSuggestions} />
                    <div id="charged-move-suggestions" className="suggestions">
                        {chargedMoveSuggestionsList}
                    </div>
                </div>

                <div className="level-select-container">
                    <div onClick={showLevels}>
                        <p>{level} &darr;</p>
                    </div>
                    <div id="level-suggestions" className="level-suggestions" >
                        {levelsList}
                    </div>
                </div><br />

                <input type="submit" value="Calculate" />
            </div>
        </div>
    )
}

export default DpsForm