const GalleryPage = () => {
    async function init() {
        class GalleryImg extends Img {
            constructor(brightness, contrast, file, year, caption) {
                super({});
                this._path = null;
                this._index = null;
                this.caption = null;
                this.contrast = 1;
                this.brightness = 1;
                if (file === undefined) {
                    this.simplyPath = file;
                    this._index = files.indexOf(file);
                }
                if (caption !== undefined)
                    this.caption = caption;
                if (contrast !== undefined)
                    this.contrast = contrast;
                if (brightness !== undefined)
                    this.brightness = brightness;
                if (year !== undefined)
                    this.year = year;
            }
            set simplyPath(_path) {
                this._path = _path;
            }
            set path(_path) {
                this._path = _path;
                this._index = files.indexOf(this.path);
                const { contrast, brightness, caption, year } = data[this._index];
                this.caption = caption;
                this.contrast = contrast || 1;
                this.brightness = brightness || 1;
                this.year = year;
            }
            get path() {
                return this._path;
            }
            indexOfLeftFile() {
                if (this._index === 0)
                    return files.length - 1;
                else
                    return this._index - 1;
            }
            indexOfRightFile() {
                if (this._index === files.length - 1)
                    return 0;
                else
                    return this._index + 1;
            }
        }
        console.log('GalleryPage init');
        const chevronSvg = `<svg version="1.1" id="chevron_right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 185.343 185.343">
    <path style="fill:#000;"
		  d="M 51.707,185.343
    c -2.741,0-5.493-1.044-7.593-3.149
    c -4.194-4.194-4.194-10.981,0-15.175
	l 74.352-74.347
	L 44.114,18.32
	c -4.194-4.194-4.194-10.987,0-15.175
	c 4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
	c 4.194,4.194,4.194,10.987,0,15.175
	l -81.934,81.939
	C 57.201,184.293,54.454,185.343,51.707,185.343
	Z"/>

</svg>
`;
        function switchToImg(_selectedIndex) {
            selectedFile.path = files[_selectedIndex];
            imgViewer.img
                .src(selectedFile.path.includes('https') ? selectedFile.path : `main/gallery/${selectedFile.path}`)
                .css({ filter: `contrast(${selectedFile.contrast}) brightness(${selectedFile.brightness})` });
            imgViewer.caption.text(selectedFile.caption);
        }
        async function gotoAdjImg(event) {
            event.stopPropagation();
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(selectedFile.indexOfLeftFile());
            }
            else {
                console.log('right chevron pointerdown');
                switchToImg(selectedFile.indexOfRightFile());
            }
        }
        function closeImgViewer() {
            Body.toggleClass('theater', false);
            imagesContainer.toggleClass('theater', false);
            Navbar.css({ opacity: 1 });
            imgViewer
                .toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }
        function toggleImgViewer(selectedFile) {
            console.log('imgContainer pointerdown, isopen (before):', imgViewer.isopen);
            if (imgViewer.isopen)
                return closeImgViewer();
            imgViewerClose.toggleClass('on', true);
            imgViewer
                .toggleClass('on', true)
                .img
                .src(selectedFile.path.includes('https') ? selectedFile.path : `main/gallery/${selectedFile.path}`)
                .css({ filter: `contrast(${selectedFile.contrast}) brightness(${selectedFile.brightness})` });
            imgViewer.caption.text(selectedFile.caption);
            imgViewer.isopen = true;
            Body.toggleClass('theater', true);
            imagesContainer.toggleClass('theater', true);
            Navbar.css({ opacity: 0 });
        }
        const imgViewer = div({ id: 'img_viewer' })
            .cacheAppend({
            left: div({ id: 'left_chevron', cls: 'left' }).html(chevronSvg).pointerdown(gotoAdjImg),
            img: img({}),
            right: div({ id: 'right_chevron', cls: 'right' }).html(chevronSvg).pointerdown(gotoAdjImg),
            caption: div({ id: 'caption' })
        }).pointerdown((event) => {
            console.log('imgViewer pointerdown, stopping propagation');
            event.stopPropagation();
        });
        imgViewer.isopen = false;
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        const galleryImgs = [];
        for (let { brightness, contrast, file, year, caption } of data) {
            let galleryImg = new GalleryImg(brightness, contrast, file, year, caption);
            let cachedImage = CacheDiv[`gallery.${file}`];
            if (cachedImage !== undefined) {
                galleryImg.wrapSomethingElse(cachedImage.removeAttr('hidden'));
                console.log('gallery | cachedImage isnt undefined:', cachedImage);
            }
            else {
                console.log('gallery | cachedImage IS undefined');
                let src = `main/gallery/${file}`;
                galleryImg.src(src);
            }
            galleryImg
                .pointerdown((event) => {
                event.stopPropagation();
                selectedFile.path = file;
                return toggleImgViewer(selectedFile);
            })
                .css({ filter: `contrast(${contrast || 1}) brightness(${brightness || 1})` });
            galleryImgs.push(galleryImg);
        }
        galleryImgs.sort(({ year: yearA }, { year: yearB }) => yearB - yearA);
        console.log(JSON.parstr({ "galleryImgs after sort": galleryImgs }));
        const yearDivs = [];
        const yearToImg = {};
        const yearToYearDiv = {};
        let count = 0;
        console.group('for (let [i, galleryImg] of Object.entries(galleryImgs))');
        for (let galleryImg of galleryImgs) {
            if (galleryImg.year in yearToYearDiv) {
                count++;
                let yearDiv = yearToYearDiv[galleryImg.year];
                console.log(`year ${galleryImg.year} in yearToYearDiv`, JSON.parstr({ count, galleryImg, yearDiv }));
                switch (count % 4) {
                    case 0:
                        yearDiv.row0.append(galleryImg);
                        console.log('row0');
                        break;
                    case 1:
                        yearDiv.row1.append(galleryImg);
                        console.log('row1');
                        break;
                    case 2:
                        yearDiv.row2.append(galleryImg);
                        console.log('row2');
                        break;
                    case 3:
                        yearDiv.row3.append(galleryImg);
                        console.log('row3');
                        break;
                }
            }
            else {
                count = 0;
                let yearDiv = div({ cls: 'year' });
                console.log(`year ${galleryImg.year} NOT in yearToYearDiv`, JSON.parstr({ count, galleryImg, yearDiv }));
                yearDiv.cacheAppend({
                    row0: div({ cls: 'row_0' }),
                    row1: div({ cls: 'row_1' }),
                    row2: div({ cls: 'row_2' }),
                    row3: div({ cls: 'row_3' }),
                });
                switch (count % 4) {
                    case 0:
                        yearDiv.row0.append(galleryImg);
                        console.log('row0');
                        break;
                    case 1:
                        yearDiv.row1.append(galleryImg);
                        console.log('row1');
                        break;
                    case 2:
                        yearDiv.row2.append(galleryImg);
                        console.log('row2');
                        break;
                    case 3:
                        yearDiv.row3.append(galleryImg);
                        console.log('row3');
                        break;
                }
                yearToYearDiv[galleryImg.year] = yearDiv;
            }
        }
        console.groupEnd();
        console.log({ yearToYearDiv });
        const imagesContainer = div({ id: 'images_container' }).append(...Object.values(yearToYearDiv));
        DocumentElem
            .pointerdown(() => {
            if (!imgViewer.isopen)
                return;
            console.log('document pointerdown, closeImgViewer()');
            closeImgViewer();
        })
            .keydown((event) => {
            if (!imgViewer.isopen)
                return;
            if (event.key === "Escape")
                return closeImgViewer();
            if (event.key.startsWith("Arrow")) {
                if (event.key === "ArrowLeft")
                    return switchToImg(selectedFile.indexOfLeftFile());
                else if (event.key === "ArrowRight")
                    return switchToImg(selectedFile.indexOfRightFile());
            }
        });
        const imgViewerClose = div({ id: 'img_viewer_close' }).append(elem({ tag: 'svg' })
            .attr({ viewBox: `0 0 32 32` })
            .append(elem({ tag: 'path', cls: 'upright' }), elem({ tag: 'path', cls: 'downleft' }))).pointerdown(closeImgViewer);
        Home.empty().class('gallery-page').append(imagesContainer, imgViewer, imgViewerClose);
    }
    return { init };
};
//# sourceMappingURL=gallery.js.map