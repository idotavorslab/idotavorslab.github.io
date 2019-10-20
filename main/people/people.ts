const PeoplePage = () => {
    
    async function init() {
        console.log('PeoplePage init');
        // await untilNotUndefined(MOBILE, 'people MOBILE');
        let ROWSIZE = 4;
        if (window.innerWidth >= $BP1) { // 1340
            // ROWSIZE = 4;
        } else {
            ROWSIZE = 4;
        }
        
        class Person extends Div {
            public cv: string;
            public email: string;
            public group: People;
            public index: number;
            
            
            constructor(image: string, name: string, role: string, cv: string, email: string) {
                super({cls: 'person'});
                this.cv = cv;
                this.email = email;
                let imgElem;
                let cachedImage = CacheDiv[`people.${image}`];
                if (cachedImage !== undefined) {
                    imgElem = cachedImage.removeAttr('hidden');
                    // console.log('people | cachedImage isnt undefined:', cachedImage);
                } else {
                    // console.log('people | cachedImage IS undefined');
                    imgElem = img({src: `main/people/${image}`});
                }
                this.append(
                    imgElem,
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).click((event) => {
                    console.log('person click, stopping prop and toggling expando');
                    event.stopPropagation();
                    expando.toggle(this);
                });
                
                
            }
            
            // @ts-ignore
            focus(): Person {
                return this.removeClass('unfocused');
            }
            
            unfocus(): Person {
                return this.addClass('unfocused');
            }
            
            indexInRow(): number {
                return this.index % ROWSIZE;
            }
            
            row(): number {
                return int(this.index / ROWSIZE);
            }
            
            private* _yieldIndexesBelow(): IterableIterator<[number, number]> {
                // const row = int(person.index / ROWSIZE);
                for (let i = this.row() + 1; i <= this.group.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.group.length; j++) {
                        yield [i, j];
                    }
                }
            }
            
            /**Sets everyone below's gridRow*/
            pushPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            pullbackPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].uncss("gridRow");
                }
            }
            
            insertExpandoAfterRightmostPerson() {
                let rightmostPersonIndex = Math.min((ROWSIZE - 1) + this.row() * ROWSIZE, this.group.length - 1);
                this.group[rightmostPersonIndex].after(expando);
            }
            
            
        }
        
        class People extends Array<Person> {
            private readonly _push: (...items: Person[]) => number;
            
            constructor() {
                super();
                this._push = super.push;
            }
            
            push(person: Person) {
                let length = this._push(person);
                let index = length - 1;
                person.index = index;
                person.group = this;
                return index;
            }
            
            static unfocusOthers(person: Person): void {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.unfocus();
                    }
                }
            }
            
            static focusOthers(person: Person): void {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.focus();
                    }
                }
            }
            
            
        }
        
        class Expando extends Div {
            public owner: Person = null;
            public cv: Div;
            public email: Div;
            private title: Div;
            
            constructor() {
                super({id: 'person_expando', cls: 'collapsed'});
                const svgX = elem({tag: 'svg'})
                    .id('svg_root')
                    // *  DEP: people.sass div#person_expando > svg#svg_root $dim
                    .attr({viewBox: '0 0 25 25'})
                    .append(
                        elem({tag: 'path', cls: 'upright'}),
                        elem({tag: 'path', cls: 'downleft'})
                    )
                    .click((event) => {
                        console.log('svg click, stopping prop and closing');
                        event.stopPropagation();
                        this.close();
                    });
                this.click((event: Event) => {
                    // prevent propagation to DocumentElem
                    console.log('expando click, stopping propagation');
                    event.stopPropagation();
                });
                
                WindowElem.promiseLoaded().then(() => {
                    
                    this.append({
                        cv: div({cls: 'cv'}),
                        email: div({cls: 'email'})
                    });
                    if (MOBILE) {
                        const title = div({cls: 'title'});
                        this.cv.before(title, svgX);
                        this._cache('title', title);
                    } else {
                        this.cv.after(svgX)
                    }
                    /*this.append({
                            cv: div({cls: 'cv'}),
                            svg: svgX,
                            email: div({cls: 'email'})
                        }
                    );*/
                    
                    
                });
                
            }
            
            
            @log()
            async toggle(pressed: Person) {
                if (this.owner === null) {
                    // *  Expand
                    People.unfocusOthers(pressed);
                    if (MOBILE) {
                        this._expand();
                    } else {
                        await this._pushAfterAndExpand(pressed);
                    }
                    this._ownAndPopulate(pressed);
                    return;
                }
                if (this.owner === pressed) {
                    // *  Close
                    this.close();
                    return;
                    
                }
                // **  Transform
                this.owner.unfocus();
                pressed.focus();
                if (this.owner.group === pressed.group) {
                    if (this.owner.row() !== pressed.row()) { // *  Same group, different row
                        this._collapse();
                        if (MOBILE) {
                            this._expand();
                        } else {
                            await this._pushAfterAndExpand(pressed);
                        }
                    }
                    this._ownAndPopulate(pressed);
                } else { // *  Different group
                    this._collapse();
                    if (MOBILE) {
                        this._expand();
                    } else {
                        await this._pushAfterAndExpand(pressed);
                    }
                    this._ownAndPopulate(pressed);
                }
                
                
            }
            
            // toggle => _ownAndPopulate
            @log()
            private async _pushAfterAndExpand(pressed: Person) {
                pressed.pushPeopleBelow();
                pressed.insertExpandoAfterRightmostPerson();
                await wait(0);
                this._expand();
            }
            
            // toggle => _ownAndPopulate
            @log()
            private _ownAndPopulate(pressed: Person) {
                this.owner = pressed;
                this._setHtml();
                if (!MOBILE)
                    this._setGridColumn();
            }
            
            @log()
            private _collapse() {
                this.removeClass('expanded').addClass('collapsed').insertAfter(alumniContainer);
                if (!MOBILE)
                    this.owner.pullbackPeopleBelow();
            }
            
            @log()
            private _expand() {
                this.removeClass('collapsed').addClass('expanded');
                if (MOBILE)
                    elem({id: 'navbar_section'}).addClass('off');
            }
            
            @log()
            close() {
                this._collapse();
                People.focusOthers(this.owner);
                this.owner = null;
                if (MOBILE)
                    elem({id: 'navbar_section'}).removeClass('off');
            }
            
            // toggle => _ownAndPopulate => _setGridColumn
            @log()
            private _setGridColumn() {
                let gridColumn;
                switch (this.owner.indexInRow()) {
                    case 0:
                        gridColumn = '1/3';
                        break;
                    case 1:
                        gridColumn = '2/4';
                        break;
                    case 2:
                    case 3:
                        gridColumn = '3/5';
                        break;
                }
                
                
                this.css({gridColumn});
                
                wait(250).then(() => {
                    let overflown = isOverflown(this.e);
                    if (overflown) {
                        let oldHeight = this.e.clientHeight;
                        let diff = this.e.scrollHeight - oldHeight;
                        this.css({height: `${parseInt(getComputedStyle(this.e).height) + diff}px`});
                    }
                    
                });
            }
            
            // toggle => _ownAndPopulate => _setHtml
            @log()
            private _setHtml() {
                
                // const expandoHeight = Math.floor((this.owner.cv.length - 640) / 55);
                // console.log({'this.owner.cv.length': this.owner.cv.length, expandoHeight});
                // this.removeClass((s) => s.startsWith('height'));
                // if (expandoHeight > 0 && expandoHeight <= 14) {
                //     this.addClass(`height-${expandoHeight}`);
                // }
                
                
                /*this.on({
                    
                    transitionend: (event: TransitionEvent) => {
                        if (event.propertyName === "width") {
                            let textLength = this.owner.cv.length + this.owner.email.length + 8;
                            let computedHeight = parseInt(getComputedStyle(this.e).height);
                            // this.css({marginBottom: `${absExpandoHeight - computedHeight}px`});
                            console.log('transitionend', event,
                                '\nname:', this.owner.email,
                                '\nexpando height:', `${computedHeight}px`,
                                '\ntext length:', textLength,
                                '\ntextLength / computedHeight:', textLength / computedHeight,
                                '\nabsExpandoHeight - computedHeight:', absExpandoHeight - computedHeight
                            );
                        }
                    }
                }, {once: true});
                wait(0).then(() => {
                    
                    let computedHeight = parseInt(getComputedStyle(this.e).height);
                    console.log({'stam computedHeight': computedHeight});
                });
                */
                this.cv.html(this.owner.cv);
                this.email.html(`Email: <a target="_blank" href="mailto:${this.owner.email}">${this.owner.email}</a>`);
                if (MOBILE)
                    this.title.text('Dr. Ido Tavor');
                showArrowOnHover(this.email.children('a'));
                
            }
            
            
        }
        
        function containerFactory({containerData, people}: { containerData: TeamType, people: People }): Div {
            
            let index = 0;
            for (let [name, {image, role, cv, email}] of dict(containerData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({cls: 'grid'}).append(...people);
            
            
            return grid;
        }
        
        
        type TeamType = TMap<{ role: string, image: string, cv: string, email: string }>
        
        const {alumni: alumniData, team: teamData} = await fetchDict<{ alumni: TeamType, team: TeamType }>('main/people/people.json');
        
        const expando: Expando = new Expando();
        
        
        const team: People = new People();
        const alumni: People = new People();
        
        
        // **  Containers
        const teamContainer = containerFactory({containerData: teamData, people: team});
        const alumniContainer = containerFactory({containerData: alumniData, people: alumni});
        
        function keyboardNavigation(event: KeyboardEvent) {
            
            
            if (event.key === "Escape" && expando.owner !== null)
                return expando.close();
            
            if (event.key.startsWith("Arrow") && expando.owner !== null) {
                if (event.key === "ArrowRight") {
                    let nextPerson = expando.owner.group[expando.owner.index + 1];
                    if (nextPerson === undefined)
                        expando.toggle(expando.owner.group[0]);
                    else
                        expando.toggle(nextPerson);
                }
                if (event.key === "ArrowLeft") {
                    let prevPerson = expando.owner.group[expando.owner.index - 1];
                    if (prevPerson === undefined)
                        expando.toggle(expando.owner.group[expando.owner.group.length - 1]);
                    else
                        expando.toggle(prevPerson);
                }
                
                
            }
        }
        
        DocumentElem
            .click(() => {
                console.log('DocumentElem click');
                if (expando.owner !== null)
                    expando.close()
            })
            .keydown(keyboardNavigation);
        Home.empty().class('people-page').append(
            elem({tag: 'h1', text: 'Team'}),
            teamContainer,
            elem({tag: 'h1', text: 'Alumni'}),
            alumniContainer,
            expando
        );
        
        
    }
    
    
    return {init}
};
