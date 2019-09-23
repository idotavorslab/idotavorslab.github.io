const ContactPage = () => {
    async function init() {
        const grid = div({id: 'contact_grid'})
            .append(
                div({cls: 'visit'})
                    .append(
                        elem({tag: 'h1', text: 'Visit'}),
                        paragraph({cls: 'subtitle', text: 'Address'}),
                        paragraph({
                            cls: 'text',
                            text: 'Sherman Bldg, Room #421 Tel Aviv University, Tel Aviv-Yafo, Israel'
                        })
                    ),
                div({cls: 'call'})
                    .append(
                        elem({tag: 'h1', text: 'Call'}),
                        paragraph({cls: 'subtitle', text: "9am - 17pm Su - Th"}),
                        paragraph({cls: 'text', text: '(+972)3-6406980'})
                    ),
                div({cls: 'email'})
                    .append(
                        elem({tag: 'h1', text: 'Email'}),
                        paragraph({cls: 'text', text: 'idotavor@tauex.tau.ac.il'})
                    )
            );
        Home.empty().append(
            grid
        )
    }
    
    return {init}
};
