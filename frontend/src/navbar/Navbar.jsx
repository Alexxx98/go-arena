import './Navbar.css'

function Navbar() {

    function switchToDps() {
        const dps = document.getElementById('dps-container');
        const raid = document.getElementById('raid-teams-container');

        dps.style.display = 'flex';

        setTimeout(() => {
            dps.style.left = "0%";
            raid.style.right = "-100%";
        }, 100)

        setTimeout(() => {
            raid.style.display = "none"
        }, 700)
    }

    function switchToRaidTeams() {
        const dps = document.getElementById('dps-container');
        const raid = document.getElementById('raid-teams-container');

        raid.style.display = 'flex';

        setTimeout(() => {
            raid.style.right = "0%";
            dps.style.left = "-100%";
        }, 100)

        setTimeout(() => {
            dps.style.display = "none"
        }, 700)
    }

    return (
        <div className="navbar">
            <div className="navbar-content">
                <ul className="left-side">
                    <li onClick={switchToDps}>Dps&Tdo</li>
                    <li onClick={switchToRaidTeams}>Raid Teams</li>
                </ul>
                <h1>Go Arena</h1>
            </div>
        </div>
    )

}


export default Navbar