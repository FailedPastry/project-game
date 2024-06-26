// /src/components/invadersSubcomponents/Bullet.jsx
class Bullet {
	constructor(canvas, x, y, velocity, bulletColor) {
	  this.canvas = canvas;
	  this.x = x;
	  this.y = y;
	  this.velocity = velocity;
	  this.bulletColor = bulletColor;
	  this.width = 5;
	  this.height = 10;
	}
  
	draw(ctx) {
	  this.y -= this.velocity;
	  ctx.fillStyle = this.bulletColor;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  
	collideWith(sprite) {
	  const collision = this.x < sprite.x + sprite.width &&
						this.x + this.width > sprite.x &&
						this.y < sprite.y + sprite.height &&
						this.y + this.height > sprite.y;
	//   console.log('Bullet collision with sprite:', collision); // Debugging log
	  return collision;
	}
  }
  
  export default Bullet;