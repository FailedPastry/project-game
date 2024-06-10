import React from 'react';

class Player {
  constructor(canvas, speed, bulletController) {
    this.canvas = canvas;
    this.speed = speed;
    this.bulletController = bulletController;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "/images/player.png"; // Ensure this path is correct
    this.image.onload = () => {
      console.log('Player image loaded');
    };
    this.image.onerror = () => {
      console.error('Error loading player image');
    };

    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);

    this.shootSound = new Audio('/sounds/shoot.wav');
    this.shootSound.volume = 0.1;

    this.rightPressed = false;
    this.leftPressed = false;
    this.shootPressed = false;
  }

  draw(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
      this.shootSound.currentTime = 0;
      this.shootSound.play();
    }
    this.move();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.rightPressed) {
      this.x += this.speed;
    } else if (this.leftPressed) {
      this.x -= this.speed;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > this.canvas.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  keydown = (event) => {
    if (event.keyCode === 39) {
      this.rightPressed = true;
    } else if (event.keyCode === 37) {
      this.leftPressed = true;
    } else if (event.keyCode === 32) {
      this.shootPressed = true;
    }
  };

  keyup = (event) => {
    if (event.keyCode === 39) {
      this.rightPressed = false;
    } else if (event.keyCode === 37) {
      this.leftPressed = false;
    } else if (event.keyCode === 32) {
      this.shootPressed = false;
    }
  };

  collideWith(sprite) {
    const collision =
      this.x < sprite.x + sprite.width &&
      this.x + this.width > sprite.x &&
      this.y < sprite.y + sprite.height &&
      this.y + this.height > sprite.y;

    return collision;
  }
}

export default Player;