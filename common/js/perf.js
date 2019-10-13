const perf = (() => {
    function mark(markName) {
        window.performance.mark(markName);
    }
    function measure(startMark, endMark) {
        window.performance.measure(`${startMark} -> ${endMark}`, startMark, endMark);
    }
    function measureMany(...startEndPairs) {
        for (let [start, end] of startEndPairs)
            measure(start, end);
    }
    function getMeasures(startMark, endMark) {
        const name = `${startMark} -> ${endMark}`;
        const measures = window.performance.getEntriesByName(name, 'measure');
        measures.avg = () => {
            let _durations = measures.map(m => m.duration);
            let _sum = _durations.reduce((a, b) => a + b);
            return _sum / _durations.length;
        };
        measures.name = name;
        return measures;
    }
    function getManyMeasures(...startEndPairs) {
        const manyMeasures = [];
        for (let [start, end] of startEndPairs)
            manyMeasures.push(getMeasures(start, end));
        return manyMeasures;
    }
    return { measureMany, getManyMeasures, getMeasures, measure, mark };
})();
