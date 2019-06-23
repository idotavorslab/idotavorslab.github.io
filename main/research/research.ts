const ResearchPage = () => {
    async function sayHi() {
        
        console.log('hi from ResearchPage');
        let myRequest = new Request('main/research/research.json');
        const data = await (await fetch(myRequest)).json();
        console.log(data);
        
        
    }
    
    
    return {sayHi}
};
