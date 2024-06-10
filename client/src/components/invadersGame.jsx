import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import BulletController from './invadersSubcomponents/BulletController';
import EnemyController from './invadersSubcomponents/EnemyController';
import Player from './invadersSubcomponents/Player';

import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ADD_SCORE } from '../utils/mutations';
import Auth from '../utils/auth';

const Canvas = styled.canvas`
	border: 2px solid black;
	display: block;
	margin: 0 auto;
`;

const Info = styled.div`
	text-align: center;
	margin-top: 10px;
`;
const GameOverBanner = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.8);
	padding: 50px;
	text-align: center;
	color: red;
	font-size: 50px;
	font-weight: bold;
	z-index: 1000;
`;

const GameWrapper = styled.div`
	position: relative;
	width: 800px;
	height: 600px;
	margin: 0 auto;
`;

const invadersGame = () => {
	const [addScoreMutation] = useMutation(ADD_SCORE);
	const [score, setScore] = useState(0);
	const [direction, setDirection] = useState(null);
	const [scoreSent, setScoreSent] = useState(false);

	const myProfile = Auth.loggedIn() ? Auth.getProfile() : null;
	const userId = myProfile?.data?._id;
	const { gameId } = useParams();

	const scoreRef = useRef(score);

	const addScore = useCallback(() => {
		addScoreMutation({
			variables: {
				userId: userId,
				score: scoreRef.current,
				gameId,
			},
		});
	}, [addScoreMutation, userId, gameId]);



	const canvasRef = useRef(null);
	const [context, setContext] = useState(null);
	const [player, setPlayer] = useState({
		x: 200,
		y: 400,
		width: 50,
		height: 50,
		speed: 5,
		bullets: [],
		score: 0,
		lives: 3,
		level: 1,
	});

	const [lost, setLost] = useState(false);
	const [showGameOver, setShowGameOver] = useState(false);
	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const enemyBulletController = useRef(null);
	const playerBulletController = useRef(null);
	const enemyController = useRef(null);
	const playerRef = useRef(null);
	const background = useRef(null);
	
	
	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	useEffect(() => {
		if (lost && userId && !scoreSent) {
			addScore();
			setScoreSent(true);
		}
	}, [lost, userId, addScore]);

	useEffect(() => {
		console.log(lost);
	  }, [lost]);

	useEffect(() => {
		const canvas = canvasRef.current;
		setContext(canvas.getContext('2d'));

		enemyBulletController.current = new BulletController(
			canvas,
			10,
			'red',
			false
		);
		playerBulletController.current = new BulletController(
			canvas,
			10,
			'yellow',
			true
		);
		enemyController.current = new EnemyController(
			canvas,
			enemyBulletController.current,
			playerBulletController.current
		);
		playerRef.current = new Player(canvas, 5, playerBulletController.current);

		background.current = new Image();
		background.current.src = '/invadersAssets/images/space.png'; // Ensure this path is correct
		background.current.onload = () => {
			// console.log('Background image loaded');
			requestAnimationFrame(gameLoop);
		};
		background.current.onerror = () => {
			console.error('Error loading background image');
		};

		// Log to verify
		// console.log('playerBulletController', playerBulletController.current);
		// console.log('enemyController', enemyController.current);
		// console.log('playerRef', playerRef.current);
	}, []);

	const handleKeyDown = (e) => {
		if (playerRef.current) {
			playerRef.current.keydown(e);
		}
	};

	const handleKeyUp = (e) => {
		if (playerRef.current) {
			playerRef.current.keyup(e);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	const checkCollision = (rect1, rect2) => {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y
		);
	};

	const handleGameOver = () => {
		if (lost || scoreSent) return;
		setShowGameOver(true);
		setLost(true);
		console.log('Score: ', scoreRef.current);
		console.log('userId: ', userId);
		console.log('gameId: ', gameId);
	};

	const restartGame = () => {
		window.location.reload(); // Refresh the page to restart the game
	};

	const addScoreToLeaderboard = () => {
		setShowLeaderboard(true);
	};

	const update = useCallback(() => {
		if (!context || lost) return;

		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.drawImage(
			background.current,
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);

		// Draw player
		if (playerRef.current) {
			playerRef.current.draw(context);
		}

		// Draw player bullets
		playerBulletController.current.draw(context);

		// Draw enemy bullets
		enemyBulletController.current.draw(context);

		// Draw enemies
		if (enemyController.current) {
			enemyController.current.draw(context);
		}

		// Check for player bullet collision with enemies
		playerBulletController.current.bullets.forEach((bullet, bulletIndex) => {
			if (enemyController.current.collideWith(bullet) && !lost) {
				playerBulletController.current.bullets.splice(bulletIndex, 1);
				setPlayer((prev) => ({
					...prev,
					score: prev.score + 10,
				}));
				setScore((prev) => prev + 10);
			}
		});

		// Check for enemy bullet collision with player
		if (enemyBulletController.current.collideWith(playerRef.current)) {
			setPlayer((prev) => {
				const newLives = Math.max(prev.lives - 1, 0);
				if (newLives <= 0) {
					handleGameOver();
				}
				return {
					...prev,
					lives: newLives,
				};
			});
		}

		// Check for enemy collision with player
		enemyController.current.enemyRows.flat().forEach((enemy) => {
			if (checkCollision(enemy, playerRef.current)) {
				// console.log('Enemy hit player', enemy);
				setPlayer((prev) => {
					const newLives = Math.max(prev.lives - 1, 0);
					if (newLives <= 0) {
						handleGameOver();
					}
					return {
						...prev,
						lives: newLives,
					};
				});
			}
		});

		// Check for level completion
		if (
			enemyController.current &&
			enemyController.current.enemyRows.flat().length === 0
		) {
			setPlayer((prev) => ({ ...prev, level: prev.level + 1 }));
			enemyController.current.createEnemies();
		}
	}, [context, player, lost]);

	const gameLoop = () => {
		if (context && !lost ) {
			update();
			if (!lost) {
				requestAnimationFrame(gameLoop);
			}
		}
	};

	useEffect(() => {
		if (context && !lost) {
			requestAnimationFrame(gameLoop);
		}
	}, [context, update, lost]);

	return (
		<div>
			<Canvas ref={canvasRef} width={800} height={600} id="gameCanvas" />
			<Info>
				<div>Score: {player.score}</div>
				<div>Lives: {player.lives}</div>
				<div>Level: {player.level}</div>
				{lost && <div>You lost!</div>}
			</Info>
			{showGameOver && (
				<GameOverBanner>
					<div>Game Over</div>
					<button className="invaders-btn" onClick={restartGame}>Restart Game</button>
					{/* <button onClick={addScoreToLeaderboard}>
						Add Score to Leaderboard
					</button> */}
				</GameOverBanner>
			)}
			{showLeaderboard && (
				<div className="leaderboard">
					<h2>Leaderboard</h2>
					<form>
						<input type="text" placeholder="Your Name" />
						<button type="submit">Submit Score</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default invadersGame;
