var TestMetric;
(function (TestMetric) {
    function executeTest() {
        D365AppInsights.writeMetric("Custom Metric: Measurement", 5, 1);
        D365AppInsights.writeMetric("Custom Metric: Aggregate", 15, 3, 0, 30);
    }
    TestMetric.executeTest = executeTest;
})(TestMetric || (TestMetric = {}));