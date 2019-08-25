const GalleryPage = () => {
    async function init() {
        console.log('GalleryPage init');
        const imgViewer = div({ id: 'img_viewer' });
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs = [];
        for (let { description, file } of data) {
            let divElem = div({ cls: 'img-container' }).append(img({ src: `main/gallery/${file}` }));
            divElem.pointerdown(() => {
                imgViewer.css({ backgroundImage: `url('main/gallery/${file}')` });
            });
            divs.push(divElem);
        }
        const images = elem({ tag: 'images' }).append(...divs);
        Home.empty().append(images, imgViewer);
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map