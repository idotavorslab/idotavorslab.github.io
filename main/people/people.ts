const PeoplePage = () => {
    
    async function init() {
        console.log('PeoplePage init');
        let ROWSIZE;
        if (window.innerWidth >= BP1) { // 1340
            ROWSIZE = 4;
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
            
            * yieldIndexesBelow(): IterableIterator<[number, number]> {
                // const row = int(person.index / ROWSIZE);
                for (let i = this.row() + 1; i <= this.group.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.group.length; j++) {
                        yield [i, j];
                    }
                }
            }
            
            /**Sets everyone below's gridRow*/
            pushPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            pullbackPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].uncss("gridRow");
                }
            }
            
            squeezeExpandoBelow() {
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
            
            constructor() {
                super({id: 'person_expando'});
                this
                    .click((event: Event) => {
                        // prevent propagation to DocumentElem
                        console.log('expando click, stopping propagation');
                        event.stopPropagation();
                    })
                    .append(
                        elem({tag: 'svg'})
                            .id('svg_root')
                            .attr({viewBox: '0 0 15 15'})
                            .append(
                                elem({tag: 'path', cls: 'upright'}),
                                elem({tag: 'path', cls: 'downleft'})
                            )
                            .click((event) => {
                                console.log('svg click, stopping prop and closing');
                                event.stopPropagation();
                                this.close();
                            }))
                    .cacheAppend({
                        cv: div({cls: 'cv'}),
                        email: div({cls: 'email'})
                    });
            }
            
            
            async toggle(pressed: Person) {
                if (this.owner === null) {
                    // *  Expand
                    People.unfocusOthers(pressed);
                    await this.pushAfterAndExpand(pressed);
                    this.ownPopulateAndPosition(pressed);
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
                        this.collapse();
                        await this.pushAfterAndExpand(pressed);
                    }
                    this.ownPopulateAndPosition(pressed);
                } else { // *  Different group
                    this.collapse();
                    await this.pushAfterAndExpand(pressed);
                    this.ownPopulateAndPosition(pressed);
                }
                
                
            }
            
            // toggle => ownPopulateAndPosition
            async pushAfterAndExpand(pressed: Person) {
                pressed.pushPeopleBelow();
                pressed.squeezeExpandoBelow();
                await wait(0);
                this.expand();
            }
            
            // toggle => ownPopulateAndPosition
            ownPopulateAndPosition(pressed: Person) {
                this.owner = pressed;
                this.setHtml();
                this.setGridColumn();
            }
            
            collapse() {
                this.removeClass('expanded').addClass('collapsed').remove();
                this.owner.pullbackPeopleBelow();
            }
            
            expand() {
                this.removeClass('collapsed').addClass('expanded');
            }
            
            close() {
                this.collapse();
                People.focusOthers(this.owner);
                this.owner = null;
            }
            
            // toggle => ownPopulateAndPosition => setGridColumn
            setGridColumn() {
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
                this.css({gridColumn})
            }
            
            // toggle => ownPopulateAndPosition => setHtml
            @log()
            setHtml() {
                
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
                showArrowOnHover(this.email.children('a'));
                
            }
            
            
        }
        
        function gridFactory({gridData, people}: { gridData: TeamType, people: People }): Div {
            
            let index = 0;
            for (let [name, {image, role, cv, email}] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({cls: 'grid'}).append(...people);
            
            
            return grid;
        }
        
        
        type TeamType = TMap<{ role: string, image: string, cv: string, email: string }>
        /*const {alumni: alumniData, team: teamData}: { alumni: TeamType, team: TeamType } = await fetchJson({
            path: 'main/people/people.json',
            jsontype: "object"
        });
        */
        const {alumni: alumniData, team: teamData} = await fetchDict<{ alumni: TeamType, team: TeamType }>('main/people/people.json');
        
        const expando: Expando = new Expando();
        
        /*const longestCv = Math.max(
            ...Object
                .values({...alumniData, ...teamData})
                .map(({cv}) => cv.length)
        );
        
        
                const expandoHeight = Math.round((longestCv - 680) / 55);
              console.log({longestCv, expandoHeight});
                if (expandoHeight > 0 && expandoHeight <= 12)
                    expando.class(`height-${expandoHeight}`);
        */
        
        const team: People = new People();
        const alumni: People = new People();
        
        
        // **  Grids
        const teamGrid = gridFactory({gridData: teamData, people: team});
        const alumniGrid = gridFactory({gridData: alumniData, people: alumni});
        
        
        Home.empty().class('people-page').append(
            // div({cls: 'title', text: 'Team'}),
            // div({cls: 'separator'}),
            elem({tag: 'h1', text: 'Team'}),
            teamGrid,
            // div({cls: 'title', text: 'Alumni'}),
            // div({cls: 'separator'}),
            elem({tag: 'h1', text: 'Alumni'}),
            alumniGrid
        );
        
        
        DocumentElem
            .click(() => {
                console.log('DocumentElem click');
                if (expando.owner !== null)
                    expando.close()
            })
            .keydown(keyboardNavigation);
        
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
        
        
    }
    
    
    return {init}
};
