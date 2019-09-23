const ContactPage = () => {
    async function init() {
        const address = 'Sackler Bldg, Room #631 Tel Aviv University, Tel Aviv-Yafo, Israel';
        const grid = div({ id: 'contact_grid' })
            .append(div({ cls: 'visit' })
            .append(elem({ tag: 'h1', text: 'Visit' }), img({ src: 'main/contact/Home_font_awesome.svg' }), paragraph({ cls: 'subtitle', text: 'Address' }), anchor({ href: `https://goo.gl/maps/wmR4cYfhDRwgM1m59`, text: address }).target("_blank")), div({ cls: 'call' })
            .append(elem({ tag: 'h1', text: 'Call' }), img({ src: 'main/contact/Phone_font_awesome.svg' }), paragraph({ cls: 'subtitle', text: "9am - 17pm Su - Th" }), anchor({ text: '(+972)3-6406980', href: `tel:(+972)3-6406980` }).target("_blank")), div({ cls: 'email' })
            .append(elem({ tag: 'h1', text: 'Email' }), img({ src: 'main/contact/Envelope_alt_font_awesome.svg' }), anchor({
            text: 'idotavor@tauex.tau.ac.il',
            href: `mailto:idotavor@tauex.tau.ac.il`
        }).target("_blank")));
        Home.empty().append(grid, elem({ tag: 'iframe' })
            .id('contact_iframe')
            .attr({
            frameborder: "0",
            allowfullscreen: "",
            src: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d844.8119449796943!2d34.8055412!3d32.11661!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d496e45f48b8b%3A0xc263bdfe4d2d0a80!2sSackler%20Interdepartmental%20Core%20Facility!5e0!3m2!1sen!2sil!4v1569246056843!5m2!1sen!2sil"
        }));
    }
    return { init };
};
//# sourceMappingURL=contact.js.map