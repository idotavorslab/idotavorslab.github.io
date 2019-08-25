const GalleryPage = () => {
    async function init() {
        console.log('GalleryPage init');
        const imgViewerContainer = div({
            id: 'img_viewer_container'
        }).cacheAppend({ imgViewer: div({ cls: 'img-viewer' }) });
        document.body.append(imgViewerContainer.e);
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs = [];
        for (let { description, file } of data) {
            let divElem = div({ cls: 'img-container' }).append(img({ src: `main/gallery/${file}` }));
            divElem.pointerdown(() => {
                imgViewerContainer.imgViewer.css({ backgroundImage: `url('main/gallery/${file}')` });
            });
            divs.push(divElem);
        }
        const imgContainer = elem({ tag: 'images' }).append(...divs);
        Home.empty().append(imgContainer);
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map