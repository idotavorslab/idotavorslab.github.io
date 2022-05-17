import os


def main():
    allowed = ['common', 'main']
    root = os.getcwd()

    cmd = 'sass --watch '
    for dirpath, dirnames, filenames in os.walk(root):
        if dirpath == root:
            [dirnames.remove(d) for d in dirnames[:] if d not in allowed]
        relpath = os.path.relpath(dirpath, root)
        for f in filenames:
            if f.endswith('.sass') and not f.startswith('_'):
                cmd += f'{relpath}/{f}:{relpath}/{f.replace("sass", "css")} '
    cmd += f'--style compressed'
    print(f"\nexecuting: \n{cmd}\n")
    os.system(cmd)


if __name__ == '__main__':
    main()
