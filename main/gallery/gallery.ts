const GalleryPage = () => {
    type ImgViewerContainer = Div & { left: Div, imgViewer: Div, right: Div };
    
    async function init() {
        // Home.css({display: "flex"});
        console.log('GalleryPage init');
        const chevronSvg = `<svg version="1.1" id="chevron_right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 185.343 185.343">
    <path style="fill:#010002;"
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
        /*const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({
            id: 'img_viewer_container'
        }).cacheAppend({imgViewer: div({cls: 'img-viewer'})});
        */
        // document.body.append(imgViewerContainer.e);
        const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({id: 'img_viewer_container'})
            .cacheAppend({
                left: div({cls: 'left'}).html(chevronSvg),
                imgViewer: div({cls: 'img-viewer'}),
                right: div({cls: 'right'}).html(chevronSvg)
            });
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        for (let {description, file} of data) {
            let divElem = div({cls: 'img-container'}).append(
                // div({cls: 'tooltip', text: description}),
                img({src: `main/gallery/${file}`})
            );
            divElem.pointerdown(() => {
                imgViewerContainer
                    .toggleClass('on', true)
                    .imgViewer.css({backgroundImage: `url('main/gallery/${file}')`});
                Body.toggleClass('theater', true);
                images.toggleClass('theater', true);
                navbar.css({opacity: 0});
            });
            
            divs.push(divElem)
        }
        
        const images = elem({tag: 'images'}).append(...divs);
        
        Home.empty().append(images, imgViewerContainer)
    }
    
    return {init}
};

GalleryPage().init();
