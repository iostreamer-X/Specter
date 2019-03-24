atomic_grid_size = 30

def get_grid(x, y, size = atomic_grid_size):
    return ((x, y), (x + size, y), (x + size, y + size), (x, y + size))

def get_play_grid(x, y):
    grid_count = 9
    max_pos = int(pow(grid_count, 0.5))
    grids = []
    for grid_num in range(0, grid_count):
        grids.append(get_grid(x + atomic_grid_size*(grid_num % max_pos), y + atomic_grid_size*(grid_num / max_pos)))
    return grids

def get_x(grid, point):
        return grid[point][0]
def get_y(grid, point):
        return grid[point][1]

def render_grid(x, y):
        stroke(255)
        for grid in get_play_grid(x,y):
                line(get_x(grid, 0), get_y(grid, 0), get_x(grid, 1), get_y(grid, 1))
                line(get_x(grid, 1), get_y(grid, 1), get_x(grid, 2), get_y(grid, 2))
                line(get_x(grid, 2), get_y(grid, 2), get_x(grid, 3), get_y(grid, 3))
                line(get_x(grid, 3), get_y(grid, 3), get_x(grid, 0), get_y(grid, 0))

size(300, 300)
background(0)
render_grid(20, 20)