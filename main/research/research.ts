const ResearchPage = () => {
    interface Article extends Elem {
        title: Div;
        content: Div;
    }
    
    async function init(selectedIndex?: number) {
        Navbar.select(Navbar.research);
        console.log({Navbar});
        // await TL.toAsync(Home.e, 0.03, {opacity: 0});
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        // Home.empty();
        console.log(data);
        const articles: Article[] = [];
        let emptied = false;
        for (let [title, {image, content}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .cacheAppend({
                    title: div({text: title, cls: "title"}),
                    content: div({text: content, cls: "content"}),
                })
                .css({backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${image}")`});
            articles.push(article as Article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.append(article);
        }
        // await TL.toAsync(Home.e, 0.03, {opacity: 1});
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({behavior: "smooth"});
            await wait(howFar * 1000);
            
            selectedArticle.title.addClass('highlighted');
            await wait(1500);
            selectedArticle.title.removeClass('highlighted');
            
            
        }
        
        
    }
    
    
    return {init}
};
