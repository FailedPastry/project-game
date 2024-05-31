import React from 'react';
import Auth from '../utils/auth';

const NavBar = () => {
	return (
		<nav className="navbar">
			<div className="login">
				<a href="/login">Login</a>
				<button onClick={Auth.logout}>Logout</button>
			</div>
		</nav>
	);
}

export default NavBar;