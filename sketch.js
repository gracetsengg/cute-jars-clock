// Cute Jars Clock (p5.js)
// Author: Grace Tseng

let hoursArr = [];
let minutesArr = [];
let secondsArr = [];
let lastMinute = -1;
let sparkleParticles = [];

function setup() {
  // Create canvas and set rectangle/text alignment
  let cnv = createCanvas(750, 500);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);

  // Initialize background sparkles
  for (let i = 0; i < 50; i++) {
    sparkleParticles.push({
      x: random(width),
      y: random(height / 2),
      size: random(2, 5),
      alpha: random(100, 200)
    });
  }
}

function draw() {
  // Draw gradient background
  drawGradientBackground();

  // Draw sparkles
  for (let p of sparkleParticles) {
    noStroke();
    fill(255, 255, 255, p.alpha);
    ellipse(p.x, p.y, p.size);
  }

  // Get current time
  let rawH = hour();
  let h = rawH % 12;
  if (h === 0) h = 12;
  let m = minute();
  let s = second();
  let ampm = rawH >= 12 ? "PM" : "AM";

  // Log minute changes for debug
  if (m !== lastMinute) {
    console.log("Minute changed:", m);
    lastMinute = m;
  }

  let jarY = height / 2;

  // Draw jars with colors and labels
  drawJar(150, jarY, 180, 280, color(100, 180, 255), "HOURS", h, 12);           // Hours: cyan-blue
  drawJar(375, jarY, 180, 280, color(0, 180, 200), "MINUTES", m, 60, 80);      // Minutes: teal, wider label
  drawJar(600, jarY, 180, 280, color(255, 120, 160), "SECONDS", s, 60, 80);    // Seconds: coral, wider label

  // Update bouncing symbols arrays
  adjustArray(hoursArr, h, "X", 150, jarY, 180, 280);
  adjustArray(minutesArr, m, "O", 375, jarY, 180, 280);
  adjustArray(secondsArr, s, ".", 600, jarY, 180, 280);

  // Draw bouncing symbols
  updateAndDraw(hoursArr, color(100, 180, 255));
  updateAndDraw(minutesArr, color(0, 180, 200));
  updateAndDraw(secondsArr, color(180, 60, 90)); // Darker seconds

  // Draw digital clock at bottom
  fill(40);
  noStroke();
  textSize(28);
  let displayM = nf(m, 2);
  let displayS = nf(s, 2);
  text(`${h}:${displayM}:${displayS} ${ampm}`, width / 2, height - 40);
}

// Draw background gradient
function drawGradientBackground() {
  let topColor = color(239, 84, 130);   // lighter pink
  let bottomColor = color(231, 84, 128); // #E75480
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw a single jar with liquid, lid, tag, and shine
// cx, cy = center coordinates
// w, h = width and height
// col = main color
// label = string for tag
// value = current value (hour, minute, second)
// maxVal = max value of jar
// tagWidth = width of label rectangle (default 50)
function drawJar(cx, cy, w, h, col, label, value, maxVal, tagWidth = 50) {
  push();
  translate(cx, cy);

  col.setAlpha(180);

  // Animated liquid inside jar
  let t = millis() * 0.002;
  let level = map(value, 0, maxVal, h / 2 - 20, -h / 2 + 50);
  fill(red(col)+20, green(col)+20, blue(col)+20, 180);
  noStroke();
  beginShape();
  for (let x = -w / 2 + 15; x <= w / 2 - 15; x += 2) {
    let y = level + sin(x * 0.08 + t) * 4;
    vertex(x, y);
  }
  vertex(w / 2 - 15, h / 2 - 15);
  vertex(-w / 2 + 15, h / 2 - 15);
  endShape(CLOSE);

  // Jar body
  stroke(180);
  strokeWeight(2.5);
  fill(255, 90);
  rect(0, 0, w, h, 60);

  // Lid
  fill(230);
  rect(0, -h / 2, w * 0.7, 18, 8);
  fill(200, 180, 220);
  rect(0, -h / 2, w * 0.7, 6);

  // Label tag
  stroke(120);
  line(w * 0.35, -h / 2 + 5, w * 0.5, -h / 2 + 25);
  fill(255, 240, 200);
  noStroke();
  rect(w * 0.55, -h / 2 + 25, tagWidth, 25, 5);
  fill(50);
  textSize(12);
  text(label, w * 0.55, -h / 2 + 25);

  // Shine effect
  noStroke();
  fill(255, 120);
  ellipse(-w / 4, 0, 25, h * 0.6);

  pop();
}

// Update symbol array to match target count
function adjustArray(arr, target, symbol, cx, cy, w, h) {
  while (arr.length < target) arr.push(new Bouncer(symbol, cx, cy, w, h));
  while (arr.length > target) arr.pop();
}

// Draw each symbol in the array
function updateAndDraw(arr, col) {
  for (let b of arr) {
    b.update();
    b.display(col);
  }
}

// Class for bouncing symbols inside jars
class Bouncer {
  constructor(symbol, cx, cy, w, h) {
    this.symbol = symbol;
    this.left = cx - w / 2 + 20;
    this.right = cx + w / 2 - 20;
    this.top = cy - h / 2 + 40;
    this.bottom = cy + h / 2 - 40;
    this.x = random(this.left, this.right);
    this.y = random(this.top, this.bottom);
    this.vx = random(-1.5, 1.5);
    this.vy = random(-1.5, 1.5);
    this.angle = random(TWO_PI);
  }

  // Update position and angle
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += 0.05;
    if (this.x < this.left || this.x > this.right) this.vx *= -1;
    if (this.y < this.top || this.y > this.bottom) this.vy *= -1;
  }

  // Draw symbol
  display(col) {
    push();
    translate(this.x, this.y);
    if (this.symbol === "X") {
      rotate(sin(this.angle) * 0.3);
      stroke(col);
      strokeWeight(3);
      line(-6, -6, 6, 6);
      line(6, -6, -6, 6);
    } else if (this.symbol === "O") {
      noFill();
      stroke(col);
      strokeWeight(2);
      ellipse(0, 0, 14, 14);
      fill(255, 180);
      ellipse(-3, -3, 4, 4);
    } else {
      noStroke();
      fill(col);
      ellipse(0, 0, 5, 5);
      fill(255, 220);
      ellipse(random(-2, 2), random(-2, 2), 2, 2);
    }
    pop();
  }
}
