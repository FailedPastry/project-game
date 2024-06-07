import React from 'react'

function Player({ position }) {
  return <div className="player" style={{ left: position.x, top: position.y }}></div>
}

export default Player
