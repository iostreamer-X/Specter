const backgroundColor = 0;

let entities;
let locked = false
function setup() {
	createCanvas(windowWidth, windowHeight);
	console.log(width, height);
	entities = new Array(2).fill(null).map(_ => new Entity(random(width/2, width/2 + 50), random(height/2, height/2 + 50), random(2,10), false));
	entities[0].isTracker = true;
	entities[0].mass = 100;
	entities[0].updateTrackerFn = () => {
		console.log(locked)
		if (!locked) {
			return;
		}
		entities[0].position.x = sin(frameCount / 250) * 70 + 600;
		entities[0].position.y = cos(frameCount / 500) * 70 + 600;
	}
	console.log(entities);
	background(backgroundColor);
}

function mousePressed() {
	console.log(2000)
	locked = true;
}

function mouseReleased() {
	locked = false;
}

  
function draw() {
	// background(backgroundColor);
	renderEnitites(entities);
}

function renderEnitites(entities) {
	for (let i = 0; i < entities.length; i++) {
		for (let j = 0; j < entities.length; j++) {
		  if (i !== j && !entities[i].isTracker) {
			const force = entities[j].attract(entities[i]);
			entities[i].applyForce(force);
		  }
		}
	
		entities[i].update();
		entities[i].display(entities[i === entities.length -1 ? 0 : i + 1]);
	}
}