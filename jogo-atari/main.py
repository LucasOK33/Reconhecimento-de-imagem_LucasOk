# main.py
import pygame
import sys
from settings import *
from sprites import Player, Asteroid, Bullet

def draw_text(surface, text, size, x, y, color):
    font = pygame.font.SysFont(None, size)
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect()
    text_rect.topleft = (x, y)
    surface.blit(text_surface, text_rect)

def draw_text_centered(surface, text, size, y, color):
    font = pygame.font.SysFont(None, size)
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect()
    text_rect.midtop = (WIDTH // 2, y)
    surface.blit(text_surface, text_rect)

def main():
    # Inicialização do Pygame
    pygame.init()
    pygame.font.init()
    
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Space Shooter - Atari Style")
    clock = pygame.time.Clock()

    # Grupos de sprites
    all_sprites = pygame.sprite.Group()
    asteroids = pygame.sprite.Group()
    bullets = pygame.sprite.Group()

    player = Player()
    all_sprites.add(player)

    score = 0
    game_over = False

    # Configuração inicial de dificuldade
    current_spawn_rate = ASTEROID_INITIAL_SPAWN_RATE
    SPAWNASTEROID = pygame.USEREVENT + 1
    pygame.time.set_timer(SPAWNASTEROID, current_spawn_rate)

    # Loop principal
    running = True
    while running:
        # 1. Controle de FPS
        clock.tick(FPS)

        # 2. Processamento de Eventos
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            if not game_over:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        player.shoot(all_sprites, bullets)
                
                if event.type == SPAWNASTEROID:
                    # O multiplicador aumenta em 0.1 a cada 50 pontos
                    speed_mult = 1.0 + (score / 500.0)
                    asteroid = Asteroid(speed_multiplier=speed_mult)
                    all_sprites.add(asteroid)
                    asteroids.add(asteroid)

        if not game_over:
            # 3. Atualização
            all_sprites.update()

            # Checar colisão: tiro acertou asteroide
            hits = pygame.sprite.groupcollide(asteroids, bullets, True, True)
            for hit in hits:
                score += 10
                
                # Aumenta a dificuldade do jogo gradualmente ajustando a taxa de surgimento
                # Começa em 1500, cai 10ms a cada 10 pontos, minimo de 400ms
                new_spawn_rate = max(400, ASTEROID_INITIAL_SPAWN_RATE - (score * 1))
                if new_spawn_rate != current_spawn_rate:
                    current_spawn_rate = new_spawn_rate
                    pygame.time.set_timer(SPAWNASTEROID, current_spawn_rate)

            # Checar colisão: asteroide atingiu jogador
            hits = pygame.sprite.spritecollide(player, asteroids, False)
            if hits:
                game_over = True
            
            # Checar colisão: asteroide chegou ao fundo da tela
            for asteroid in asteroids:
                if asteroid.rect.top > HEIGHT:
                    game_over = True

        # 4. Renderização
        screen.fill(BLACK)
        all_sprites.draw(screen)
        
        draw_text(screen, f"Score: {score}", 36, 10, 10, WHITE)

        if game_over:
            draw_text_centered(screen, "GAME OVER", 64, HEIGHT // 2 - 80, RED)
            draw_text_centered(screen, f"Pontuacao Final: {score}", 48, HEIGHT // 2 - 10, WHITE)
            draw_text_centered(screen, "Pressione 'R' para REINICIAR", 36, HEIGHT // 2 + 50, GREEN)
            draw_text_centered(screen, "Pressione 'ESC' para SAIR", 36, HEIGHT // 2 + 90, WHITE)
            
            keys = pygame.key.get_pressed()
            if keys[pygame.K_ESCAPE]:
                running = False
            if keys[pygame.K_r]:
                # Reinicia os estados do jogo
                game_over = False
                score = 0
                current_spawn_rate = ASTEROID_INITIAL_SPAWN_RATE
                pygame.time.set_timer(SPAWNASTEROID, current_spawn_rate)
                
                # Esvazia os grupos
                all_sprites.empty()
                asteroids.empty()
                bullets.empty()
                
                # Recria o jogador
                player = Player()
                all_sprites.add(player)

        # Atualiza a tela
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
