// /src/pages/Game.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import BulletController from '../components/BulletController';
import EnemyController from '../components/EnemyController';
import Player from '../components/Player';

const Canvas = styled.canvas`
  border: 2px solid black;
  display: block;
  margin: 0 auto;
`;

const Info = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Game = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [player, setPlayer] = useState({
    x: 400,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
    bullets: [],
    score: 0,
    lives: 3,
    level: 1
  });
  const [powerUps, setPowerUps] = useState([]);
  const [lost, setLost] = useState(false);

  const enemyBulletController = useRef(null);
  const playerBulletController = useRef(null);
  const enemyController = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext('2d'));
    enemyBulletController.current = new BulletController(canvas, 10, 'red', true);
    playerBulletController.current = new BulletController(canvas, 10, 'yellow', true);
    enemyController.current = new EnemyController(canvas, enemyBulletController.current, playerBulletController.current);

    // Log to verify
    console.log('playerBulletController', playerBulletController.current);
    console.log('enemyController', enemyController.current);
  }, []);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        setPlayer((prev) => ({ ...prev, x: Math.max(prev.x - prev.speed, 0) }));
        break;
      case 'ArrowRight':
        setPlayer((prev) => ({ ...prev, x: Math.min(prev.x + prev.speed, context.canvas.width - prev.width) }));
        break;
      case ' ':
        setPlayer((prev) => ({
          ...prev,
          bullets: [...prev.bullets, { x: prev.x + 25, y: prev.y, width: 5, height: 10 }],
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const update = useCallback(() => {
    if (!context || lost) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw player
    context.fillStyle = 'red';
    context.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    player.bullets.forEach((bullet, index) => {
      bullet.y -= 5;
      context.fillStyle = 'yellow';
      context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      if (bullet.y < 0) {
        setPlayer((prev) => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== index) }));
      }
    });

    // Draw enemies
    if (enemyController.current) {
      enemyController.current.draw(context);
    }

    // Check for bullet collision with enemies
    player.bullets.forEach((bullet, bulletIndex) => {
      if (enemyController.current.collideWith(bullet)) {
        setPlayer((prev) => ({
          ...prev,
          bullets: prev.bullets.filter((_, i) => i !== bulletIndex),
          score: prev.score + 10,
        }));
      }
    });

    // Draw power-ups
    powerUps.forEach((powerUp, index) => {
      context.fillStyle = 'green';
      context.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      powerUp.y += 2;
      if (checkCollision(powerUp, player)) {
        setPowerUps((prev) => prev.filter((_, i) => i !== index));
        setPlayer((prev) => ({ ...prev, score: prev.score + 50 }));
      }
    });

    // Check for level completion
    if (enemyController.current && enemyController.current.enemyRows.flat().length === 0) {
      setPlayer((prev) => ({ ...prev, level: prev.level + 1 }));
      enemyController.current.createEnemies(player.level + 1);
    }

    if (player.lives <= 0) {
      alert('Game Over');
      setLost(true);
    }
  }, [context, player, powerUps, lost]);

  useEffect(() => {
    if (context) {
      const intervalId = setInterval(update, 1000 / 60); // 60 fps
      return () => clearInterval(intervalId);
    }
  }, [context, update]);

  return (
    <div>
      <Canvas ref={canvasRef} width={800} height={600} />
      <Info>
        <div>Score: {player.score}</div>
        <div>Lives: {player.lives}</div>
        <div>Level: {player.level}</div>
        {lost && <div>You lost!</div>}
      </Info>
    </div>
  );
};

export default Game;
