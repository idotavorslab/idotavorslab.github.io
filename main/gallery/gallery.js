const GalleryPage = () => {
    async function init() {
        console.log('GalleryPage init');
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const imgs = [];
        for (let imgObj of data) {
            console.log(imgObj);
            imgs.push(img({ src: `main/gallery/${imgObj.file}` }));
        }
        const imgContainer = div({ id: 'img_container' }).append(...imgs);
        Home.empty().addClass('squeezed').append(imgContainer);
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map