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
            *yieldIndexesBelow() {
                for (let i = this.row() + 1; i <= this.group.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.group.length; j++) {
                        yield [i, j];
                    }
                }
            }
            pushPeopleBelow() {
                for (let [i, j] of this.yieldIndexesBelow()) {
                    this.group[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
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
        }
        class Expando extends Div {
            constructor() {
                super({ id: 'person_expando' });
                this.owner = null;
                this.append(div({ cls: 'close' }).pointerdown(() => this.close()))
                    .cacheAppend({
                    cv: div({ cls: 'cv' }),
                    email: div({ cls: 'email' })
                });
            }
            async toggle(event, pressed) {
                if (this.owner === null) {
                    People.unfocusOthers(pressed);
                    await this.pushAfterAndExpand(pressed);
                    this.ownPopulateAndPosition(pressed);
                    return;
                }
                if (this.owner === pressed) {
                    this.close();
                    return;
                }
                this.owner.unfocus();
                pressed.focus();
                if (this.owner.group === pressed.group) {
                    if (this.owner.row() !== pressed.row()) {
                        this.collapse();
                        await this.pushAfterAndExpand(pressed);
                    }
                    this.ownPopulateAndPosition(pressed);
                }
                else {
                    this.collapse();
                    await this.pushAfterAndExpand(pressed);
                    this.ownPopulateAndPosition(pressed);
                }
            }
            async pushAfterAndExpand(pressed) {
                pressed.pushPeopleBelow();
                pressed.squeezeExpandoBelow();
                await wait(0);
                this.expand();
            }
            ownPopulateAndPosition(pressed) {
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
                this.css({ gridColumn });
            }
            setHtml() {
                this.cv.html(this.owner.cv);
                this.email.html(`Email: <a href="mailto:${this.owner.email}">${this.owner.email}</a>`);
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