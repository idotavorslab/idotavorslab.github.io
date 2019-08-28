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
        const divs: BetterHTMLElement[] = [];
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
                
            });
            divs.push(image)
        }
        
        const images = elem({tag: 'images'}).append(...divs);
        
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
                }
            );
        const imgViewerClose = div({id: 'img_viewer_close'}).append(
            elem({tag: 'svg'})
                .attr({viewBox: `0 0 32 32`})
                .append(
                    elem({tag: 'path', cls: 'upright'}),
                    elem({tag: 'path', cls: 'downleft'})
                )
        ).pointerdown(closeImgViewer);
        Home.empty().append(images, imgViewer, imgViewerClose);
        /*const masonry = div({cls: 'grid'})
        // .attr({'data-masonry': '{ "itemSelector": ".grid-item", "columnWidth": 160 }'})
            .html(`
<img src="main/gallery/00.jpeg" class="grid-item"/>
<img src="main/gallery/01.jpeg" class="grid-item"/>
<img src="main/gallery/02.jpeg" class="grid-item"/>
<img src="main/gallery/03.jpeg" class="grid-item"/>
<img src="main/gallery/04.jpeg" class="grid-item"/>
<img src="main/gallery/05.jpeg" class="grid-item"/>
<img src="main/gallery/06.jpeg" class="grid-item"/>
<img src="main/gallery/07.jpeg" class="grid-item"/>
<img src="main/gallery/08.jpeg" class="grid-item"/>
<img src="main/gallery/09.jpeg" class="grid-item"/>
<img src="main/gallery/10.jpeg" class="grid-item"/>
<img src="main/gallery/11.jpeg" class="grid-item"/>
<img src="main/gallery/12.jpeg" class="grid-item"/>
<img src="main/gallery/13.jpeg" class="grid-item"/>
<img src="main/gallery/14.jpeg" class="grid-item"/>
<img src="main/gallery/15.jpeg" class="grid-item"/>
<img src="main/gallery/16.jpeg" class="grid-item"/>
<img src="main/gallery/17.jpeg" class="grid-item"/>

<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js"></script>
`);
        
        Body.empty().append(masonry);


        new Masonry('.grid', {
            // options
        });
        */
    }
    
    return {init}
};

GalleryPage().init();
