class PositionQueue {
    constructor(length) {
        this.length = length;
        this.positions = [];
        this.currentIndex = 0;
    }

    push(position) {
        if (this.currentIndex >= this.length) {
            const [_, ...positions] = this.positions;
            this.positions = positions;
        }
        this.positions.push(position);
        this.currentIndex++;
    }

    get positionArray() {
        return this.positions.slice(-this.length);
    }
}

class Entity {
    constructor(x, y, mass, trailLength = 20) {
        this.positionQueue = new PositionQueue(trailLength);
        this.positionArray = [];
        this.position = createVector(x,y);
        this.positionArray.push(this.position);
        this.positionQueue.push(this.position);

        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.mass = mass;
    }

    applyForce(force) {
        const f = force.div(this.mass);
        this.acceleration.add(f);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.positionArray.push(createVector(this.position.x, this.position.y));
        this.positionQueue.push(createVector(this.position.x, this.position.y));
        this.acceleration.mult(0);
    }
    
    display() {
        stroke(255);
        fill(255, 100);
        noFill();

        const positions = this.positionQueue.positionArray;
        beginShape();
        for (const position of positions) {
            vertex(position.x, position.y);
        }
        endShape();
    }
}