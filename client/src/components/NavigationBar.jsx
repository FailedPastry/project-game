import React from 'react';
import { Link } from 'react-router-dom';
import DonateBtn from './DonateBtn';
import Auth from '../utils/auth';

const NavBar = () => {

	const loggedIn = Auth.loggedIn();
	const [dropDownOpen, setDropDownOpen] = React.useState(false);

	const toggleDropDown = () => {
		setDropDownOpen(!dropDownOpen);
	}

	return (
		<nav className="navbar">
			<div className="desktop-menu">
				<Link to="/">Home</Link>
				<Link to="/games">Games</Link>
				<Link to="/leaderboard">Leaderboards</Link>
				{loggedIn ? <Link to="/profile">Profile</Link> : null}
				
				{loggedIn ? <button onClick={Auth.logout}>Logout</button> :
					<>
						<Link to="/login">Log In</Link>
						{/* <Link to="/signup">Sign Up</Link> */}
					</>
				}
				
				{/* <div className="search">
					<input type="text" placeholder="Search" />
					<button>Search</button>
				</div>  */}
				{/* <DonateBtn /> */}
			</div>

			<div className="mobile-menu">
				<button onClick={toggleDropDown}>Menu</button>
				{dropDownOpen ? 
					<div className="mobile-dropdown">
						<Link to="/">Home</Link>
						<Link to="/games">Games</Link>
						<Link to="/leaderboard">Leaderboards</Link>
						{loggedIn ? <Link to="/profile">Profile</Link> : null}
						{loggedIn ? <button onClick={Auth.logout}>Logout</button> :
							<>
								<Link to="/login">Log In</Link>
								{/* <Link to="/signup">Sign Up</Link> */}
							</>
						}
						{/* <div className="search">
							<input type="text" placeholder="Search" />
							<button>Search</button>
						</div> */}
						{/* <DonateBtn /> */}
					</div>
					: null
				}
			</div>
		</nav>
	);
}

export default NavBar;