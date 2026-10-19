#!/usr/bin/env python3
# Genera favicon.gif: la «a» de alpefe en fósforo, 32×32, con scanlines, un
# barrido de sincronismo que baja y un par de frames de glitch. Paleta
# teletexto (verde fósforo sobre el negro azulado del tubo).
#
# Uso: python scripts/make-favicon.py   (escribe favicon.gif en la raíz)
#
# Sin dependencias fuera de Pillow.

from PIL import Image

SIZE = 32
GLASS = (4, 6, 11)
BORDER = (18, 63, 72)          # cian del sitio al 25 % sobre el cristal
PHOSPHOR_LO = (125, 255, 176)  # verde fósforo en reposo
PHOSPHOR_HI = (216, 255, 232)  # el pico del pulso

# «a» de 5×7, escala ×3
A = [
    "00000",
    "01110",
    "00001",
    "01111",
    "10001",
    "01111",
    "00000",
]
SCALE = 3
AX = (SIZE - 5 * SCALE) // 2
AY = (SIZE - 7 * SCALE) // 2


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def frame(i, total=12):
    img = Image.new("RGB", (SIZE, SIZE), GLASS)
    px = img.load()

    # margen del tubo
    for x in range(SIZE):
        for y in (0, SIZE - 1):
            px[x, y] = BORDER
    for y in range(SIZE):
        for x in (0, SIZE - 1):
            px[x, y] = BORDER

    # pulso del fósforo: dos latidos por vuelta
    t = (i % total) / total
    pulse = abs((t * 2) % 1 - 0.5) * 2          # 0..1
    color = tuple(int(lo + (hi - lo) * pulse) for lo, hi in zip(PHOSPHOR_LO, PHOSPHOR_HI))

    # glitch: dos frames con la señal desplazada y franjas de color
    glitch = i in (9, 10)
    off = -1 if i == 9 else 1 if i == 10 else 0

    for row, bits in enumerate(A):
        for col, bit in enumerate(bits):
            if bit != "1":
                continue
            for dy in range(SCALE):
                for dx in range(SCALE):
                    x = AX + col * SCALE + dx + off
                    y = AY + row * SCALE + dy
                    if 0 < x < SIZE - 1 and 0 < y < SIZE - 1:
                        px[x, y] = color

    # fringe de color en el glitch (aberración cromática del golpe de electrones)
    if glitch:
        for y in range(AY, AY + 7 * SCALE):
            x = AX - 1 + off
            if 0 < x < SIZE - 1:
                px[x, y] = (255, 84, 66)
            x = AX + 5 * SCALE + off
            if 0 < x < SIZE - 1:
                px[x, y] = (60, 232, 255)

    # scanlines: filas pares oscurecidas (como el .crt del sitio)
    for y in range(1, SIZE - 1):
        if y % 2 == 0:
            for x in range(1, SIZE - 1):
                px[x, y] = shade(px[x, y], 0.62)

    # barrido de sincronismo: banda de 3 filas que baja en cada frame
    band = (i * 3) % (SIZE + 6) - 4
    for y in range(band, band + 3):
        if 1 <= y < SIZE - 1:
            for x in range(1, SIZE - 1):
                px[x, y] = shade(px[x, y], 1.35)

    return img


def main():
    frames = [frame(i).convert("P", palette=Image.ADAPTIVE, colors=32) for i in range(12)]
    frames[0].save(
        "favicon.gif",
        save_all=True,
        append_images=frames[1:],
        duration=80,      # ms por frame, ~1 s de vuelta
        loop=0,
        disposal=2,
        optimize=False,
    )
    print("favicon.gif escrito")


if __name__ == "__main__":
    main()
