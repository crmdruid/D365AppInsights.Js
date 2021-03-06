﻿/// <reference path="node_modules/@types/xrm/index.d.ts" />
/// <reference path="scripts/ai.1.0.18-build01843.d.ts" />

namespace D365AppInsights {
    var enableDebug: boolean = false;
    var props: Object;
    var disablePageviewTracking: boolean = false;
    var percentLoggedPageview: number = 100;
    var disablePageLoadTimeTracking: boolean = false;
    var percentLoggedPageLoadTime: number = 100;
    var disableTraceTracking: boolean = false;
    var percentLoggedTrace: number = 100;
    var disableExceptionTracking: boolean = false;
    var percentLoggedException: number = 100;
    var disableDependencyTracking: boolean = false;
    var percentLoggedDependency: number = 100;
    var disableMetricTracking: boolean = false;
    var percentLoggedMetric: number = 100;
    var disableEventTracking: boolean = false;
    var percentLoggedEvent: number = 100;
    var targetPage: any = window;

    /**
     * Configures and enables logging to Application Insights.
     * @param   {any} [config] The configuration JSON 
     */
    export function startLogging(config?: any) {
        if (config)
            setConfigOptions(config);

        // Capture PageView start
        if (!disablePageviewTracking)
            var pageViewStart = performance.now();

        if (/ClientApiWrapper\.aspx/i.test(window.location.pathname)) {
            targetPage = window.parent;
            if (enableDebug)
                console.log("DEBUG: Application Insights page target: window.parent");
        }

        var formName = Xrm.Page.ui.formSelector.getCurrentItem().getLabel();

        // Custom implementation of Pageview to avoid duplicate events being 
        // recorded likely due to CRM/D365 already implementing AI which currently
        // has poor support for multiple AI accounts
        if (log("PageviewTracking", disablePageviewTracking, percentLoggedPageview)) {
            (window as any).addEventListener("beforeunload",
                () => {
                    const envelope = createPageViewEnvelope(formName, pageViewStart);

                    if (navigator.sendBeacon) {
                        navigator.sendBeacon((window as any).appInsights.config.endpointUrl, JSON.stringify(envelope));
                        if (enableDebug)
                            console.log("DEBUG: Application Insights logged Pageview via Beacon");
                    } else {
                        // IE doesn't support Beacon - use sync XHR w/ delay instead
                        // Need slight delay to ensure PageView gets sent
                        var waitMs = 100; // Miliseconds wait
                        var futureTime = (new Date()).getTime() + waitMs;

                        sendPageViewRequest(envelope);

                        // Delay
                        while ((new Date()).getTime() < futureTime) { }
                    }
                },
                false);
        }

        props = {};
        props["entityId"] = Xrm.Page.data.entity.getId().substr(1, 36);
        props["entityName"] = Xrm.Page.data.entity.getEntityName();
        props["formType"] = getFormTypeName(Xrm.Page.ui.getFormType());
        props["formName"] = formName;
        props["orgName"] = Xrm.Page.context.getOrgUniqueName();
        props["orgVersion"] = Xrm.Page.context.getVersion();
        props["source"] = "JavaScript";

        if (!(window as any).appInsights.queue)
            (window as any).appInsights.queue = [];

        (window as any).appInsights.queue.push(() => {
            (window as any).appInsights.context.addTelemetryInitializer(envelope => {
                const telemetryItem = envelope.data.baseData;
                // Add CRM specific properties to every request
                telemetryItem.properties = combineProps(telemetryItem.properties, props);
            });
        });

        (window as any).appInsights.setAuthenticatedUserContext(Xrm.Page.context.getUserId().substr(1, 36), null, false);

        writePageLoadMetric();
    }

