from typing import List, Any

from PIL import Image
from pathlib import Path
import sys
import os

gallery_path = Path('main/gallery')
opt_path = (gallery_path / 'opt')
if not opt_path.is_dir():
    opt_path.mkdir()

doubles = set()

gallery_images: List[Path] = [e for e in gallery_path.iterdir() if e.suffix.lower() in ['.jpg', '.jpeg', '.png']]
jpgs: List[Path] = []
pngs: List[Path] = []


def populate_jpgs_pngs():
    for img in gallery_images:
        if img.suffix.lower() in ['.jpg', '.jpeg']:
            jpgs.append(img)
        elif img.suffix.lower() == 'png':
            pngs.append(img)


def separate_doubles():
    for i_img in gallery_images:
        for j__img in gallery_images:
            if i_img != j__img and i_img.stem.lower() == j__img.stem.lower():
                doubles.add(i_img)
                doubles.add(j__img)

    for double in doubles:
        gallery_images.remove(double)


separate_doubles()
print(doubles)


def foo():
    for img in gallery_images:
        suffix = img.suffix.lower()
        stem = img.stem.lower()
    # if ext in ['jpg', 'jpeg']:
    #     jpg = Image.open(pathlib.)

# print(doubles)
# no_il = Image.open('main/gallery/23-gimp-no-interlace.png')
# il = Image.open('main/gallery/23-gimp-interlace.png')
# jpg = Image.open('main/gallery/23-gimp-interlace-q95-opt-prog.jpg')
# il.save('main/gallery/23-gimp-interlace-q95.jpg', quality=95)
# il.save('main/gallery/23-gimp-interlace-q95-opt.jpg', quality=95, optimize=True)
# il.save('main/gallery/23-gimp-interlace-q95-prog.jpg', quality=95, progressive=True)
# il.save('main/gallery/23-gimp-interlace-q95-opt-prog.jpg', quality=95, optimize=True, progressive=True)
# img.save('main/gallery/23-comp9.png', compress_level=9, optimize=False)
# img.save('main/gallery/23-comp1.png', compress_level=1, optimize=False)
# img.save('main/gallery/23-optimized.png', optimize=True)
# data = img.getdata()
# print()
