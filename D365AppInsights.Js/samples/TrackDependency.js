function DependencyTest() {

    var req = new XMLHttpRequest();
    req.open("GET", "https://httpbin.org/delay/2?test=1", true);
    req.setRequestHeader("Accept", "application/json");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);

            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };

    AiFormLogger.trackDependencyTime(req, "DependencyTest");
    req.send();

}