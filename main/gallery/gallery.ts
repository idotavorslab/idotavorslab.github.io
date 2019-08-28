const GalleryPage = () => {
    type ImgViewerContainer = Div & { left: Div, img: Img, right: Div, isopen: boolean };
    
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
        
        //**  Functions
        function switchToImg(selectedIndex: number) {
            selectedFile = files[selectedIndex];
            imgViewer.img.src(`main/gallery/${selectedFile}`);
        }
        
        function getRightIndex(selectedIndex: number) {
            if (selectedIndex === files.length - 1)
                return 0;
            else
                return selectedIndex + 1;
        }
        
        function getLeftIndex(selectedIndex: number) {
            if (selectedIndex === 0)
                return files.length - 1;
            else
                return selectedIndex - 1;
        }
        
        async function gotoAdjImg(event: PointerEvent) {
            event.stopPropagation();
            let selectedIndex = files.indexOf(selectedFile);
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(getLeftIndex(selectedIndex));
            } else { // right
                console.log('right chevron pointerdown');
                switchToImg(getRightIndex(selectedIndex));
            }
        }
        
        function closeImgViewer() {
            Body.toggleClass('theater', false);
            images.toggleClass('theater', false);
            navbar.css({opacity: 1});
            imgViewer
                .toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }
        
        //**  imgViewer
        const imgViewer: ImgViewerContainer = <ImgViewerContainer>div({id: 'img_viewer'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).html(chevronSvg).pointerdown(gotoAdjImg),
                img: img({}),
                right: div({id: 'right_chevron', cls: 'right'}).html(chevronSvg).pointerdown(gotoAdjImg)
            }).pointerdown((event: Event) => {
                // clicked on img, not chevrons
                console.log('imgViewer pointerdown, stopping propagation');
                event.stopPropagation();
            });
        
        imgViewer.isopen = false;
        
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        console.log('GalleryPage data', data);
        
        
        //**  HTML
        const imgs: Img[] = [];
        let selectedFile: string = null;
        for (let {description, file} of data) {
            
            /*let imgContainer = div({cls: 'img-container'})
                .append(
                    // div({cls: 'tooltip', text: description}),
                    img({src: `main/gallery/${file}`})
                ).pointerdown((event: Event) => {
                    // if open: clicked on other images in the bg. if closed: open imgViewer
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
                    navbar.css({opacity: 0});
                    
                });
            */
            
            let image: Img = img({src: `main/gallery/${file}`}).pointerdown((event: Event) => {
                // if open: clicked on other images in the bg. if closed: open imgViewer
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
                navbar.css({opacity: 0});
                
            }).on({
                load: () => console.log(`load: ${file}`), loadeddata: () => console.log(`loadeddata: ${file}`),
                loadend: () => console.log(`loadend: ${file}`), loadstart: () => console.log(`loadstart: ${file}`)
            });
            
            imgs.push(image)
        }
        
        const images = elem({tag: 'images'}).append(...imgs);
        
        DocumentElem
            .pointerdown(() => {
                if (!imgViewer.isopen)
                    return;
                console.log('document pointerdown, closeImgViewer()');
                closeImgViewer();
            })
            .keydown((event: KeyboardEvent) => {
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
        const imgViewerClose = div({id: 'img_viewer_close'}).append(
            elem({tag: 'svg'})
                .attr({viewBox: `0 0 32 32`})
                .append(
                    elem({tag: 'path', cls: 'upright'}),
                    elem({tag: 'path', cls: 'downleft'})
                )
        ).pointerdown(closeImgViewer);
        
        const observer = new MutationObserver(async (mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.previousSibling === images.e) {
                    console.log('done appending images!');
                    await wait(50);
                    masonryImages();
                }
            }
        });
        observer.observe(Home.e, {childList: true});
        Home.empty().append(images, imgViewer, imgViewerClose);
        
        function masonryImages() {
            let ROWSIZE;
            if (window.innerWidth >= BP1) { // 1340
                ROWSIZE = 4;
            } else {
                ROWSIZE = 4;
            }
            
            function getBottom(_image: Img): number {
                return _image.e.offsetTop + _image.e.height
            }
            
            for (let i = 1; i < imgs.length / ROWSIZE; i++) {
                console.group(`row ${i}`);
                for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < imgs.length; j++) {
                    let image = imgs[i * ROWSIZE + j];
                    let prevImage = imgs[(i - 1) * ROWSIZE + j];
                    let marginTop = `-${image.e.offsetTop - getBottom(prevImage) - 8}px`;
                    console.log(`${marginTop}`);
                    image.css({marginTop});
                }
                console.groupEnd();
                
            }
        }
        
        
    }
    
    return {init}
};

// GalleryPage().init();
