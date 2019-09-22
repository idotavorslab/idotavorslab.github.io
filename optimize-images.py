from typing import List

from PIL import Image
from pathlib import Path
import sys
import os
import png

gallery_path = Path('main/gallery')
opt_path = (gallery_path / 'opt')
if not opt_path.is_dir():
    opt_path.mkdir()

duplicates = set()

# none of the following 3 lists have duplicates in either list
gallery_images: List[Path] = [e for e in gallery_path.iterdir() if e.suffix.lower() in ['.jpg', '.jpeg', '.png']]
jpgs: List[Path] = []
pngs: List[Path] = []


def populate_jpgs_pngs():
    for img in gallery_images:
        if img.suffix.lower() in ['.jpg', '.jpeg']:
            jpgs.append(img)
        elif img.suffix.lower() == '.png':
            pngs.append(img)


def separate_duplicates():
    for i_img in gallery_images:
        for j__img in gallery_images:
            if i_img != j__img and i_img.stem.lower() == j__img.stem.lower():
                duplicates.add(i_img)
                duplicates.add(j__img)

    for dup in duplicates:
        gallery_images.remove(dup)


def interlace_pngs():
    for png_path in pngs:
        if '23-no-il' not in png_path.stem:
            continue
        png_img: Image.Image = Image.open(png_path)
        # interlaced = bool(png_img.info.get('interlace'))
        reader: png.Reader = png.Reader(bytes=png_path.read_bytes())
        reader.read()
        if reader.interlace:
            reduce_filesize(reader)
        else:
            write_path = opt_path / png_path.name
            with open(write_path, 'w+b') as f:
                writer = png.Writer(width=reader.width,
                                    height=reader.height,
                                    bitdepth=reader.bitdepth,
                                    compression=reader.compression,
                                    greyscale=False,
                                    interlace=True
                                    )
                direct = list(reader.asDirect()[2])
                writer.write(f, direct)


def reduce_filesize(png_reader: png.Reader):
    pass


separate_duplicates()
print(duplicates)
populate_jpgs_pngs()


def foo():
    for img in gallery_images:
        suffix = img.suffix.lower()
        stem = img.stem.lower()
    # if ext in ['jpg', 'jpeg']:
    #     jpg = Image.open(pathlib.)


interlace_pngs()
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
