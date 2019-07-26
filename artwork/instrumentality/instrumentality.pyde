import math


def get_slope(start_x, start_y, end_x, end_y):
    if end_x == start_x:
        return float("inf")
    return (float(end_y - start_y) / (end_x - start_x))

def get_distance(start_x, start_y, end_x, end_y):
    return sqrt(pow(end_x-start_x, 2) + pow(end_y - end_x, 2))

def get_distance_ratio(start_x, start_y, end_x, end_y, total_distance):
    return get_distance(start_x, start_y, end_x, end_y) / total_distance

def circle(center_x, center_y, radius, is_on_line, slope, intercept, turns = 1, start_angle = 0, end_angle = 360, rate = 0, given_x = None, given_y = None):
    x = given_x
    y = given_y
    final_angle = None
    for angle in range(int(start_angle), (int(end_angle) * turns) + 1):
        final_angle = angle
        radius += rate
        next_x = int(round(center_x + radius*cos(radians(angle))))
        next_y = int(round(center_y + radius*sin(radians(angle))))
        if x is None or y is None:
            x = next_x
            y = next_y
            continue
        line(x, y, next_x, next_y)
        x = next_x
        y = next_y
        if is_on_line(x, y):
            break
    origin_y = y - radius*sin(radians(final_angle))
    origin_x = x - radius*cos(radians(final_angle))
    return (origin_x, origin_y, x, y, final_angle)

def curve(start_x, start_y, end_x, end_y, at_x, at_y, total_distance, given_origin_angle = None, given_x = None, given_y = None):
    slope = get_slope(start_x, start_y, end_x, end_y)
    intercept = start_y - (slope*start_x)
    origin_angle = degrees(atan(slope)) if given_origin_angle is None else given_origin_angle;

    distance = get_distance_ratio(start_x, start_y, end_x, end_y, total_distance)
    pob = at_x / (pow(distance, 2) + at_y)
    rate = map(pob*2, 0, 1.5, -0.25, 0.25)
    radius = map(noise(at_x), 0, 1, 2, 3) if not given_x and not given_y else get_distance(given_x, given_y, start_x, start_y)
    print radius
    return circle(start_x, start_y, round(radius), get_is_on_line_fn(start_x, start_y, slope), slope, intercept, 1, origin_angle, 360 + origin_angle, rate, given_x, given_y)
    

def get_is_on_line_fn(start_x, start_y, slope):
    intercept = start_y - (slope*start_x) 
    return lambda x,y: True if y == slope*x + intercept else False


background(255)
size(250, 250)
stroke(64,167,224)

(x, y, given_x, given_y, angle) = curve(75, 75, 150, 25, 0.8 , 0.8, get_distance(75, 75, 150, 25))
curve(x, y, 150, 25, 0.8 , 0.8, get_distance(75, 75, 150, 25), angle, given_x, given_y)