const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        class Person extends BetterHTMLElement {
            *yieldIndexesBelow() {
                for (let i = this.row + 1; i <= People.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < People.length; j++) {
                        console.log('i:', i, 'j:', j, `i * 4 + j:`, i * 4 + j);
                        yield [i, j];
                    }
                }
            }
            pushPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    People[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
            async pullbackPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    People[i * 4 + j].css({ marginTop: `${-GAP}px` });
                }
                await wait(500);
                for (let [i, j] of this.yieldIndexesBelow()) {
                    People[i * 4 + j].css({ gridRow: `${i + 1}/${i + 1}`, marginTop: `0px` });
                }
            }
            unfocusOthers() {
                for (let p of People) {
                    if (p !== this) {
                        p.addClass('unfocused');
                    }
                }
            }
            focusOthers() {
                for (let p of People) {
                    if (p !== this) {
                        p.removeClass('unfocused');
                    }
                }
            }
            async collapseExpando() {
                PersonExpando.removeClass('expanded').addClass('collapsed');
                this.focusOthers();
                await this.pullbackPeopleBelow();
                PersonExpando.remove();
            }
            async expandExpando() {
                if (window.innerWidth >= BP0) {
                    if (this.index === undefined) {
                        this.index = People.indexOf(this);
                        this.row = int(this.index / 4);
                        this.indexInRow = this.index % 4;
                    }
                    console.log({
                        index: this.index,
                        row: this.row,
                        indexInRow: this.indexInRow,
                        'IsExpanded (result of click)': IsExpanded
                    });
                    this.pushPeopleBelow();
                    this.unfocusOthers();
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
                    console.log('PersonExpando.email', PersonExpando.email);
                    PersonExpando
                        .text(this.cv)
                        .css({ gridColumn })
                        .append(div({ cls: 'email' }).html(`Email: <a href="mailto:${this.email}">${this.email}</a>`));
                    let rightmostPersonIndex = 3 + (this.row % 4) * 4;
                    console.log({ gridColumn, rightmostPersonIndex });
                    People[rightmostPersonIndex].after(PersonExpando);
                    await wait(0);
                    PersonExpando.removeClass('collapsed').addClass('expanded');
                }
                else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
            }
            constructor(image, name, role, cv, email) {
                super({ tag: 'person' });
                this.cv = cv;
                this.email = email;
                this
                    .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown(async () => {
                    IsExpanded = !IsExpanded;
                    if (!IsExpanded) {
                        this.collapseExpando();
                    }
                    else {
                        this.expandExpando();
                    }
                });
            }
        }
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const People = [];
        const PersonExpando = div({ cls: 'person-expando' });
        const { team, alumni } = data;
        let IsExpanded = false;
        for (let [name, { image, role, cv, email }] of dict(team).items()) {
            let person = new Person(image, name, role, cv, email);
            People.push(person);
        }
        const teamGrid = div({ id: "team_grid" })
            .append(...People);
        const alumniArr = [];
        for (let [name, { image, role, cv, email }] of dict(alumni).items()) {
            let alum = elem({ tag: "person" });
            alum
                .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown(() => {
                if (!personViewer.isopen)
                    personViewer.open();
                personViewer.populate(name, image, cv, email);
            });
            alumniArr.push(alum);
        }
        const alumniGrid = div({ id: "alumni_grid" })
            .append(...alumniArr);
        Home.empty().append(div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), teamGrid, div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), alumniGrid);
    }
    return { init };
};
PeoplePage().init();
//# sourceMappingURL=people.js.map