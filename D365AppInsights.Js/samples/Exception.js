function ExceptionTest() {

    try {

        doSomethingNotDefined();

    } catch (e) {
        AiFormLogger.writeException(e, "ExceptionTest", null, null, AI.SeverityLevel.Error);
    }

}

function UnhandledExceptionTest() {

    //Unhandled exceptions are not currently logged (this appears to be a bug)

    doSomethingElseNotDefined();

}