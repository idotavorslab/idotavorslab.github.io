import re
change = raw_input('What was changed? (no quotes)\t')
trynum = 1

while not change or not re.findall(r'\w',change):
    print "! user input was empty or had no letter, try again (try number: %d)" % trynum
    change = raw_input('Bad input, what was changed?')
    trynum += 1
import os

os.system('git add . && git commit -a -m "' + change + '" && git push')
