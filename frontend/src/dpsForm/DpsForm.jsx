import { useState } from 'react'
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

    function showSuggestions(event) {
        const suggestions = event.target.nextSibling;
        suggestions.style.display = "block";
    }

    function hideSuggestions(event) {
        console.log(event.target);

        // const suggestions = event.target.nextSibling;
        // suggestions.style.display = "none";
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

    function changePokemonName(event) {
        const suggestions = document.getElementById("name-suggestions");
        const pokemonName = event.target.innerText;

        setPokemonName(pokemonName);

        suggestions.style.display = "none";
        
    }
    
    const nameSuggestionsList = nameSuggestions.map((name, index) => (
        <div key={index} className="suggestion" onClick={changePokemonName}>
            {name}
        </div>
    ))

    return(
        <div className="form-container">
            <div className="form">
                <label>Dps Calculator</label><br /><br />
                <div className="input-container">
                    <input type="text" placeholder="Pokemon Name" value={pokemonName} onChange={handlePokemonNameChange} onFocus={showSuggestions} />
                    <div id="name-suggestions" className="suggestions">
                        {nameSuggestionsList}
                    </div> 
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Fast Move" onFocus={showSuggestions} onBlur={hideSuggestions}/>
                    <div className="suggestions"></div><br />
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Charged Move" onFocus={showSuggestions} onBlur={hideSuggestions}/>
                    <div className="suggestions"></div><br />
                </div>

                <input type="submit" value="Calculate" />
            </div>
        </div>
    )
}

export default DpsForm