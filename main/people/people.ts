const PeoplePage = () => {
    
    async function init() {
        console.log('PeoplePage init');
        
        class Expando extends Div {
            public isExpanded: boolean = false;
            public owner: Person = null;
            
            constructor() {
                super({cls: 'person-expando'});
            }
        }
        
        class Person extends BetterHTMLElement {
            private _cv: string;
            private _index: number;
            private _indexInRow: number;
            private _row: number;
            private readonly _arr: Person[];
            private readonly _email: string;
            
            
            constructor(image: string, name: string, role: string, cv: string, email: string, arr: Person[]) {
                super({tag: 'person'});
                this._cv = cv;
                this._email = email;
                this._arr = arr;
                this.append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).pointerdown((event) => this._toggleExpando(event));
                
                
            }
            
            @log(true)
            private async _toggleExpando(event: Event): Promise<void> {
                console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                event.cancelBubble = true; // doesn't bubble up to grid
                
                if (expando.isExpanded) {
                    if (expando.owner === this) {
                        this.collapseExpando();
                    } else {
                        expando.owner.collapseExpando();
                        await this._expandExpando();
                    }
                } else {
                    await this._expandExpando();
                }
            }
            
            @log()
            collapseExpando(): void {
                console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                expando.removeClass('expanded').addClass('collapsed');
                this._toggleOthersFocus();
                this._pullbackPeopleBelow();
                expando.remove();
                expando.owner = null;
                expando.isExpanded = false;
                
            }
            
            @log()
            private async _expandExpando(): Promise<void> {
                console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                if (window.innerWidth >= BP0) {
                    if (this._index === undefined) {
                        this._index = this._arr.indexOf(this);
                        this._row = int(this._index / 4);
                        this._indexInRow = this._index % 4;
                    }
                    
                    if (this._row >= 1)
                        this.e.scrollIntoView({behavior: 'smooth'});
                    this._pushPeopleBelow();
                    this._toggleOthersFocus();
                    
                    let gridColumn;
                    switch (this._indexInRow) {
                        case 0:
                            gridColumn = '1/3';
                            break;
                        case 1:
                        case 2:
                            gridColumn = '2/4';
                            break;
                        case 3:
                            gridColumn = '3/5';
                            break;
                    }
                    expando
                        .text(this._cv)
                        .css({gridColumn})
                        .append(div({cls: 'email'}).html(`Email: <a href="mailto:${this._email}">${this._email}</a>`));
                    
                    
                    let rightmostPersonIndex = Math.min(3 + (this._row % 4) * 4, this._arr.length - 1);
                    
                    this._arr[rightmostPersonIndex].after(expando);
                    
                    await wait(0);
                    expando.removeClass('collapsed').addClass('expanded');
                    expando.owner = this;
                    expando.isExpanded = true;
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
                // await wait(500); // *  DEP: people.sass .person-expando padding transitions (any)
                
                for (let [i, j] of this._yieldIndexesBelow()) {
                    // *  Resetting margin-top is unneeded if there's no padding transition
                    // People[i * 4 + j].css({gridRow: `${i + 1}/${i + 1}`, marginTop: `0px`});
                    this._arr[i * 4 + j].uncss("gridRow");
                }
            }
            
            @log()
            private _toggleOthersFocus(): void {
                console.log(_(`expando.isExpanded: ${expando.isExpanded}. expando.owner: ${expando.owner ? expando.owner._email : expando.owner}. this._email: ${this._email}`));
                for (let p of this._arr) {
                    if (p !== this)
                        p.toggleClass('unfocused');
                }
                
            }
            
            
        }
        
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        
        
        const expando = new Expando();
        
        
        const {team, alumni} = data;
        
        
        function gridFactory(gridData, id: string): Div {
            const arr: Person[] = [];
            for (let [name, {image, role, cv, email}] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email, arr);
                arr.push(person);
            }
            const grid = div({id})
                .append(...arr)
                .pointerdown(() => {
                    if (expando.isExpanded) {
                        expando.owner.collapseExpando();
                        // expando.isExpanded = !expando.isExpanded;
                    }
                });
            
            return grid;
        }
        
        // **  Grids
        const teamGrid = gridFactory(team, 'team_grid');
        const alumniGrid = gridFactory(alumni, 'alumni_grid');
        
        
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
