/**@example
 for(...) {
   perf.mark('start');
   // do something
   perf.mark('end');
   perf.measure('start', 'end');
 }
 const measures = perf.getMeasures('start', 'end');
 console.log(measures.name, measures.avg());
 > start -> end 48.01234567891011127*/
const perf = (() => {
    function mark(markName: string) {
        window.performance.mark(markName);
    }
    
    function measure(startMark: string, endMark: string) {
        window.performance.measure(`${startMark} -> ${endMark}`, startMark, endMark);
    }
    
    function measureMany(...startEndPairs: string[][]) {
        for (let [start, end] of startEndPairs)
            measure(start, end);
    }
    
    function getMeasures(startMark: string, endMark: string): PerformanceEntryList {
        const name = `${startMark} -> ${endMark}`;
        const measures = window.performance.getEntriesByName(name, 'measure');
        // @ts-ignore
        measures.avg = () => avg(measures.map(m => m.duration));
        // @ts-ignore
        measures.name = name;
        return measures;
    }
    
    function getManyMeasures(...startEndPairs: string[][]): PerformanceEntryList[] {
        const manyMeasures = [];
        for (let [start, end] of startEndPairs)
            manyMeasures.push(getMeasures(start, end));
        return manyMeasures;
    }
    
    return {measureMany, getManyMeasures, getMeasures, measure, mark};
    
})();
