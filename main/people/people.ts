const PeoplePage = () => {
    async function init() {
        console.log('PeoplePage init');
        
        
        const data = await fetchJson('main/people/people.json', "no-cache");
        console.log('people data', data);
        const people: BetterHTMLElement[] = [];
        const {team, alumni} = data;
        
        // **  Team
        let isExpanded = false;
        for (let [name, {image, role, cv, email}] of dict(team).items()) {
            let person = elem({tag: "person"});
            person
                .append(
                    img({src: `main/people/${image}`}),
                    div({text: name, cls: "name"}),
                    div({text: role, cls: "role"}),
                );
            person.pointerdown(async () => {
                console.group('person.pointerdown');
                isExpanded = !isExpanded;
                if (!isExpanded) {
                    elem({query: '.expanded'}).removeClass('expanded').css({padding: 0});
                    
                    return;
                }
                if (window.innerWidth >= BP0) {
                    let personIndex = people.indexOf(person);
                    // eg 0
                    let personRow = int(personIndex / 4);
                    let personIndexInRow = personIndex % 4;
                    console.log({personIndex, personRow, personIndexInRow, 'isExpanded (result of click)': isExpanded});
                    // i=1; i<=1 (from next row and on)
                    for (let i = personRow + 1; i <= people.length / 4; i++) {
                        for (let j = 0; j < 4 && i * 4 + j < people.length; j++) {
                            
                            console.log('i:', i, 'j:', j, `i * 4 + j:`, i * 4 + j);
                            // 4,5,6,7                  3/3     (go over row and increment gridRow)
                            people[i * 4 + j].css({gridRow: `${i + 2}/${i + 2}`});
                            
                            
                        }
                    }
                    // unfocus all persons
                    for (let p of people) {
                        if (p !== person) {
                            p.toggleClass('unfocused')
                        }
                    }
                    // 3, 7, 11.. last person in each row
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
                    console.log({gridColumn, rightmostPersonIndex});
                    let personExpando = div({text: cv, cls: 'person-expando'})
                        .append(div({cls: 'email'}).html(`Email: <a href="mailto:${email}">${email}</a>`))
                        .css({gridColumn});
                    people[rightmostPersonIndex].after(personExpando);
                    await wait(0);
                    personExpando.addClass('expanded');
                } else if (window.innerWidth >= BP1) {
                    console.warn('people.ts. person pointerdown BP1 no code');
                }
                console.groupEnd();
            });
            people.push(person);
        }
        const teamGrid = div({id: "team_grid"})
            .append(
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
        const alumniGrid =
            div({id: "alumni_grid"})
                .append(
                    ...alumniArr
                );
        
        
        Home.empty().append(
            // personViewer.e,
            div({cls: 'title', text: 'Team'}),
            div({cls: 'separator'}),
            teamGrid,
            div({cls: 'title', text: 'Alumni'}),
            div({cls: 'separator'}),
            alumniGrid
        );
        
        
    }
    
    
    return {init}
};
PeoplePage().init();
