const GalleryPage = () => {
    // type ImgViewerContainer = Div & { imgViewer: Img };
    
    async function init() {
        // Home.css({display: "flex"});
        console.log('GalleryPage init');
        
        /*const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({
            id: 'img_viewer_container'
        }).cacheAppend({imgViewer: div({cls: 'img-viewer'})});
        */
        // document.body.append(imgViewerContainer.e);
        const imgViewer = div({id: 'img_viewer'});
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        for (let {description, file} of data) {
            let divElem = div({cls: 'img-container'}).append(
                // div({cls: 'tooltip', text: description}),
                img({src: `main/gallery/${file}`})
            );
            divElem.pointerdown(() => {
                imgViewer.css({backgroundImage: `url('main/gallery/${file}')`}).toggleClass('on', true);
                Body.toggleClass('theater', true);
                images.toggleClass('theater', true);
                navbar.css({opacity: 0});
            });
            
            divs.push(divElem)
        }
        
        const images = elem({tag: 'images'}).append(...divs);
        
        Home.empty().append(images, imgViewer)
    }
    
    return {init}
};

GalleryPage().init();
