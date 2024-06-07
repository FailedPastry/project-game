import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import Player from './Player';
import Enemy from './Enemy';
import Score from './ScoreBoard';

function GameWindow() {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [enemies, setEnemies] = useState([{ x: 100, y: 100 }, { x: 200, y: 200 }]);

  useEffect(() => {
    // Game initialization logic here
    // Example: set up key listeners for player movement
    const handleKeyDown = (event) => {
      switch(event.key) {
        case 'ArrowUp':
          setPlayerPosition(pos => ({ ...pos, y: pos.y - 10 }));
          break;
        case 'ArrowDown':
          setPlayerPosition(pos => ({ ...pos, y: pos.y + 10 }));
          break;
        case 'ArrowLeft':
          setPlayerPosition(pos => ({ ...pos, x: pos.x - 10 }));
          break;
        case 'ArrowRight':
          setPlayerPosition(pos => ({ ...pos, x: pos.x + 10 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="game-window">
		<div className="game-window__title">Game Window</div>
      <Score score={score} />
      <GameBoard>
        <Player position={playerPosition} />
        {enemies.map((enemy, index) => (
          <Enemy key={index} position={enemy} />
        ))}
      </GameBoard>
    </div>
  );
}

export default GameWindow;
