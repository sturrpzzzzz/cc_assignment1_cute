//Note on 04/04/2024: I opened the sketch to play with it again and accidentally saved ):

//References:
//https://www.youtube.com/watch?v=Rr-5HiXquhw&t=305s
//https://editor.p5js.org/sturrpzzzzz/sketches/qqZt0QgM0
//https://restackor.com/physics/response/spring-mass-damper#:~:text=Springs%20make%20the%20suspension%20bounce,exact%20description%20of%20suspension%20motion.


//Gradient
const Y_AXIS = 1;
let c1, c2;

//Bubbles array
let bubbles = [];

let rectx = 150,
    recty = 150,
    rectw = 100,
    recth = 180,
    maxHeight = 305,  //Max stretch of spring
    minHeight = 170,   //Max compression of spring
    move = false;     //When rectangle is stretched

//Constants for Hooke's law
let m = 0.9,  //Mass
    k = 0.15, //Spring constant
    d = 0.95, //Damping
    r = 260;  //Rest position

//Spring simulation variables
let p = r,   // Position
    v = 0.0, // Velocity
    a = 0,   // Acceleration
    F = 0;   // Force

//Sounds
let springSound,
    song,
    button;


function setup() {
  springSound = loadSound('Sounds/BOOOING.mp3');
  song = loadSound('Sounds/sillygato.mp3');
  
  let button = createButton (':3');
  button.mousePressed(togglePlaying);
  button.position(730, 5);
  
  createCanvas(730,800);
  
  for (let i = 0; i < 14; i++) {
  	bubbles[i] = new Bubble (random(innerWidth), random(300,800));
  }
  
  c1 = color(28, 11, 46);
  c2 = color(171, 60, 163);
}

function draw() {
  
  background(100);
  
  setGradient(0, 0, innerWidth, innerHeight, c1, c2, Y_AXIS);
  
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].show();
    bubbles[i].move();
  }

  //Change rectangle colour based on mouse position
  push();
  let baseWidth = 0.3 * p;
    noStroke();
    if (mouseX > width / 2 - baseWidth * 1.3 && mouseX < width / 2 +         baseWidth * 1.3 && mouseY > p && mouseY < p + recth) {
      fill (222, 7, 35);
    } else if (mouseX > width / 2 - baseWidth * 1.3 - 50 && mouseX < width   / 2 + baseWidth * 1.3 + 50 && mouseY > p - 50 && mouseY < p + recth +     50) {
      fill (13, 85, 186);
    } else {
      fill (7, 252, 3);
      }
    rect(width / 2 - baseWidth * 1.3, p, baseWidth * 2.7, recth, 40, 40,     5, 5);
  pop();

  //Change rectangle expression based on mouse position
    if (mouseX > width / 2 - baseWidth * 1.3 && mouseX < width / 2 +         baseWidth * 1.3 && mouseY > p && mouseY < p + recth) {
    push();
      fill(220);
      stroke(1);
      arc (rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth *       0.7, baseWidth * 0.7, 0, PI, CHORD);
    pop();
    push();
      fill(1);
      stroke(1);
      arc (rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth /       1.5 * 0.7, baseWidth / 1.5 * 0.7, 0, PI, CHORD);
    pop();
    } else if (mouseX > width / 2 - baseWidth * 1.3 - 50 && mouseX < width    / 2 + baseWidth * 1.3 + 50 && mouseY > p - 50 && mouseY < p + recth +      50) {
   push();
     fill(220);
     stroke(1);
     arc(rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth *         0.7, baseWidth * 0.7, 0, PI + QUARTER_PI, CHORD);
    pop();
    push();
      fill(1); 
      stroke(1);
      arc(rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth /       1.5 * 0.7, baseWidth / 1.5 * 0.7,0, PI + QUARTER_PI, CHORD);
    pop();
    } else {
    push();
      fill(220);
      stroke(1);
      ellipse (rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth     * 0.7, baseWidth * 0.7);
    pop();
    push();
      fill(1);
      stroke(1);
      ellipse (rectx + baseWidth * 3.4, recty + baseWidth * 2.1, baseWidth     / 1.5 * 0.7, baseWidth / 1.5 * 0.7);
    pop();
  }

  
  //The ground
  push();
    noStroke();
    fill(102, 18, 88);
    rect (0, 440, innerWidth);
  pop();
  
  updateSpring();
}

//Function to turn rectangle into a spring
function updateSpring() {
  if (!move) {
  //Hooke's Law: F = -ky;
  //y is the amount of deformation of spring, which means y = deformed position of spring - original position of spring
  //y = p - r
    F = -k * ( p - r );
  //F = ma => a = F/m 
    a = F / m;
  //Sets spring velocity based on how deformed the spring is
    v = d * (v + a);
  //Updated position of spring
    p = p + v;        
  }
  
  //This is to make sure whether velocity is a negative or positive value (compressed or stretched) it is still being registered :D
  if (abs(v) < 0.1) {
    v = 0;
  }
  
  if (move) {
    p = mouseY - recth / 2;
    p = constrain(p, minHeight, maxHeight);
  }
}


function mousePressed() {
  let baseWidth = 0.3 * p;
  if (mouseX > width / 2 - baseWidth * 1.3 && mouseX < width / 2 +         baseWidth * 1.3 && mouseY > p && mouseY < p + recth) {
      move = true;
  }
  append(bubbles, new Bubble(mouseX,mouseY));
}


function mouseReleased() {
  if (move) {
   springSound.play();
  }
  
  move = false;
}


function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}


function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
  } else {
    song.stop();
  }
}


class Bubble {
	constructor(x, y) {
  	this.x = x;
    this.y = y;
    this.size = random(20, 90);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.a = random(100);
  }
  
  move() {
  	this.x += random(-2,2);
  	this.y += random(-5,-3);
      if (this.y < 0) {
        this.y = random(innerHeight, innerHeight + innerWidth);
      }
      if (this.x > innerWidth) {
        this.x = 0;
      }
      if (this.x < 0) {
    	this.x = innerWidth;
      }
  }
  
  show() {
  	stroke(random(255),random(255),random(255));
  	strokeWeight(1);
  	fill(this.r,this.g,this.b,this.a);
  	ellipse(this.x,this.y,this.size,this.size);
  }
}
