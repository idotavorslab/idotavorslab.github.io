cd /a/home/cc/tree/taucc/students/lifesci/idotavor/public_html || exit
git clone https://github.com/idotavorslab/idotavorslab.github.io.git __tmp
rm -rf __tmp/.git
cp -v -r __tmp/* .
rm -rf __tmp
