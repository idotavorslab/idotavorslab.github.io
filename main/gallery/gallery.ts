const GalleryPage = () => {
    type ImgViewer = Div & { left: Div, img: Img, right: Div, caption: Div, isopen: boolean };
    
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
            private _path: string = null;
            private _index: number = null;
            caption: string = null;
            contrast: number = 1;
            brightness: number = 1;
            year: number;
            
            constructor(brightness?: number, contrast?: number, file?: string, year?: number, caption?: string) {
                super({});
                if (file === undefined) {
                    this.simplyPath = file;
                    this._index = files.indexOf(file);
                }
                if (caption !== undefined)
                    this.caption = caption;
                if (contrast !== undefined)
                    this.contrast = contrast;
                if (brightness !== undefined)
                    this.brightness = brightness;
                if (year !== undefined)
                    this.year = year
            }
            
            set simplyPath(_path: string) {
                this._path = _path;
            }
            
            set path(_path: string) {
                this._path = _path;
                this._index = files.indexOf(this.path);
                
                const {contrast, brightness, caption, year} = data[this._index];
                this.caption = caption;
                this.contrast = contrast || 1;
                this.brightness = brightness || 1;
                this.year = year;
            }
            
            get path(): string {
                return this._path;
            }
            
            indexOfLeftFile(): number {
                let leftFileIndex;
                if (this._index === 0)
                    leftFileIndex = files.length - 1;
                else
                    leftFileIndex = this._index - 1;
                console.log(JSON.parstr({
                    'files[leftFileIndex]': files[leftFileIndex],
                    'galleryImgs[leftFileIndex]': galleryImgs[leftFileIndex]
                }));
                debugger;
                return leftFileIndex;
            }
            
            indexOfRightFile(): number {
                let rightFileIndex;
                if (this._index === files.length - 1)
                    rightFileIndex = 0;
                else
                    rightFileIndex = this._index + 1;
                console.log(JSON.parstr({
                    'files[rightFileIndex]': files[rightFileIndex],
                    'galleryImgs[rightFileIndex]': galleryImgs[rightFileIndex]
                }));
                debugger;
                return rightFileIndex;
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
        function switchToImg(_selectedIndex: number) {
            // *  Clicked Arrow key or clicked Chevron
            console.log('switchToImg(_selectedIndex:', _selectedIndex);
            selectedImg.path = files[_selectedIndex];
            // TODO: load img from cache, or just selectedImg = galleryImg
            imgViewer.img
                .src(selectedImg.path.includes('https') ? selectedImg.path : `main/gallery/${selectedImg.path}`)
                .css({filter: `contrast(${selectedImg.contrast}) brightness(${selectedImg.brightness})`});
            
            imgViewer.caption.text(selectedImg.caption);
        }
        
        // Chevron click  =>  gotoAdjImg
        async function gotoAdjImg(event: PointerEvent) {
            // *  Clicked chevron
            event.stopPropagation();
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(selectedImg.indexOfLeftFile());
            } else { // right
                console.log('right chevron pointerdown');
                switchToImg(selectedImg.indexOfRightFile());
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
        function toggleImgViewer(selectedImg: GalleryImg) {
            // *  If open: clicked on other images in the bg. if closed: open imgViewer
            console.log('galleryImg.pointerdown, isopen (before):', imgViewer.isopen, {selectedImg});
            if (imgViewer.isopen)
                return closeImgViewer();
            imgViewerClose.toggleClass('on', true);
            imgViewer
                .toggleClass('on', true)
                .img
                .src(selectedImg.path.includes('https') ? selectedImg.path : `main/gallery/${selectedImg.path}`)
                .css({filter: `contrast(${selectedImg.contrast}) brightness(${selectedImg.brightness})`});
            imgViewer.caption.text(selectedImg.caption);
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
                console.log('imgViewer pointerdown, stopping propagation');
                event.stopPropagation();
            });
        
        imgViewer.isopen = false;
        type TGalleryData = { file: string, contrast: number, brightness: number, caption: string, year: number }[];
        const data: TGalleryData = await fetchJson("main/gallery/gallery.json", "no-cache");
        const files = data.map(d => d.file);
        const galleryImgs: GalleryImg[] = [];
        // **  Populate galleryImgs: GalleryImg[] from data
        for (let {brightness, contrast, file, year, caption} of data) {
            let galleryImg = new GalleryImg(brightness, contrast, file, year, caption);
            let cachedImage: Img = CacheDiv[`gallery.${file}`];
            if (cachedImage !== undefined) {
                galleryImg.wrapSomethingElse(cachedImage.removeAttr('hidden'));
                console.log('gallery | cachedImage isnt undefined:', cachedImage);
            } else {
                console.log('gallery | cachedImage IS undefined');
                let src = `main/gallery/${file}`;
                galleryImg.src(src);
            }
            // TODO: probably move to GalleryImg constructor
            galleryImg
                .pointerdown((event: PointerEvent) => {
                    event.stopPropagation();
                    // TODO: maybe selectedImg = galleryImg
                    selectedImg.path = file;
                    return toggleImgViewer(selectedImg);
                })
                .css({filter: `contrast(${contrast || 1}) brightness(${brightness || 1})`});
            
            galleryImgs.push(galleryImg);
        }
        // **  Sort galleryImgs by year
        // Needs to be sorted, order doesn't matter (asc / desc). Order resets with keys of yearToYearDiv
        galleryImgs.sort(({year: yearA}, {year: yearB}) => yearB - yearA);
        console.log(JSON.parstr({"galleryImgs after sort": galleryImgs}));
        // **  Group images by year
        const yearToYearDiv: TMap<YearDiv> = {};
        let count = 0; // assume sorted galleryImgs
        console.group('for (let galleryImg of galleryImgs)');
        
        function appendToRow(yearDiv: YearDiv, galleryImg: GalleryImg, count: number) {
            switch (count % 4) {
                case 0:
                    yearDiv.grid.row0.append(galleryImg);
                    console.log('row0');
                    break;
                case 1:
                    yearDiv.grid.row1.append(galleryImg);
                    console.log('row1');
                    break;
                case 2:
                    yearDiv.grid.row2.append(galleryImg);
                    console.log('row2');
                    break;
                case 3:
                    yearDiv.grid.row3.append(galleryImg);
                    console.log('row3');
                    break;
                
            }
        }
        
        // ***  HTML from vars
        for (let galleryImg of galleryImgs) {
            let yearDiv: YearDiv;
            
            if (galleryImg.year in yearToYearDiv) {
                count++;
                yearDiv = yearToYearDiv[galleryImg.year];
                console.log(`year ${galleryImg.year} in yearToYearDiv`, JSON.parstr({count, galleryImg, yearDiv}));
                
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
                
                console.log(`year ${galleryImg.year} NOT in yearToYearDiv`, JSON.parstr({count, galleryImg, yearDiv}));
                yearToYearDiv[galleryImg.year] = yearDiv;
            }
            appendToRow(yearDiv, galleryImg, count);
            
            
        }
        console.groupEnd();
        console.log(JSON.parstr({yearToYearDiv}));
        let selectedImg: GalleryImg = new GalleryImg();
        
        const imagesContainer = div({id: 'images_container'}).append(...Object.values(yearToYearDiv).reverse());
        
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
                        return switchToImg(selectedImg.indexOfLeftFile());
                    else if (event.key === "ArrowRight")
                        return switchToImg(selectedImg.indexOfRightFile());
                    
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

