const G = 1;

class Attractor {
    constructor(x, y, mass) {
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
}