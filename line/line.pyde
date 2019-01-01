def get_slope(start_x, start_y, end_x, end_y):
	return (float(end_y - start_y) / (end_x - start_x))

def get_y_of_line(start_x, start_y, end_x, end_y, x, slope = None):
	slopeToUse = get_slope(start_x, start_y, end_x, end_y) if slope is None else slope
	return round(slopeToUse * (x - start_x) + start_y)

def jitteryLine(start_x, start_y, end_x, end_y, max_height=3, x_step=1, y_step=1, chance_threshold = 40):
	y = start_y
	x = start_x
	slope = get_slope(start_x, start_y, end_x, end_y)
	perpendicularSlope = -1/slope

	for scan_x in range(start_x, end_x - x_step + 1, x_step):
		next_straight_x = scan_x + x_step
		next_straight_y = get_y_of_line(start_x, start_y, end_x, end_y, next_straight_x, slope)

		next_x = next_straight_x
		next_y = next_straight_y
	
		chance = random(90) + 10
		if chance < chance_threshold:
			random_height = random(2*max_height) - max_height
			next_x = next_straight_x + random_height
			next_y = get_y_of_line(next_straight_x, next_straight_y, None, None, next_x, perpendicularSlope)

		line(x, y, next_x, next_y)
		y = next_y
		x = next_x
