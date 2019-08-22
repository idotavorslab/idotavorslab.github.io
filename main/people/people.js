const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        let ROWSIZE;
        if (window.innerWidth >= BP0) {
            ROWSIZE = 4;
        }
        else {
            console.warn('people.ts. init BP1 no code, defaulting ROWSIZE 4');
            ROWSIZE = 4;
        }
        class People extends Array {
            constructor() {
                super();
                this._push = super.push;
            }
            push(person) {
                let length = this._push(person);
                let index = length - 1;
                person.index = index;
                person.group = this;
                return index;
            }
            static unfocusOthers(person) {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.unfocus();
                    }
                }
            }
            static focusOthers(person) {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.focus();
                    }
                }
            }
            *yieldIndexesBelow(person) {
                for (let i = person.row() + 1; i <= this.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.length; j++) {
                        yield [i, j];
                    }
                }
            }
            pushPeopleBelow(person) {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
            pullbackPeopleBelow(person) {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].uncss("gridRow");
                }
            }
            squeezeExpandoBelow(person) {
                let rightmostPersonIndex = Math.min((ROWSIZE - 1) + (person.row() % ROWSIZE) * ROWSIZE, this.length - 1);
                this[rightmostPersonIndex].after(expando);
            }
        }
        class Expando extends Div {
            constructor() {
                super({ id: 'person_expando' });
                this.owner = null;
                this.cacheAppend({
                    close: div({ cls: 'close' }).pointerdown(() => this.collapse()),
                    cv: div({ cls: 'cv' }),
                    email: div({ cls: 'email' })
                });
            }
            async toggle(event, pressed) {
                console.group('toggle');
                if (this.owner === null) {
                    console.log('this.owner === null, expanding');
                    People.unfocusOthers(pressed);
                    this.owner = pressed;
                    this.owner.group.pushPeopleBelow(this.owner);
                    this.setGridColumn(this.owner);
                    this.setHtml(this.owner);
                    this.owner.group.squeezeExpandoBelow(this.owner);
                    await wait(0);
                    this.removeClass('collapsed').addClass('expanded');
                }
                else {
                    console.log('this.owner !== null');
                    if (this.owner === pressed) {
                        console.log(`this.owner (${this.owner.email}) === pressed (${pressed.email}), collapsing`);
                        People.focusOthers(this.owner);
                        this.removeClass('expanded').addClass('collapsed').remove();
                        this.owner.group.pullbackPeopleBelow(this.owner);
                        this.owner = null;
                    }
                    else {
                        console.log(`this.owner (${this.owner.email}) !== pressed (${pressed.email}) (expanded and someone else was pressed)`);
                        this.owner.unfocus();
                        pressed.focus();
                        if (this.owner.group === pressed.group) {
                            console.log('same group');
                            if (this.owner.row() === pressed.row()) {
                                console.log('same row, doing nothing');
                            }
                            else {
                                console.log('different row');
                                this.removeClass('expanded').addClass('collapsed').remove();
                                this.owner.group.pullbackPeopleBelow(this.owner);
                                this.owner.group.pushPeopleBelow(pressed);
                                this.owner.group.squeezeExpandoBelow(pressed);
                                await wait(0);
                                this.removeClass('collapsed').addClass('expanded');
                            }
                        }
                        else {
                            console.log('different group');
                            this.removeClass('expanded').addClass('collapsed').remove();
                            this.owner.group.pullbackPeopleBelow(this.owner);
                            pressed.group.pushPeopleBelow(pressed);
                            pressed.group.squeezeExpandoBelow(pressed);
                            await wait(0);
                            this.removeClass('collapsed').addClass('expanded');
                        }
                        this.owner = pressed;
                        this.setGridColumn(pressed);
                        this.setHtml(pressed);
                    }
                }
                console.groupEnd();
            }
            collapse() {
                this.removeClass('expanded').addClass('collapsed').remove();
                this.owner.group.pullbackPeopleBelow(this.owner);
                People.focusOthers(this.owner);
                this.owner = null;
            }
            setGridColumn(person) {
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
                this.css({ gridColumn });
            }
            setHtml(person) {
                this.cv.html(person.cv);
                this.email.html(`Email: <a href="mailto:${person.email}">${person.email}</a>`);
            }
        }
        class Person extends BetterHTMLElement {
            constructor(image, name, role, cv, email) {
                super({ tag: 'person' });
                this.cv = cv;
                this.email = email;
                this.append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown((event) => expando.toggle(event, this));
            }
            focus() {
                console.log(`focusing: ${this.email}`);
                return this.removeClass('unfocused');
            }
            unfocus() {
                console.log(`UNfocusing: ${this.email}`);
                return this.addClass('unfocused');
            }
            indexInRow() {
                return this.index % ROWSIZE;
            }
            row() {
                return int(this.index / ROWSIZE);
            }
        }
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const expando = new Expando();
        const { team: teamData, alumni: alumniData } = data;
        const team = new People();
        const alumni = new People();
        function gridFactory(gridData, gridId, people) {
            let index = 0;
            for (let [name, { image, role, cv, email }] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({ id: gridId }).append(...people);
            return grid;
        }
        const teamGrid = gridFactory(teamData, 'team_grid', team);
        const alumniGrid = gridFactory(alumniData, 'alumni_grid', alumni);
        Home.empty().append(div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), teamGrid, div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), alumniGrid);
    }
    return { init };
};
PeoplePage().init();
//# sourceMappingURL=people.js.map