import React from 'react';
import DonateBtn from './DonateBtn';
import Auth from '../utils/auth';

const NavBar = () => {

	const loggedIn = Auth.loggedIn();

	return (
		<nav className="navbar">
			<a href="/">Home</a>
			<a href="/games">Games</a>
			<a href="/leaderboard">Leaderboards</a>
			{loggedIn ? <a href="/profile">Profile</a> : null}
			
			{loggedIn ? <button onClick={Auth.logout}>Logout</button> :
				<div className="login">
					<a href="/login">Login</a>
					<a href="/login">Signup</a>
				</div>
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