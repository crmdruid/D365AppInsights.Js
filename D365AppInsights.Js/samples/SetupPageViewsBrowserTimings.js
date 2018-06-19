/*
  Add this function to form's OnLoad handler
  D365AppInsights.startLogging
 
  Pass this JSON string to the function and set values as needed

  {
	"enableDebug": true,
	"disablePageviewTracking": false,
    "percentLoggedPageview": 100,
	"disablePageLoadTimeTracking": false,
    "percentLoggedPageLoadTime": 100,
	"disableExceptionTracking": false,
    "percentLoggedException": 100,
	"disableAjaxTracking": true,
	"maxAjaxCallsPerView": 500,
	"disableTraceTracking": false,
    "percentLoggedTrace": 100,
	"disableDependencyTracking": false,
    "percentLoggedDependency": 100,
	"disableMetricTracking": false,
    "percentLoggedMetric": 100,
	"disableEventTracking": false,
    "percentLoggedEvent": 100
  }

*/

/*
 https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
 {
        "enableDebug": false,  //Turns on/off built in AI debug mode - default = false
        "disablePageviewTracking": false, //Turns on/off Pageview tracking - default = false
        "percentLoggedPageview": 100, //Percentage of Pageviews logged - default = 100
        "disablePageLoadTimeTracking": false, //Turns on/off metric recording page load duration - default = false
        "percentLoggedPageLoadTime": 100, //Percentage of page load durations logged - default = 100
        "disableExceptionTracking": false, //Turns on/off built in AI exception tracking and custom implementation - default = false
        "percentLoggedException": 100, //Percentage of exceptions logged - default = 100
        "disableAjaxTracking": true, //Turns on/off built in AI request tracking which logs all Ajax requests - default = true
        "maxAjaxCallsPerView": 500, //The max number of requests logged using the built in tracking - default = 100
        "disableTraceTracking": false, //Turns on/off custom implementation of trace tracking - default = false
        "percentLoggedTrace": 100, //Percentage of traces logged - default = 100
        "disableDependencyTracking": false, //Turns on/off custom implementation of manual dependency tracking - default = false
        "percentLoggedDependency": 100, //Percentage of manual dependencies logged - default = 100
        "disableMetricTracking": false, //Turns on/off custom implementation of metric tracking - default = false
        "percentLoggedMetric": 100, //Percentage of metrics logged - default = 100
        "disableEventTracking": false, //Turns on/off custom implementation of event tracking - default = false
        "percentLoggedEvent": 100 //Percentage of events logged - default = 100
   }
*/