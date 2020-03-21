const GalleryPage = () => {
    async function init() {
        class PhotoDiv extends Div {
            constructor(brightness, contrast, file, year, caption) {
                super({});
                this.path = null;
                this.index = null;
                this.caption = null;
                this.contrast = 1;
                this.brightness = 1;
                if (file !== undefined) {
                    this.path = file;
                }
                if (caption !== undefined) {
                    this.caption = caption;
                }
                if (contrast !== undefined) {
                    this.contrast = contrast;
                }
                if (brightness !== undefined) {
                    this.brightness = brightness;
                }
                if (year !== undefined) {
                    this.year = year;
                }
                this.click((event) => {
                    console.log('this click:', this);
                    event.stopPropagation();
                    return togglePhotoViewer(this);
                });
            }
            getLeftPhotoDiv() {
                let i;
                if (this.index === 0) {
                    i = photoDivs.length - 1;
                }
                else {
                    i = this.index - 1;
                }
                return photoDivs[i];
            }
            getRightPhotoDiv() {
                let i;
                if (this.index === photoDivs.length - 1) {
                    i = 0;
                }
                else {
                    i = this.index + 1;
                }
                return photoDivs[i];
            }
            src(src) {
                return this.css({ backgroundImage: `url(${src})` });
            }
        }
        if (MOBILE === undefined) {
            await WindowElem.promiseLoaded();
        }
        const ROWSIZE = MOBILE ? 2 : 4;
        function switchToPhoto(_selectedPhoto) {
            console.log(`photoDiv.switchToImg(`, JSON.parstr({ _selectedPhoto }));
            selectedPhoto = _selectedPhoto;
            photoViewer.caption.text(selectedPhoto.caption);
            let clone = _selectedPhoto.e.cloneNode();
            photoViewer.photo.wrapSomethingElse(clone);
        }
        async function gotoAdjPhoto(event) {
            event.stopPropagation();
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron click');
                switchToPhoto(selectedPhoto.getLeftPhotoDiv());
            }
            else {
                console.log('right chevron click');
                switchToPhoto(selectedPhoto.getRightPhotoDiv());
            }
        }
        function closePhotoViewer(event) {
            console.log('closePhotoViewer', event);
            Body.toggleClass('theater', false);
            photosContainer.toggleClass('theater', false);
            _toggleNavigationElementsDisplay(true);
            photoViewer.toggleClass('on', false);
            photoViewerClose.toggleClass('on', false);
            photoViewer.isopen = false;
        }
        function togglePhotoViewer(_selectedPhoto) {
            console.log('photoDiv.togglePhotoViewer(', JSON.parstr({ _selectedPhoto }));
            if (photoViewer.isopen) {
                return closePhotoViewer();
            }
            photoViewerClose.toggleClass('on', true);
            photoViewer.toggleClass('on', true);
            switchToPhoto(_selectedPhoto);
            photoViewer.isopen = true;
            Body.toggleClass('theater', true);
            photosContainer.toggleClass('theater', true);
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
        const photoViewer = div({ id: 'img_viewer' })
            .cacheAppend({
            left: div({ id: 'left_chevron', cls: 'left' }).append(span({ cls: 'lines' })).click(gotoAdjPhoto),
            photo: div(),
            right: div({ id: 'right_chevron', cls: 'right' }).append(span({ cls: 'lines' })).click(gotoAdjPhoto),
            caption: div({ id: 'caption' })
        }).click((event) => {
            console.log('photoViewer click, stopping propagation');
            event.stopPropagation();
        });
        photoViewer.isopen = false;
        const data = await fetchArray("main/gallery/gallery.json");
        const photoDivs = [];
        for (let { brightness, contrast, file, year, caption } of data) {
            let photoDiv = new PhotoDiv(brightness, contrast, file, year, caption);
            let cachedPhoto = CacheDiv[`gallery.${file}`];
            if (cachedPhoto !== undefined) {
                photoDiv.wrapSomethingElse(cachedPhoto.removeAttr('hidden'));
                console.log(...less(`gallery | "gallery.${file}" loaded from cache`));
            }
            else {
                let src = `main/gallery/${file}`;
                photoDiv.src(src);
                console.log(...less(`gallery | "gallery.${file}" NOT loaded from cache`));
            }
            photoDiv.css({ filter: `contrast(${contrast || 1}) brightness(${brightness || 1})` });
            photoDivs.push(photoDiv);
        }
        photoDivs
            .sort(({ year: yearA }, { year: yearB }) => yearB - yearA)
            .forEach((image, i) => image.index = i);
        const yearToYearDiv = {};
        let count = 0;
        function appendToRow(yearDiv, photoDiv, count) {
            switch (count % ROWSIZE) {
                case 0:
                    yearDiv.grid.row0.append(photoDiv);
                    break;
                case 1:
                    yearDiv.grid.row1.append(photoDiv);
                    break;
                case 2:
                    yearDiv.grid.row2.append(photoDiv);
                    break;
                case 3:
                    yearDiv.grid.row3.append(photoDiv);
                    break;
            }
        }
        for (let photoDiv of photoDivs) {
            let yearDiv;
            if (photoDiv.year in yearToYearDiv) {
                count++;
                yearDiv = yearToYearDiv[photoDiv.year];
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
                    title: div({ cls: 'title' }).text(photoDiv.year),
                    grid: div({ cls: 'grid' }).cacheAppend(gridChildrenObj)
                });
                yearToYearDiv[photoDiv.year] = yearDiv;
            }
            appendToRow(yearDiv, photoDiv, count);
        }
        let selectedPhoto = new PhotoDiv();
        const photosContainer = div({ id: 'images_container' })
            .append(...Object.values(yearToYearDiv).reverse());
        DocumentElem
            .click(() => {
            if (!photoViewer.isopen) {
                return;
            }
            console.log('document click, closePhotoViewer()');
            closePhotoViewer();
        })
            .keydown((event) => {
            if (!photoViewer.isopen) {
                return;
            }
            if (event.key === "Escape") {
                return closePhotoViewer();
            }
            if (event.key.startsWith("Arrow")) {
                if (event.key === "ArrowLeft") {
                    return switchToPhoto(selectedPhoto.getLeftPhotoDiv());
                }
                else {
                    if (event.key === "ArrowRight") {
                        return switchToPhoto(selectedPhoto.getRightPhotoDiv());
                    }
                }
            }
        });
        const photoViewerClose = div({ id: 'img_viewer_close' })
            .append(span({ cls: 'lines' })).click(closePhotoViewer);
        Home.empty().class('gallery-page').append(photosContainer, photoViewer, photoViewerClose);
    }
    return { init };
};
//# sourceMappingURL=gallery.js.map