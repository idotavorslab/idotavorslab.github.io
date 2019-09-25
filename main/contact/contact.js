const ContactPage = () => {
    async function init() {
        const data = await fetchJson("main/contact/contact.json");
        const visit = div({ cls: 'visit' })
            .append(elem({ tag: 'h1', text: 'Visit' }), img({ src: 'main/contact/Home_font_awesome.svg' }), paragraph({ cls: 'subtitle', text: 'Address' }), anchor({ href: data.visit.link, text: data.visit.address }).target("_blank"));
        const call = div({ cls: 'call' })
            .append(elem({ tag: 'h1', text: 'Call' }), img({ src: 'main/contact/Phone_font_awesome.svg' }), paragraph({ cls: 'subtitle', text: data.call.hours }), anchor({ text: data.call.phone, href: `tel:${data.call.phone}` }).target("_blank"));
        const email = div({ cls: 'email' })
            .append(elem({ tag: 'h1', text: 'Email' }), img({ src: 'main/contact/Envelope_alt_font_awesome.svg' }), anchor({
            text: data.email,
            href: `mailto:${data.email}`
        }).target("_blank"));
        const grid = div({ id: 'contact_grid' })
            .append(visit, call, email);
        Home.empty().class('contact-page').append(grid, elem({ tag: 'iframe' })
            .id('contact_iframe')
            .attr({
            frameborder: "0",
            allowfullscreen: "",
            src: data.map
        }));
    }
    return { init };
};
//# sourceMappingURL=contact.js.map