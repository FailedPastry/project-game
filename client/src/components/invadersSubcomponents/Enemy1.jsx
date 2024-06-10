import React from 'react'

function Enemy({ position }) {
  return <div className="enemy" style={{ left: position.x, top: position.y }}></div>
}

export default Enemy