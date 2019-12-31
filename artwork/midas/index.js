const backgroundColor = 0;
let paused = false;

let attractors;
let entities;
function setup() {
	createCanvas(windowWidth, windowHeight);
	entities = new Array(1).fill(null).map(_ => new Entity(random(0, width), random(0, height), random(2,10)));
	attractors = new Array(300).fill(null).map(_ => new Attractor(random(0, width), random(0, height), random(2,300)));
	background(backgroundColor);
}

function keyPressed() {
	if (keyCode === ENTER) {
		attractors = new Array(300).fill(null).map(_ => new Attractor(random(0, width), random(0, height), random(2,300)));
	}
}

function mousePressed() {
	paused = !paused;
}
  
function draw() {
	if (!paused) {
		background(backgroundColor);
		renderEnitites(entities);
	}
}

function renderEnitites(entities) {
	for (const entity of entities) {
		for (const attractor of attractors) {
			attractor.display();
			const force = attractor.attract(entity);
			entity.applyForce(force);
		}
		for (const foreignEntity of entities) {
			if (foreignEntity === entity) {
				continue;
			}
			entity.repel(foreignEntity).forEach(force => foreignEntity.applyForce(force));
			foreignEntity.update();
			foreignEntity.display();
		}

		entity.update();
		entity.display();
	}
}