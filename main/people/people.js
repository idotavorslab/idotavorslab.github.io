var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        class People extends Array {
            constructor() {
                super();
                this._push = super.push;
            }
            push(person) {
                let index = this._push(person);
                person.index = index;
                person.group = this;
                return index;
            }
            static unfocusOthers(person) {
                for (let p of [...team, ...alumni]) {
                    if (p !== person) {
                        p.addClass('unfocused');
                    }
                }
            }
            *yieldIndexesBelow(person) {
                const row = int(person.index / 4);
                for (let i = row + 1; i <= this.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < this.length; j++) {
                        yield [i, j];
                    }
                }
            }
            pushPeopleBelow(person) {
                for (let [i, j] of this.yieldIndexesBelow(person)) {
                    this[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
        }
        class Expando extends Div {
            constructor() {
                super({ id: 'person_expando' });
                this.isExpanded = false;
                this.owner = null;
                this.cacheAppend({
                    close: div({ cls: 'close' }).pointerdown(() => this.owner.collapseExpando()),
                    cv: div({ cls: 'cv' }),
                    email: div({ cls: 'email' })
                });
            }
            toggle(event, pressed) {
                console.group('toggle');
                if (this.owner === null) {
                    People.unfocusOthers(pressed);
                    this.owner = pressed;
                    this.owner.group.pushPeopleBelow(this.owner);
                }
                console.groupEnd();
            }
        }
        class Person extends BetterHTMLElement {
            constructor(image, name, role, cv, email) {
                super({ tag: 'person' });
                this._cv = cv;
                this._email = email;
                this.append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown((event) => expando.toggle(event, this));
            }
            async _toggleExpando(event) {
                console.group(`_toggleExpando | ${this._email}`);
                event.cancelBubble = true;
                if (expando.isExpanded) {
                    console.log('isExpanded');
                    if (expando.owner === this) {
                        console.log('owner === this');
                        this.collapseExpando();
                    }
                    else {
                        console.log('owner !== this');
                        if (expando.owner._arr !== this._arr) {
                            console.log('_arr !== this._arr');
                            expando.owner.toggleClass('unfocused', true);
                            expando.removeClass('expanded').addClass('collapsed');
                            expando.owner._pullbackPeopleBelow();
                            expando.remove();
                            expando.owner = null;
                            expando.isExpanded = false;
                            this._expandExpando();
                        }
                        else {
                            console.log('_arr === this._arr');
                            this._setExpandoGridColumn();
                            this._setExpandoHtml();
                            expando.owner.toggleClass('unfocused', true);
                            this.toggleClass('unfocused', false);
                            expando.owner = this;
                        }
                    }
                }
                else {
                    console.log('!isExpanded');
                    await this._expandExpando();
                }
                console.groupEnd();
            }
            _setExpandoGridColumn() {
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
                console.log(`_setExpandoGridColumn, _indexInRow: ${this._indexInRow}, setting expandoGridColumn: ${expandoGridColumn}`);
                expando.css({ gridColumn: expandoGridColumn });
            }
            _setExpandoHtml() {
                expando.cv.html(this._cv);
                expando.email.html(`Email: <a href="mailto:${this._email}">${this._email}</a>`);
            }
            collapseExpando() {
                expando.removeClass('expanded').addClass('collapsed');
                this._toggleOthersUnfocused();
                this._pullbackPeopleBelow();
                expando.remove();
                expando.owner = null;
                expando.isExpanded = false;
            }
            async _expandExpando() {
                if (window.innerWidth >= BP0) {
                    if (this._row >= 1)
                        this.e.scrollIntoView({ behavior: 'smooth' });
                    if (!expando.isExpanded) {
                        this._pushPeopleBelow();
                        this._toggleOthersUnfocused();
                    }
                    else {
                        this.toggleClass('unfocused', false);
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
                }
                else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
            }
            *_yieldIndexesBelow() {
                for (let i = this._row + 1; i <= this._arr.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < this._arr.length; j++) {
                        yield [i, j];
                    }
                }
            }
            _pushPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this._arr[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
            _pullbackPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this._arr[i * 4 + j].uncss("gridRow");
                }
            }
            _toggleOthersUnfocused(force) {
                for (let p of this._arr) {
                    if (p === this) {
                    }
                    else {
                        p.toggleClass('unfocused', force);
                    }
                }
            }
        }
        __decorate([
            log()
        ], Person.prototype, "collapseExpando", null);
        __decorate([
            log()
        ], Person.prototype, "_expandExpando", null);
        __decorate([
            log()
        ], Person.prototype, "_toggleOthersUnfocused", null);
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