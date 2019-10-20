const GalleryPage = () => {
    async function init() {
        class GalleryImg extends Img {
            constructor(brightness, contrast, file, year, caption) {
                super({});
                this.path = null;
                this.index = null;
                this.caption = null;
                this.contrast = 1;
                this.brightness = 1;
                if (file !== undefined)
                    this.path = file;
                if (caption !== undefined)
                    this.caption = caption;
                if (contrast !== undefined)
                    this.contrast = contrast;
                if (brightness !== undefined)
                    this.brightness = brightness;
                if (year !== undefined)
                    this.year = year;
                this.click((event) => {
                    console.log('this click:', this);
                    event.stopPropagation();
                    return toggleImgViewer(this);
                });
            }
            getLeftImage() {
                let i;
                if (this.index === 0)
                    i = galleryImgs.length - 1;
                else
                    i = this.index - 1;
                return galleryImgs[i];
            }
            getRightImage() {
                let i;
                if (this.index === galleryImgs.length - 1)
                    i = 0;
                else
                    i = this.index + 1;
                return galleryImgs[i];
            }
        }
        console.log('GalleryPage init');
        if (MOBILE === undefined)
            await WindowElem.promiseLoaded();
        const ROWSIZE = MOBILE ? 2 : 4;
        function switchToImg(_selectedImg) {
            console.log(`galleryImg.switchToImg(`, JSON.parstr({ _selectedImg }));
            selectedImg = _selectedImg;
            imgViewer.caption.text(selectedImg.caption);
            let clone = _selectedImg.e.cloneNode();
            imgViewer.img.wrapSomethingElse(clone);
        }
        async function gotoAdjImg(event) {
            event.stopPropagation();
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron click');
                switchToImg(selectedImg.getLeftImage());
            }
            else {
                console.log('right chevron click');
                switchToImg(selectedImg.getRightImage());
            }
        }
        function closeImgViewer(event) {
            console.log('closeImgViewer', event);
            Body.toggleClass('theater', false);
            imagesContainer.toggleClass('theater', false);
            _toggleNavigationElementsDisplay(true);
            imgViewer.toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }
        function toggleImgViewer(_selectedImg) {
            console.log('galleryImg.toggleImgViewer(', JSON.parstr({ _selectedImg }));
            if (imgViewer.isopen)
                return closeImgViewer();
            imgViewerClose.toggleClass('on', true);
            imgViewer.toggleClass('on', true);
            switchToImg(_selectedImg);
            imgViewer.isopen = true;
            Body.toggleClass('theater', true);
            imagesContainer.toggleClass('theater', true);
            _toggleNavigationElementsDisplay(false);
        }
        function _toggleNavigationElementsDisplay(on) {
            if (on) {
                elem({ id: 'navbar_section' }).removeClass('off');
            }
            else {
                elem({ id: 'navbar_section' }).addClass('off');
            }
        }
        const imgViewer = div({ id: 'img_viewer' })
            .cacheAppend({
            left: div({ id: 'left_css_chevron', cls: 'left' }).append(span({ cls: 'lines' })).click(gotoAdjImg),
            img: img(),
            right: div({ id: 'right_css_chevron', cls: 'right' }).append(span({ cls: 'lines' })).click(gotoAdjImg),
            caption: div({ id: 'caption' })
        }).click((event) => {
            console.log('imgViewer click, stopping propagation');
            event.stopPropagation();
        });
        imgViewer.isopen = false;
        const data = await fetchArray("main/gallery/gallery.json");
        const galleryImgs = [];
        for (let { brightness, contrast, file, year, caption } of data) {
            let galleryImg = new GalleryImg(brightness, contrast, file, year, caption);
            let cachedImage = CacheDiv[`gallery.${file}`];
            if (cachedImage !== undefined) {
                galleryImg.wrapSomethingElse(cachedImage.removeAttr('hidden'));
                console.log(...less(`gallery | "gallery.${file}" loaded from cache`));
            }
            else {
                let src = `main/gallery/${file}`;
                galleryImg.src(src);
            }
            galleryImg.css({ filter: `contrast(${contrast || 1}) brightness(${brightness || 1})` });
            galleryImgs.push(galleryImg);
        }
        galleryImgs
            .sort(({ year: yearA }, { year: yearB }) => yearB - yearA)
            .forEach((image, i) => image.index = i);
        const yearToYearDiv = {};
        let count = 0;
        function appendToRow(yearDiv, galleryImg, count) {
            switch (count % ROWSIZE) {
                case 0:
                    yearDiv.grid.row0.append(galleryImg);
                    break;
                case 1:
                    yearDiv.grid.row1.append(galleryImg);
                    break;
                case 2:
                    yearDiv.grid.row2.append(galleryImg);
                    break;
                case 3:
                    yearDiv.grid.row3.append(galleryImg);
                    break;
            }
        }
        for (let galleryImg of galleryImgs) {
            let yearDiv;
            if (galleryImg.year in yearToYearDiv) {
                count++;
                yearDiv = yearToYearDiv[galleryImg.year];
            }
            else {
                count = 0;
                let gridChildrenObj = {
                    row0: div({ cls: 'row' }),
                    row1: div({ cls: 'row' }),
                };
                if (!MOBILE) {
                    gridChildrenObj.row2 = div({ cls: 'row' });
                    gridChildrenObj.row3 = div({ cls: 'row' });
                }
                yearDiv = div({ cls: 'year' })
                    .cacheAppend({
                    title: div({ cls: 'title' }).text(galleryImg.year),
                    grid: div({ cls: 'grid' }).cacheAppend(gridChildrenObj)
                });
                yearToYearDiv[galleryImg.year] = yearDiv;
            }
            appendToRow(yearDiv, galleryImg, count);
        }
        console.log('yearToYearDiv:', JSON.parstr(yearToYearDiv));
        let selectedImg = new GalleryImg();
        const imagesContainer = div({ id: 'images_container' })
            .append(...Object.values(yearToYearDiv).reverse());
        DocumentElem
            .click(() => {
            if (!imgViewer.isopen)
                return;
            console.log('document click, closeImgViewer()');
            closeImgViewer();
        })
            .keydown((event) => {
            if (!imgViewer.isopen)
                return;
            if (event.key === "Escape")
                return closeImgViewer();
            if (event.key.startsWith("Arrow")) {
                if (event.key === "ArrowLeft")
                    return switchToImg(selectedImg.getLeftImage());
                else if (event.key === "ArrowRight")
                    return switchToImg(selectedImg.getRightImage());
            }
        });
        const imgViewerClose = div({ id: 'img_viewer_close_css' })
            .append(span({ cls: 'lines' })).click(closeImgViewer);
        Home.empty().class('gallery-page').append(imagesContainer, imgViewer, imgViewerClose);
    }
    return { init };
};
//# sourceMappingURL=gallery.js.map