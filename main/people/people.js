const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        console.log({ Navbar });
        Navbar.select(Navbar.people);
        const personViewer = {
            init: function () {
                console.log('init', this);
                this.e.cacheAppend({
                    name: div({ cls: "name" }),
                    img: img({}),
                    cv: div({ cls: "cv" }),
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
                console.log('opening', this);
                this.e.class('open');
                await this.e.fadeIn(500);
                this.isopen = true;
            },
            populate: function (name, image, cv, email) {
                console.log('populating');
                this.e.name.text(name);
                this.e.img.attr({ src: `main/people/${image}` });
                this.e.cv.text(cv);
                this.e.email.html(`Email: <a href="mailto:${email}">${email}</a>`);
            }
        };
        const req = new Request('main/people/people.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log(data);
        const people = [];
        personViewer.init();
        const { team, alumni } = data;
        for (let [name, { image, role, cv, email }] of dict(team).items()) {
            let person = elem({ tag: "person" });
            person
                .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" }));
            person.pointerdown(() => {
                if (!personViewer.isopen)
                    personViewer.open();
                personViewer.populate(name, image, cv, email);
            });
            people.push(person);
        }
        const teamContainer = div({ id: "team_container" })
            .append(div({ cls: 'title', text: 'Team' }), div({ cls: 'separator' }), ...people);
        const alumniArr = [];
        for (let [name, { image, role, cv, email }] of dict(alumni).items()) {
            let alum = elem({ tag: "person" });
            alum
                .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" }));
            alum.pointerdown(() => {
                if (!personViewer.isopen)
                    personViewer.open();
                personViewer.populate(name, image, cv, email);
            });
            alumniArr.push(alum);
        }
        const alumniContainer = div({ id: "alumni_container" })
            .append(div({ cls: 'title', text: 'Alumni' }), div({ cls: 'separator' }), ...alumniArr);
        Home.empty().addClass('squeezed').append(personViewer.e, teamContainer, alumniContainer);
    }
    return { init };
};
//# sourceMappingURL=people.js.map