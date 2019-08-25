const GalleryPage = () => {
    async function init() {
        console.log('GalleryPage init');
        const imgViewerContainer = div({ id: 'img_viewer_container' })
            .cacheAppend({
            left: div({ cls: 'left', text: '<' }),
            imgViewer: div({ cls: 'img-viewer' }),
            right: div({ cls: 'right', text: '>' })
        });
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs = [];
        for (let { description, file } of data) {
            let divElem = div({ cls: 'img-container' }).append(img({ src: `main/gallery/${file}` }));
            divElem.pointerdown(() => {
                imgViewerContainer
                    .toggleClass('on', true)
                    .imgViewer.css({ backgroundImage: `url('main/gallery/${file}')` });
                Body.toggleClass('theater', true);
                images.toggleClass('theater', true);
                navbar.css({ opacity: 0 });
            });
            divs.push(divElem);
        }
        const images = elem({ tag: 'images' }).append(...divs);
        Home.empty().append(images, imgViewerContainer);
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map