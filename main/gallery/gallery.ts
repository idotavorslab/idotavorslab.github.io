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
                    return toggleImgViewer(this);
                })


            }

            getLeftImage(): GalleryImg {
                let i;
                if (this.index === 0) {
                    i = galleryImgs.length - 1;
                } else {
                    i = this.index - 1;
                }
                return galleryImgs[i];
            }

            getRightImage(): GalleryImg {
                let i;
                if (this.index === galleryImgs.length - 1) {
                    i = 0;
                } else {
                    i = this.index + 1;
                }
                return galleryImgs[i];
            }


        }

        // console.log('GalleryPage init');
        if (MOBILE === undefined) {
            await WindowElem.promiseLoaded();
        }
        const ROWSIZE = window.innerWidth <= $BP3 ? 2 : 4;
        console.log({ROWSIZE});

        //**  Functions


        // DocumentElem.keydown Arrow  =>  switchToImg
        // Chevron click  =>  gotoAdjImg  =>  switchToImg
        // galleryImg.click  =>  toggleImgViewer  =>  switchToImg
        function switchToImg(_selectedImg: GalleryImg) {
            // *  Clicked Arrow key or clicked Chevron
            console.log(`galleryImg.switchToImg(`, JSON.parstr({_selectedImg}));
            selectedImg = _selectedImg;
            imgViewer.caption.text(selectedImg.caption);
            let clone = _selectedImg.e.cloneNode();
            imgViewer.img.wrapSomethingElse(clone);
        }


        // Chevron click  =>  gotoAdjImg
        async function gotoAdjImg(event: PointerEvent) {
            // *  Clicked chevron
            event.stopPropagation();
            // @ts-ignore
            if (event.currentTarget.id === 'left_chevron') {
                console.log('left chevron click');
                switchToImg(selectedImg.getLeftImage());
            } else { // right
                console.log('right chevron click');
                switchToImg(selectedImg.getRightImage());
            }
        }

        // galleryImg.click  =>  closeImgViewer
        // DocumentElem.click  =>  closeImgViewer
        // DocumentElem.keydown Arrow  =>  closeImgViewer
        // X.click  =>  closeImgViewer
        function closeImgViewer(event?) {
            // *  Clicked X, click outside viewer, Escape,
            console.log('closeImgViewer', event);
            Body.toggleClass('theater', false);
            imagesContainer.toggleClass('theater', false);
            _toggleNavigationElementsDisplay(true);
            imgViewer.toggleClass('on', false);
            imgViewerClose.toggleClass('on', false);
            imgViewer.isopen = false;
        }


        // galleryImg.click  =>  toggleImgViewer
        function toggleImgViewer(_selectedImg: GalleryImg) {
            // *  If open: clicked on other images in the bg. if closed: open imgViewer
            console.log('galleryImg.toggleImgViewer(', JSON.parstr({_selectedImg}));
            if (imgViewer.isopen) {
                return closeImgViewer();
            }
            imgViewerClose.toggleClass('on', true);
            imgViewer.toggleClass('on', true);
            switchToImg(_selectedImg);

            imgViewer.isopen = true;
            Body.toggleClass('theater', true);
            imagesContainer.toggleClass('theater', true);
            _toggleNavigationElementsDisplay(false);

        }

        function _toggleNavigationElementsDisplay(on: boolean) {
            if (on) {
                elem({id: 'navbar_section'}).removeClass('off');
            } else {
                elem({id: 'navbar_section'}).addClass('off');
            }
        }

        //**  imgViewer
        const imgViewer: ImgViewer = <ImgViewer>div({id: 'img_viewer'})
            .cacheAppend({
                left: div({id: 'left_chevron', cls: 'left'}).append(span({cls: 'lines'})).click(gotoAdjImg),
                img: img(),
                right: div({id: 'right_chevron', cls: 'right'}).append(span({cls: 'lines'})).click(gotoAdjImg),
                caption: div({id: 'caption'})
            }).click((event: Event) => {
                // *  Clicked on img, not chevrons. do nothing
                // TODO: listen to .left, img, .right clicks for better resolution
                console.log('imgViewer click, stopping propagation');
                event.stopPropagation();
            });

        imgViewer.isopen = false;
        type TGalleryData = { file: string, contrast: number, brightness: number, caption: string, year: number };
        const data = await fetchArray<TGalleryData>("main/gallery/gallery.json");
        const galleryImgs: GalleryImg[] = [];
        // **  Populate galleryImgs: GalleryImg[] from data
        for (let {brightness, contrast, file, year, caption} of data) {
            let galleryImg = new GalleryImg(brightness, contrast, file, year, caption);
            let cachedImage: Img = CacheDiv[`gallery.${file}`];
            if (cachedImage !== undefined) {
                galleryImg.wrapSomethingElse(cachedImage.removeAttr('hidden'));
                // console.log(...less(`gallery | "gallery.${file}" loaded from cache`));
            } else {
                let src = `main/gallery/${file}`;
                galleryImg.src(src);
            }
            // keep out of constructor
            galleryImg.css({filter: `contrast(${contrast || 1}) brightness(${brightness || 1})`});
            galleryImgs.push(galleryImg);
        }
        // **  Sort galleryImgs by year and index
        // Needs to be sorted, order doesn't matter (asc / desc). Order resets with keys of yearToYearDiv
        galleryImgs
            .sort(({year: yearA}, {year: yearB}) => yearB - yearA)
            .forEach((image, i) => image.index = i);


        // **  Group yearDivs by year number
        const yearToYearDiv: TMap<YearDiv> = {};
        let count = 0; // assume sorted galleryImgs

        function appendToRow(yearDiv: YearDiv, galleryImg: GalleryImg, count: number) {
            switch (count % ROWSIZE) {
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

            } else {

                count = 0;
                let gridChildrenObj = {
                    row0: div({cls: 'row'}),
                    row1: div({cls: 'row'}),

                };
                if (ROWSIZE == 4) {
                    // @ts-ignore
                    gridChildrenObj.row2 = div({cls: 'row'});
                    // @ts-ignore
                    gridChildrenObj.row3 = div({cls: 'row'});
                }

                yearDiv = <YearDiv>div({cls: 'year'})
                    .cacheAppend({
                        title: div({cls: 'title'}).text(galleryImg.year),
                        grid: div({cls: 'grid'}).cacheAppend(gridChildrenObj)
                    });

                yearToYearDiv[galleryImg.year] = yearDiv;
            }
            appendToRow(yearDiv, galleryImg, count);


        }
        // console.log('yearToYearDiv:', JSON.parstr(yearToYearDiv));
        let selectedImg: GalleryImg = new GalleryImg();

        const imagesContainer = div({id: 'images_container'})
            .append(...Object.values(yearToYearDiv).reverse());

        DocumentElem
            .click(() => {
                if (!imgViewer.isopen) {
                    return;
                }
                console.log('document click, closeImgViewer()');
                closeImgViewer();
            })
            .keydown((event: KeyboardEvent) => {
                if (!imgViewer.isopen) {
                    return;
                }

                if (event.key === "Escape") {
                    return closeImgViewer();
                }

                if (event.key.startsWith("Arrow")) {
                    if (event.key === "ArrowLeft") {
                        return switchToImg(selectedImg.getLeftImage());
                    } else {
                        if (event.key === "ArrowRight") {
                            return switchToImg(selectedImg.getRightImage());
                        }
                    }

                }
            });

        const imgViewerClose = div({id: 'img_viewer_close'})
            .append(span({cls: 'lines'})).click(closeImgViewer);


        Home.empty().class('gallery-page').append(imagesContainer, imgViewer, imgViewerClose);


    }

    return {init}
};

