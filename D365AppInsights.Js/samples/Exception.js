function ExceptionTest() {

    try {

        doSomethingNotDefined();

    } catch (e) {
        AiFormLogger.writeException(e, "ExceptionTest", AI.SeverityLevel.Error, null, null);
    }

}

function UnhandledExceptionTest() {

    //Unhandled exceptions are not currently logged (this appears to be a bug)

    doSomethingElseNotDefined();

}