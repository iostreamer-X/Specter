def get_slope(start_x, start_y, end_x, end_y):
    return (end_y - start_y) / (end_x - start_x)

def jitteryLine(start_x, start_y, end_x, end_y, max_height = 3, x_step = 1, y_step = 1):
    y = start_y
    for x in range(start_x, end_x - x_step + 1, x_step):
        next_x = x + x_step
        next_y = get_slope(start_x, start_y, end_x, end_y) * (next_x - start_x) + start_y
        line(x, y, next_x, next_y)
        y = next_y
