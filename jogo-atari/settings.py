# settings.py
# Configurações globais do jogo

# Dimensões da tela
WIDTH = 800
HEIGHT = 600
FPS = 60

# Cores (RGB)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Configurações do Jogador (Nave)
PLAYER_SPEED = 5
PLAYER_WIDTH = 50
PLAYER_HEIGHT = 40

# Configurações dos Asteroides
ASTEROID_MIN_SPEED = 2
ASTEROID_MAX_SPEED = 4
ASTEROID_WIDTH = 40
ASTEROID_HEIGHT = 40
ASTEROID_INITIAL_SPAWN_RATE = 1500 # em milissegundos (mais lento no começo)

# Configurações do Projétil (Tiro)
BULLET_SPEED = -10
BULLET_WIDTH = 5
BULLET_HEIGHT = 15
