change = raw_input('what was changed?\t')
if not change:
    change = raw_input('bad input, what was changed man?\t')
    if not change:
        print('i give up. exiting')
        import sys

        sys.exit()
import os

os.system('git commit -a -m "' + change + '" && git push')
