import re

change = raw_input('What was changed? (no quotes)\t')
trynum = 1

while not change or not re.findall(r'\w', change):
    print "! user input was empty or had no letter, try again (try number: %d)" % trynum
    change = raw_input('Bad input, what was changed?')
    trynum += 1
import os

"""
/a/home/cc/tree/taucc/students/lifesci/idotavor/public_html
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
os.system('git add . && git commit -a -m "' + change + '" && git push')
