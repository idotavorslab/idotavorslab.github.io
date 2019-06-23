const ResearchPage = () => {
    async function sayHi() {
        console.log('hi from ResearchPage');
        let myRequest = new Request('main/research/research.json', {
            method: "GET",
            headers: { 'Content-Type': 'text/json' }
        });
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
    return { sayHi };
};
//# sourceMappingURL=research.js.map