atomic_grid_size = 30
grid_count = 9
def get_grid(x, y, grid_num, size = atomic_grid_size):
    return ((x, y, grid_num), (x + size, y, grid_num), (x + size, y + size, grid_num), (x, y + size, grid_num))

def get_grid_by_num(grid, num):
        if not isinstance(grid, list):
                return grid
        tagged_grid = filter(lambda tuple: tuple[0][2] is num, grid)[0]
        return tagged_grid

def get_play_grid(x, y):
    max_pos = int(pow(grid_count, 0.5))
    grids = []
    for grid_num in range(0, grid_count):
        grids.append(get_grid(x + atomic_grid_size*(grid_num % max_pos), y + atomic_grid_size*(grid_num / max_pos), grid_num))
    return grids

def get_x(grid, point):
        return grid[point][0]
def get_y(grid, point):
        return grid[point][1]

def render_grid(grid):
        stroke(255)
        line(get_x(grid, 0), get_y(grid, 0), get_x(grid, 1), get_y(grid, 1))
        line(get_x(grid, 1), get_y(grid, 1), get_x(grid, 2), get_y(grid, 2))
        line(get_x(grid, 2), get_y(grid, 2), get_x(grid, 3), get_y(grid, 3))
        line(get_x(grid, 3), get_y(grid, 3), get_x(grid, 0), get_y(grid, 0))

def render_play_grid(x, y):
        for grid in get_play_grid(x,y):
                render_grid(grid)

def get_flattened_grid(grid):
        if not isinstance(grid, list):
                return grid
        flattened_list = [item for sublist in grid for item in sublist]
        x_sorted = sorted(flattened_list, key = lambda point: point[0])
        y_sorted = sorted(flattened_list, key = lambda point: point[1])
        
        top_left = sorted(filter(lambda point: point[0] is x_sorted[0][0], x_sorted), key = lambda point: point[1])[0]
        top_right = sorted(filter(lambda point: point[0] is x_sorted[-1][0], x_sorted), key = lambda point: point[1])[0]
        bottom_right = sorted(filter(lambda point: point[0] is x_sorted[-1][0], x_sorted), reverse = True, key = lambda point: point[1])[0]
        bottom_left = sorted(filter(lambda point: point[0] is x_sorted[0][0], x_sorted), reverse = True, key = lambda point: point[1])[0]
        
        return(top_left, top_right, bottom_right, bottom_left)
        

size(300, 300)
background(0)
render_grid(get_grid_by_num(get_play_grid(20, 30), 2))
alphabets = []