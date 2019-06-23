import os

allowed = ['common', 'main']
root = os.getcwd()

cmd = 'sass --no-source-map --watch '
for dirpath, dirnames, filenames in os.walk(root):
    if dirpath == root:
        [dirnames.remove(d) for d in dirnames[:] if d not in allowed]
    relpath = os.path.relpath(dirpath, root)
    for f in filenames:
        if f.endswith('.sass') and not f.startswith('_'):
            cmd += f'{relpath}/{f}:{relpath}/{f.replace("sass", "css")} '

print(f"\nexecuting: \n{cmd}\n")
os.system(cmd)
