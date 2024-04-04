import './Navbar.css'
import userIcon from './assets/user-icon.png'

function Navbar() {
    return(
        <div className="navbar">
            <ul className="left-side">
                <li>Home</li>
                <li>Dps</li>
            </ul>
            <h1>Go Arena</h1>
            <ul className="right-side">
                <li><img src={userIcon} alt="User Icon" /></li>
            </ul>
        </div>
    )
}

export default Navbar