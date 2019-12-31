const backgroundColor = 0;
let paused = false;

let attractors;
let entities;
function setup() {
	createCanvas(windowWidth, windowHeight);
	entities = new Array(4).fill(null).map(_ => new Entity(random(width/2, width/2 + 50), random(height/2, height/2 + 50), random(2,10)));
	attractors = new Array(7).fill(null).map(_ => new Attractor(random(width/2+30, width/2 + 150), random(height/2 + 70, height/2 + 250), random(2,10)));
	background(backgroundColor);
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