#!/usr/bin/env python3
# Genera assets/bg.gif: la baldosa de fondo, al estilo de los fondos oscuros
# repetidos de las webs de los 90. Negro, una retícula de rombos punteada muy
# tenue y un par de estrellas. Lo bastante apagada para leer encima.
#
# Uso: python scripts/make-bg.py   (escribe assets/bg.gif)
#
# Sin dependencias fuera de Pillow.

from PIL import Image

SIZE = 32
BLACK = (0, 0, 0)
LATTICE = (22, 22, 34)   # rombos: apenas se ven
DITHER = (11, 11, 18)    # relleno de trama dentro de cada rombo
STAR = (70, 70, 96)      # estrellas sueltas
STAR_DIM = (36, 36, 52)

img = Image.new("RGB", (SIZE, SIZE), BLACK)
px = img.load()
half = SIZE // 2

for y in range(SIZE):
    for x in range(SIZE):
        # distancia "manhattan" al centro de la baldosa: rombo
        d = abs(x - half) + abs(y - half)
        if d == half and (x + y) % 2 == 0:
            px[x, y] = LATTICE           # borde del rombo, punteado
        elif d < half - 3 and (x % 4 == 0 and y % 4 == 2):
            px[x, y] = DITHER            # trama interior

for (x, y, c) in [(5, 7, STAR), (24, 26, STAR_DIM), (27, 4, STAR_DIM), (9, 22, STAR_DIM)]:
    px[x, y] = c

img.save("assets/bg.gif")
print("assets/bg.gif", img.size)
