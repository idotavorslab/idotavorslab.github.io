const GalleryPage = () => {
    async function init() {
        class File {
            constructor() {
                this._path = null;
                this._index = null;
                this.caption = null;
                this.contrast = 1;
                this.brightness = 1;
            }
            set path(_path) {
                this._path = _path;
                this._index = files.indexOf(this.path);
                const { contrast, brightness, caption } = data[this._index];
                this.caption = caption;
                this.contrast = contrast || 1;
                this.brightness = brightness || 1;
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
        let selectedFile = new File();
        const row0 = div({ id: 'row_0' });
        const row1 = div({ id: 'row_1' });
        const row2 = div({ id: 'row_2' });
        const row3 = div({ id: 'row_3' });
        for (let [i, { file, contrast, brightness }] of Object.entries(data)) {
            let cachedImage = CacheDiv[file];
            let image;
            if (cachedImage !== undefined) {
                image = cachedImage.removeAttr('hidden');
                console.log('cachedImage isnt undefined:', cachedImage);
            }
            else {
                let src;
                if (file.includes('http') || file.includes('www')) {
                    src = file;
                }
                else {
                    src = `main/gallery/${file}`;
                }
                image = img({ src })
                    .pointerdown((event) => {
                    event.stopPropagation();
                    selectedFile.path = file;
                    return toggleImgViewer(selectedFile);
                })
                    .css({ filter: `contrast(${contrast || 1}) brightness(${brightness || 1})` });
            }
            switch (parseInt(i) % 4) {
                case 0:
                    row0.append(image);
                    break;
                case 1:
                    row1.append(image);
                    break;
                case 2:
                    row2.append(image);
                    break;
                case 3:
                    row3.append(image);
                    break;
            }
        }
        const imagesContainer = div({ id: 'images' }).append(row0, row1, row2, row3);
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
        Home.empty().append(imagesContainer, imgViewer, imgViewerClose);
    }
    return { init };
};
//# sourceMappingURL=gallery.js.map