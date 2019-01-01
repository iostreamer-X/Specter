import math

def get_slope(start_x, start_y, end_x, end_y):
	if end_x == start_x:
		return float("inf")
	return (float(end_y - start_y) / (end_x - start_x))

def get_y_of_line(start_x, start_y, end_x, end_y, x, slope = None, y = 0):
	slope_to_use = get_slope(start_x, start_y, end_x, end_y) if slope is None else slope
	y_to_use = y if slope_to_use == float("inf") else -y if slope_to_use == float("-inf") else None 
	if y_to_use is not None:
		return start_y + y_to_use
	return round(slope_to_use * (x - start_x) + start_y)

def jitteryLine(start_x, start_y, end_x, end_y, max_height=3, x_step=1, y_step=1, chance_threshold = 40):
	y = start_y
	x = start_x
	slope = get_slope(start_x, start_y, end_x, end_y)
	perpendicularSlope = -1/slope if slope != 0.0 else float("inf")
	
	start = start_x
	end = end_x - x_step + 1

	if start == end:
		end = end + 1

	if end < start:
		start, end = end, start
	
	for scan_x in range(start, end, x_step):
		next_straight_x = scan_x + x_step
		next_straight_y = get_y_of_line(start_x, start_y, end_x, end_y, next_straight_x, slope)
		
		next_x = next_straight_x
		next_y = next_straight_y
	
		chance = random(90) + 10
		if chance < chance_threshold:
			random_height = random(2*max_height) - max_height
			if perpendicularSlope != float("inf") and perpendicularSlope != float("-inf"):
				next_x = next_straight_x + random_height
			next_y = get_y_of_line(next_straight_x, next_straight_y, None, None, next_x, perpendicularSlope, random_height)

		line(x, y, next_x, next_y)
		y = next_y
		x = next_x




def jitteryCircle(center_x, center_y, radius, turns = 1):
	x = None
	y = None
	for angle in range(0, (360 * turns) + 1) :
		next_x = int(round(center_x + radius*math.cos(radians(angle))))
		next_y = int(round(center_y + radius*math.sin(radians(angle))))
		if x is None or y is None:
			x = next_x
			y = next_y
			continue
		jitteryLine(x, y, next_x, next_y)
		x = next_x
		y = next_y
