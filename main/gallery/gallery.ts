const GalleryPage = () => {
    type ImgViewer = Div & { left: Div, img: Img, right: Div, caption: Div, isopen: boolean };
    
    
    async function init() {
        class File {
            private _path: string = null;
            private _index: number = null;
            caption: string = null;
            contrast: number = 1;
            brightness: number = 1;
            
            constructor() {
            }
            
            set path(_path: string) {
                this._path = _path;
                this._index = files.indexOf(this.path);
                
                const {contrast, brightness, caption} = data[this._index];
                this.caption = caption;
                this.contrast = contrast || 1;
                this.brightness = brightness || 1;
            }
            
            get path(): string {
                return this._path;
            }
            
            indexOfLeftFile(): number {
                if (this._index === 0)
                    return files.length - 1;
                else
                    return this._index - 1;
            }
            
            indexOfRightFile(): number {
                if (this._index === files.length - 1)
                    return 0;
                else
                    return this._index + 1;
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
        function switchToImg(_selectedIndex: number) {
            selectedFile.path = files[_selectedIndex];
            imgViewer.img
                .src(`main/gallery/${selectedFile.path}`)
                .css({filter: `contrast(${selectedFile.contrast}) brightness(${selectedFile.brightness})`});
            
            imgViewer.caption.text(selectedFile.caption);
        }
        
        
        async function gotoAdjImg(event: PointerEvent) {
            // *  Clicked chevron or Arrow key
            event.stopPropagation();
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron pointerdown');
                switchToImg(selectedFile.indexOfLeftFile());
            } else { // right
                console.log('right chevron pointerdown');
                switchToImg(selectedFile.indexOfRightFile());
            }
        }
        
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
        
        function toggleImgViewer(selectedFile: File) {
            // *  If open: clicked on other images in the bg. if closed: open imgViewer
            console.log('imgContainer pointerdown, isopen (before):', imgViewer.isopen);
            if (imgViewer.isopen)
                return closeImgViewer();
            /*if (file.includes('http') || file.includes('www')) {
                selectedFile = file;
            } else {
                selectedFile = `main/gallery/${file}`;
            }
            */
            imgViewerClose.toggleClass('on', true);
            imgViewer
                .toggleClass('on', true)
                .img
                .src(`main/gallery/${selectedFile.path}`)
                .css({filter: `contrast(${selectedFile.contrast}) brightness(${selectedFile.brightness})`});
            imgViewer.caption.text(selectedFile.caption);
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
        type TGalleryData = { file: string, contrast: number, brightness: number, caption: string }[];
        const data: TGalleryData = await fetchJson("main/gallery/gallery.json", "default");
        const files = data.map(d => d.file);
        
        
        //**  HTML
        // const images: Img[] = [];
        let selectedFile: File = new File();
        const row0 = div({id: 'row_0'});
        const row1 = div({id: 'row_1'});
        const row2 = div({id: 'row_2'});
        const row3 = div({id: 'row_3'});
        
        for (let [i, {file, contrast, brightness}] of Object.entries(data)) {
            let src;
            /*if (file.includes('http') || file.includes('www')) {
                src = file;
            } else {
                src = `main/gallery/${file}`;
            }
            */
            src = `main/gallery/${file}`;
            let image: Img = img({src})
                .pointerdown((event: PointerEvent) => {
                    event.stopPropagation();
                    selectedFile.path = file;
                    // selectedFile.caption = caption;
                    return toggleImgViewer(selectedFile);
                })
                // .css({filter: `contrast(${contrast === undefined ? 1 : contrast}) brightness(${brightness === undefined ? 1 : brightness})`});
                .css({filter: `contrast(${contrast || 1}) brightness(${brightness || 1})`});
            
            switch (parseInt(i) % 4) {
                case 0:
                    row0.append(image);
                    break;
                case 1:
                    row1.append(image);
                    break;
                case 2:
                    row2.append(image);
                    break;
                case 3:
                    row3.append(image);
                    break;
                
            }
        }
        
        const imagesContainer = div({id: 'images'}).append(row0, row1, row2, row3);
        
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
                    // let selectedIndex = files.indexOf(selectedFile.path);
                    if (event.key === "ArrowLeft")
                    // return switchToImg(getLeftIndex(selectedIndex));
                        return switchToImg(selectedFile.indexOfLeftFile());
                    else if (event.key === "ArrowRight")
                    // return switchToImg(getRightIndex(selectedIndex));
                        return switchToImg(selectedFile.indexOfRightFile());
                    
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
        
        
        Home.empty().append(imagesContainer, imgViewer, imgViewerClose);
        
        
    }
    
    return {init}
};

