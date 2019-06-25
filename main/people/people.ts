type TPersonViewer = {
    e: Div,
    isopen: boolean,
    open: (name: string, image: string, cv: string, email: string) => void,
    populate: (name: string, image: string, cv: string, email: string) => void
};

const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        const personViewer: TPersonViewer = {
            e: div({id: "person_viewer"}),
            isopen: false,
            open: function (name, image, cv, email) {
                this.e.setClass('open')
                    .cacheAppend({
                        name: div({text: name, cls: "name"}),
                        img: img({src: `main/people/${image}`}),
                        cv: div({text: cv, cls: "cv"}),
                        email: div({text: `Email: ${email}`, cls: "email"}),
                        close: div({text: "_", cls: "close"})
                    });
                this.isopen = true;
            },
            populate: function (name, image, cv, email) {
                this.e.name.text(name);
                this.e.img.attr({src: `main/people/${image}`});
                this.e.cv.text(cv);
                this.e.email.text(`Email: ${email}`);
            }
        };
        let req = new Request('main/people/people.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const people = [];
        for (let [name, {image, role, cv, email}] of dict(data).items()) {
            let person = elem({tag: "person"});
            person
                .append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                );
            person.pointerdown(() => {
                if (!personViewer.isopen) {
                    personViewer.open(name, image, cv, email);
                    
                } else {
                    personViewer.populate(name, image, cv, email)
                }
                // personViewer.e
                //     .setClass('open')
                //     .append(
                //         div({text: name, cls: "name"}),
                //         img({src: `main/people/${image}`}),
                //         div({text: cv, cls: "cv"}),
                //         div({text: `Email: ${email}`, cls: "email"}),
                //     );
            });
            people.push(person);
        }
        const peopleContainer = div({id: "people_container"})
            .append(...people);
        
        home.empty().append(personViewer.e, peopleContainer);
        
        
    }
    
    
    return {init}
};
