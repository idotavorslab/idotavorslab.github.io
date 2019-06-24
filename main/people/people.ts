const PeoplePage = () => {
    async function init() {
        
        console.log('PeoplePage init');
        const personViewer = div({id: "person_viewer"});
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
                personViewer
                    .setClass('open')
                    .append(
                        div({text: name, cls: "name"}),
                        img({src: `main/people/${image}`}),
                        div({text: cv, cls: "cv"}),
                        div({text: `Email: ${email}`, cls: "email"}),
                    );
            });
            people.push(person);
        }
        const peopleContainer = div({id: "people_container"})
            .append(...people);
        
        home.empty().append(personViewer, peopleContainer);
        
        
    }
    
    
    return {init}
};
