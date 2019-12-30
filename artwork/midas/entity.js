const G = 1;
class Entity {
    constructor(x, y, mass, isTracker = false, updateTrackerFn = () => {}) {
        this.isTracker = isTracker;
        this.updateTrackerFn = updateTrackerFn;
        this.position = createVector(x,y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.mass = mass;
    }

    attract(entity) {
        const force = this.position.copy().sub(entity.position);
        let distance = force.mag();
        distance = constrain(distance, 3, 25.0);
        force.normalize();
    
        const strength = (G * this.mass * entity.mass) * (distance * distance) * 0.0000009;
        force.mult(strength);
        return force;
    }

    applyForce(force) {
        const f = force.div(this.mass);
        this.acceleration.add(f);
    }

    update() {
        if (this.isTracker) {
            this.updateTrackerFn();
            return;
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
      }
    
    display(entity) {
        if (this.isTracker && false) {
            stroke(backgroundColor);
            fill(backgroundColor);
        } else {
            stroke(255);
            fill(255, 100);
        }
        ellipse(this.position.x, this.position.y, 0.9, 0.9);
        // line(this.position.x, this.position.y, entity.position.x, entity.position.y)
    }
}