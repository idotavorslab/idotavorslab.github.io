type PersonViewer = {
    init: () => void,
    e: Div,
    isopen: boolean,
    open: () => void,
    populate: (name: string, image: string, cv: string, email: string) => void
};

const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        
        // **  personViewer
        const personViewer: PersonViewer = {
            init: function () {
                
                console.log('personViewer init');
                this.e.cacheAppend({
                    name: div({cls: "name"}),
                    imgCvContainer: div({cls: "img-cv-container"}).cacheAppend({
                        img: img(),
                        cv: div({cls: "cv"})
                    }),
                    email: div({cls: "email"}),
                    minimize: div({text: "_", cls: "minimize"})
                });
                
                this.e.minimize.pointerdown(async () => {
    
                    await this.e.fadeOut(50);
                    this.isopen = false;
                    this.e.removeClass('open');
                });
            },
            e: div({id: "person_viewer"}),
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
                this.e.imgCvContainer.img.attr({src: `main/people/${image}`});
                this.e.imgCvContainer.cv.text(cv);
                this.e.email.html(`Email: <a href="mailto:${email}">${email}</a>`);
            }
        };
        
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const people: BetterHTMLElement[] = [];
        personViewer.init();
        const {team, alumni} = data;
        
        // **  Team
        for (let [name, {image, role, cv, email}] of dict(team).items()) {
            let person = elem({tag: "person"});
            person
                .append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                );
            person.pointerdown(() => {
                if (!personViewer.isopen)
                    personViewer.open();
                
                personViewer.populate(name, image, cv, email)
                
            });
            people.push(person);
        }
        const teamContainer = div({id: "team_container"})
            .append(
                div({cls: 'title', text: 'Team'}),
                div({cls: 'separator'}),
                ...people
            );
        
        // **  Alumni
        const alumniArr = [];
        for (let [name, {image, role, cv, email}] of dict(alumni).items()) {
            let alum = elem({tag: "person"});
            alum
                .append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                ).pointerdown(() => {
                if (!personViewer.isopen)
                    personViewer.open();
                
                personViewer.populate(name, image, cv, email)
                
            });
            alumniArr.push(alum);
        }
        const alumniContainer =
            div({id: "alumni_container"})
                .append(
                    div({cls: 'title', text: 'Alumni'}),
                    div({cls: 'separator'}),
                    ...alumniArr
                );
        
        
        Home.empty().addClass('squeezed').append(
            personViewer.e,
            teamContainer,
            alumniContainer
        );
        
        
    }
    
    
    return {init}
};
