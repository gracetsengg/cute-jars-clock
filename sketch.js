// Cute Jars Clock (p5.js)
// Author: Grace Tseng

let hoursArr = [];
let minutesArr = [];
let secondsArr = [];
let lastMinute = -1;
let sparkleParticles = [];
let canvas; // store canvas reference

function setup() {
  // Create a responsive canvas
  canvas = createCanvas(750, 500);
  canvas.style('display', 'block');
  canvas.parent(document.body); // attach to body
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);

  // Center canvas horizontally
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

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

function windowResized() {
  // Re-center canvas if window resizes
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

function draw() {
  drawGradientBackground();

  // Sparkles
  for (let p of sparkleParticles) {
    noStroke();
    fill(255, 255, 255, p.alpha);
    ellipse(p.x, p.y, p.size);
  }

  // Time
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

  // Jars
  drawJar(150, jarY, 180, 280, color(100, 180, 255), "HOURS", h, 12);
  drawJar(375, jarY, 180, 280, color(0, 180, 200), "MINUTES", m, 60, 80);
  drawJar(600, jarY, 180, 280, color(255, 120, 160), "SECONDS", s, 60, 80);

  adjustArray(hoursArr, h, "X", 150, jarY, 180, 280);
  adjustArray(minutesArr, m, "O", 375, jarY, 180, 280);
  adjustArray(secondsArr, s, ".", 600, jarY, 180, 280);

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

// Rest of your functions (drawGradientBackground, drawJar, adjustArray, updateAndDraw, Bouncer class) stay the same
