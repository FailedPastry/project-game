import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Phaser from 'phaser';
import nipplejs from 'nipplejs';

import { ADD_SCORE } from '../utils/mutations';
import Auth from '../utils/auth';

const StarboyGame = () => {
	const [addScoreMutation] = useMutation(ADD_SCORE);
	const [score, setScore] = useState(0);
	const [direction, setDirection] = useState(null);

	const myProfile = Auth.loggedIn() ? Auth.getProfile() : null;
	const userId = myProfile?.data?._id;
	const { gameId } = useParams();

	const scoreRef = useRef(score);

	const addScore = () => {
		addScoreMutation({
			variables: {
				userId: userId,
				score: scoreRef.current,
				gameId,
			},
		});
	};

	let joystick;

	useEffect(() => {
		let localScore = score;
		scoreRef.current = score;

		var config = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			parent: 'starboyGame',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 300 },
					debug: false,
				},
			},
			scene: {
				preload: preload,
				create: create,
				update: update,
			},
		};

		var player;
		var stars;
		var bombs;
		var platforms;
		var cursors;
		var gameOver = false;
		var scoreText;
		var gameOverText;

		var game = new Phaser.Game(config);

		function preload() {
			this.load.image('sky', '/starboyAssets/assets/sky.png');
			this.load.image('ground', '/starboyAssets/assets/platform.png');
			this.load.image('star', '/starboyAssets/assets/star.png');
			this.load.image('bomb', '/starboyAssets/assets/bomb.png');
			this.load.spritesheet('dude', '/starboyAssets/assets/dude.png', {
				frameWidth: 32,
				frameHeight: 48,
			});
		}

		function create() {
			//  A simple background for our game
			this.add.image(400, 300, 'sky');

			//  The platforms group contains the ground and the 2 ledges we can jump on
			platforms = this.physics.add.staticGroup();

			//  Here we create the ground.
			//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
			platforms.create(400, 568, 'ground').setScale(2).refreshBody();

			//  Now let's create some ledges
			platforms.create(600, 400, 'ground');
			platforms.create(50, 250, 'ground');
			platforms.create(750, 220, 'ground');

			// The player and its settings
			player = this.physics.add.sprite(100, 450, 'dude');

			//  Player physics properties. Give the little guy a slight bounce.
			player.setBounce(0.2);
			player.setCollideWorldBounds(true);

			//  Our player animations, turning, walking left and walking right.
			this.anims.create({
				key: 'left',
				frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
				frameRate: 10,
				repeat: -1,
			});

			this.anims.create({
				key: 'turn',
				frames: [{ key: 'dude', frame: 4 }],
				frameRate: 20,
			});

			this.anims.create({
				key: 'right',
				frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
				frameRate: 10,
				repeat: -1,
			});

			//  Input Events
			cursors = this.input.keyboard.createCursorKeys();

			//  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
			stars = this.physics.add.group({
				key: 'star',
				repeat: 11,
				setXY: { x: 12, y: 0, stepX: 70 },
			});

			stars.children.iterate(function (child) {
				//  Give each star a slightly different bounce
				child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			});

			bombs = this.physics.add.group();

			//  The score
			scoreText = this.add.text(16, 16, 'Score: 0', {
				fontSize: '32px',
				fill: '#000',
			});

			//  Collide the player and the stars with the platforms
			this.physics.add.collider(player, platforms);
			this.physics.add.collider(stars, platforms);
			this.physics.add.collider(bombs, platforms);

			//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
			this.physics.add.overlap(player, stars, collectStar, null, this);

			this.physics.add.collider(player, bombs, hitBomb, null, this);

			gameOverText = this.add.text(
				400,
				300,
				`Game Over! \n Score: ${score} \n Click to Restart`,
				{ fontSize: '32px', fill: '#000' }
			);
			gameOverText.setOrigin(0.5);

			gameOverText.setInteractive();
			gameOverText.on('pointerdown', () => {
				restartGame(this);
			});
			gameOverText.visible = false;

			game.registry.set('direction', null);

			// NippleJS
			// Create a new joystick
			// var options = {
			// 	zone: document.getElementById('joystick-container'),
			// 	mode: 'static',
			// 	position: { left: '50%', top: '85%' },
			// 	color: 'red'
			// };
			// joystick = nipplejs.create(options);

			// joystick.on('move', (event, data) => {
			// 	switch (data.direction.angle) {
			// 		case 'up':
			// 		  player.setVelocityY(-330);
			// 		  break;
			// 		case 'down':
			// 		  player.setVelocityX(0);
			// 		  player.anims.play('turn');
			// 		  break;
			// 		case 'left':
			// 		  player.setVelocityX(-160);
			// 		  player.anims.play('left', true);
			// 		  break;
			// 		case 'right':
			// 		  player.setVelocityX(160);
			// 		  player.anims.play('right', true);
			// 		  break;
			// 		default:
			// 		  break;
			// 	  }
			// });

			// joystick.on('end', () => {
			// 	player.setVelocityX(0);
			// 	player.anims.play('turn');
			// });

			//d-pad
			const arrowKeys = document.getElementById('arrow-keys');
			const arrowUp = document.querySelector('.arrow-up');
			const arrowDown = document.querySelector('.arrow-down');
			const arrowLeft = document.querySelector('.arrow-left');
			const arrowRight = document.querySelector('.arrow-right');

			let moveInterval;

			arrowKeys.addEventListener('touchstart', (event) => {
				event.preventDefault();
				switch (event.target) {
					case arrowUp:
						game.registry.set('direction', 'up');
						break;
					case arrowDown:
						game.registry.set('direction', 'down');
						break;
					case arrowLeft:
						game.registry.set('direction', 'left');
						break;
					case arrowRight:
						game.registry.set('direction', 'right');
						break;
					default:
						break;
				}
			});

			arrowKeys.addEventListener('touchend', () => {
				game.registry.set('direction', null);
			});
		}

		function update() {
			if (gameOver) {
				return;
			}

			if (cursors.left.isDown) {
				player.setVelocityX(-160);

				player.anims.play('left', true);
			} else if (cursors.right.isDown) {
				player.setVelocityX(160);

				player.anims.play('right', true);
			} else {
				player.setVelocityX(0);

				player.anims.play('turn');
			}

			if (cursors.up.isDown && player.body.touching.down) {
				player.setVelocityY(-330);
			}

			let direction = game.registry.get('direction');

			switch (direction) {
				case 'up':
					if (player.body.touching.down) {
						player.setVelocityY(-330);
					}
					break;
				case 'down':
					player.setVelocityX(0);
					player.anims.play('turn');
					break;
				case 'left':
					player.setVelocityX(-160);
					player.anims.play('left', true);
					break;
				case 'right':
					player.setVelocityX(160);
					player.anims.play('right', true);
					break;
				default:
					player.setVelocityX(0);
					player.anims.play('turn');
					break;
			}
		}

		function collectStar(player, star) {
			star.disableBody(true, true);

			//  Add and update the score
			setScore((prevScore) => {
				localScore = prevScore + 10;
				scoreRef.current = localScore;
				scoreText.setText('Score: ' + localScore);
				return localScore;
			});

			if (stars.countActive(true) === 0) {
				//  A new batch of stars to collect
				stars.children.iterate(function (child) {
					child.enableBody(true, child.x, 0, true, true);
				});

				var x =
					player.x < 400
						? Phaser.Math.Between(400, 800)
						: Phaser.Math.Between(0, 400);

				var bomb = bombs.create(x, 16, 'bomb');
				bomb.setBounce(1);
				bomb.setCollideWorldBounds(true);
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
				bomb.allowGravity = false;
			}
		}

		function hitBomb(player, bomb) {
			this.physics.pause();

			player.setTint(0xff0000);

			player.anims.play('turn');

			gameOver = true;

			gameOverText.setText(
				`Game Over! \n Score: ${localScore} \n Click to Restart`
			);

			gameOverText.visible = true;

			setScore(localScore);

			scoreRef.current = localScore;

			if (userId) {
				addScore();
			}
			console.log('Score: ', scoreRef.current);
			console.log('userId: ', userId);
			console.log('gameId: ', gameId);
		}

		function restartGame(scene) {
			setScore(0);
			gameOver = false;
			gameOverText.visible = false;
			scene.scene.restart();
		}
	}, [userId, gameId]);

	return (
		<>
			<div id="starboyGame"></div>
			<div id="joystick-container"></div>
			<div id="arrow-keys">
				<div className="arrow-left">&#8592;</div>
				<div className="arrow-up">&#8593;</div>
				<div className="arrow-right">&#8594;</div>
			</div>
		</>
	);
};

export default StarboyGame;
