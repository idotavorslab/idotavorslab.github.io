const ResearchPage = () => {
    interface Article extends Div {
        title: Div;
    }
    
    async function init(selectedIndex?: number) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchJson('main/research/research.json', "no-cache");
        // console.log('ResearchPage data', data);
        const articles: Article[] = [];
        let emptied = false;
        type TResearchData = { image: string, text: string, circle?: boolean }[];
        for (let [i, [title, {image, text, circle}]] of Object.entries(Object.entries(<TResearchData>data))) {
            // @ts-ignore
            let articleCls = i % 2 == 0 ? '' : 'reverse';
            let imgCls = circle !== undefined ? 'circle' : '';
            // let pHtml = `<span class="bold">${text.slice(0, text.indexOf('.') + 1)}</span>${text.slice(text.indexOf('.') + 1)}`;
            let article = div({cls: `article ${articleCls}`})
                .cacheAppend({
                    title: elem({tag: 'h1', text: title}),
                    text: paragraph({cls: "text"}).html(text),
                    img: img({src: `main/research/${image}`, cls: imgCls})
                    
                });
            articles.push(article as Article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.append(article);
        }
        // console.log('ResearchPage done for loop');
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({behavior: "smooth", block: "center"});
            await wait(howFar * 1000);
            
            selectedArticle.title.addClass('highlighted');
            await wait(600);
            selectedArticle.title.removeClass('highlighted');
            
            
        }
        
        
    }
    
    
    return {init}
};
