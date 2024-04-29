import { useState, useEffect } from 'react'
import RaidBosses from '../raidBosses/RaidBosses'
import threeStar from './assets/rareegg.png'
import fiveStar from './assets/legendaryegg.png'
import megaLegendaryEgg from './assets/megalegendegg.png'
import './RaidEggs.css'

function RaidEggs() {

    const [namesLoaded, setNamesLoaded] = useState(false);
    const [spritesLoaded, setSpritesLoaded] = useState(false);

    const [fiveStarRaids, setFiveStarRaids] = useState([]);
    const [megaRaids, setMegaRaids] = useState([]);
    const [chosenBosses, setChosenBosses] = useState([]);

    const [fiveStarSprites, setFiveStarSprites] = useState([]);
    const [megaSprites, setMegaSprites] = useState([]);
    const [chosenSprites, setChosenSprites] = useState([]);

    async function fetchPokemonData() {
        try {
            const fiveStarRaidResponse = await fetch('five_star_raids.txt')
            const megaRaidResponse = await fetch('mega_raids.txt')

            if (!fiveStarRaidResponse || !megaRaidResponse) {
                throw new Error("Failed to get raid pokemon data")
            }

            const fiveStarRaidData = await fiveStarRaidResponse.text()
            const megaRaidData = await megaRaidResponse.text()

            const fiveStarRaidArray = fiveStarRaidData.split('\n');
            const megaRaidArray = megaRaidData.split('\n');

            setFiveStarRaids([]);
            setMegaRaids([]);

            setFiveStarRaids(fiveStarRaidArray);
            setMegaRaids(megaRaidArray)

        } catch (error) {
            copnsole.error('Error fettching file:', error)
        }
    }

    async function fetchRaidBossesSprites() {
        // Five Star Raids sprites
        setFiveStarSprites([]);

        const specialForms = ['Origin', 'Altered', 'Therian', 'Incarnate']
        for (let index = 0; index < fiveStarRaids.length; index++) {
            let raidBoss = fiveStarRaids[index].split(' ');
            if (specialForms.includes(raidBoss[0])) {
                [raidBoss[0], raidBoss[1]] = [raidBoss[1], raidBoss[0]]
            }
            raidBoss = raidBoss.join('-').replace('\r', '').toLowerCase();

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${raidBoss}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch Raid Boss sprite')
                }

                const data = await response.json();
                const sprite = data.sprites.other['official-artwork'].front_default;

                setFiveStarSprites(prev => ([...prev, sprite]))

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        setMegaSprites([]);

        for (let index = 0; index < megaRaids.length; index++) {
            let raidBoss = megaRaids[index].split(' ');
            [raidBoss[0], raidBoss[1]] = [raidBoss[1], raidBoss[0]];
            raidBoss = raidBoss.join('-').replace('\r', '').toLowerCase();

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${raidBoss}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch Raid Boss sprite')
                }

                const data = await response.json();
                const sprite = data.sprites.other['official-artwork'].front_default;

                setMegaSprites(prev => ([...prev, sprite]))

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    }

    useEffect(() => {
        fetchPokemonData()
            .then(() => {
                setNamesLoaded(true);
            })

        return () => {
            setFiveStarRaids([]);
            setMegaRaids([]);
        }

    }, [])

    useEffect(() => {
        fetchRaidBossesSprites()
            .then(() => {
                setSpritesLoaded(true);
            });

        return () => {
            setFiveStarSprites([]);
            setMegaSprites([]);
        }

    }, [namesLoaded])

    const raidTypes = { "Five_Star_Egg": fiveStarRaids, "Mega_Egg": megaRaids }
    const raidSprites = { "Five_Star_Egg": fiveStarSprites, "Mega_Egg": megaSprites }

    function selectRaidType(event) {
        const eggs = document.getElementById('raid-eggs').children;
        const chosenEgg = event.target.parentElement;
        const eggsArray = Array.from(eggs)

        eggsArray.forEach(egg => {
            egg === chosenEgg ? egg.classList.add("chosen") : egg.classList.remove("chosen");
        })

        setChosenBosses(raidTypes[`${chosenEgg.children[0].alt}`]);
        setChosenSprites(raidSprites[`${chosenEgg.children[0].alt}`]);

    }

    return (
        <>
            <div id="raid-eggs">
                <div className="egg-container">
                    <img src={fiveStar} alt="Five_Star_Egg" onClick={selectRaidType} />
                </div>
                <div className="egg-container">
                    <img src={megaLegendaryEgg} alt="Mega_Egg" onClick={selectRaidType} />
                </div>
            </div>
            {spritesLoaded && <RaidBosses pokemonList={chosenBosses} pokemonSprites={chosenSprites} />}
        </>
    )
}

export default RaidEggs