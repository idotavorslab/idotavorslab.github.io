const ResearchPage = () => {
    async function sayHi() {
        
        console.log('hi from ResearchPage');
        let myRequest = new Request('main/research/research.json', {
            method: "GET",
            // credentials: "same-origin",
            // mode: "cors",
            headers: {'Content-Type': 'text/json'}
        });
        /* let myHeaders = new Headers();
         myHeaders.append('Content-Type', 'text/json');
         
         const myInit = {
             method: 'GET',
             headers: myHeaders,
             mode: 'cors',
             cache: 'default'
         };
        */
        fetch(myRequest)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP error, status = ' + response.status);
                }
                debugger;
                return response.blob();
            })
            .then(function (response) {
                debugger;
            });
        
    }
    
    
    return {sayHi}
};
