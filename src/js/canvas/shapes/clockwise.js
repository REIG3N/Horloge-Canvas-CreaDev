export class RotatingClockwise {
  constructor(x, y, radius, startAngle, endAngle, length) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.startAngle = startAngle;
      this.endAngle = endAngle;
      this.length = length; // New parameter to specify the length of the clock hand
      this.rotationSpeed = Math.PI / 30; // 1 second for a full rotation (2*PI)
      this.speed = 0;
  }

  update(elapsedTime, speed = 1) {
      this.startAngle += this.rotationSpeed * elapsedTime * speed;
      this.endAngle += this.rotationSpeed * elapsedTime * speed;
  }

  draw(context) {
      context.save();
      context.beginPath();

      // Translate to the position
      context.translate(this.x, this.y);

      // Rotate based on the current angle
      context.rotate(this.startAngle); // Assuming both start and end angles are same

      // Draw the line representing the clock hand with adjusted length
      context.moveTo(0, 0);
      context.lineTo(this.length, 0);

      // Stroke the line
      context.stroke();
      context.closePath();
      context.restore();
  }
}
