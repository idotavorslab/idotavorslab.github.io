const GalleryPage = () => {
    
    interface ImgViewer extends Div {
        left: Div;
        img: Img;
        right: Div;
        caption: Div;
        isopen: boolean
    }
    
    interface GridDiv extends Div {
        row0: Div;
        row1: Div;
        row2: Div;
        row3: Div
    }
    
    interface YearDiv extends Div {
        title: Div;
        grid: GridDiv;
    }
    
    async function init() {
        class GalleryImg extends Img {
            path: string = null;
            index: number = null;
            caption: string = null;
            contrast: number = 1;
            brightness: number = 1;
            year: number;
            
            constructor(brightness?: number, contrast?: number, file?: string, year?: number, caption?: string) {
                super({});
                if (file !== undefined)
                    this.path = file;
                if (caption !== undefined)
                    this.caption = caption;
                if (contrast !== undefined)
                    this.contrast = contrast;
                if (brightness !== undefined)
                    this.brightness = brightness;
                if (year !== undefined)
                    this.year = year;
                
                this
                    .pointerdown((event: PointerEvent) => {
                        console.log('this pointerdown:', this);
                        event.stopPropagation();
                        return toggleImgViewer(this);
                    })
                    .css({filter: `contrast(${contrast || 1}) brightness(${brightness || 1})`});
                
            }
            
            getLeftImage(): GalleryImg {
                let i;
                if (this.index === 0)
                    i = galleryImgs.length - 1;
                else
                    i = this.index - 1;
                return galleryImgs[i];
            }
            
            getRightImage(): GalleryImg {
                let i;
                if (this.index === galleryImgs.length - 1)
                    i = 0;
                else
                    i = this.index + 1;
                return galleryImgs[i];
            }
            
            
        }
        
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
        // DocumentElem.keydown Arrow  =>  switchToImg
        // Chevron click  =>  gotoAdjImg  =>  switchToImg
        // galleryImg.pointerdown  =>  toggleImgViewer  =>  switchToImg
        function switchToImg(_selectedImg: GalleryImg) {
            // *  Clicked Arrow key or clicked Chevron
            console.log(`galleryImg.switchToImg(`, {_selectedImg});
            selectedImg = _selectedImg;
            imgViewer.caption.text(selectedImg.caption);
            let clone = _selectedImg.e.cloneNode();
            imgViewer.img.wrapSomethingElse(clone);
            // imgViewer.img.e.replaceWith(_selectedImg.e.cloneNode())
            // imgViewer.img
            //     .src(`main/gallery/${selectedImg.path}`)
            //     .css({filter: `contrast(${selectedImg.contrast}) brightness(${selectedImg.brightness})`});
        }
        
        
        // Chevron click  =>  gotoAdjImg
        async function gotoAdjImg(event: PointerEvent) {
            // *  Clicked chevron
            event.stopPropagation();
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(selectedImg.getLeftImage());
            } else { // right
                console.log('right chevron pointerdown');
                switchToImg(selectedImg.getRightImage());
            }
        }
        
        // galleryImg.pointerdown  =>  closeImgViewer
        // DocumentElem.pointerdown  =>  closeImgViewer
        // DocumentElem.keydown Arrow  =>  closeImgViewer
        // X.pointerdown  =>  closeImgViewer
        function closeImgViewer() {
            // *  Clicked X, click outside viewer, Escape,
            Body.toggleClass('theater', false);
            imagesContainer.toggleClass('theater', false);
            Navbar.css({opacity: 1});
            imgViewer
                .toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }
        
        // galleryImg.pointerdown  =>  toggleImgViewer
        function toggleImgViewer(_selectedImg: GalleryImg) {
            // *  If open: clicked on other images in the bg. if closed: open imgViewer
            console.log('galleryImg.toggleImgViewer(', {_selectedImg});
            if (imgViewer.isopen)
                return closeImgViewer();
            imgViewerClose.toggleClass('on', true);
            imgViewer.toggleClass('on', true);
            switchToImg(_selectedImg);
            
            imgViewer.isopen = true;
            Body.toggleClass('theater', true);
            imagesContainer.toggleClass('theater', true);
            Navbar.css({opacity: 0});
            
        }
        
        //**  imgViewer
        const imgViewer: ImgViewer = <ImgViewer>div({id: 'img_viewer'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).html(chevronSvg).pointerdown(gotoAdjImg),
                img: img({}),
                right: div({id: 'right_chevron', cls: 'right'}).html(chevronSvg).pointerdown(gotoAdjImg),
                caption: div({id: 'caption'})
            }).pointerdown((event: Event) => {
                // *  Clicked on img, not chevrons. do nothing
                // TODO: listen to .left, img, .right clicks for better resolution
                console.log('imgViewer pointerdown, stopping propagation');
                event.stopPropagation();
            });
        
        imgViewer.isopen = false;
        type TGalleryData = { file: string, contrast: number, brightness: number, caption: string, year: number }[];
        const data: TGalleryData = await fetchJson("main/gallery/gallery.json", "no-cache");
        const galleryImgs: GalleryImg[] = [];
        // **  Populate galleryImgs: GalleryImg[] from data
        for (let {brightness, contrast, file, year, caption} of data) {
            let galleryImg = new GalleryImg(brightness, contrast, file, year, caption);
            let cachedImage: Img = CacheDiv[`gallery.${file}`];
            if (cachedImage !== undefined) {
                galleryImg.wrapSomethingElse(cachedImage.removeAttr('hidden'));
                console.log(...less(`gallery | "gallery.${file}" loaded from cache`));
            } else {
                console.log(...less(`gallery | "gallery.${file}" not in cache`));
                let src = `main/gallery/${file}`;
                galleryImg.src(src);
            }
            galleryImgs.push(galleryImg);
        }
        // **  Sort galleryImgs by year and index
        // Needs to be sorted, order doesn't matter (asc / desc). Order resets with keys of yearToYearDiv
        galleryImgs
            .sort(({year: yearA}, {year: yearB}) => yearB - yearA)
            .forEach((image, i) => image.index = i);
        
        console.log(JSON.parstr({"galleryImgs after sort and index": galleryImgs}));
        // **  Group yearDivs by year number
        const yearToYearDiv: TMap<YearDiv> = {};
        let count = 0; // assume sorted galleryImgs
        
        function appendToRow(yearDiv: YearDiv, galleryImg: GalleryImg, count: number) {
            switch (count % 4) {
                case 0:
                    yearDiv.grid.row0.append(galleryImg);
                    break;
                case 1:
                    yearDiv.grid.row1.append(galleryImg);
                    break;
                case 2:
                    yearDiv.grid.row2.append(galleryImg);
                    break;
                case 3:
                    yearDiv.grid.row3.append(galleryImg);
                    break;
                
            }
        }
        
        // ***  HTML from vars
        for (let galleryImg of galleryImgs) {
            let yearDiv: YearDiv;
            
            if (galleryImg.year in yearToYearDiv) {
                count++;
                yearDiv = yearToYearDiv[galleryImg.year];
                // console.log(`year ${galleryImg.year} in yearToYearDiv`, JSON.parstr({count, galleryImg, yearDiv}));
                
            } else {
                count = 0;
                yearDiv = <YearDiv>div({cls: 'year'})
                    .cacheAppend({
                        title: div({cls: 'year-title'}).text(galleryImg.year),
                        grid: div({cls: 'grid'}).cacheAppend({
                            row0: div({cls: 'row'}),
                            row1: div({cls: 'row'}),
                            row2: div({cls: 'row'}),
                            row3: div({cls: 'row'}),
                        })
                    });
                
                // console.log(`year ${galleryImg.year} NOT in yearToYearDiv`, JSON.parstr({count, galleryImg, yearDiv}));
                yearToYearDiv[galleryImg.year] = yearDiv;
            }
            appendToRow(yearDiv, galleryImg, count);
            
            
        }
        console.log(JSON.parstr({yearToYearDiv}));
        let selectedImg: GalleryImg = new GalleryImg();
        
        const imagesContainer = div({id: 'images_container'})
            .append(...Object.values(yearToYearDiv).reverse());
        
        DocumentElem
            .pointerdown(() => {
                if (!imgViewer.isopen)
                    return;
                console.log('document pointerdown, closeImgViewer()');
                closeImgViewer();
            })
            .keydown((event: KeyboardEvent) => {
                if (!imgViewer.isopen)
                    return;
                
                if (event.key === "Escape")
                    return closeImgViewer();
                
                if (event.key.startsWith("Arrow")) {
                    if (event.key === "ArrowLeft")
                        return switchToImg(selectedImg.getLeftImage());
                    else if (event.key === "ArrowRight")
                        return switchToImg(selectedImg.getRightImage());
                    
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
        
        
        Home.empty().class('gallery-page').append(imagesContainer, imgViewer, imgViewerClose);
        
        
    }
    
    return {init}
};

