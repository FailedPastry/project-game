// /src/components/BulletController.jsx
import React from 'react';
import Bullet from './Bullet';

class BulletController {
  bullets = [];
  timerTillNextBulletAllowed = 0;

  constructor(canvas, maxBulletsAtATime, bulletColor, isPlayerBullet) {
    this.canvas = canvas;
    this.maxBulletsAtATime = maxBulletsAtATime;
    this.bulletColor = bulletColor;
    this.isPlayerBullet = isPlayerBullet;
  }

  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );

    this.bullets.forEach((bullet) => bullet.draw(ctx));

    if (this.timerTillNextBulletAllowed > 0) {
      this.timerTillNextBulletAllowed--;
    }
  }

  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (
      this.timerTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBulletsAtATime
    ) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      this.timerTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}

export default BulletController;