    function setConfigOptions(config: any) {
        try {
            if (config.hasOwnProperty("enableDebug")) { //default false
                enableDebug = config.enableDebug;
                (window as any).appInsights.config.enableDebug = config.enableDebug;
            }

            if (config.hasOwnProperty("disablePageviewTracking")) //default false
                disablePageviewTracking = config.disablePageviewTracking;

            if (config.hasOwnProperty("percentLoggedPageview")) //default 100
                percentLoggedPageview = getLogPercent(config.percentLoggedPageview);

            if (config.hasOwnProperty("disablePageLoadTimeTracking")) //default false
                disablePageLoadTimeTracking = config.disablePageLoadTimeTracking;

            if (config.hasOwnProperty("percentLoggedPageLoadTime")) //default 100
                percentLoggedPageLoadTime = getLogPercent(config.percentLoggedPageLoadTime);

            if (config.hasOwnProperty("disableExceptionTracking")) { //default false
                disableExceptionTracking = config.disableExceptionTracking;
                (window as any).appInsights.config.disableExceptionTracking = config.disableExceptionTracking;
            }

            if (config.hasOwnProperty("percentLoggedException")) //default 100
                percentLoggedException = getLogPercent(config.percentLoggedException);

            if (config.hasOwnProperty("disableAjaxTracking")) //default false
                (window as any).appInsights.config.disableAjaxTracking = config.disableAjaxTracking;

            if (config.hasOwnProperty("maxAjaxCallsPerView")) //default 500, -1 = all
                (window as any).appInsights.config.maxAjaxCallsPerView = config.maxAjaxCallsPerView;

            if (config.hasOwnProperty("disableTraceTracking")) { //default false
                disableTraceTracking = config.disableTraceTracking;
                (window as any).appInsights.config.disableTraceTracking = config.disableTraceTracking;
            }

            if (config.hasOwnProperty("percentLoggedTrace")) //default 100
                percentLoggedTrace = getLogPercent(config.percentLoggedTrace);

            if (config.hasOwnProperty("disableDependencyTracking")) { //default false
                disableDependencyTracking = config.disableDependencyTracking;
                (window as any).appInsights.config.disableDependencyTracking = config.disableDependencyTracking;
            }

            if (config.hasOwnProperty("percentLoggedDependency")) //default 100
                percentLoggedDependency = getLogPercent(config.percentLoggedDependency);

            if (config.hasOwnProperty("disableMetricTracking")) { //default false
                disableMetricTracking = config.disableMetricTracking;
                (window as any).appInsights.config.disableMetricTracking = config.disableMetricTracking;
            }

            if (config.hasOwnProperty("percentLoggedMetric")) //default 100
                percentLoggedMetric = getLogPercent(config.percentLoggedMetric);

            if (config.hasOwnProperty("disableEventTracking")) { //default false
                disableEventTracking = config.disableEventTracking;
                (window as any).appInsights.config.disableEventTracking = config.disableEventTracking;
            }

            if (config.hasOwnProperty("percentLoggedEvent")) //default 100
                percentLoggedEvent = getLogPercent(config.percentLoggedEvent);

            if (enableDebug) {
                console.log("D365 Application Insights configuration:");
                console.log(`enableDebug: ${enableDebug}`);
                console.log(`disablePageviewTracking: ${disablePageviewTracking}`);
                console.log(`percentLoggedPageview: ${percentLoggedPageview}`);
                console.log(`disablePageLoadTimeTracking: ${disablePageLoadTimeTracking}`);
                console.log(`percentLoggedPageLoadTime: ${percentLoggedPageLoadTime}`);
                console.log(`disableExceptionTracking: ${disableExceptionTracking}`);
                console.log(`percentLoggedException: ${percentLoggedException}`);
                console.log(`disableAjaxTracking: ${(window as any).appInsights.config.disableAjaxTracking}`);
                console.log(`maxAjaxCallsPerView: ${(window as any).appInsights.config.maxAjaxCallsPerView}`);
                console.log(`disableTraceTracking: ${disableTraceTracking}`);
                console.log(`percentLoggedTrace: ${percentLoggedTrace}`);
                console.log(`disableDependencyTracking: ${disableDependencyTracking}`);
                console.log(`percentLoggedDependency: ${percentLoggedDependency}`);
                console.log(`disableMetricTracking: ${disableMetricTracking}`);
                console.log(`percentLoggedMetric: ${percentLoggedMetric}`);
                console.log(`disableEventTracking: ${disableEventTracking}`);
                console.log(`percentLoggedEvent: ${percentLoggedEvent}`);
            }

        } catch (error) {
            console.log(`DEBUG: Application Insights error parsing configuration parameters: ${error}`);
        }
    }

