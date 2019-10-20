var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        let ROWSIZE = 4;
        if (window.innerWidth >= $BP1) {
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
                }
                else {
                    imgElem = img({ src: `main/people/${image}` });
                }
                this.append(imgElem, div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).click((event) => {
                    console.log('person click, stopping prop and toggling expando');
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
                    .click((event) => {
                    console.log('expando click, stopping propagation');
                    event.stopPropagation();
                })
                    .append(elem({ tag: 'svg' })
                    .id('svg_root')
                    .attr({ viewBox: '0 0 15 15' })
                    .append(elem({ tag: 'path', cls: 'upright' }), elem({ tag: 'path', cls: 'downleft' }))
                    .click((event) => {
                    console.log('svg click, stopping prop and closing');
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
                    if (MOBILE)
                        this.expand();
                    else
                        await this.pushAfterAndExpand(pressed);
                    this.ownAndPopulate(pressed, { setGridCol: !MOBILE });
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
                        if (MOBILE)
                            this.expand();
                        else
                            await this.pushAfterAndExpand(pressed);
                    }
                    this.ownAndPopulate(pressed, { setGridCol: !MOBILE });
                }
                else {
                    this.collapse();
                    if (MOBILE)
                        this.expand();
                    else
                        await this.pushAfterAndExpand(pressed);
                    this.ownAndPopulate(pressed, { setGridCol: !MOBILE });
                }
            }
            async pushAfterAndExpand(pressed) {
                pressed.pushPeopleBelow();
                pressed.squeezeExpandoBelow();
                await wait(0);
                this.expand();
            }
            ownAndPopulate(pressed, { setGridCol = true }) {
                this.owner = pressed;
                this.setHtml();
                if (setGridCol === true)
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
        ], Expando.prototype, "toggle", null);
        __decorate([
            log()
        ], Expando.prototype, "pushAfterAndExpand", null);
        __decorate([
            log()
        ], Expando.prototype, "ownAndPopulate", null);
        __decorate([
            log()
        ], Expando.prototype, "collapse", null);
        __decorate([
            log()
        ], Expando.prototype, "expand", null);
        __decorate([
            log()
        ], Expando.prototype, "close", null);
        __decorate([
            log()
        ], Expando.prototype, "setGridColumn", null);
        __decorate([
            log()
        ], Expando.prototype, "setHtml", null);
        function containerFactory({ containerData, people }) {
            let index = 0;
            for (let [name, { image, role, cv, email }] of dict(containerData).items()) {
                let person = new Person(image, name, role, cv, email);
                people.push(person);
                index++;
            }
            const grid = div({ cls: 'grid' }).append(...people);
            return grid;
        }
        const { alumni: alumniData, team: teamData } = await fetchDict('main/people/people.json');
        const expando = new Expando();
        const team = new People();
        const alumni = new People();
        const teamContainer = containerFactory({ containerData: teamData, people: team });
        const alumniContainer = containerFactory({ containerData: alumniData, people: alumni });
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
        DocumentElem
            .click(() => {
            console.log('DocumentElem click');
            if (expando.owner !== null)
                expando.close();
        })
            .keydown(keyboardNavigation);
        Home.empty().class('people-page').append(elem({ tag: 'h1', text: 'Team' }), teamContainer, elem({ tag: 'h1', text: 'Alumni' }), alumniContainer);
    }
    return { init };
};
//# sourceMappingURL=people.js.map