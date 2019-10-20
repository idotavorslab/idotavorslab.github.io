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
                this.name = name;
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
            *_yieldIndexesBelow() {
                for (let i = this.row() + 1; i <= this.group.length / ROWSIZE; i++) {
                    for (let j = 0; j < ROWSIZE && i * ROWSIZE + j < this.group.length; j++) {
                        yield [i, j];
                    }
                }
            }
            pushPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
            pullbackPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.group[i * ROWSIZE + j].uncss("gridRow");
                }
            }
            insertExpandoAfterRightmostPerson() {
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
            static unfocusAll() {
                for (let p of [...team, ...alumni]) {
                    p.unfocus();
                }
            }
            static focusAll() {
                for (let p of [...team, ...alumni]) {
                    p.focus();
                }
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
                super({ id: 'person_expando', cls: 'collapsed' });
                this.owner = null;
                const svgX = elem({ tag: 'svg' })
                    .id('svg_root')
                    .attr({ viewBox: '0 0 25 25' })
                    .append(elem({ tag: 'path', cls: 'upright' }), elem({ tag: 'path', cls: 'downleft' }))
                    .click((event) => {
                    console.log('svg click, stopping prop and closing');
                    event.stopPropagation();
                    this.close();
                });
                this.click((event) => {
                    console.log('expando click, stopping propagation');
                    event.stopPropagation();
                });
                WindowElem.promiseLoaded().then(() => {
                    this.append({
                        cv: div({ cls: 'cv' }),
                        email: div({ cls: 'email' })
                    });
                    if (MOBILE) {
                        const title = div({ cls: 'title' });
                        this.cv.before(title, svgX);
                        this._cache('title', title);
                    }
                    else {
                        this.cv.after(svgX);
                    }
                });
            }
            async toggle(pressed) {
                if (this.owner === null) {
                    if (MOBILE) {
                        People.unfocusAll();
                        this._expand();
                    }
                    else {
                        People.unfocusOthers(pressed);
                        await this._pushAfterAndExpand(pressed);
                    }
                    this._ownAndPopulate(pressed);
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
                        this._collapse();
                        if (MOBILE) {
                            this._expand();
                        }
                        else {
                            await this._pushAfterAndExpand(pressed);
                        }
                    }
                    this._ownAndPopulate(pressed);
                }
                else {
                    this._collapse();
                    if (MOBILE) {
                        this._expand();
                    }
                    else {
                        await this._pushAfterAndExpand(pressed);
                    }
                    this._ownAndPopulate(pressed);
                }
            }
            async _pushAfterAndExpand(pressed) {
                pressed.pushPeopleBelow();
                pressed.insertExpandoAfterRightmostPerson();
                await wait(0);
                this._expand();
            }
            _ownAndPopulate(pressed) {
                this.owner = pressed;
                this._setHtml();
                if (!MOBILE)
                    this.__setGridColumn();
            }
            __setGridColumn() {
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
                wait(250).then(() => {
                    if (isOverflown(this.e)) {
                        let diff = this.e.scrollHeight - this.e.clientHeight;
                        this.css({ height: `${parseInt(getComputedStyle(this.e).height) + diff}px` });
                    }
                });
            }
            _collapse() {
                this.removeClass('expanded').addClass('collapsed').insertAfter(alumniContainer);
                if (!MOBILE)
                    this.owner.pullbackPeopleBelow();
            }
            _expand() {
                this.removeClass('collapsed').addClass('expanded');
                if (MOBILE)
                    elem({ id: 'navbar_section' }).addClass('off');
            }
            close() {
                this._collapse();
                this.owner = null;
                if (MOBILE) {
                    People.focusAll();
                    elem({ id: 'navbar_section' }).removeClass('off');
                    [teamH1, alumniH1].forEach(h1 => h1.removeClass('unfocused'));
                    Body.removeClass('noscroll');
                }
                else {
                    People.focusOthers(this.owner);
                }
            }
            _setHtml() {
                this.cv.html(this.owner.cv);
                this.email.html(`Email: <a target="_blank" href="mailto:${this.owner.email}">${this.owner.email}</a>`);
                if (MOBILE) {
                    this.title.text(this.owner.name);
                    if (isOverflown(this.e))
                        this.css({ bottom: 'unset' });
                    else
                        this.uncss('bottom');
                    [teamH1, alumniH1].forEach(h1 => h1.class('unfocused'));
                    Body.addClass('noscroll');
                    console.log('WindowElem._listeners.scroll:', WindowElem._listeners.scroll);
                }
                else {
                    showArrowOnHover(this.email.children('a'));
                }
            }
        }
        __decorate([
            log()
        ], Expando.prototype, "toggle", null);
        __decorate([
            log()
        ], Expando.prototype, "_pushAfterAndExpand", null);
        __decorate([
            log()
        ], Expando.prototype, "_ownAndPopulate", null);
        __decorate([
            log()
        ], Expando.prototype, "__setGridColumn", null);
        __decorate([
            log()
        ], Expando.prototype, "_collapse", null);
        __decorate([
            log()
        ], Expando.prototype, "_expand", null);
        __decorate([
            log()
        ], Expando.prototype, "close", null);
        __decorate([
            log()
        ], Expando.prototype, "_setHtml", null);
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
        DocumentElem.click(() => {
            console.log('DocumentElem click');
            if (expando.owner !== null)
                expando.close();
        });
        if (!MOBILE)
            DocumentElem.keydown(keyboardNavigation);
        const teamH1 = elem({ tag: 'h1', text: 'Team' });
        const alumniH1 = elem({ tag: 'h1', text: 'Alumni' });
        Home.empty().class('people-page').append(teamH1, teamContainer, alumniH1, alumniContainer, expando);
    }
    return { init };
};
//# sourceMappingURL=people.js.map