#!python3
"""
This is a simple script to resize a specified image / directory (all images in main/gallery by default), to a new resolution.
Defaults to a new height of 600 pixels (aspect ratio is preserved so width is calculated automatically).
Resized file names are suffixed with '-height-<NEW HEIGHT>' (e.g. 'image.jpg' -> 'image-height-600.jpg').
Usage:
    python3 resize_images.py [ARGUMENTS] [OPTIONS]
Arguments:
    PATH                Default: all images in main/gallery.
                          Can be a path to a single image or to a directory with images.
Options:
    --height=<HEIGHT>   Default: 600.
    --dry-run           Don't actually save any files to disk.
    -h, --help          Show this help message and exit.
    --no-overwrite      Write resized images to a new file, instead of overwriting the original. Default: overwrite.
                          If the target file already exists, and has the same resolution as the target resolution,
                          it will be skipped. If it has a different resolution, user will be prompted to overwrite.

Examples:
    python3 resize_images.py
    python3 resize_images.py /main/gallery/31.png
    python3 resize_images.py --height=800
    python3 resize_images.py --height=800 /main/gallery/31.png
    python3 resize_images.py /family-albums/eilat-2018 --no-overwrite
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
    if '\n' in prompt:
        prompt = "\n   ".join(prompt.splitlines()) + "\n  "
    prompt = f'\x1b[36;1m ? \x1b[22m{prompt} \x1b[1my/n\x1b[0m '
    answer = input(prompt).strip().lower()
    while not answer:
        print('\x1b[1mNo answer given.\x1b[0m')
        answer = input(prompt).strip().lower()
    return answer in ('y', 'yes')


def resize_image(path: Path):
    image = Image.open(path)
    original_image_size_kb = path.stat().st_size / 1_000
    width, height = image.size
    new_width = int(width // (height / new_height))
    if new_width == width or new_height == height:
        print(f'\x1b[1mSkipping\x1b[0m {path} (already at {new_width}x{new_height})')
        return
    if new_width >= width or new_height >= height:
        prompt = (f'{path} original size is {width}x{height}.\n'
                  f'Are you sure you want to resize it to {new_width}x{new_height}?')
        if not confirm(prompt):
            return
    resized = image.resize((new_width, new_height))
    if overwrite:
        resized_path = path
    else:
        resized_path = Path(f'{path.parent}/{path.stem}-height-{new_height}{path.suffix}')
        if resized_path.exists():
            existing_resized_image = Image.open(resized_path)
            if existing_resized_image.size == (new_width, new_height):
                print(f'\x1b[1mSkipping\x1b[0m {path}; A {new_width}x{new_height} already exists: {resized_path}')
                return
            prompt = (f'{resized_path} already exists, but at {"x".join(map(str,existing_resized_image.size))}.\n'
                      f'Are you sure you want to overwrite it with a {new_width}x{new_height} image?')
            if not confirm(prompt):
                return
    message = f'\x1b[1mResizing\x1b[0m {path} ({width}x{height}) -> {resized_path} ({new_width}x{new_height})'
    if dry_run:
        message += " (not really because of --dry-run)"
    print(message)
    if not dry_run:
        resized.save(resized_path, optimize=True)
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
        prompt = f'Resize all {len(images)} images in {target_path} to {new_height}px height?'
        if overwrite:
            prompt += '\nThis will overwrite existing files, so remember to back up your originals first'
        else:
            prompt += f'\nThis will create new images ending with "-height-{new_height}", so remember to change gallery.json to point to the resized images'
        if not confirm(prompt):
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
    overwrite = True
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
        elif arg == '--no-overwrite':
            overwrite = False
        else:
            if target_path is None:
                target_path = Path(arg)
            else:
                sys.exit(f'\x1b[31;1mERROR\x1b[0m: too many arguments: {arg}.\n{__doc__}')
    if target_path is None:
        target_path = Path('main/gallery')
    main()
