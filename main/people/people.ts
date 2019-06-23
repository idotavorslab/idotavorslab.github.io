const PeoplePage = () => {
    async function init() {
        
        console.log('PeoplePage init');
        home.empty();
        elem({id: 'page_css'}).attr({href: 'main/people/people.css'});
        let req = new Request('main/people/people.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const people = [];
        for (let [name, {img, role}] of dict(data).items()) {
            let person = elem({tag: "person"});
            person
                .append(
                    div({text: name, cls: "name"}),
                    // div({text: role, cls: "role"}),
                )
                .css({backgroundImage: `url("main/people/${img}")`});
            people.push(person);
        }
        const peopleContainer = div({id: "people_container"})
            .append(...people);
        home.append(peopleContainer);
        
        
    }
    
    
    return {init}
};
