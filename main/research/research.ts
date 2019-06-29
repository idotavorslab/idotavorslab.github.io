const ResearchPage = () => {
    interface Article extends Elem {
        title: Div;
        content: Div;
    }
    
    async function init(selectedIndex?: number) {
        
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        Home.empty();
        console.log(data);
        const articles: Article[] = [];
        for (let [title, {image, content}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .cacheAppend({
                    title: div({text: title, cls: "title"}),
                    content: div({text: content, cls: "content"}),
                })
                .css({backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${image}")`});
            articles.push(article as Article);
            Home.append(article);
        }
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({behavior: "smooth"});
            await wait(howFar * 1000);
            /*
            for (let i = 0; i < 100; i++) {
                selectedArticle.title.css({
                    backgroundImage: `linear-gradient(0.75turn, rgba(0,0,0,${0.4 * i / 100}),rgba(0,0,0,0))`,
                });
                await wait(3);
            }
            for (let j = 0; j < 100; j++) {
                selectedArticle.title.css({
                    backgroundImage: `linear-gradient(0.75turn, rgba(0,0,0,${0.4 * (100 - j) / 100}),rgba(0,0,0,0) ${100 - j}%)`,
                });
                await wait(5);
            }
            selectedArticle.title.css({
                backgroundImage: null,
            });
            */
            // selectedArticle.content.addClass('highlighted');
            selectedArticle.title.addClass('highlighted');
            await wait(1500);
            // selectedArticle.content.removeClass('highlighted');
            selectedArticle.title.removeClass('highlighted');
            
            
        }
        
        
    }
    
    
    return {init}
};
