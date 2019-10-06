const ContactPage = () => {
    async function init() {
        function htmlToElement(html) {
            const template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
        
        type TContactData = {
            visit: { address: string, link: string, icon: string },
            call: { hours: string, phone: string, icon: string },
            email: { address: string, icon: string, }
            map: string,
            form: string
        };
        const data = await fetchDict<TContactData>("main/contact/contact.json");
        // let svg = await fetchText("main/contact/home-simple.svg");
        const visit = div({cls: 'visit'})
            .append(
                elem({tag: 'h1', text: 'Visit'}),
                htmlToElement(await fetchText(`main/contact/${data.visit.icon}`)),
                // div().css({backgroundImage: `url(main/contact/${data.visit.icon}`}),
                paragraph({cls: 'subtitle', text: 'Address'}),
                anchor({href: data.visit.link, text: data.visit.address}).target("_blank")
            );
        
        const call = div({cls: 'call'})
            
            .append(
                elem({tag: 'h1', text: 'Call'}),
                // div().css({backgroundImage: `url(main/contact/${data.call.icon}`}),
                htmlToElement(await fetchText(`main/contact/${data.call.icon}`)),
                paragraph({cls: 'subtitle', text: data.call.hours}),
                anchor({text: data.call.phone, href: `tel:${data.call.phone}`}).target("_blank")
            );
        
        const email = div({cls: 'email'})
            .append(
                elem({tag: 'h1', text: 'Email'}),
                // div().css({backgroundImage: `url(main/contact/${data.email.icon}`}),
                htmlToElement(await fetchText(`main/contact/${data.email.icon}`)),
                anchor({text: data.email.address, href: `mailto:${data.email.address}`}).target("_blank")
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
        );
        
    }
    
    return {init}
};
