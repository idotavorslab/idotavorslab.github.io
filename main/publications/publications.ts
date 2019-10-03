const PublicationsPage = () => {
    class Publication extends Div {
        year: number;
        
        constructor(title: string, year: number, creds: string, mag: string, thumbnail: string, link: string) {
            super({cls: 'publication'});
            
            function _openLink(): void {
                if (link.includes('http') || link.includes('www'))
                    window.open(link);
                else // local
                    window.open(`main/publications/${link}`)
            }
            
            function _getPdfText(_link: string): string {
                const ext = _link.split('.').reverse()[0].toLowerCase();
                if (ext === "pdf")
                    return ext;
                return "↗";
                
            }
            
            
            this.year = year;
            this.cacheAppend({
                thumb: img({src: `main/publications/${thumbnail}`, cls: "thumbnail"}),
                content: div({cls: "content-div"}).cacheAppend({
                    title: div({text: title, cls: "publication-title"}),
                    creds: span({text: creds, cls: "creds"}),
                    year: span({text: ` (${year})`, cls: "year"}),
                    mag: div({text: mag, cls: "mag"}),
                }),
                pdf: div({cls: 'pdf-div'})
                    .text(_getPdfText(link)) // ext
                
            }).pointerdown(_openLink);
            
        }
    }
    
    async function init() {
        
        console.log('PublicationsPage init');
        type TPublicationData = { selected: string[], publications: TMap<{ year: number, creds: string, mag: string, thumbnail: string, link: string }> };
        const {selected: selectedData, publications: publicationsData} = await fetchDict<TPublicationData>('main/publications/publications.json');
        // console.log('PublicationsPage data:', JSON.parstr({selectedData, publicationsData}));
        const publications: Publication[] = [];
        const selected: Publication[] = [];
        // ***  vars from json
        // **  Populate selected: Publication[] from selectedData
        for (let title of selectedData) {
            let {year, creds, mag, thumbnail, link} = publicationsData[title];
            selected.push(new Publication(title, year, creds, mag, thumbnail, link));
        }
        
        // **  Populate publications: Publication[] from publicationsData
        for (let [title, {year, creds, mag, thumbnail, link}] of dict(publicationsData).items()) {
            publications.push(new Publication(title, year, creds, mag, thumbnail, link));
        }
        
        
        // **  Group publications by year
        const yearToPublication: TMap<[Publication]> = {};
        for (let publication of publications) {
            if (publication.year in yearToPublication) {
                yearToPublication[publication.year].push(publication);
            } else {
                yearToPublication[publication.year] = [publication];
            }
        }
        // ***  HTML from vars
        const years: BetterHTMLElement[] = [];
        
        // **  Create div.year from selected
        const selectedPublicationsElem = div({cls: 'year'}).append(
            div({cls: 'title-and-minimize-flex'}).append(
                span({cls: 'year-title'}).text('Selected Publications'),
            ),
        );
        
        for (let publication of selected) {
            selectedPublicationsElem.append(publication)
        }
        years.push(selectedPublicationsElem);
        
        
        // **  Create div.year's from publications
        for (let year of Object.keys(yearToPublication).reverse()) { // 2019, 2018, 2016
            years.push(div({cls: 'year'}).append(
                div({cls: 'title-and-minimize-flex'}).append(
                    span({cls: 'year-title'}).text(year),
                ),
                ...yearToPublication[year],
            ))
        }
        
        const publicationsContainer = div({id: "publications_container"}).append(
            ...years,
        );
        Home.empty().class('publications-page').append(publicationsContainer);
        
        
    }
    
    
    return {init}
};
