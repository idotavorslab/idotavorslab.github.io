import re
import os
import sys

print('''
       -----------------------------------------------------------------------------------------------------------------
       |   USAGE:                                                                                                      |
       |   python update-website.py         Pushes changes to GitHub, then copies idotavor@gp.tau.ac.il:public_html    |
       |   python update-website.py git     Only pushes to GitHub                                                      |
       |   python update-website.py scp     Only copies files to idotavor@gp.tau.ac.il:public_html                     |
       -----------------------------------------------------------------------------------------------------------------
    ''')

if sys.version_info[0] < 3:
    inputfn = raw_input
else:
    inputfn = input

onlygit = False
onlyscp = False
try:
    if sys.argv[1].lower() == 'git':
        onlygit = True
        ok = inputfn('You are about to PUSH the changes you made to github, continue? y/n\t')
        if ok.lower() != 'y':
            print ('Exiting')
            sys.exit()
    elif sys.argv[1].lower() == 'scp':
        onlyscp = True
        ok = inputfn('You are about to COPY the changes you made to the actual website, continue? y/n\t')
        if ok.lower() != 'y':
            print ('Exiting')
            sys.exit()
except IndexError:
    ok = inputfn('You are about to PUSH to github and UPDATE the actual website with changes you made, continue? y/n\t')
    if ok.lower() != 'y':
        print ('Exiting')
        sys.exit()

if not onlyscp:
    change = inputfn('What was changed? (no quotes)\t')
    trynum = 1

    while not change or not re.findall(r'\w', change):
        print ("! user input was empty or had no letters, try again (try number: %d)\t" % trynum)
        change = inputfn('Bad input, what was changed?')
        trynum += 1

    print ('''
       -----------------------------
       |   Pushing to GitHub...    |
       -----------------------------
    ''')
    os.system('git add . && git commit -a -m "' + change + '" && git push')
    print ('''
       --------------------------------------------------------------------------------
       |   Success pushing to GitHub.                                                 |
       --------------------------------------------------------------------------------
       ''')

if not onlygit:
    print ('''
       ----------------------------------------------------------------------
       |   (secure)Copying files to idotavor@gp.tau.ac.il:public_html...    |
       ----------------------------------------------------------------------
    ''')
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

    os.system('rsync -avrth --delete-excluded %s ./ idotavor@gp.tau.ac.il:public_html' % excludestr)

    print ('''
       --------------------------------------------------------------------------------
       |   Success copying files to idotavor@gp.tau.ac.il:public_html.                |
       |   You can now see the changes at tau.ac.il/~idotavor                         |
       --------------------------------------------------------------------------------
       ''')
