#!python3
"""
This is a simple script to resize a specified image, (or all images in main/gallery if unspecified), to a new resolution.
Defaults to a new height of 600 pixels (aspect ratio is preserved so width is calculated automatically).
Resized file names are suffixed with '-height-<NEW HEIGHT>' (e.g. 'image.jpg' -> 'image-height-600.jpg').
Usage:
    python3 resize_images.py [ARGUMENTS] [OPTIONS]
Arguments:
    PATH                Default: all images in main/gallery.
                          Can be a path to a single image or to a directory with images.
Options:
    --height=<HEIGHT>   Default: 600
    --dry-run           Don't actually save any files to disk
    -h, --help          Show this help message and exit

Examples:
    python3 resize_images.py
    python3 resize_images.py /main/gallery/31.png
    python3 resize_images.py --height=800
    python3 resize_images.py --height=800 /main/gallery/31.png
    python3 resize_images.py /family-albums/eilat-2018 --dry-run
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ModuleNotFoundError:
    print('\x1b[31;1mERROR\x1b[0m: PIL (Python Imaging Library) is required to run this script.\n'
          'Install it with `pip3 install Pillow` (preferably from a virtual environment).')
    sys.exit(1)

def confirm(prompt):
    prompt = f'\x1b[36;1m ? \x1b[22m{prompt} \x1b[1my/n\x1b[0m '
    return input(prompt).strip().lower() == 'y'

def resize_image(path):
    im = Image.open(path)
    width, height = im.size
    new_width = int(width // (height / new_height))
    if new_width == width or new_height == height:
        print(f'\x1b[1mSkipping\x1b[0m {path} (already at {new_width}x{new_height})')
        return
    if new_width >= width or new_height >= height:
        prompt = (f'{path} original size is {width}x{height}; '
                  f'are you sure you want to resize it to {new_width}x{new_height}?')
        if not confirm(prompt):
            return
    resized = im.resize((new_width, new_height))
    resized_path = f'{path.parent}/{path.stem}-height-{new_height}{path.suffix}'
    print(f'Resizing {path} ({width}x{height}) -> {resized_path} ({new_width}x{new_height})')
    if not dry_run:
        resized.save(resized_path, optimize=True)
        original_image_size_kb = path.stat().st_size / 1_000
        resized_size_kb = Path(resized_path).stat().st_size / 1_000
        message = f'Original file size: {original_image_size_kb:,.2f}KB, resized file size: {resized_size_kb:,.2f}KB'
        if resized_size_kb >= original_image_size_kb:
            print(f'\033[33m{message}\033[0m')
        else:
            print(f'\033[32m{message}\033[0m')


def main():
    if dry_run:
        print('\x1b[1mDRY RUN\x1b[0m, not actually saving any files to disk')
    if not target_path.exists():
        print(f'\x1b[31;1mERROR\x1b[0m: {target_path} does not exist')
        sys.exit(1)
    if target_path.is_dir():
        images = [image for image in target_path.iterdir() if image.suffix.lower() in ('.jpg', '.jpeg', '.png')]
        if not confirm(f'Resize all {len(images)} images in {target_path} to {new_height}px height?'):
            sys.exit(0)
        for path in images:
            print()
            resize_image(path)
    else:
        if not confirm(f'Resize {target_path} to {new_height}px height?'):
            sys.exit(0)
        resize_image(target_path)


if __name__ == '__main__':
    target_path = None
    dry_run = False
    new_height = 600
    while sys.argv[1:]:
        arg = sys.argv.pop(1)
        if arg == '-h' or 'help' in arg:
            print(__doc__)
            sys.exit(0)
        if arg == '--dry-run':
            dry_run = True
        elif arg.startswith('--height'):
            if '=' in arg:
                new_height = int(arg.split('=')[1])
            else:
                new_height = int(sys.argv.pop(1))
        else:
            if target_path is None:
                target_path = Path(arg)
            else:
                sys.exit(f'\x1b[31;1mERROR\x1b[0m: too many arguments: {arg}.\n{__doc__}')
    if target_path is None:
        target_path = Path('main/gallery')
    main()
