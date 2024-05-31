import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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
    x: 200,
    y: 400,
    width: 50,
    height: 50,
    speed: 5,
    bullets: [],
    score: 0,
    lives: 3,
    level: 1
  });
  const [enemies, setEnemies] = useState(generateEnemies(1));
  const [powerUps, setPowerUps] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext('2d'));
  }, []);

  useEffect(() => {
    if (context) {
      const intervalId = setInterval(update, 1000 / 60); // 60 fps
      return () => clearInterval(intervalId);
    }
  }, [context, player, enemies, powerUps]);

  const generateEnemies = (level) => {
    const newEnemies = [];
    for (let i = 0; i < level * 5; i++) {
      newEnemies.push({
        x: 50 + (i % 5) * 60,
        y: 50 + Math.floor(i / 5) * 60,
        width: 40,
        height: 40,
        speed: 2 + level,
      });
    }
    return newEnemies;
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        setPlayer(prev => ({ ...prev, x: Math.max(prev.x - prev.speed, 0) }));
        break;
      case 'ArrowRight':
        setPlayer(prev => ({ ...prev, x: Math.min(prev.x + prev.speed, context.canvas.width - prev.width) }));
        break;
      case ' ':
        setPlayer(prev => ({
          ...prev,
          bullets: [...prev.bullets, { x: prev.x + 25, y: prev.y, width: 5, height: 10 }]
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

  const update = () => {
    if (!context) return;

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
        setPlayer(prev => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== index) }));
      }
    });

    // Draw enemies
    enemies.forEach((enemy, enemyIndex) => {
      enemy.x += enemy.speed;
      if (enemy.x + enemy.width > context.canvas.width || enemy.x < 0) {
        enemy.speed *= -1;
        enemy.y += 20;
      }
      context.fillStyle = 'blue';
      context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Check for bullet collision with enemies
      player.bullets.forEach((bullet, bulletIndex) => {
        if (checkCollision(bullet, enemy)) {
          setEnemies(prev => prev.filter((_, i) => i !== enemyIndex));
          setPlayer(prev => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== bulletIndex),
            score: prev.score + 10
          }));
        }
      });

      // Check for enemy collision with player
      if (checkCollision(enemy, player)) {
        setEnemies(prev => prev.filter((_, i) => i !== enemyIndex));
        setPlayer(prev => ({ ...prev, lives: prev.lives - 1 }));
      }
    });

    // Draw power-ups
    powerUps.forEach((powerUp, index) => {
      context.fillStyle = 'green';
      context.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      powerUp.y += 2;
      if (checkCollision(powerUp, player)) {
        setPowerUps(prev => prev.filter((_, i) => i !== index));
        // Add power-up effect to player
        setPlayer(prev => ({ ...prev, score: prev.score + 50 }));
      }
    });

    // Check for level completion
    if (enemies.length === 0) {
      setPlayer(prev => ({ ...prev, level: prev.level + 1 }));
      setEnemies(generateEnemies(player.level + 1));
    }

    if (player.lives <= 0) {
      alert('Game Over');
      // Reset game or handle game over logic
    }
  };

  return (
    <div>
      <Canvas ref={canvasRef} width={500} height={500} />
      <Info>
        <div>Score: {player.score}</div>
        <div>Lives: {player.lives}</div>
        <div>Level: {player.level}</div>
      </Info>
    </div>
  );
};

export default Game;