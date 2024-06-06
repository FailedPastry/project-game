import React from 'react';
import { Link } from 'react-router-dom';
import DonateBtn from './DonateBtn';
import Auth from '../utils/auth';

const NavBar = () => {

	const loggedIn = Auth.loggedIn();

	return (
		<nav className="navbar">
			<Link to="/">Home</Link>
			<Link to="/games">Games</Link>
			<Link to="/leaderboard">Leaderboards</Link>
			{loggedIn ? <Link to="/profile">Profile</Link> : null}
			
			{loggedIn ? <button onClick={Auth.logout}>Logout</button> :
				<>
					<Link to="/login">Log In</Link>
					<Link to="/signup">Sign Up</Link>
				</>
			}
			
			<div className="search">
				<input type="text" placeholder="Search" />
				<button>Search</button>
			</div>

			<DonateBtn />
		</nav>
	);
}

export default NavBar;