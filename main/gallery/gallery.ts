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
        
        function switchToImg(selectedIndex: number) {
            selectedFile = files[selectedIndex];
            imgViewerContainer.img.src(`main/gallery/${selectedFile}`);
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
            imgViewerContainer
                .toggleClass('on', false);
            imgViewerContainer.isopen = false;
        }
        
        const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({id: 'img_viewer_container'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).html(chevronSvg).pointerdown(gotoAdjImg),
                img: img({}),
                right: div({id: 'right_chevron', cls: 'right'}).html(chevronSvg).pointerdown(gotoAdjImg)
            }).pointerdown((event: Event) => {
                // clicked on img, not chevrons
                console.log('imgViewerContainer pointerdown, stopping propagation');
                event.stopPropagation();
            });
        imgViewerContainer.isopen = false;
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        let selectedFile: string = null;
        for (let {description, file} of data) {
            let imgContainer = div({cls: 'img-container'})
                .append(
                    // div({cls: 'tooltip', text: description}),
                    img({src: `main/gallery/${file}`})
                ).pointerdown((event: Event) => {
                    // if open: clicked on other images in the bg. if closed: open imgViewer
                    console.log('imgContainer pointerdown, isopen (before):', imgViewerContainer.isopen);
                    event.stopPropagation();
                    if (imgViewerContainer.isopen)
                        return closeImgViewer();
                    selectedFile = file;
                    imgViewerContainer
                        .toggleClass('on', true)
                        .img.src(`main/gallery/${selectedFile}`);
                    imgViewerContainer.isopen = true;
                    Body.toggleClass('theater', true);
                    images.toggleClass('theater', true);
                    navbar.css({opacity: 0});
                    
                });
            
            divs.push(imgContainer)
        }
        
        const images = elem({tag: 'images'})
            .append(...divs);
        
        // @ts-ignore
        elem({htmlElement: document})
            .pointerdown(() => {
                if (!imgViewerContainer.isopen)
                    return;
                console.log('document pointerdown, closeImgViewer()');
                closeImgViewer();
            })
            .keydown((event: KeyboardEvent) => {
                    console.log(`keydown, event.code: ${event.code}, event.key: ${event.key}`);
                    if (imgViewerContainer.isopen) {
                        if (event.key === "Escape") {
                            return closeImgViewer();
                        } else if (event.key.startsWith("Arrow")) {
                            let selectedIndex = files.indexOf(selectedFile);
                            if (event.key === "ArrowLeft")
                                switchToImg(getLeftIndex(selectedIndex));
                            else if (event.key === "ArrowRight")
                                switchToImg(getRightIndex(selectedIndex));
                            
                        }
                    }
                }
            );
        
        Home.empty().append(images, imgViewerContainer)
    }
    
    return {init}
};

GalleryPage().init();
