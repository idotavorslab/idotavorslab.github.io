const ContactPage = () => {
    async function init() {
        console.log('ContactPage.init()');
        
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
                elem({tag: 'h2', text: 'Visit'}),
                // htmlToElement(await fetchText(`main/contact/${data.visit.icon}`)),
                paragraph({cls: 'subtitle', text: 'Address'}),
                anchor({href: data.visit.link}).html(data.visit.address).target("_blank")
            );
        
        const call = div({cls: 'call'})
            
            .append(
                elem({tag: 'h2', text: 'Call'}),
                // htmlToElement(await fetchText(`main/contact/${data.call.icon}`)),
                paragraph({cls: 'subtitle', text: data.call.hours}),
                anchor({text: data.call.phone, href: `tel:${data.call.phone}`}).target("_blank")
            );
        
        const email = div({cls: 'email'})
            .append(
                elem({tag: 'h2', text: 'Email'}),
                // htmlToElement(await fetchText(`main/contact/${data.email.icon}`)),
                anchor({text: data.email.address, href: `mailto:${data.email.address}`}).target("_blank")
            );
        
        const contactFlex = div({id: 'contact_flex'})
            .append(
                visit,
                call,
                email
            );
        
        
        let map = elem({tag: 'iframe'})
            .id('contact_map')
            .attr({
                frameborder: "0",
                allowfullscreen: "",
                src: data.map
            });
        Home.empty().class('contact-page');
        await WindowElem.promiseLoaded();
        if (MOBILE)
            Home.append(contactFlex);
        else
            Home.append(
                map,
                contactFlex
            );
        
    }
    
    return {init}
};
