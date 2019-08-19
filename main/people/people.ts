const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        
        class Person extends BetterHTMLElement {
            index: number;
            row: number;
            indexInRow: number;
            cv: string;
            email: string;
            ownsExpando: boolean;
            arr: Person[];
            
            constructor(image: string, name: string, role: string, cv: string, email: string, arr: Person[]) {
                super({tag: 'person'});
                this.cv = cv;
                this.email = email;
                this.arr = arr;
                this.append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).pointerdown((event) => {
                        event.cancelBubble = true; // doesn't bubble up to grid
                        this.toggleClass('expanded');
                        if (IsExpanded)
                            this.collapseExpando();
                        else
                            this._expandExpando();
                        IsExpanded = !IsExpanded;
                        
                    }
                )
            }
            
            
            private* _yieldIndexesBelow() {
                
                for (let i = this.row + 1; i <= this.arr.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < this.arr.length; j++) {
                        
                        // console.log('i:', i, 'j:', j, `i * 4 + j:`, i * 4 + j);
                        // 4,5,6,7                  3/3     (go over row and increment gridRow)
                        yield [i, j];
                        
                    }
                }
            }
            
            private _pushPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.arr[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                }
                
            }
            
            private async _pullbackPeopleBelow() {
                // *  This is unneeded if there's no padding transition
                // for (let [i, j] of this._yieldIndexesBelow()) {
                //     People[i * 4 + j].css({marginTop: `${-GAP}px`});
                // }
                // await wait(500); // *  DEP: people.sass .person-expando padding transitions (any)
                
                for (let [i, j] of this._yieldIndexesBelow()) {
                    // *  Resetting margin-top is unneeded if there's no padding transition
                    // People[i * 4 + j].css({gridRow: `${i + 1}/${i + 1}`, marginTop: `0px`});
                    this.arr[i * 4 + j].css({gridRow: `${i + 1}/${i + 1}`});
                }
            }
            
            
            private _toggleOthersFocus() {
                for (let p of this.arr) {
                    if (p !== this)
                        p.toggleClass('unfocused');
                }
                
            }
            
            
            private async _expandExpando() {
                if (window.innerWidth >= BP0) {
                    if (this.index === undefined) {
                        this.index = this.arr.indexOf(this);
                        this.row = int(this.index / 4);
                        this.indexInRow = this.index % 4;
                    }
                    
                    if (this.row >= 1)
                        this.e.scrollIntoView({behavior: 'smooth'});
                    this._pushPeopleBelow();
                    this._toggleOthersFocus();
                    
                    let gridColumn;
                    switch (this.indexInRow) {
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
                    PersonExpando
                        .text(this.cv)
                        .css({gridColumn})
                        .append(div({cls: 'email'}).html(`Email: <a href="mailto:${this.email}">${this.email}</a>`));
                    
                    
                    let rightmostPersonIndex = Math.min(3 + (this.row % 4) * 4, this.arr.length - 1);
                    
                    console.log({gridColumn, rightmostPersonIndex});
                    this.arr[rightmostPersonIndex].after(PersonExpando);
                    
                    await wait(0);
                    PersonExpando.removeClass('collapsed').addClass('expanded');
                    this.ownsExpando = true;
                } else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
                
            }
            
            async collapseExpando() {
                PersonExpando.removeClass('expanded').addClass('collapsed');
                
                this._toggleOthersFocus();
                await this._pullbackPeopleBelow();
                PersonExpando.remove();
                this.ownsExpando = false;
                
            }
        }
        
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const Team: Person[] = [];
        type TPersonExpando = Div & { email: Div };
        const PersonExpando: TPersonExpando = <TPersonExpando>div({cls: 'person-expando'});
        
        const {team, alumni} = data;
        
        // **  Team
        let IsExpanded = false;
        for (let [name, {image, role, cv, email}] of dict(team).items()) {
            let teammate = new Person(image, name, role, cv, email, Team);
            Team.push(teammate);
        }
        const teamGrid = div({id: "team_grid"})
            .append(...Team)
            .pointerdown(() => {
                if (IsExpanded) {
                    Team.find(member => member.ownsExpando).collapseExpando();
                    IsExpanded = !IsExpanded;
                }
            });
        
        // **  Alumni
        const Alumni: Person[] = [];
        for (let [name, {image, role, cv, email}] of dict(alumni).items()) {
            let alumnus = new Person(image, name, role, cv, email, Alumni);
            Alumni.push(alumnus);
        }
        const alumniGrid =
            div({id: "alumni_grid"})
                .append(...Alumni)
                .pointerdown(() => {
                    if (IsExpanded) {
                        Alumni.find(a => a.ownsExpando).collapseExpando();
                        IsExpanded = !IsExpanded;
                    }
                });
        
        
        Home.empty().append(
            // personViewer.e,
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
// PeoplePage().init();
