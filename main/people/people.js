const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        const personViewer = {
            init: function () {
                console.log('init');
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
                console.log('opening');
                this.e.setClass('open');
                await this.e.fadeIn(500);
                this.isopen = true;
            },
            populate: function (name, image, cv, email) {
                console.log('populating');
                this.e.name.text(name);
                this.e.img.attr({ src: `main/people/${image}` });
                this.e.cv.text(cv);
                this.e.email.text(`Email: ${email}`);
            }
        };
        const req = new Request('main/people/people.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log(data);
        const people = [];
        personViewer.init();
        for (let [name, { image, role, cv, email }] of dict(data).items()) {
            let person = elem({ tag: "person" });
            person
                .append(img({ src: `main/people/${image}` }), div({ text: name, cls: "name" }), div({ text: role, cls: "role" }));
            person.pointerdown(() => {
                if (!personViewer.isopen) {
                    personViewer.open();
                    personViewer.populate(name, image, cv, email);
                }
                else {
                    personViewer.populate(name, image, cv, email);
                }
            });
            people.push(person);
        }
        const peopleContainer = div({ id: "people_container" })
            .append(...people);
        Home.empty().append(personViewer.e, peopleContainer);
    }
    return { init };
};
//# sourceMappingURL=people.js.map