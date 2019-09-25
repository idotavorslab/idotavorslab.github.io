var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        let ROWSIZE;
        if (window.innerWidth >= BP1) {
            ROWSIZE = 4;
        }
        else {
            ROWSIZE = 4;
        }
        class Person extends Div {
            constructor(image, name, role, cv, email) {
                super({ cls: 'person' });
                this.cv = cv;
                this.email = email;
                let imgElem;
                let cachedImage = CacheDiv[`people.${image}`];
                if (cachedImage !== undefined) {
                    imgElem = cachedImage.removeAttr('hidden');
                    console.log('people | cachedImage isnt undefined:', cachedImage);
                }
                else {
                    console.log('people | cachedImage IS undefined');
                    imgElem = img({ src: `main/people/${image}` });
                }
                this.append(imgElem, div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown((event) => {
                    console.log('person pointerdown, stopping prop and toggling expando');
                    event.stopPropagation();
                    expando.toggle(this);
                });
            }
            focus() {
                return this.removeClass('unfocused');
            }
            unfocus() {
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
                    this.group[i * ROWSIZE + j].css({ gridRow: `${i + 2}/${i + 2}` });
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
        }
        class Expando extends Div {
            constructor() {
                super({ id: 'person_expando' });
                this.owner = null;
                this
                    .pointerdown((event) => {
                    console.log('expando pointerdown, stopping propagation');
                    event.stopPropagation();
                })
                    .append(elem({ tag: 'svg' })
                    .id('svg_root')
                    .attr({ viewBox: '0 0 15 15' })
                    .append(elem({ tag: 'path', cls: 'upright' }), elem({ tag: 'path', cls: 'downleft' }))
                    .pointerdown((event) => {
                    console.log('svg pointerdown, stopping prop and closing');
                    event.stopPropagation();
                    this.close();
                }))
                    .cacheAppend({
                    cv: div({ cls: 'cv' }),
                    email: div({ cls: 'email' })
                });
            }
            async toggle(pressed) {
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
                this.email.html(`Email: <a target="_blank" href="mailto:${this.owner.email}">${this.owner.email}</a>`);
                showArrowOnHover(this.email.children('a'));
            }
        }
        __decorate([
            log()
        ], Expando.prototype, "setHtml", null);
        function gridFactory({ gridData, people }) {
            let index = 0;
            for (let [name, { image, role, cv, email }] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({ cls: 'grid' }).append(...people);
            return grid;
        }
        const { alumni: alumniData, team: teamData } = await fetchJson('main/people/people.json');
        const expando = new Expando();
        const team = new People();
        const alumni = new People();
        const teamGrid = gridFactory({ gridData: teamData, people: team });
        const alumniGrid = gridFactory({ gridData: alumniData, people: alumni });
        Home.empty().class('people-page').append(elem({ tag: 'h1', text: 'Team' }), teamGrid, elem({ tag: 'h1', text: 'Alumni' }), alumniGrid);
        DocumentElem
            .pointerdown(() => {
            console.log('DocumentElem pointerdown');
            if (expando.owner !== null)
                expando.close();
        })
            .keydown(keyboardNavigation);
        function keyboardNavigation(event) {
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
    return { init };
};
//# sourceMappingURL=people.js.map