import re
import os
import sys

SSHTGT = 'idotavor@gp.tau.ac.il:public_html'
print('''
       -----------------------------------------------------------------------------------------------------------------
       |   USAGE:                                                                                                      |
       |   python update-website.py         Pushes changes to GitHub, then copies %s    |
       |   python update-website.py git     Only pushes to GitHub                                                      |
       |   python update-website.py scp     Only copies files to %s                     |
       -----------------------------------------------------------------------------------------------------------------
    ''' % (SSHTGT, SSHTGT))

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
            print('Exiting')
            sys.exit()
    elif sys.argv[1].lower() == 'scp':
        onlyscp = True
        ok = inputfn('You are about to COPY the changes you made to the actual website, continue? y/n\t')
        if ok.lower() != 'y':
            print('Exiting')
            sys.exit()
except IndexError:
    ok = inputfn('You are about to PUSH to github and UPDATE the actual website with changes you made, continue? y/n\t')
    if ok.lower() != 'y':
        print('Exiting')
        sys.exit()

if not onlyscp:
    change = inputfn('What was changed? (no quotes)\t')
    trynum = 1

    while not change or not re.findall(r'\w', change):
        print("! user input was empty or had no letters, try again (try number: %d)\t" % trynum)
        change = inputfn('Bad input, what was changed?')
        trynum += 1

    print('''
       -----------------------------
       |   Pushing to GitHub...    |
       -----------------------------
    ''')
    os.system('git add . && git commit -a -m "' + change + '" && git push')
    print('''
       --------------------------------------------------------------------------------
       |   Success pushing to GitHub.                                                 |
       --------------------------------------------------------------------------------
       ''')

if not onlygit:
    print('''
       ----------------------------------
       |   Starting sync commands...    |
       ----------------------------------
    ''')
    exclude = ['.git',
               '.gitignore',
               'tsconfig.json',
               'shutterstock-conversation',
               'tmp',
               '.idea',
               '*.py',
               '*.sass',
               '*.map',
               '*.ts',
               '*.md',
               '*.zip',
               '*.sh',
               '.python-version',
               # '__tmp*'
               ]
    TMPDIR = '~/Documents/__tmp'
    excludestr = ' '.join(['--exclude=%s' % ex for ex in exclude])
    cmds = {
        'mkdir %s' % TMPDIR:                            'creating local %s dir' % TMPDIR,
        'rsync -arth %s ./ %s/' % (excludestr, TMPDIR): 'copying website files into %s dir' % TMPDIR,
        'chmod -R 755 %s/' % TMPDIR:                    "chmod'ing -R 755 everything inside %s dir" % TMPDIR,
        'rsync -avrth --delete-excluded %s ./ %s/ %s' % (
            excludestr, TMPDIR, SSHTGT):                'syncing contents of %s dir to %s' % (TMPDIR, SSHTGT),
        'rm -rf %s' % TMPDIR:                           'removing local %s dir' % TMPDIR
        }

    for cmd, description in cmds.items():
        print('\n%s...' % description.capitalize())
        code = os.system(cmd)
        if code != 0:
            print('\n\t!!\tSomething went wrong while %s. Quitting.' % description)
            sys.exit(code)

    print('''
       ----------------------------------------------------------------------------------
       |   Success copying files to %s.                  |
       |   In a few minutes, you will be able to see the changes at tau.ac.il/~idotavor |
       ----------------------------------------------------------------------------------
       ''' % SSHTGT)
