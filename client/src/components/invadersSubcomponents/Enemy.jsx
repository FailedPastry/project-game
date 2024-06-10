// /src/components/invadersSubcomponents/Enemy.jsx
import React from 'react';

class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.type = type;

    this.image = new Image();
    switch (type) {
      case 1:
        this.image.src = '/invadersAssets/images/enemy1.png';
        break;
      case 2:
        this.image.src = '/invadersAssets/images/enemy2.png';
        break;
      case 3:
        this.image.src = '/invadersAssets/images/enemy3.png';
        break;
      default:
        this.image.src = '/invadersAssets/images/enemy1.png';
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    return (
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y
    );
  }
}

export default Enemy;