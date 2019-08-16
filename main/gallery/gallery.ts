const GalleryPage = () => {
    async function init() {
        
        console.log('GalleryPage init');
        
        const data = await fetchJson("main/gallery/gallery.json", "no-cache");
        console.log('GalleryPage data', data);
        const divs: BetterHTMLElement[] = [];
        for (let {description, file} of data) {
            let divElem = div({cls: 'container-div'}).append(
                div({cls: 'tooltip', text: description}),
                img({src: `main/gallery/${file}`})
            );
            divElem.pointerdown(() => {
                alert(`You expected that to zoom in the image right? Yeah me too. Soon`)
            });
            
            divs.push(divElem)
        }
        
        const imgContainer = div({id: 'img_container'}).append(...divs);
        Home.empty().addClass('squeezed').append(imgContainer)
    }
    
    return {init}
};

