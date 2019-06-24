const PeoplePage = () => {
    async function init() {
        
        console.log('PeoplePage init');
        let req = new Request('main/people/people.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const people = [];
        for (let [name, {image, role}] of dict(data).items()) {
            let person = elem({tag: "person"});
            person
                .append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                );
            person.pointerdown(() => {
                // home.replaceChild(personViewer, peopleContainer).append(peopleContainer);
            });
            people.push(person);
        }
        const peopleContainer = div({id: "people_container"})
            .append(...people);
        
        home.empty().append(peopleContainer);
        
        
    }
    
    
    return {init}
};
