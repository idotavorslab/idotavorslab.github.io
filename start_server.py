import urllib.request
import os

# import http.server as server

jsurl = 'https://cdn.jsdelivr.net/gh/giladbarnea/betterhtmlelement@latest/dist/all.js'
dtsurl = 'https://cdn.jsdelivr.net/gh/giladbarnea/betterhtmlelement@latest/dist/all.d.ts'
localjspath = os.path.join(os.getcwd(), 'common/js/betterhtmlelement.js')
localdtspath = os.path.join(os.getcwd(), 'common/js/betterhtmlelement.d.ts')
print('trying to delete local betterhtmlelement.js and d.ts...')
try:
    os.remove(localjspath)
except FileNotFoundError:
    print(f'{localjspath} not found, skipping')
    pass
try:
    os.remove(localdtspath)
except FileNotFoundError:
    print(f'{localdtspath} not found, skipping')
    pass

print(f'downloading betterhtmlelement@latest/dist/all.js and all.d.ts to /common/js/...')
urllib.request.urlretrieve(jsurl, localjspath)
urllib.request.urlretrieve(dtsurl, localdtspath)

os.system('py -3.7 -m http.server')
