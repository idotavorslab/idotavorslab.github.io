import re
import os
import sys

if sys.version_info[0] < 3:
    inputfn = raw_input
else:
    inputfn = input
ok = raw_input('You are about to UPDATE the actual website with changes you made, continue? y/n\t')
if ok.lower() != 'y':
    print 'Exiting'
    sys.exit()

change = raw_input('What was changed? (no quotes)\t')
trynum = 1

while not change or not re.findall(r'\w', change):
    print "! user input was empty or had no letters, try again (try number: %d)\t" % trynum
    change = raw_input('Bad input, what was changed?')
    trynum += 1

print
'''
   -----------------------------
   |   Pushing to GitHub...    |
   -----------------------------
'''
os.system('git add . && git commit -a -m "' + change + '" && git push')
print '''
   --------------------------------------------------------------------------------
   |   Success pushing to GitHub.                                                 |
   |   Starting secure copy to idotavor@gp.tau.ac.il:public_html...               |
   --------------------------------------------------------------------------------
   '''
# os.system('ssh idotavor@gp.tau.ac.il')
exclude = ['.git',
           '.gitignore',
           'tsconfig.json',
           '.idea',
           '*.py',
           '*.sass',
           '*.map',
           '*.ts',
           '*.md',
           '*.zip',
           '*.sh',
           '.python-version',
           ]
excludestr = ' '.join(['--exclude=%s' % ex for ex in exclude])

# the slash after the dot is crucial!
os.system('rsync -anvth --delete %s ./ idotavor@gp.tau.ac.il:public_html' % excludestr)

print '''
   --------------------------------------------------------------------------------
   |   Success copying files to idotavor@gp.tau.ac.il:public_html.                |
   |   You can now see the changes at tau.ac.il/~idotavor                         |
   --------------------------------------------------------------------------------
   '''
