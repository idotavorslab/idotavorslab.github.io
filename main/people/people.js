const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        class Person extends BetterHTMLElement {
            constructor(image, name, role, cv, email, arr) {
                super({ tag: 'person' });
                this.cv = cv;
                this.email = email;
                this.arr = arr;
                this.append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" })).pointerdown((event) => {
                    event.cancelBubble = true;
                    if (IsExpanded)
                        this.collapseExpando();
                    else
                        this._expandExpando();
                    IsExpanded = !IsExpanded;
                });
            }
            *_yieldIndexesBelow() {
                for (let i = this.row + 1; i <= this.arr.length / 4; i++) {
                    for (let j = 0; j < 4 && i * 4 + j < this.arr.length; j++) {
                        yield [i, j];
                    }
                }
            }
            _pushPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.arr[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                }
            }
            async _pullbackPeopleBelow() {
                for (let [i, j] of this._yieldIndexesBelow()) {
                    this.arr[i * 4 + j].css({ gridRow: `${i + 1}/${i + 1}` });
                }
            }
            _toggleOthersFocus() {
                for (let p of this.arr) {
                    if (p !== this)
                        p.toggleClass('unfocused');
                }
            }
            async _expandExpando() {
                if (window.innerWidth >= BP0) {
                    if (this.index === undefined) {
                        this.index = this.arr.indexOf(this);
                        this.row = int(this.index / 4);
                        this.indexInRow = this.index % 4;
                    }
                    if (this.row >= 1)
                        this.e.scrollIntoView({ behavior: 'smooth' });
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
                        .css({ gridColumn })
                        .append(div({ cls: 'email' }).html(`Email: <a href="mailto:${this.email}">${this.email}</a>`));
                    let rightmostPersonIndex = Math.min(3 + (this.row % 4) * 4, this.arr.length - 1);
                    console.log({ gridColumn, rightmostPersonIndex });
                    this.arr[rightmostPersonIndex].after(PersonExpando);
                    await wait(0);
                    PersonExpando.removeClass('collapsed').addClass('expanded');
                    this.ownsExpando = true;
                }
                else if (window.innerWidth >= BP1) {
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
        const Team = [];
        const PersonExpando = div({ cls: 'person-expando' });
        const { team, alumni } = data;
        let IsExpanded = false;
        for (let [name, { image, role, cv, email }] of dict(team).items()) {
            let teammate = new Person(image, name, role, cv, email, Team);
            Team.push(teammate);
        }
        const teamGrid = div({ id: "team_grid" })
            .append(...Team)
            .pointerdown(() => {
            if (IsExpanded) {
                Team.find(member => member.ownsExpando).collapseExpando();
                IsExpanded = !IsExpanded;
            }
        });
        const Alumni = [];
        for (let [name, { image, role, cv, email }] of dict(alumni).items()) {
            let alumnus = new Person(image, name, role, cv, email, Alumni);
            Alumni.push(alumnus);
        }
        const alumniGrid = div({ id: "alumni_grid" })
            .append(...Alumni)
            .pointerdown(() => {
            if (IsExpanded) {
                Alumni.find(a => a.ownsExpando).collapseExpando();
                IsExpanded = !IsExpanded;
            }
        });
        Home.empty().append(div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), teamGrid, div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), alumniGrid);
    }
    return { init };
};
//# sourceMappingURL=people.js.map