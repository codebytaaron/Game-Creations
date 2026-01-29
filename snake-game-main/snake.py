
# Screen
WIDTH, HEIGHT = 600, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake")

# Colors
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

clock = pygame.time.Clock()
CELL_SIZE = 20

# Snake
snake = [(300, 300), (280, 300), (260, 300)]
direction = "RIGHT"

# Food
food = (
    random.randrange(0, WIDTH, CELL_SIZE),
    random.randrange(0, HEIGHT, CELL_SIZE)
)

def draw_snake():
    for segment in snake:
        pygame.draw.rect(screen, GREEN, (*segment, CELL_SIZE, CELL_SIZE))

def move_snake():
    global food
    x, y = snake[0]

    if direction == "UP":
        new_head = (x, y - CELL_SIZE)
    elif direction == "DOWN":
        new_head = (x, y + CELL_SIZE)
    elif direction == "LEFT":
        new_head = (x - CELL_SIZE, y)
    else:
        new_head = (x + CELL_SIZE, y)

    snake.insert(0, new_head)

    if new_head == food:
        food = (
            random.randrange(0, WIDTH, CELL_SIZE),
            random.randrange(0, HEIGHT, CELL_SIZE)
        )
    else:
        snake.pop()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP] and direction != "DOWN":
        direction = "UP"
    if keys[pygame.K_DOWN] and direction != "UP":
        direction = "DOWN"
    if keys[pygame.K_LEFT] and direction != "RIGHT":
        direction = "LEFT"
    if keys[pygame.K_RIGHT] and direction != "LEFT":
        direction = "RIGHT"

    move_snake()

    # Game over conditions
    head = snake[0]
    if (
        head[0] < 0 or head[0] >= WIDTH or
        head[1] < 0 or head[1] >= HEIGHT or
        head in snake[1:]
    ):
        pygame.quit()
        sys.exit()

    screen.fill(BLACK)
    draw_snake()
    pygame.draw.rect(screen, RED, (*food, CELL_SIZE, CELL_SIZE))
    pygame.display.flip()
    clock.tick(10)
