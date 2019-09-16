const isIphone = window.clientInformation.userAgent.includes('iPhone');
const DocumentElem = elem({ htmlElement: document });
const Body = elem({ htmlElement: document.body });
const Home = elem({ id: 'home' });
const _Window = elem({ htmlElement: window });
console.log(JSON.parstr({
    hash: window.location.hash,
    pathname: window.location.pathname,
    location: window.location
}));
window.addEventListener("hashchange", (ev) => {
    console.log('hash change', ev);
});
//# sourceMappingURL=main.js.map