    function writePageLoadMetric() {
        if (!log("PageLoadTime", disablePageLoadTimeTracking, percentLoggedPageLoadTime))
            return;

        if (isNaN(targetPage.performance.timing.loadEventEnd) || isNaN(targetPage.performance.timing.responseEnd) ||
            targetPage.performance.timing.loadEventEnd === 0 || targetPage.performance.timing.responseEnd === 0) {
            setTimeout(() => {
                writePageLoadMetric();
            }, 50);
        } else {
            const pageLoad = targetPage.performance.timing.loadEventEnd - targetPage.performance.timing.responseEnd;

            writeMetric("PageLoad", pageLoad, 1, null, null, null);
            if (enableDebug) {
                console.log(`DEBUG: Application Insights logged metric: PageLoad time: ${pageLoad}ms`);
            }
        }
    }

    /**
     * Writes an event message to Application Insights.
     * @param   {string} name The event name
     * @param   {any} [newProps] Additional properties as object - { key: value }
     * @param   {any} [measurements] The associated measurements as object - { key: value }
     */
    export function writeEvent(name: string, newProps: any, measurements: any) {
        if (!log("Event", disableEventTracking, percentLoggedEvent))
            return;

        (window as any).appInsights.trackEvent(name, newProps, measurements);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged event: ${name}`);
    }

    /**
     * Writes a metric message to Application Insights.
     * @param   {string} name The metric name
     * @param   {number} value The metric value
     * @param   {number} [sampleCount] The count of metrics being logged (default = 1)
     * @param   {number} [min] The minimum value of metrics being logged (default = value)
     * @param   {number} [max] The maximum value of metrics being logged (default = value)
     * @param   {any} [newProps] Additional properties as object - { key: value }
     */
    export function writeMetric(name: string, value: number, sampleCount?: number, min?: number, max?: number, newProps?: any) {
        if (!log("Metric", disableMetricTracking, percentLoggedMetric))
            return;

        if (!sampleCount)
            sampleCount = 1;

        if (!min)
            min = value;

        if (!max)
            max = value;

        (window as any).appInsights.trackMetric(name, value, sampleCount, min, max, newProps);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged metric: ${name}`);
    }

    /**
     * Writes exception data to Application Insights.
     * @param   {Error} exception The exception being logged
     * @param   {string} [handledAt] The location the exception
     * @param   {AI.SeverityLevel} [severityLevel] The severity level (default = Error)
     * @param   {any} [newProps] Additional properties as object - { key: value }
     * @param   {any} [measurements] The associated measurements as object - { key: value }
     */
    export function writeException(exception: Error, handledAt?: string, severityLevel?: AI.SeverityLevel, newProps?: any, measurements?: any) {
        if (!log("Exception", disableExceptionTracking, percentLoggedException))
            return;

        if (!severityLevel)
            severityLevel = AI.SeverityLevel.Error;

        (window as any).appInsights.trackException(exception, handledAt, newProps, measurements, severityLevel);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged exception: ${exception.name}`);
    }

    /**
     * Writes a trace message to Application Insights.
     * @param   {string} message The trace message
     * @param   {AI.SeverityLevel} [severityLevel] The severity level (default = Information)
     * @param   {any} [newProps] Additional properties as object - { key: value }
     */
    export function writeTrace(message: string, severityLevel?: AI.SeverityLevel, newProps?: any) {
        if (!log("Trace", disableTraceTracking, percentLoggedTrace))
            return;

        if (!severityLevel)
            severityLevel = AI.SeverityLevel.Information;

        (window as any).appInsights.trackTrace(message, newProps, severityLevel);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged trace: ${message}`);
    }

    /**
     * Writes a dependency message to Application Insights.
     * @param   {string} name The dependency name or absolute URL
     * @param   {string} method The HTTP method (only logged with URL)
     * @param   {number} duration The duration in ms of the dependent event
     * @param   {boolean} success Set to true if the dependent event was successful, false otherwise
     * @param   {number} resultCode The result code, HTTP or otherwise
     * @param   {string} pathName The path part of the absolute URL (default = determined from name)
     * @param   {any} [newProps] Additional properties as object - { key: value }
     */
    export function writeDependency(name: string, method: string, duration: number, success: boolean, resultCode: number, pathName?: string, newProps?: any) {
        if (!log("Dependency", disableDependencyTracking, percentLoggedDependency))
            return;

        const id = Microsoft.ApplicationInsights.Util.newId();
        if (!pathName) {
            if (isUrl(name))
                pathName = getUrlPath(name);
        }

        (window as any).appInsights.trackDependency(id, method, name, pathName, duration, success, resultCode, newProps, null);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged dependency: ${id}: ${duration}`);
    }

    /**
     * Writes a metric message logging method execution duration to Application Insights.
     * @param   {string} methodName The method name
     * @param   {number} start The start time using performance.now()
     * @param   {number} end The end time using performance.now()
     */
    export function writeMethodTime(methodName: string, start: number, end: number) {
        const time = end - start;
        writeMetric(`Method Time: ${methodName}`, time, null, null, null);
        if (enableDebug)
            console.log(`DEBUG: Application Insights logged method time: ${methodName}: ${time}ms`);
    }

    /**
     * Attaches to a XHR request and writes a dependency message to Application Insights.
     * @param   {string} methodName The method name
     * @param   {number} start The start time using performance.now()
     * @param   {number} end The end time using performance.now()
     */
    export function trackDependencyTime(req: any, methodName: string) {
        // ReSharper disable once Html.EventNotResolved
        req.addEventListener("loadstart", () => {
            getStartTime(req, methodName);
        });

        req.addEventListener("load", () => {
            getEndTime(req, true);
        });

        req.addEventListener("error", () => {
            getEndTime(req, false);
        });
    }

    function getStartTime(req: any, methodName: string) {
        req.t0 = performance.now();
        req.methodName = methodName;
    }

    function getEndTime(req: any, success: boolean) {
        const duration = performance.now() - req.t0;
        writeDependency(req._method, req._url, duration, success, req.status, `${req._url}`,
            { methodName: req.methodName, mode: getMode(req._async) });
    }

    function combineProps(props: any, newProps: any) {
        if (!props && !newProps)
            return null;
        if (newProps === null)
            return props;
        if (props === null)
            return newProps;

        for (let attrname in newProps) {
            if (newProps.hasOwnProperty(attrname))
                props[attrname] = newProps[attrname];
        }

        return props;
    }

    function getIdFromCookie(cookieName: string) {
        const cookie = Microsoft.ApplicationInsights.Util.getCookie(cookieName);
        if (!cookie)
            return null;
        const params = cookie.split(Microsoft.ApplicationInsights.Context.User.cookieSeparator);
        if (params.length < 1)
            return null;

        return params[0];
    }

    function isUrl(name: string): boolean {
        return /^[a-z][a-z0-9+.-]*:/.test(name);
    }

    function getUrlPath(url: string): string {
        const urlElem = document.createElement("a");
        urlElem.href = url;

        return urlElem.pathname;
    }

    function sendPageViewRequest(envelope: Microsoft.Telemetry.Envelope): void {
        var req = new XMLHttpRequest();
        req.open("POST", (window as any).appInsights.config.endpointUrl, false); // Doesn't work if async
        req.setRequestHeader("Accept", "*/*");
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    if (enableDebug)
                        console.log("DEBUG: Application Insights logged Pageview via XHR");
                }
            }
        }
        req.send(JSON.stringify(envelope));
    }

    function createPageViewEnvelope(formName: string, pageViewStart: number): Microsoft.Telemetry.Envelope {
        var iKey = (window as any).appInsights.config.instrumentationKey;
        var envelope = new Microsoft.Telemetry.Envelope;
        envelope.time = new Date().toISOString();
        envelope.iKey = iKey;
        envelope.name = `Microsoft.ApplicationInsights.${iKey.replace("-", "")}.Pageview`;

        envelope.data = { baseType: "PageviewData" };
        envelope.tags["ai.session.id"] = getIdFromCookie("ai_session");
        envelope.tags["ai.device.id"] = (window as any).appInsights.context.device.id;
        envelope.tags["ai.device.type"] = (window as any).appInsights.context.device.type;
        envelope.tags["ai.internal.sdkVersion"] = (window as any).appInsights.context.internal.sdkVersion;
        envelope.tags["ai.user.id"] = getIdFromCookie(Microsoft.ApplicationInsights.Context.User.userCookieName);
        envelope.tags["ai.user.authUserId"] = (window as any).appInsights.context.user.authenticatedId.toUpperCase();
        envelope.tags["ai.operation.id"] = (window as any).appInsights.context.operation.id;
        envelope.tags["ai.operation.name"] = (window as any).appInsights.context.operation.name;
        envelope.data.baseType = "PageviewData";
        var pageViewData = new AI.PageViewData;
        pageViewData.ver = 2;
        pageViewData.name = formName;
        pageViewData.url = Microsoft.ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeUrl((window as any).location.href);
        var d = performance.now() - pageViewStart;
        pageViewData.duration = Microsoft.ApplicationInsights.Util.msToTimeSpan(d);
        envelope.data["baseData"] = pageViewData;
        envelope.data["baseData"]["properties"] = Microsoft.ApplicationInsights.Telemetry.Common.DataSanitizer.sanitizeProperties(props);
        envelope.data["baseData"]["measurements"] = null;
        envelope.data["baseData"]["id"] = Microsoft.ApplicationInsights.Util.newId();

        return envelope;
    }

    function getFormTypeName(formType: number): string {
        switch (formType) {
            case 1:
                return "Create";
            case 2:
                return "Update";
            case 3:
                return "Read Only";
            case 4:
                return "Disabled";
            case 6:
                return "Bulk Edit";
            default:
                return "Undefined";
        }
    }

    function getMode(mode: boolean): string {
        return (mode) ? "Asynchronous" : "Synchronous";
    }

    function getLogPercent(value: any): number {
        if (isNaN(value)) {
            if (enableDebug)
                console.log(`DEBUG: Log percent: ${value} is not a number`);
            return 100;
        }

        let x = parseFloat(value);
        x = Math.round(x);

        if (x < 1)
            return 0;
        if (x > 100)
            return 100;
        return x;
    }

    function log(type: string, disable: boolean, threshold: number): boolean {
        if (disable) {
            if (enableDebug)
                console.log(`DEBUG: Application Insights ${type} not written: Disabled`);
            return false;
        }

        const shouldLog = inLogThreshold(threshold);
        if (!shouldLog) {
            if (enableDebug)
                console.log(`DEBUG: Application Insights ${type} not written: Threshold%: ${threshold}`);
            return false;
        }

        return true;
    }

    function inLogThreshold(threshold: number): boolean {
        if (threshold === 100)
            return true;
        if (threshold === 0)
            return false;

        const number = Math.floor(Math.random() * (101));
        return number <= threshold;
    }

    var xhrProto = XMLHttpRequest.prototype,
        origOpen = xhrProto.open;

    xhrProto.open = function (method, url, async) {
        this._url = url;
        this._method = method;
        this._async = async;
        return origOpen.apply(this, arguments);
    };
}