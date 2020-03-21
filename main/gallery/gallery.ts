const GalleryPage = () => {

    interface PhotoViewer extends Div {
        left: Div;
        photo: Div;
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
        class PhotoDiv extends Div {
            path: string = null;
            index: number = null;
            caption: string = null;
            contrast: number = 1;
            brightness: number = 1;
            year: number;

            constructor(brightness?: number, contrast?: number, file?: string, year?: number, caption?: string) {
                super({});
                if (file !== undefined) {
                    this.path = file;
                }
                if (caption !== undefined) {
                    this.caption = caption;
                }
                if (contrast !== undefined) {
                    this.contrast = contrast;
                }
                if (brightness !== undefined) {
                    this.brightness = brightness;
                }
                if (year !== undefined) {
                    this.year = year;
                }

                this.click((event: PointerEvent) => {
                    console.log('this click:', this);
                    event.stopPropagation();
                    return togglePhotoViewer(this);
                })


            }

            getLeftPhotoDiv(): PhotoDiv {
                let i;
                if (this.index === 0) {
                    i = photoDivs.length - 1;
                } else {
                    i = this.index - 1;
                }
                return photoDivs[i];
            }

            getRightPhotoDiv(): PhotoDiv {
                let i;
                if (this.index === photoDivs.length - 1) {
                    i = 0;
                } else {
                    i = this.index + 1;
                }
                return photoDivs[i];
            }

            src(src): PhotoDiv {
                return this.css({backgroundImage: `url(${src})`})
            }
        }

        // console.log('GalleryPage init');
        if (MOBILE === undefined) {
            await WindowElem.promiseLoaded();
        }
        const ROWSIZE = MOBILE ? 2 : 4;

        /*const chevronSvg = `<svg version="1.1" id="chevron_right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
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
`;*/


        //**  Functions


        // DocumentElem.keydown Arrow  =>  switchToPhoto
        // Chevron click  =>  gotoAdjPhoto  =>  switchToPhoto
        // photoDiv.click  =>  togglePhotoViewer  =>  switchToPhoto
        function switchToPhoto(_selectedPhoto: PhotoDiv) {
            // *  Clicked Arrow key or clicked Chevron
            console.log(`photoDiv.switchToImg(`, JSON.parstr({_selectedPhoto}));
            selectedPhoto = _selectedPhoto;
            photoViewer.caption.text(selectedPhoto.caption);
            let clone = _selectedPhoto.e.cloneNode();
            photoViewer.photo.wrapSomethingElse(clone);
        }


        // Chevron click  =>  gotoAdjPhoto
        async function gotoAdjPhoto(event: PointerEvent) {
            // *  Clicked chevron
            event.stopPropagation();
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron click');
                switchToPhoto(selectedPhoto.getLeftPhotoDiv());
            } else { // right
                console.log('right chevron click');
                switchToPhoto(selectedPhoto.getRightPhotoDiv());
            }
        }

        // photoDiv.click  =>  closePhotoViewer
        // DocumentElem.click  =>  closePhotoViewer
        // DocumentElem.keydown Arrow  =>  closePhotoViewer
        // X.click  =>  closePhotoViewer
        function closePhotoViewer(event?) {
            // *  Clicked X, click outside viewer, Escape,
            console.log('closePhotoViewer', event);
            Body.toggleClass('theater', false);
            photosContainer.toggleClass('theater', false);
            _toggleNavigationElementsDisplay(true);
            photoViewer.toggleClass('on', false);
            photoViewerClose.toggleClass('on', false);
            photoViewer.isopen = false;
        }


        // photoDiv.click  =>  togglePhotoViewer
        function togglePhotoViewer(_selectedPhoto: PhotoDiv) {
            // *  If open: clicked on other images in the bg. if closed: open photoViewer
            console.log('photoDiv.togglePhotoViewer(', JSON.parstr({_selectedPhoto}));
            if (photoViewer.isopen) {
                return closePhotoViewer();
            }
            photoViewerClose.toggleClass('on', true);
            photoViewer.toggleClass('on', true);
            switchToPhoto(_selectedPhoto);

            photoViewer.isopen = true;
            Body.toggleClass('theater', true);
            photosContainer.toggleClass('theater', true);
            _toggleNavigationElementsDisplay(false);

        }

        function _toggleNavigationElementsDisplay(on: boolean) {
            if (on) {
                elem({id: 'navbar_section'}).removeClass('off');
            } else {
                elem({id: 'navbar_section'}).addClass('off');
            }
        }

        //**  photoViewer
        const photoViewer: PhotoViewer = <PhotoViewer>div({id: 'img_viewer'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).append(span({cls: 'lines'})).click(gotoAdjPhoto),
                photo: div(),
                right: div({id: 'right_chevron', cls: 'right'}).append(span({cls: 'lines'})).click(gotoAdjPhoto),
                caption: div({id: 'caption'})
            }).click((event: Event) => {
                // *  Clicked on img, not chevrons. do nothing
                // TODO: listen to .left, img, .right clicks for better resolution
                console.log('photoViewer click, stopping propagation');
                event.stopPropagation();
            });

        photoViewer.isopen = false;
        type TGalleryData = { file: string, contrast: number, brightness: number, caption: string, year: number };
        const data = await fetchArray<TGalleryData>("main/gallery/gallery.json");
        const photoDivs: PhotoDiv[] = [];
        // **  Populate photoDivs: PhotoDiv[] from data
        for (let {brightness, contrast, file, year, caption} of data) {
            let photoDiv = new PhotoDiv(brightness, contrast, file, year, caption);
            let cachedPhoto: Div = CacheDiv[`gallery.${file}`];
            if (cachedPhoto !== undefined) {
                photoDiv.wrapSomethingElse(cachedPhoto.removeAttr('hidden'));
                console.log(...less(`gallery | "gallery.${file}" loaded from cache`));
            } else {
                let src = `main/gallery/${file}`;
                photoDiv.src(src);
                console.log(...less(`gallery | "gallery.${file}" NOT loaded from cache`));
            }
            // keep out of constructor
            photoDiv.css({filter: `contrast(${contrast || 1}) brightness(${brightness || 1})`});
            photoDivs.push(photoDiv);
        }
        // **  Sort photoDivs by year and index
        // Needs to be sorted, order doesn't matter (asc / desc). Order resets with keys of yearToYearDiv
        photoDivs
            .sort(({year: yearA}, {year: yearB}) => yearB - yearA)
            .forEach((image, i) => image.index = i);


        // **  Group yearDivs by year number
        const yearToYearDiv: TMap<YearDiv> = {};
        let count = 0; // assume sorted photoDivs

        function appendToRow(yearDiv: YearDiv, photoDiv: PhotoDiv, count: number) {
            switch (count % ROWSIZE) {
                case 0:
                    yearDiv.grid.row0.append(photoDiv);
                    break;
                case 1:
                    yearDiv.grid.row1.append(photoDiv);
                    break;
                case 2:
                    yearDiv.grid.row2.append(photoDiv);
                    break;
                case 3:
                    yearDiv.grid.row3.append(photoDiv);
                    break;

            }
        }

        // ***  HTML from vars
        for (let photoDiv of photoDivs) {
            let yearDiv: YearDiv;

            if (photoDiv.year in yearToYearDiv) {
                count++;
                yearDiv = yearToYearDiv[photoDiv.year];

            } else {

                count = 0;
                let gridChildrenObj = {
                    row0: div({cls: 'row'}),
                    row1: div({cls: 'row'}),

                };
                if (!MOBILE) {
                    // @ts-ignore
                    gridChildrenObj.row2 = div({cls: 'row'});
                    // @ts-ignore
                    gridChildrenObj.row3 = div({cls: 'row'});
                }

                yearDiv = <YearDiv>div({cls: 'year'})
                    .cacheAppend({
                        title: div({cls: 'title'}).text(photoDiv.year),
                        grid: div({cls: 'grid'}).cacheAppend(gridChildrenObj)
                    });

                yearToYearDiv[photoDiv.year] = yearDiv;
            }
            appendToRow(yearDiv, photoDiv, count);


        }
        // console.log('yearToYearDiv:', JSON.parstr(yearToYearDiv));
        let selectedPhoto: PhotoDiv = new PhotoDiv();

        const photosContainer = div({id: 'images_container'})
            .append(...Object.values(yearToYearDiv).reverse());

        DocumentElem
            .click(() => {
                if (!photoViewer.isopen) {
                    return;
                }
                console.log('document click, closePhotoViewer()');
                closePhotoViewer();
            })
            .keydown((event: KeyboardEvent) => {
                if (!photoViewer.isopen) {
                    return;
                }

                if (event.key === "Escape") {
                    return closePhotoViewer();
                }

                if (event.key.startsWith("Arrow")) {
                    if (event.key === "ArrowLeft") {
                        return switchToPhoto(selectedPhoto.getLeftPhotoDiv());
                    } else {
                        if (event.key === "ArrowRight") {
                            return switchToPhoto(selectedPhoto.getRightPhotoDiv());
                        }
                    }

                }
            });

        const photoViewerClose = div({id: 'img_viewer_close'})
            .append(span({cls: 'lines'})).click(closePhotoViewer);


        Home.empty().class('gallery-page').append(photosContainer, photoViewer, photoViewerClose);


    }

    return {init}
};

