const ContactPage = () => {
    async function init() {
        const data = await fetchJson("main/contact/contact.json");
        const visit = div({cls: 'visit'})
            .append(
                elem({tag: 'h1', text: 'Visit'}),
                img({src: 'main/contact/home-simple.svg'}),
                paragraph({cls: 'subtitle', text: 'Address'}),
                anchor({href: data.visit.link, text: data.visit.address}).target("_blank")
            );
        
        const call = div({cls: 'call'})
            
            .append(
                elem({tag: 'h1', text: 'Call'}),
                img({src: 'main/contact/phone.svg'}),
                paragraph({cls: 'subtitle', text: data.call.hours}),
                anchor({text: data.call.phone, href: `tel:${data.call.phone}`}).target("_blank")
            );
        
        const email = div({cls: 'email'})
            .append(
                elem({tag: 'h1', text: 'Email'}),
                img({src: 'main/contact/envelope.svg'}),
                anchor({
                    text: data.email,
                    href: `mailto:${data.email}`
                }).target("_blank")
            );
        
        const grid = div({id: 'contact_grid'})
            .append(
                visit,
                call,
                email
            );
        
        const form = elem({tag: 'iframe', text: "Loading"})
            .id('contact_form')
            .attr({
                frameborder: "0",
                allowfullscreen: "",
                marginheight: "0",
                marginwidth: "0",
                src: data.form
            });
        let map = elem({tag: 'iframe'})
            .id('contact_map')
            .attr({
                frameborder: "0",
                allowfullscreen: "",
                src: data.map
            });
        Home.empty().class('contact-page').append(
            grid,
            form,
            map
        )
    }
    
    return {init}
};
