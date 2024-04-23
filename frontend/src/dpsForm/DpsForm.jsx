import { useState, useEffect } from 'react'
import pokeBall from './assets/masterball.png'
import shinySnorlax from './assets/shiny-snorlax.png'
import eevee from './assets/eevee.png'
import tangela from './assets/tangela.png'
import weedle from './assets/weedle.png'
import pikachu from './assets/pikachu3.png'
import './DpsForm.css'

function DpsForm(props) {

    const [pokemonData, setPokemonData] = useState(props.pokemonData)
    const shadowPokemonList = props.shadowPokemonList;

    const apiUrl = "http://127.0.0.1:8080/api/pokemon/"

    // variables for input values
    const [storageLoaded, setStorageLoaded] = useState(false);
    const [pokemonName, setPokemonName] = useState(() => {
        const storedPokemonName = sessionStorage.getItem("pokemon-name");
        setStorageLoaded(true);
        return storedPokemonName ? storedPokemonName : "";
    });
    const [fastMove, setFastMove] = useState(() => {
        const storedFastMove = sessionStorage.getItem("fast-move");
        return storedFastMove ? storedFastMove : "";
    });
    const [chargedMove, setChargedMove] = useState(() => {
        const storedChargedMove = sessionStorage.getItem("charged-move");
        return storedChargedMove ? storedChargedMove : "";
    });

    useEffect(() => {
        sessionStorage.setItem("pokemon-name", pokemonName);
        sessionStorage.setItem("fast-move", fastMove);
        sessionStorage.setItem("charged-move", chargedMove);
        setStorageLoaded(true);
    }, [pokemonName, fastMove, chargedMove])

    useEffect(() => {
        const pokemon = pokemonData.filter(pokemon => (
            pokemon[0] === pokemonName
        ));

        setFastMoveSuggestions(pokemon[0][1]);
        setChargedMoveSuggestions(pokemon[0][2]);

    }, [storageLoaded])

    const [cp, setCp] = useState("");
    const [attackIv, setAttackIv] = useState(15);
    const [defenseIv, setDefenseIv] = useState(15);
    const [staminaIv, setStaminaIv] = useState(15);

    // Suggestions
    const pokemonNamesList = props.pokemonData.map(data => data[0])

    const [nameSuggestions, setNameSuggestions] = useState(pokemonNamesList);
    const [fastMoveSuggestions, setFastMoveSuggestions] = useState([])
    const [chargedMoveSuggestions, setChargedMoveSuggestions] = useState([])
    const [level, setLevel] = useState("Select Level");
    const [fastMoveSuggestionsList, setFastMoveSuggestionsList] = useState("");
    const [chargedMoveSuggestionsList, setChargedMoveSuggestionsList] = useState("");

    // Change form
    const [formByLevel, setFormByLevel] = useState(true);

    // Booleans
    const [isShiny, setIsShiny] = useState(false);
    const [isShadow, setIsShadow] = useState(false);

    function postPokemonData() {

        const data = {
            "name": pokemonName,
            "level": level,
            "iv": [attackIv, defenseIv, staminaIv],
            "cp": cp,
            "fast_move": fastMove,
            "charged_move": chargedMove,
            "is_shiny": isShiny,
            "is_shadow": isShadow
        }

        if (!cp) {
            delete data.cp;
        }else {
            delete data.level;
        }

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.style.display = 'block';

        fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Bad response")
            }
            return response.json()
        })
        .then(data => {
            data.fast_move = JSON.parse(`{${data.fast_move}}`);
            data.charged_move = JSON.parse(`{${data.charged_move}}`);

            const id = parseInt(Math.random() * 100000)
            localStorage.setItem(id, JSON.stringify(data));

            loadingScreen.style.display = 'none';
            window.location.reload()
        })

        .catch(error => {
            console.error("Error fetching data", error);
            loadingScreen.style.display = 'none';
            const errorMessage = document.getElementById("error-message-display");
            console.log(errorMessage);
            errorMessage.parentElement.style.zIndex = '10';
            errorMessage.classList.remove('hidden');
        })

        setLevel("Select Level:");
        setCp("");
        setAttackIv(15);
        setDefenseIv(15);
        setStaminaIv(15);
    }

    // Change list of displayed moves each time suggestion list changes 
    useEffect(() => {

        if (fastMoveSuggestions && chargedMoveSuggestions) {
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
        }
        
    }, [fastMoveSuggestions, chargedMoveSuggestions]);

    // Switch background of switches
    useEffect(() => {
        const switches = document.getElementById("switches");
        const byLevelSwitch = switches.children[0];
        const byCpSwitch = switches.children[1];

        if (formByLevel) {
            byLevelSwitch.style.background = "linear-gradient(to right, hsla(0, 0%, 7%, 0.863), hsla(219, 92%, 41%, 0.884)";
            byCpSwitch.style.background = "none";
        } else {
            byLevelSwitch.style.background = "none";
            byCpSwitch.style.background = "linear-gradient(to right, hsla(219, 92%, 41%, 0.884), hsla(0, 0%, 7%, 0.863)";
        }

    }, [formByLevel])

    function showSuggestions(event) {
        const suggestions = event.target.nextSibling;

        if (suggestions.className === "suggestions"){
            suggestions.className = "suggestions-visible";
        } else {
            suggestions.className = "suggestions";
        }
    }

    const [areLevelsVisible, setAreLevelsVisible] = useState(false);

    function showLevels() {
        const levels = document.getElementById("level-suggestions");
        const arrow = document.getElementById("arrow");

        if (!areLevelsVisible) {
            arrow.className = "arrow active";
            levels.className = "level-suggestions show-levels"
            levels.style.display = 'block';
        } else {
            arrow.className = "arrow unactive";
            levels.className = "level-suggestions hide-levels"
            setTimeout(() => {
                levels.style.display = "none";
            }, 300)
        }

        setAreLevelsVisible(!areLevelsVisible);

    }

    function hideSuggestions(event) {
        const levels = document.getElementById("level-suggestions");
    }

    function handlePokemonNameChange(event) {
        setPokemonName(event.target.value);

        const newSuggestions = pokemonNamesList.filter(
            name => pokemonName.length > 1 ? 
            name.toLowerCase().includes(pokemonName.toLocaleLowerCase()) :
            pokemonNamesList
        );

        // setNameSuggestions(newSuggestions.slice(0, newSuggestions.length / 2));
        setNameSuggestions(newSuggestions);
    }

    // On change functions
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

        setFastMove("");
        setChargedMove("");

        setFastMoveSuggestions(pokemon[0][1]);
        setChargedMoveSuggestions(pokemon[0][2]);

        setPokemonName(pokemonName);

        suggestions.className = "suggestions";
        
    }

    useEffect(() => {
        const isShadowContainer = document.getElementById("is-shadow-container")
        isShadowContainer.style.display = 'none';
        shadowPokemonList.forEach(name => {
            if (name === pokemonName || 'Groudon' === pokemonName || 'Kyogre' === pokemonName) {
                isShadowContainer.style.display = 'block';
                return;
            }
        })
    }, [pokemonName])

    function changeFastMove(event) {
        
        setFastMove(event.target.innerText);
        
        const suggestions = document.getElementById("fast-move-suggestions");
        suggestions.className = "suggestions";

    }

    function changeChargedMove(event) {

        setChargedMove(event.target.innerText);

        const suggestions = document.getElementById("charged-move-suggestions");
        suggestions.className = "suggestions";

    }

    function changeLevel(event) {

        setLevel(event.target.innerText);

        const levels = document.getElementById("level-suggestions");
        const arrow = document.getElementById("arrow");

        arrow.className = "arrow unactive"
        levels.className = "level-suggestions hide-levels"
        setTimeout(() => {
            levels.style.display = "none";
        }, 300)

        setAreLevelsVisible(!areLevelsVisible)

    }

    function changeCp(event) {
        setCp(event.target.value)
    }

    function handleIsShinyClick(event) {
        setIsShiny(event.target.checked);
    }

    function handleIsShadowClick(event) {
        setIsShadow(event.target.checked);
    }
    
    // content displayed in suggestions divs
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

    const ivPoints = [];
    for (let iv = 0; iv <= 15; iv++) {
        ivPoints.push(iv);
    }

    const ivPointsList = ivPoints.map((ivValue, index) => (
        <option key={index} value={ivValue}>{ivValue}</option>
    ))

    const [isFormVisible, setIsFormVisible] = useState(true);

    function toggleFormVisibility() {
        setIsFormVisible(!isFormVisible);
    }

    return(
        <div className="container">
            <div id="loading-screen" className="loading-screen">
                <div>
                    <img src={pokeBall} alt="Great_Ball" />
                </div>
            </div>
            <div id="title-container">
                <img id="shiny-snorlax" src={shinySnorlax} alt="Shiny_Snorlax" />
                <img id="tangela" src={tangela} alt="Tangela" />
                <img id="eevee" src={eevee} alt="Eevee" />
                <img id="weedle" src={weedle} alt="Weedle" />
                <img id="pikachu" src={pikachu} alt="Pikachu" />
                <h1 className="title" onClick={toggleFormVisibility}>DPS & TDO Pokemon Calculator</h1>
            </div>
            
            <div className="form-container" onClick={hideSuggestions}>
                <div className="form">
                    <br />

                    <div id="form-content" className={isFormVisible ? "form-content-visible" : "form-content-hidden"}>
                        {/* Form changing buttons */}
                        <div id="switches" className="switch-buttons">
                            <span onClick={() => setFormByLevel(true)}>Calculate by level</span>
                            <span onClick={() => setFormByLevel(false)}>Calculate by CP</span>
                        </div>

                        <div className="input-container">
                            <input type="text" placeholder="Pokemon Name" value={pokemonName} onChange={handlePokemonNameChange} onClick={showSuggestions} />
                            <div id="name-suggestions" className="suggestions">
                                {nameSuggestionsList}
                            </div> 
                        </div>

                        <div className="input-container">
                            <input type="text" placeholder="Fast Move" value={fastMove} onChange={handleFastMovecChange} onClick={showSuggestions} />
                            <div id="fast-move-suggestions" className="suggestions">
                                {fastMoveSuggestionsList}
                            </div>
                        </div>

                        <div className="input-container">
                            <input type="text" placeholder="Charged Move" value={chargedMove} onChange={handleChargedMoveChange} onClick={showSuggestions} />
                            <div id="charged-move-suggestions" className="suggestions">
                                {chargedMoveSuggestionsList}
                            </div>
                        </div>

                        {formByLevel 
                        ?   <div id="level-selector" className="level-select-container">
                                <div className="display-container" onClick={showLevels}>
                                    <div className="display-level">
                                        <p>{level}</p><button id="arrow" className="arrow">&#8249;</button>
                                    </div>
                                </div>
                                <div id="level-suggestions" className="level-suggestions" >
                                    {levelsList}
                                </div>
                            </div>
                        :   <div id="cp-input" className="input-container">
                                <input type="text" placeholder="CP" value={cp} onChange={changeCp}/>
                            </div>
                        }

                        <div className="iv-container">
                            <p>IV:</p>
                            <select value={attackIv} onChange={(event) => {setAttackIv(event.target.value)}} >
                                {ivPointsList}
                            </select>
                            <select value={defenseIv} onChange={(event) => {setDefenseIv(event.target.value)}} >
                                {ivPointsList}
                            </select>
                            <select value={staminaIv} onChange={(event) => {setStaminaIv(event.target.value)}} >
                                {ivPointsList}
                            </select>
                        </div>

                        <div className="checkbox-container">
                            <div>
                                <input id="is-shiny" type="checkbox" onClick={handleIsShinyClick}/>
                                <label htmlFor="is-shiny">Shiny</label>
                            </div>

                            <div id="is-shadow-container">
                                <input id="is-shadow" type="checkbox" onClick={handleIsShadowClick}/>
                                <label htmlFor="is-shadow">Shadow</label>
                            </div>                
                        </div>

                        <input type="submit" value="Calculate" onClick={postPokemonData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DpsForm