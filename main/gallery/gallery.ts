const GalleryPage = () => {
    type ImgViewerContainer = Div & { left: Div, img: Img, right: Div };
    
    async function init() {
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
        
        const gotoAdjImg = (event: Event) => {
            let selectedIndex = files.indexOf(selectedFile);
            console.log('index of selected file: ', selectedIndex);
            if (event.currentTarget.id === 'left_chevron') {
                if (selectedIndex === 0)
                    selectedIndex = files.length - 1;
                else
                    selectedIndex -= 1;
            } else { // right
                if (selectedIndex === files.length - 1)
                    selectedIndex = 0;
                else
                    selectedIndex += 1;
            }
            
            
            console.log('selected index AFTER:', selectedIndex);
            selectedFile = files[selectedIndex];
            
            
            imgViewerContainer.img.attr({src: `main/gallery/${selectedFile}`});
        };
        const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({id: 'img_viewer_container'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).html(chevronSvg).pointerdown(gotoAdjImg),
                img: img({}),
                right: div({id: 'right_chevron', cls: 'right'}).html(chevronSvg).pointerdown(gotoAdjImg)
            });
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        let selectedFile: string = null;
        for (let {description, file} of data) {
            let imgContainer = div({cls: 'img-container'}).append(
                // div({cls: 'tooltip', text: description}),
                img({src: `main/gallery/${file}`})
            );
            imgContainer.pointerdown(() => {
                selectedFile = file;
                imgViewerContainer
                    .toggleClass('on', true)
                    .img.attr({src: `main/gallery/${selectedFile}`});
                Body.toggleClass('theater', true);
                images.toggleClass('theater', true);
                navbar.css({opacity: 0});
            });
            
            divs.push(imgContainer)
        }
        
        const images = elem({tag: 'images'}).append(...divs);
        
        Home.empty().append(images, imgViewerContainer)
    }
    
    return {init}
};

GalleryPage().init();
