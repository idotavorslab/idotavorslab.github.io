from PIL import Image
import os

for img in os.listdir('main/gallery'):
    name, _, ext = img.rpartition('.')
    if not ext.lower() in ['jpg', 'jpeg', 'png']:
        continue
    if [e.rpartition('.')[0] for e in os.listdir('main/gallery')].count(name) > 1:
        print(name)
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
