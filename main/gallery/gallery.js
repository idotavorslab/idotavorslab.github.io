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
            images.toggleClass('theater', false);
            navbar.css({ opacity: 1 });
            imgViewer
                .toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }
        const imgViewer = div({ id: 'img_viewer' })
            .cacheAppend({
            left: div({ id: 'left_chevron', cls: 'left' }).html(chevronSvg).pointerdown(gotoAdjImg),
            img: img({}),
            right: div({ id: 'right_chevron', cls: 'right' }).html(chevronSvg).pointerdown(gotoAdjImg)
        }).pointerdown((event) => {
            console.log('imgViewer pointerdown, stopping propagation');
            event.stopPropagation();
        });
        imgViewer.isopen = false;
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        console.log('GalleryPage data', data);
        const divs = [];
        let selectedFile = null;
        for (let { description, file } of data) {
            let imgContainer = div({ cls: 'img-container' })
                .append(img({ src: `main/gallery/${file}` })).pointerdown((event) => {
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
                Body.toggleClass('theater', true);
                images.toggleClass('theater', true);
                navbar.css({ opacity: 0 });
            });
            divs.push(imgContainer);
        }
        const images = elem({ tag: 'images' })
            .append(...divs);
        DocumentElem
            .pointerdown(() => {
            if (!imgViewer.isopen)
                return;
            console.log('document pointerdown, closeImgViewer()');
            closeImgViewer();
        })
            .keydown((event) => {
            console.log(`keydown, event.code: ${event.code}, event.key: ${event.key}`);
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
        const masonry = div({ cls: 'grid' })
            .attr({ 'data-masonry': '{ "itemSelector": ".grid-item", "columnWidth": 160 }' })
            .html(`<div class="grid-item"></div>
<div class="grid-item grid-item--width2 grid-item--height2"></div>
<div class="grid-item grid-item--height3"></div>
<div class="grid-item grid-item--height2"></div>
<div class="grid-item grid-item--width3"></div>
<div class="grid-item"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--height2"></div>
<div class="grid-item grid-item--width2 grid-item--height3"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--height2"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--width2 grid-item--height2"></div>
<div class="grid-item grid-item--width2"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--height2"></div>
<div class="grid-item"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--height3"></div>
<div class="grid-item grid-item--height2"></div>
<div class="grid-item"></div>
<div class="grid-item"></div>
<div class="grid-item grid-item--height2"></div>
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js"></script>
`);
        elem({ htmlElement: document.head }).empty().append(elem({ tag: 'style' }).html(`* { box-sizing: border-box; }

body { font-family: sans-serif; }

/* ---- grid ---- */

.grid {
  background: #EEE;
  max-width: 1200px;
}

/* clearfix */
.grid:after {
  content: '';
  display: block;
  clear: both;
}

/* ---- grid-item ---- */

.grid-item {
  width: 160px;
  height: 120px;
  float: left;
  background: #D26;
  border: 2px solid #333;
  border-color: hsla(0, 0%, 0%, 0.5);
  border-radius: 5px;
}

.grid-item--width2 { width: 320px; }
.grid-item--width3 { width: 480px; }
.grid-item--width4 { width: 640px; }

.grid-item--height2 { height: 200px; }
.grid-item--height3 { height: 260px; }
.grid-item--height4 { height: 360px; }
`));
        Body.empty().append(masonry);
        var msnry = new Masonry('.grid', {});
    }
    return { init };
};
GalleryPage().init();
//# sourceMappingURL=gallery.js.map