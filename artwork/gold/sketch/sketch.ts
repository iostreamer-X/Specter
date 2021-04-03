type Line = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  angle: number,
  parallel: {
    middlePointProjection: {
      x: number;
      y: number;
      actualPoints: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      };
    };
    middlePoint: {
      x: number;
      y: number;
    };
    firstPoint: {
      x: number;
      y: number;
    };
    secondPoint: {
      x: number;
      y: number;
    };
  }
};

class PolygonHelper {
  getSlopeAndIntercept(line: { x1: number, y1: number, x2: number, y2: number }) {
    if (line.x1 > line.x2) {
      line = { x1: line.x2, y1: line.y2, x2: line.x1, y2: line.y1 }
    }

    const rise = line.y2 - line.y1;
    const run = line.x2 - line.x1;
    if (run === 0) {
      return { slope: Infinity, intercept: NaN };
    }

    const slope = rise / run;
    const intercept = line.y1 - slope * (line.x1);

    return { slope, intercept };
  }

  getAngleBetweenLines(
    line1: { x1: number, y1: number, x2: number, y2: number },
    line2: { x1: number, y1: number, x2: number, y2: number }
  ) {
    const dx_in = line1.x1 - line1.x2;
    const dy_in = line1.y1 - line1.y2;
    const dx_out = line2.x2 - line2.x1;
    const dy_out = line2.y2 - line2.y1;

    const atan2_result = atan2(dx_in * dy_out - dx_out * dy_in, dx_in * dx_out + dy_in * dy_out)
    return PI + atan2_result;
  }

  getOrthogonalProjection(point: { x: number, y: number }, slope: number, intercept: number) {
    const newIntercept = intercept < 0 ? intercept + 40 : intercept - 90;
    console.log(newIntercept)
    let x = (point.x + (slope * point.y) - slope * newIntercept) / (1 + Math.pow(slope, 2));
    let y = (slope * point.x + Math.pow(slope, 2) * point.y + newIntercept) / (1 + Math.pow(slope, 2));

    return { x, y };
  }

  getMiddlePoint(line: { x1: number, y1: number, x2: number, y2: number },) {
    return {
      x: (line.x1 + line.x2) / 2,
      y: (line.y1 + line.y2) / 2,
    }
  }

  getPerpendicularPoints(
    line: { x1: number, y1: number, x2: number, y2: number },
    actualLine: { x1: number, y1: number, x2: number, y2: number }
  ) {
    const ax = line.x1;
    const ay = line.y1;

    const bx = line.x2;
    const by = line.y2;
    const diff_x = ax - bx;
    const diff_y = ay - by;

    var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

    const offset = dist / 4;

    const normX = diff_x / dist;
    const normY = diff_y / dist;

    const xPerp = offset * normX;
    const yPerp = offset * normY;

    // Create perpendicular points

    const k = 0.6;
    const cx = ax + k * 0.2 * yPerp;
    const cy = ay - k * 0.2 * xPerp;
    const dx = ax - k * 0.2 * yPerp;
    const dy = ay + k * 0.2 * xPerp;

    const actual_cx = actualLine.x1 + k * yPerp;
    const actual_cy = actualLine.y1 - k * xPerp;
    const actual_dx = actualLine.x1 - k * yPerp;
    const actual_dy = actualLine.y1 + k * xPerp;
    const actual_ex = actualLine.x2 - k * yPerp;
    const actual_ey = actualLine.y2 + k * xPerp;
    const actual_fx = actualLine.x2 + k * yPerp;
    const actual_fy = actualLine.y2 - k * xPerp;

    return [{ x: cx, y: cy, actualPoints: { x1: actual_cx, y1: actual_cy, x2: actual_fx, y2: actual_fy } }, { x: dx, y: dy, actualPoints: { x1: actual_dx, y1: actual_dy, x2: actual_ex, y2: actual_ey } }]
  }

  inside(point: [number, number], vs: [number, number][]) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  getParallelPoints(params: {
    sourcePolygon: Polygon,
    sourceLine: { x1: number, y1: number, x2: number, y2: number },
  }) {
    const { sourceLine, sourcePolygon } = params;
    const middlePoint = this.getMiddlePoint(sourceLine);

    const pointsToCheck = (() => {
      return this.getPerpendicularPoints({ x1: middlePoint.x, y1: middlePoint.y, x2: sourceLine.x2, y2: sourceLine.y2 }, sourceLine);
    })();

    for (const point of pointsToCheck) {
      const isInside = this.inside([point.x, point.y], sourcePolygon.points.map(data => [data.x, data.y]));
      if (!isInside) {
        return {
          middlePointProjection: point,
          middlePoint,
          firstPoint: {
            x: point.actualPoints.x1,
            y: point.actualPoints.y1
          },
          secondPoint: {
            x: point.actualPoints.x2,
            y: point.actualPoints.y2
          },
        }
      }
    }
  }
}

class Polygon {
  public points: { x: number, y: number }[] = [];
  public lines: Line[] = [];
  constructor(
    readonly number_of_sides: number,
    readonly max_length_of_side: number,
    readonly starting_point: { x: number, y: number, angle?: number },
    readonly existing_points_at_index: { [key in number]: { x: number, y: number } } = {},
    private angleDirection = 1,
    readonly polygonHelper = new PolygonHelper(),
  ) {
    if (number_of_sides < 3) {
      throw new Error('What polygon has ' + number_of_sides + ' sides?')
    }

    this.updatePointsAndLines();
  }

  updatePointsAndLines() {
    const { points, lines } = this.getPointsAndLines();
    this.points = points;
    this.addParallelDataToLines(lines as Line[]);
    this.lines = lines as Line[];
  }


