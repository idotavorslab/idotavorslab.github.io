cd /a/home/cc/tree/taucc/students/lifesci/idotavor/public_html || exit
git clone https://github.com/idotavorslab/idotavorslab.github.io.git __tmp
rm -rf __tmp/.git
cp -v -r __tmp/* .
rm -rf __tmp
find . -iname "*.py" -type f -exec rm '{}' ';'
find . -iname "*.sh" -type f -exec rm '{}' ';'
find . -iname "*.sass" -type f -exec rm '{}' ';'
find . -iname "*.map" -type f -exec rm '{}' ';'
find . -iname "*.ts" -type f -exec rm '{}' ';'
find . -iname "*.md" -type f -exec rm '{}' ';'
find . -iname "*.zip" -type f -exec rm '{}' ';'
exit
