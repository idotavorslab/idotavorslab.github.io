import os
import sys

shouldsync = raw_input('Sync any changes that might have happened? y/n\t').lower()
if shouldsync != 'y':
    print('exiting')
    sys.exit()
print 'ok, syncing...'
os.system('git pull')
