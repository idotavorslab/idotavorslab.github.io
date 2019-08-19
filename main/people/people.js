const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        const personViewer = {
            init: function () {
                console.log('personViewer init');
                this.e.cacheAppend({
                    name: div({ cls: "name" }),
                    imgCvContainer: div({ cls: "img-cv-container" }).cacheAppend({
                        img: img(),
                        cv: div({ cls: "cv" })
                    }),
                    email: div({ cls: "email" }),
                    minimize: div({ text: "_", cls: "minimize" })
                });
                this.e.minimize.pointerdown(async () => {
                    await this.e.fadeOut(50);
                    this.isopen = false;
                    this.e.removeClass('open');
                });
            },
            e: div({ id: "person_viewer" }),
            isopen: false,
            open: async function () {
                console.log('opening');
                this.e.class('open');
                await this.e.fadeIn(500);
                this.isopen = true;
            },
            populate: function (name, image, cv, email) {
                console.log('populating');
                this.e.name.text(name);
                this.e.imgCvContainer.img.attr({ src: `main/people/${image}` });
                this.e.imgCvContainer.cv.text(cv);
                this.e.email.html(`Email: <a href="mailto:${email}">${email}</a>`);
            }
        };
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const people = [];
        personViewer.init();
        const { team, alumni } = data;
        for (let [name, { image, role, cv, email }] of dict(team).items()) {
            let person = elem({ tag: "person" });
            person
                .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" }));
            person.pointerdown(() => {
                if (window.innerWidth >= BP0) {
                    let personIndex = people.indexOf(person);
                    let personRow = int(personIndex / 4);
                    let personIndexInRow = personIndex % 4;
                    console.log({ personIndex, personRow, personIndexInRow });
                    for (let i = personRow + 1; i <= people.length / 4; i++) {
                        for (let j = 0; j < 4 && i * 4 + j < people.length; j++) {
                            console.log('i:', i, 'j:', j, `i * 4 + j:`, i * 4 + j);
                            people[i * 4 + j].css({ gridRow: `${i + 2}/${i + 2}` });
                        }
                    }
                    for (let p of people) {
                        if (p !== person) {
                            p.toggleClass('unfocused');
                        }
                    }
                    let gridColumn;
                    switch (personIndexInRow) {
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
                    let rightmostPersonIndex = 3 + (personRow % 4) * 4;
                    console.log({ gridColumn, rightmostPersonIndex });
                    people[rightmostPersonIndex].after(div({ text: cv, cls: 'person-content' }).css({ gridColumn }));
                }
                else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
                people.reverse()[0].css({ gridRow: '3/3' });
            });
            people.push(person);
        }
        const teamGrid = div({ id: "team_grid" })
            .append(...people);
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
        Home.empty().append(personViewer.e, div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), teamGrid, div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), alumniGrid);
    }
    return { init };
};
PeoplePage().init();
//# sourceMappingURL=people.js.map