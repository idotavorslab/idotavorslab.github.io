const GalleryPage = () => {
    type ImgViewerContainer = Div & { left: Div, imgViewer: Div, right: Div };
    
    async function init() {
        // Home.css({display: "flex"});
        console.log('GalleryPage init');
        
        /*const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({
            id: 'img_viewer_container'
        }).cacheAppend({imgViewer: div({cls: 'img-viewer'})});
        */
        // document.body.append(imgViewerContainer.e);
        const imgViewerContainer: ImgViewerContainer = <ImgViewerContainer>div({id: 'img_viewer_container'})
            .cacheAppend({
                /*left: div({cls: 'left'}).append(elem({tag: 'svg'})
                    .attr({viewBox: '0 0 196 600'})
                    .append(
                        elem({tag: 'path'}),
                        elem({tag: 'path'})
                    )),
                */
                imgViewer: div({cls: 'img-viewer'}),
                /*                right: div({cls: 'right'}).append(elem({tag: 'svg'})
                                    .attr({viewBox: '0 0 196 600'})
                                    .append(
                                        elem({tag: 'path'}),
                                        elem({tag: 'path'})
                                    ))
                */
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
