const ResearchPage = () => {
    interface Article extends Div {
        title: Div;
    }
    
    async function init(selectedIndex?: number) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchJson('main/research/research.json');
        const articles: Article[] = [];
        let emptied = false;
        type TResearchData = { image: string, text: string, circle?: boolean }[];
        for (let [i, [title, {image, text, circle}]] of Object.entries(Object.entries(<TResearchData>data))) {
            // @ts-ignore
            let articleCls = i % 2 == 0 ? '' : 'reverse';
            let imgCls = circle === true ? 'circle' : '';
            let imgElem: BetterHTMLElement;
            let cachedImage = CacheDiv[`research.${image}`];
            if (cachedImage !== undefined) {
                imgElem = cachedImage.removeAttr('hidden');
                console.log('research | cachedImage isnt undefined:', cachedImage);
            } else {
                console.log('research | cachedImage IS undefined:', cachedImage);
                let src;
                if (image.includes('http') || image.includes('www')) {
                    src = image;
                } else {
                    src = `main/research/${image}`;
                }
                imgElem = img({src});
            }
            imgElem.class(imgCls);
            let article = div({cls: `article ${articleCls}`})
                .cacheAppend({
                    title: elem({tag: 'h1', text: title}),
                    text: paragraph({cls: "text"}).html(text),
                    img: imgElem
                    
                });
            articles.push(article as Article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.class('research-page').append(article);
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
