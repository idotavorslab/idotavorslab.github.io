type Group = "team" | "alumni";
const PeoplePage = () => {
    
    async function init() {
        console.log('PeoplePage init');
        let ROWSIZE;
        if (window.innerWidth >= BP0) {
            ROWSIZE = 4;
        } else {
            console.warn('people.ts. init BP1 no code, defaulting ROWSIZE 4');
            ROWSIZE = 4;
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
                person.indexInRow = index % ROWSIZE;
                person.group = this;
                return index;
            }
            
            static unfocusOthers(person: Person): void {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.addClass('unfocused')
                    }
                }
            }
            
            
            * yieldIndexesBelow(person: Person): IterableIterator<[number, number]> {
                const row = int(person.index / ROWSIZE);
                for (let i = row + 1; i <= this.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.length; j++) {
                        yield [i, j];
                    }
                }
            }
            
            pushPeopleBelow(person: Person): void {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            squeezeExpandoBelow(person: Person): void {
                const row = int(person.index / ROWSIZE);
                let rightmostPersonIndex = Math.min((ROWSIZE - 1) + (row % ROWSIZE) * ROWSIZE, this.length - 1);
                this[rightmostPersonIndex].after(expando);
            }
            
        }
        
        class Expando extends Div {
            public isExpanded: boolean = false;
            public owner: Person = null;
            public close: Div;
            public cv: Div;
            public email: Div;
            
            constructor() {
                super({id: 'person_expando'});
                this.cacheAppend({
                    close: div({cls: 'close'}).pointerdown(() => this.owner.collapseExpando()),
                    cv: div({cls: 'cv'}),
                    email: div({cls: 'email'})
                })
            }
            
            
            async toggle(event: Event, pressed: Person) {
                console.group('toggle');
                if (this.owner === null) {
                    People.unfocusOthers(pressed);
                    this.owner = pressed;
                    this.owner.group.pushPeopleBelow(this.owner);
                    this.setGridColumn(this.owner);
                    this.setHtml(this.owner);
                    this.owner.group.squeezeExpandoBelow(this.owner);
                    await wait(0);
                    this.removeClass('collapsed').addClass('expanded');
                    this.isExpanded = true;
                }
                /*if (this.owner === pressed) {
                    if (!this.isExpanded) {
                        throw new Error("pressed IS owner and !isExpanded. bad flow")
                    } else {
                        this.removeClass('expanded').addClass('collapsed');
                    }
                } else { // pressed NOT owner
                
                }
                */
                console.groupEnd();
            }
            
            setGridColumn(person: Person) {
                let gridColumn;
                switch (person.indexInRow) {
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
            
            setHtml(person: Person) {
                this.cv.html(person.cv);
                this.email.html(`Email: <a href="mailto:${person.email}">${person.email}</a>`);
            }
            
            
        }
        
        class Person extends BetterHTMLElement {
            public cv: string;
            // private readonly _index: number;
            // private readonly _indexInRow: number;
            // private readonly _row: number;
            // private readonly _arr: Person[];
            public email: string;
            public group: People;
            public index: number;
            public indexInRow: 0 | 1 | 2 | 3;
            
            
            constructor(image: string, name: string, role: string, cv: string, email: string) {
                super({tag: 'person'});
                this.cv = cv;
                this.email = email;
                // this._arr = arr;
                // this._index = index;
                // this._row = int(this._index / 4);
                // this._indexInRow = this._index % 4;
                
                this.append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).pointerdown((event) => expando.toggle(event, this));
                
                
            }
            
            
            private async _toggleExpando(event: Event): Promise<void> {
                // console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                console.group(`_toggleExpando | ${this._email}`);
                event.cancelBubble = true; // doesn't bubble up to grid
                
                if (expando.isExpanded) {
                    console.log('isExpanded');
                    if (expando.owner === this) {
                        console.log('owner === this');
                        this.collapseExpando();
                    } else {
                        console.log('owner !== this');
                        if (expando.owner._arr !== this._arr) {
                            // alumni, team...
                            console.log('_arr !== this._arr');
                            expando.owner.toggleClass('unfocused', true);
                            expando.removeClass('expanded').addClass('collapsed');
                            expando.owner._pullbackPeopleBelow();
                            expando.remove();
                            expando.owner = null;
                            expando.isExpanded = false;
                            this._expandExpando();
                            
                        } else {
                            console.log('_arr === this._arr');
                            
                            this._setExpandoGridColumn();
                            this._setExpandoHtml();
                            expando.owner.toggleClass('unfocused', true);
                            this.toggleClass('unfocused', false);
                            expando.owner = this;
                        }
                    }
                } else {
                    console.log('!isExpanded');
                    await this._expandExpando();
                }
                console.groupEnd();
            }
            
            /**switch (this._indexInRow)*/
            private _setExpandoGridColumn() {
                let expandoGridColumn;
                switch (this._indexInRow) {
                    case 0:
                        expandoGridColumn = '1/3';
                        break;
                    case 1:
                        expandoGridColumn = '2/4';
                        break;
                    case 2:
                    case 3:
                        expandoGridColumn = '3/5';
                        break;
                }
                expando.css({gridColumn: expandoGridColumn})
            }
            
            /**by this._cv and this._email*/
            private _setExpandoHtml() {
                expando.cv.html(this._cv);
                expando.email.html(`Email: <a href="mailto:${this._email}">${this._email}</a>`);
            }
            
            @log()
            collapseExpando(): void {
                // console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                expando.removeClass('expanded').addClass('collapsed');
                this._toggleOthersUnfocused();
                this._pullbackPeopleBelow();
                expando.remove();
                expando.owner = null;
                expando.isExpanded = false;
                
            }
            
            @log()
            private async _expandExpando(): Promise<void> {
                // console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                if (window.innerWidth >= BP0) {
                    
                    
                    if (this._row >= 1)
                        this.e.scrollIntoView({behavior: 'smooth'});
                    if (!expando.isExpanded) {
                        this._pushPeopleBelow();
                        this._toggleOthersUnfocused();
                    } else {
                        this.toggleClass('unfocused', false)
                    }
                    
                    this._setExpandoGridColumn();
                    this._setExpandoHtml();
                    
                    
                    let rightmostPersonIndex = Math.min(3 + (this._row % 4) * 4, this._arr.length - 1);
                    
                    this._arr[rightmostPersonIndex].after(expando);
                    
                    await wait(0);
                    if (!expando.isExpanded) {
                        expando.removeClass('collapsed').addClass('expanded');
                        expando.owner = this;
                        expando.isExpanded = true;
                    }
                    
                } else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
                
            }
            
            private* _yieldIndexesBelow(): IterableIterator<number[]> {
                
                for (let i = this._row + 1; i <= this._arr.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < this._arr.length; j++) {
                        yield [i, j];
                        
                    }
                }
            }
            
            private _pushPeopleBelow(): void {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this._arr[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            private _pullbackPeopleBelow(): void {
                // *  This is unneeded if there's no padding transition
                // for (let [i, j] of this._yieldIndexesBelow()) {
                //     People[i * 4 + j].css({marginTop: `${-GAP}px`});
                // }
                // await wait(500); // *  DEP: people.sass .person_expando padding transitions (any)
                
                for (let [i, j] of this._yieldIndexesBelow()) {
                    // *  Resetting margin-top is unneeded if there's no padding transition
                    // People[i * 4 + j].css({gridRow: `${i + 1}/${i + 1}`, marginTop: `0px`});
                    this._arr[i * 4 + j].uncss("gridRow");
                }
            }
            
            @log()
            private _toggleOthersUnfocused(force?: boolean): void {
                // console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                for (let p of this._arr) {
                    if (p === this) {
                    } else {
                        p.toggleClass('unfocused', force);
                    }
                    
                }
                
            }
            
            
        }
        
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const expando = new Expando();
        const {team: teamData, alumni: alumniData} = data;
        
        const team: People = new People();
        const alumni: People = new People();
        
        function gridFactory(gridData, gridId: string, people: People): Div {
            
            let index = 0;
            for (let [name, {image, role, cv, email}] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({id: gridId}).append(...people);
            
            
            return grid;
        }
        
        // **  Grids
        const teamGrid = gridFactory(teamData, 'team_grid', team);
        const alumniGrid = gridFactory(alumniData, 'alumni_grid', alumni);
        
        
        Home.empty().append(
            div({cls: 'title', text: 'Team'}),
            div({cls: 'separator'}),
            teamGrid,
            div({cls: 'title', text: 'Alumni'}),
            div({cls: 'separator'}),
            alumniGrid
        );
        
        
    }
    
    
    return {init}
};
PeoplePage().init();
