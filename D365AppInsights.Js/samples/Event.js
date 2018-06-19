var TestEvent;
(function (TestEvent) {
    function executeTest() {
        // This is also an example of sending custom measurements
        D365AppInsights.writeEvent("Button Click", null, { click: 1 });
    }
    TestEvent.executeTest = executeTest;
})(TestEvent || (TestEvent = {}));