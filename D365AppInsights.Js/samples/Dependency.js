﻿var TestDependency;
(function (TestDependency) {
    function executeTest() {
        D365AppInsights.writeDependency("Test", "Some Method", 100, true, 0);
    }
    TestDependency.executeTest = executeTest;
})(TestDependency || (TestDependency = {}));