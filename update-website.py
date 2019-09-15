import re
import os
import sys
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


"""
cd /a/home/cc/tree/taucc/students/lifesci/idotavor/public_html
git clone https://github.com/idotavorslab/idotavorslab.github.io.git __tmp
rm -rf __tmp/.git
cp -v -r __tmp/* .
rm -rf __tmp
find -iname "*.py" -type f -exec rm '{}' ';'
find -iname "*.sh" -type f -exec rm '{}' ';'
find -iname "*.sass" -type f -exec rm '{}' ';'
find -iname "*.map" -type f -exec rm '{}' ';'
find -iname "*.ts" -type f -exec rm '{}' ';'
find -iname "*.md" -type f -exec rm '{}' ';'
find -iname "*.zip" -type f -exec rm '{}' ';'
exit
"""
print '\nPushing to GitHub...\n'
os.system('git add . && git commit -a -m "' + change + '" && git push')
print '\nSuccess pushing to GitHub.\nYou will now be asked to enter your tau account password. Afterwards, run the following command (you can copy-paste it):\n'
print '"sh /a/home/cc/tree/taucc/students/lifesci/idotavor/public_html/clone-and-replace.sh"'
os.system('ssh idotavor@gp.tau.ac.il')
