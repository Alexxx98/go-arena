import { useState } from 'react'
import './DpsForm.css'

function DpsForm(props) {

    // variables for input values
    const [pokemonName, setPokemonName] = useState("");
    const [fastMove, setFastMove] = useState("");
    const [chargedMove, setChargedMove] = useState("");

    // Suggestions
    const pokemonSuggestionNames = [props.pokemonData.map(data => data[0])]

    const [nameSuggestions, setNamesSuggestions] = useState(pokemonSuggestionNames);
    const [fastMoveSuggestions, setFastMoveSuggestions] = useState([]);
    const [chargedMoveSuggestions, setChargedMoveSuggestions] = useState([]);

    function showSuggestions(event) {
        const suggestions = event.target.nextSibling;
        suggestions.style.display = "block";
    }

    function hideSuggestions(event) {
        const suggestions = event.target.nextSibling;
        suggestions.style.display = "none";
    }

    function handlePokemonNameChange(event) {
        setPokemonName(event.target.value)
    }
    
    const nameSuggestionsList = nameSuggestions;


    return(
        <div className="form-container">
            <form>
                <label>Dps Calculator</label><br /><br />
                <div>
                    <input type="text" placeholder="Pokemon Name" value={pokemonName} onChange={handlePokemonNameChange} onFocus={showSuggestions} onBlur={hideSuggestions} />
                    <div className="suggestions">
                    </div> 
                </div><br />

                <input type="text" placeholder="Fast Move" onFocus={showSuggestions} onBlur={hideSuggestions}/>
                <div className="suggestions"></div><br />

                <input type="text" placeholder="Charged Move" onFocus={showSuggestions} onBlur={hideSuggestions}/>
                <div className="suggestions"></div><br />

                <input type="submit" value="Calculate" />
            </form>
        </div>
    )
}

export default DpsForm