const GalleryPage = () => {
    type ImgViewerContainer = Div & { imgViewer: Img };
    
    async function init() {
        
        console.log('GalleryPage init');
        
        const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({
            id: 'img_viewer_container'
        }).cacheAppend({imgViewer: img({cls: 'img-viewer'})});
        document.body.append(imgViewerContainer.e);
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        for (let {description, file} of data) {
            let divElem = div({cls: 'img-container'}).append(
                div({cls: 'tooltip', text: description}),
                img({src: `main/gallery/${file}`})
            );
            divElem.pointerdown(() => {
                imgViewerContainer.imgViewer.attr({src: `main/gallery/${file}`})
            });
            
            divs.push(divElem)
        }
        
        const imgContainer = elem({tag: 'images'}).append(...divs);
        Home.empty().addClass('squeezed').append(imgContainer)
    }
    
    return {init}
};

GalleryPage().init();
