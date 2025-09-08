// Cute Jars Clock (p5.js)
// Author: Grace Tseng

let hoursArr = [];
let minutesArr = [];
let secondsArr = [];
let lastMinute = -1;
let sparkleParticles = [];
let canvas;

function setup() {
  // Create responsive canvas
  canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.7);
  canvas.style('display', 'block');

  // Center canvas
  centerCanvas();

  // Initialize sparkles
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
  drawGradientBackground();

  // Sparkles
  for (let p of sparkleParticles) {
    noStroke();
    fill(255, 255, 255, p.alpha);
    ellipse(p.x, p.y, p.size);
  }

  // Current time
  let rawH = hour();
  let h = rawH % 12;
  if (h === 0) h = 12;
  let m = minute();
  let s = second();
  let ampm = rawH >= 12 ? "PM" : "AM";

  if (m !== lastMinute) {
    console.log("Minute changed:", m);
    lastMinute = m;
  }

  let jarY = height / 2;
  let spacing = width / 4;

  // Draw jars
  drawJar(spacing, jarY, 180, 280, color(100, 180, 255), "HOURS", h, 12);
  drawJar(spacing * 2, jarY, 180, 280, color(0, 180, 200), "MINUTES", m, 60, 80);
  drawJar(spacing * 3, jarY, 180, 280, color(255, 120, 160), "SECONDS", s, 60, 80);

  // Bouncing symbols
  adjustArray(hoursArr, h, "X", spacing, jarY, 180, 280);
  adjustArray(minutesArr, m, "O", spacing * 2, jarY, 180, 280);
  adjustArray(secondsArr, s, ".", spacing * 3, jarY, 180, 280);

  updateAndDraw(hoursArr, color(100, 180, 255));
  updateAndDraw(minutesArr, color(0, 180, 200));
  updateAndDraw(secondsArr, color(180, 60, 90));

  // Digital clock
  fill(40);
  noStroke();
  textSize(28);
  let displayM = nf(m, 2);
  let displayS = nf(s, 2);
  text(`${h}:${displayM}:${displayS} ${ampm}`, width / 2, height - 40);
}

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.7);
  centerCanvas();
}

function centerCanvas() {
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

// Draw background gradient
function drawGradientBackground() {
  let topColor = color(239, 84, 130);
  let bottomColor = color(231, 84, 128);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw a single jar with liquid, lid, label, shine
function drawJar(cx, cy, w, h, col, label, value, maxVal, tagWidth = 50) {
  push();
  translate(cx, cy);

  col.setAlpha(180);

  // Animated liquid
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

  // Label
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

// Draw each symbol
function updateAndDraw(arr, col) {
  for (let b of arr) {
    b.update();
    b.display(col);
  }
}

// Class for bouncing symbols
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

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += 0.05;
    if (this.x < this.left || this.x > this.right) this.vx *= -1;
    if (this.y < this.top || this.y > this.bottom) this.vy *= -1;
  }

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
