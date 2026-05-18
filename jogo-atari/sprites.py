# sprites.py
import pygame
import random
from settings import *

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Usando um retângulo simples para representar a nave
        self.image = pygame.Surface((PLAYER_WIDTH, PLAYER_HEIGHT))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        # Posicionando a nave na parte inferior central da tela
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 20
        self.speedx = 0

    def update(self):
        self.speedx = 0
        keystate = pygame.key.get_pressed()
        if keystate[pygame.K_LEFT]:
            self.speedx = -PLAYER_SPEED
        if keystate[pygame.K_RIGHT]:
            self.speedx = PLAYER_SPEED
        
        self.rect.x += self.speedx

        # Mantém a nave dentro da tela
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
        if self.rect.left < 0:
            self.rect.left = 0

    def shoot(self, all_sprites, bullets):
        bullet = Bullet(self.rect.centerx, self.rect.top)
        all_sprites.add(bullet)
        bullets.add(bullet)

class Asteroid(pygame.sprite.Sprite):
    def __init__(self, speed_multiplier=1.0):
        super().__init__()
        self.image = pygame.Surface((ASTEROID_WIDTH, ASTEROID_HEIGHT))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        # Surge em posição aleatória no topo
        self.rect.x = random.randrange(0, WIDTH - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        
        # Calcula a velocidade baseada no multiplicador de dificuldade
        min_spd = int(ASTEROID_MIN_SPEED * speed_multiplier)
        max_spd = int(ASTEROID_MAX_SPEED * speed_multiplier)
        if min_spd >= max_spd:
            max_spd = min_spd + 1
            
        self.speedy = random.randrange(min_spd, max_spd)

    def update(self):
        self.rect.y += self.speedy

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((BULLET_WIDTH, BULLET_HEIGHT))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect()
        self.rect.bottom = y
        self.rect.centerx = x
        self.speedy = BULLET_SPEED

    def update(self):
        self.rect.y += self.speedy
        # Se o tiro sair pelo topo da tela, é destruído
        if self.rect.bottom < 0:
            self.kill()
