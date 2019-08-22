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
        
        class Person extends BetterHTMLElement {
            public cv: string;
            public email: string;
            public group: People;
            public index: number;
            
            
            constructor(image: string, name: string, role: string, cv: string, email: string) {
                super({tag: 'person'});
                this.cv = cv;
                this.email = email;
                this.append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).pointerdown((event) => expando.toggle(event, this));
                
                
            }
            
            focus(): Person {
                console.log(`focusing: ${this.email}`);
                return this.removeClass('unfocused');
            }
            
            unfocus(): Person {
                console.log(`UNfocusing: ${this.email}`);
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
            
            pushPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    this.group[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            pullbackPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    this.group[i * 4 + j].uncss("gridRow");
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
            
            
            * yieldIndexesBelow(person: Person): IterableIterator<[number, number]> {
                for (let i = person.row() + 1; i <= this.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.length; j++) {
                        yield [i, j];
                    }
                }
            }
            
            /*pushPeopleBelow(person: Person): void {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
            }
            
            pullbackPeopleBelow(person: Person): void {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].uncss("gridRow");
                }
            }
            
            squeezeExpandoBelow(person: Person): void {
                let rightmostPersonIndex = Math.min((ROWSIZE - 1) + person.row() * ROWSIZE, this.length - 1);
                this[rightmostPersonIndex].after(expando);
            }
            */
            
        }
        
        class Expando extends Div {
            public owner: Person = null;
            public cv: Div;
            public email: Div;
            
            constructor() {
                super({id: 'person_expando'});
                this.append(div({cls: 'close'}).pointerdown(() => this.close()))
                    .cacheAppend({
                        cv: div({cls: 'cv'}),
                        email: div({cls: 'email'})
                    });
            }
            
            
            async toggle(event: Event, pressed: Person) {
                if (this.owner === pressed) {
                    // *  Close
                    this.close();
                    return;
                    
                }
                if (this.owner === null) {
                    // *  Expand
                    People.unfocusOthers(pressed);
                    await this.pushSqueezeAndExpand(pressed);
                    this.ownPopulateAndPosition(pressed);
                    return;
                }
                
                // **  Transform
                this.owner.unfocus();
                pressed.focus();
                this.collapse();
                this.owner.pullbackPeopleBelow();
                await this.pushSqueezeAndExpand(pressed);
                this.ownPopulateAndPosition(pressed);
                
                
            }
            
            async pushSqueezeAndExpand(pressed: Person) {
                pressed.pushPeopleBelow();
                pressed.squeezeExpandoBelow();
                await wait(0);
                this.expand();
            }
            
            collapse() {
                this.removeClass('expanded').addClass('collapsed').remove();
            }
            
            expand() {
                this.removeClass('collapsed').addClass('expanded');
            }
            
            close() {
                this.collapse();
                this.owner.pullbackPeopleBelow();
                People.focusOthers(this.owner);
                this.owner = null;
            }
            
            ownPopulateAndPosition(pressed: Person) {
                this.owner = pressed;
                this.setGridColumn(pressed);
                this.setHtml(pressed);
            }
            
            setGridColumn(person: Person) {
                let gridColumn;
                switch (person.indexInRow()) {
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
