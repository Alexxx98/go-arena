import { useState, useEffect } from 'react'
import RaidBosses from '../raidBosses/RaidBosses'
import threeStar from './assets/rareegg.png'
import fiveStar from './assets/legendaryegg.png'
import megaLegendaryEgg from './assets/megalegendegg.png'
import './RaidEggs.css'

function RaidEggs() {

    const [loaded, setLoaded] = useState(false);
    const [threeStarRaids, setThreeStarRaids] = useState([]);
    const [fiveStarRaids, setFiveStarRaids] = useState([]);
    const [megaRaids, setMegaRaids] = useState([]);
    const [chosenBosses, setChosenBosses] = useState([]);

    async function fetchPokemonData() {
        try {
            const threeStarRaidResponse = await fetch('three_star_raids.txt')
            const fiveStarRaidResponse = await fetch('five_star_raids.txt')
            const megaRaidResponse = await fetch('mega_raids.txt')

            if (!threeStarRaidResponse || !fiveStarRaidResponse || !megaRaidResponse) {
                throw new Error("Failed to get raid pokemon data")
            }

            const threeStarRaidData = await threeStarRaidResponse.text()
            const fiveStarRaidData = await fiveStarRaidResponse.text()
            const megaRaidData = await megaRaidResponse.text()

            const threeStarRaidArray = threeStarRaidData.split('\n');
            const fiveStarRaidArray = fiveStarRaidData.split('\n');
            const megaRaidArray = megaRaidData.split('\n');

            setThreeStarRaids([]);
            setFiveStarRaids([]);
            setMegaRaids([]);

            setThreeStarRaids(threeStarRaidArray);
            setFiveStarRaids(fiveStarRaidArray);
            setMegaRaids(megaRaidArray)

        } catch (error) {
            copnsole.error('Error fettching file:', error)
        }
    }

    useEffect(() => {
        fetchPokemonData().then(() => {
            setLoaded(true);
        });

        return () => {
            setThreeStarRaids([]);
            setFiveStarRaids([]);
            setMegaRaids([]);
        }

    }, [])

    const raidTypes = { "Three_Star_Egg": threeStarRaids, "Five_Star_Egg": fiveStarRaids, "Mega_Egg": megaRaids }

    function selectRaidType(event) {
        const eggs = document.getElementById('raid-eggs').children;
        const chosenEgg = event.target.parentElement;
        const eggsArray = Array.from(eggs)

        eggsArray.forEach(egg => {
            egg === chosenEgg ? egg.classList.add("chosen") : egg.classList.remove("chosen");
        })

        setChosenBosses(raidTypes[`${chosenEgg.children[0].alt}`]);

    }

    return (
        <>
            <div id="raid-eggs">
                <div className="egg-container">
                    <img src={threeStar} alt="Three_Star_Egg" onClick={selectRaidType} />
                </div>
                <div className="egg-container">
                    <img src={fiveStar} alt="Five_Star_Egg" onClick={selectRaidType} />
                </div>
                <div className="egg-container">
                    <img src={megaLegendaryEgg} alt="Mega_Egg" onClick={selectRaidType} />
                </div>
            </div>
            {loaded && <RaidBosses pokemonList={chosenBosses} />}
        </>
    )
}

export default RaidEggs