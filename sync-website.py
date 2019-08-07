import os
import sys

shouldsync = input('sync any changed that might have happened? y/n\t').lower()
if shouldsync != 'y':
    print('exiting')
    sys.exit()
print('ok, syncing...')
os.system(f'git pull')
