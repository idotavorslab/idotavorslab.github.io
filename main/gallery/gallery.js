const GalleryPage = () => {
    async function init() {
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
        function switchToImg(selectedIndex) {
            selectedFile = files[selectedIndex];
            imgViewer.img.src(`main/gallery/${selectedFile}`);
        }
        function getRightIndex(selectedIndex) {
            if (selectedIndex === files.length - 1)
                return 0;
            else
                return selectedIndex + 1;
        }
        function getLeftIndex(selectedIndex) {
            if (selectedIndex === 0)
                return files.length - 1;
            else
                return selectedIndex - 1;
        }
        async function gotoAdjImg(event) {
            event.stopPropagation();
            let selectedIndex = files.indexOf(selectedFile);
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(getLeftIndex(selectedIndex));
            }
            else {
                console.log('right chevron pointerdown');
                switchToImg(getRightIndex(selectedIndex));
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
        function toggleImgViewer(event, file, description) {
            console.log('imgContainer pointerdown, isopen (before):', imgViewer.isopen);
            event.stopPropagation();
            if (imgViewer.isopen)
                return closeImgViewer();
            selectedFile = file;
            imgViewerClose.toggleClass('on', true);
            imgViewer
                .toggleClass('on', true)
                .img.src(`main/gallery/${selectedFile}`);
            imgViewer.isopen = true;
            imgViewer.caption.text(description);
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
        const data = await fetchJson("main/gallery/gallery.json", "default");
        const files = data.map(d => d.file);
        let selectedFile = null;
        const row0 = div({ id: 'row_0' });
        const row1 = div({ id: 'row_1' });
        const row2 = div({ id: 'row_2' });
        const row3 = div({ id: 'row_3' });
        for (let [i, { description, file }] of Object.entries(data)) {
            let src;
            src = `main/gallery/${file}`;
            let image = img({ src }).pointerdown((event) => toggleImgViewer(event, file, description));
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
                let selectedIndex = files.indexOf(selectedFile);
                if (event.key === "ArrowLeft")
                    return switchToImg(getLeftIndex(selectedIndex));
                else if (event.key === "ArrowRight")
                    return switchToImg(getRightIndex(selectedIndex));
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