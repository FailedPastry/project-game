import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Ensure you have some basic styles for the Home component

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Space Invaders</h1>
      <div className="links">
        <Link to="/game" className="link-button">Start Game</Link>
        <Link to="/leaderboard" className="link-button">Leaderboard</Link>
        <Link to="/login" className="link-button">Login</Link>
        <Link to="/register" className="link-button">Register</Link>
        <Link to="/donate" className="link-button">Donate</Link>
      </div>
    </div>
  );
};

export default Home;
