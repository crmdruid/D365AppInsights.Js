var TestException;
(function (TestException) {
    function executeTest() {
        try {
            doSomethingNotDefined();
        }
        catch (e) {
            D365AppInsights.writeException(e, "ExceptionTest", AI.SeverityLevel.Error, null, null);
        }
    }
    TestException.executeTest = executeTest;
    function unhandledExceptionTest() {
        doSomethingElseNotDefined();
    }
})(TestException || (TestException = {}));