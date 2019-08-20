var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        class Expando extends Div {
            constructor() {
                super({ cls: 'person-expando' });
                this.isExpanded = false;
                this.owner = null;
            }
        }
        class Person extends BetterHTMLElement {
            constructor(image, name, role, cv, email, arr) {
                super({ tag: 'person' });
                this._cv = cv;
                this._email = email;
                this._arr = arr;
                this.append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown((event) => this._toggleExpando(event));
            }
            async _toggleExpando(event) {
                event.cancelBubble = true;
                if (expando.isExpanded) {
                    if (expando.owner === this) {
                        this.collapseExpando();
                    }
                    else {
                        expando.owner.collapseExpando();
                        await this._expandExpando();
                    }
                }
                else {
                    await this._expandExpando();
                }
            }
            collapseExpando() {
                expando.removeClass('expanded').addClass('collapsed');
                this._toggleOthersFocus();
                this._pullbackPeopleBelow();
                expando.remove().empty();
                expando.owner = null;
                expando.isExpanded = false;
            }
            async _expandExpando() {
                if (window.innerWidth >= BP0) {
                    if (this._index === undefined) {
                        this._index = this._arr.indexOf(this);
                        this._row = int(this._index / 4);
                        this._indexInRow = this._index % 4;
                    }
                    if (this._row >= 1)
                        this.e.scrollIntoView({ behavior: 'smooth' });
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
                        .css({ gridColumn })
                        .append(div({ cls: 'close' }).pointerdown(() => expando.owner.collapseExpando()), div({ cls: 'cv' }).html(this._cv), div({ cls: 'email' }).html(`Email: <a href="mailto:${this._email}">${this._email}</a>`));
                    let rightmostPersonIndex = Math.min(3 + (this._row % 4) * 4, this._arr.length - 1);
                    this._arr[rightmostPersonIndex].after(expando);
                    await wait(0);
                    expando.removeClass('collapsed').addClass('expanded');
                    expando.owner = this;
                    expando.isExpanded = true;
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
            _toggleOthersFocus() {
                for (let p of this._arr) {
                    if (p !== this)
                        p.toggleClass('unfocused');
                }
            }
        }
        __decorate([
            log(true)
        ], Person.prototype, "_toggleExpando", null);
        __decorate([
            log()
        ], Person.prototype, "collapseExpando", null);
        __decorate([
            log()
        ], Person.prototype, "_expandExpando", null);
        __decorate([
            log()
        ], Person.prototype, "_toggleOthersFocus", null);
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const expando = new Expando();
        const { team, alumni } = data;
        function gridFactory(gridData, id) {
            const arr = [];
            for (let [name, { image, role, cv, email }] of dict(gridData).items()) {
                let person = new Person(image, name, role, cv, email, arr);
                arr.push(person);
            }
            const grid = div({ id })
                .append(...arr);
            return grid;
        }
        const teamGrid = gridFactory(team, 'team_grid');
        const alumniGrid = gridFactory(alumni, 'alumni_grid');
        Home.empty().append(div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), teamGrid, div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), alumniGrid);
    }
    return { init };
};
PeoplePage().init();
//# sourceMappingURL=people.js.map