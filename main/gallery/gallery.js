const GalleryPage = () => {
    async function init() {
        console.log('GalleryPage init');
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const srcs = data.pics;
        const imgs = [];
        for (let src of srcs) {
            console.log(src);
            imgs.push(img({ src: `main/gallery/${src}` }));
        }
        Home.empty().addClass('squeezed').append(...imgs);
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map