  getPointsAndLines() {
    let points: { x: number, y: number }[] = [];
    let steps = this.number_of_sides - 1;
    const angle_step = HALF_PI / steps;

    for (let step = 0; step < steps; step++) {
      const angle = step * angle_step * this.angleDirection + (radians(this.starting_point.angle) || 0);
      const effective_length = map(noise(points[points.length - 1]?.x || 0, points[points.length - 1]?.y || 0), 0, 1, 0.5, 1) * this.max_length_of_side;
      const x = effective_length * cos(angle) + this.starting_point.x;
      const y = effective_length * sin(angle) + this.starting_point.y;

      points.push({ x, y });
    }

    points = [{ x: this.starting_point.x, y: this.starting_point.y }, ...points, { x: this.starting_point.x, y: this.starting_point.y }];

    for (const index in this.existing_points_at_index) {
      points[index] = this.existing_points_at_index[index];
    }

    const rawLines: {
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    }[] = []
    for (let index = 0; index < points.length - 1; index++) {
      const point = points[index];
      const nextPoint = points[index === points.length - 1 ? 0 : index + 1];

      rawLines.push({ x1: point.x, y1: point.y, x2: nextPoint.x, y2: nextPoint.y });
    }

    const lines: {
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      angle: number,
    }[] = []
    for (let index = 0; index < rawLines.length; index++) {
      const first_line = rawLines[index];
      const second_line = rawLines[index === rawLines.length - 1 ? 0 : index + 1];

      lines.push({ ...first_line, angle: 180 - degrees(this.polygonHelper.getAngleBetweenLines(first_line, second_line)) });
    }

    return { points, lines };
  }

  addParallelDataToLines(lines: Line[]) {
    for (const line of lines) {
      const parallel = this.polygonHelper.getParallelPoints({ sourcePolygon: this, sourceLine: line });
      line.parallel = parallel;
    }
  }

  paint() {
    const lines = this.lines;

    for (let index = 0; index < lines.length; index++) {
      const sourceLine = lines[index];
      line(sourceLine.x1, sourceLine.y1, sourceLine.x2, sourceLine.y2);
    }
  }

  paintParallel(sourceLine: Line) {
    const parallelPoints = sourceLine.parallel
    line(parallelPoints.middlePoint.x, parallelPoints.middlePoint.y, parallelPoints.middlePointProjection.x, parallelPoints.middlePointProjection.y)
    ellipse(parallelPoints.firstPoint.x, parallelPoints.firstPoint.y, 5);
    ellipse(parallelPoints.secondPoint.x, parallelPoints.secondPoint.y, 5);
  }
}


class PolygonManager {
  constructor(
    readonly polygonHelper = new PolygonHelper(),
  ) { }

  getSide(sourcePolygon: Polygon, angleVectorInDegrees: number) {
    const expectedAngle = radians(angleVectorInDegrees);
    let lowestDifference = Infinity;
    let closestSlopeSide: Line;

    for (let index = 0; index < sourcePolygon.lines.length; index++) {
      const baseLine = { x1: 0, y1: 0, x2: 1, y2: 0 };
      const line = sourcePolygon.lines[index];
      const angle = this.polygonHelper.getAngleBetweenLines(baseLine, {
        x1: line.parallel.middlePoint.x,
        y1: line.parallel.middlePoint.y,
        x2: line.parallel.middlePointProjection.x,
        y2: line.parallel.middlePointProjection.y,
      });

      const difference = Math.abs(angle - expectedAngle);
      if (difference < lowestDifference) {
        lowestDifference = difference;
        closestSlopeSide = line;
      }
    }

    return closestSlopeSide;
  }

  getAdjacentPolygon(sourcePolygon: Polygon, angleVectorInDegrees: number) {
    const chosenSide = this.getSide(sourcePolygon, angleVectorInDegrees);
    const parallelPoints = chosenSide.parallel;
    const adjacentPolygon = new Polygon(
      3,
      70,
      { x: parallelPoints.firstPoint.x, y: parallelPoints.firstPoint.y, angle: angleVectorInDegrees },
      {
        2: { x: parallelPoints.secondPoint.x, y: parallelPoints.secondPoint.y }
      },
    );
    return adjacentPolygon;
  }
}





let polygons: Polygon[];
let polygonManager: PolygonManager;
// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  // FULLSCREEN CANVAS
  createCanvas(windowWidth, windowHeight);

  // SETUP SOME OPTIONS
  rectMode(CENTER).noFill().frameRate(60);


  stroke(200);
  strokeWeight(1.3);
  fill(200);

  polygonManager = new PolygonManager();
  const polygon = new Polygon(3, 70, { x: 0, y: 0 },);
  const p = polygonManager.getAdjacentPolygon(polygon, 110);
  const p1 = polygonManager.getAdjacentPolygon(p, 110);
  const p2 = polygonManager.getAdjacentPolygon(p1, 130);
  const p3 = polygonManager.getAdjacentPolygon(p2, 170);
  const p4 = polygonManager.getAdjacentPolygon(p3, 210);

  const p5 = polygonManager.getAdjacentPolygon(p4, 150);
  const p6 = polygonManager.getAdjacentPolygon(p5, 140);
  const p7 = polygonManager.getAdjacentPolygon(p6, 130);
  const p8 = polygonManager.getAdjacentPolygon(p7, 120);

  polygons = [polygon, p, p1, p2, p3, p4, p5, p6, p7, p8]
}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  // CLEAR BACKGROUND
  background(0);
  // TRANSLATE TO CENTER OF SCREEN
  translate(width / 2, height / 2);

  for (const polygon of polygons) {
    polygon.paint();
  }
}






// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
