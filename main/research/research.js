const ResearchPage = () => {
    async function init(selectedIndex) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchDict('main/research/research.json');
        const articles = [];
        let emptied = false;
        for (let [i, [title, { image, text, circle }]] of enumerate(data.items())) {
            let articleCls = i % 2 == 0 ? '' : 'reverse';
            let imgCls = circle === true ? 'circle' : '';
            let imgElem;
            let cachedImage = CacheDiv[`research.${image}`];
            if (cachedImage !== undefined) {
                imgElem = cachedImage.removeAttr('hidden');
            }
            else {
                let src;
                if (image.includes('http') || image.includes('www')) {
                    src = image;
                }
                else {
                    src = `main/research/${image}`;
                }
                imgElem = img({ src });
            }
            imgElem.class(imgCls);
            let article = div({ cls: `article ${articleCls}` })
                .cacheAppend({
                title: elem({ tag: 'h1', text: title }),
                text: paragraph({ cls: "text" }).html(text),
                img: imgElem
            });
            articles.push(article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.class('research-page').append(article);
        }
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({ behavior: "smooth", block: "center" });
            await wait(howFar * 1000);
            selectedArticle.title.addClass('highlighted');
            await wait(600);
            selectedArticle.title.removeClass('highlighted');
        }
    }
    return { init };
};
