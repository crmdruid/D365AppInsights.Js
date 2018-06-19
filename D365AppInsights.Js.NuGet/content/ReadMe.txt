D365AppInsights.Js


Getting started:
1. Replace "Your AI Instrumentation Key" with your actual Application Insights instrumentation key in jlattimer.d365appinsights_x.x.x(.min).js (or minified version)
2. Create a web resoruce(s) for jlattimer.d365appinsights_x.x.x(.min).js and upload the file contents
3. Include the jlattimer.d365appinsights_x.x.x(.min).js web resource on the form where logging is desired
4. Create an OnLoad handler for jlattimer.d365appinsights_x.x.x(.min).js which executes the "D365AppInsights.startLogging" function
5. Optionally include configuration in JSON format (cut and paste values below including curly braces into OnLoad parameters), all are optional so you only need to include the items you want to change from the default

Optional configuration (passed to OnLoad handler as JSON)
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


For examples: 
https://github.com/jlattimer/D365AppInsights.Js/wiki/Examples


Making modifications and compiling:
1. Install @types/xrm from npm: https://www.npmjs.com/package/@types/xrm
2. Make changes to jlattimer.d365appinsights_x.x.x.ts or potentially ai.init.js
3. It is recommended that ai.init.js and the output from jlattimer.d365appinsights_x.x.x.ts be combined into a single file (ai.init.js on top) for deployment as both are required


Included files:
/scripts
   ai.init.js - automatically downloads and initializes main Application Insights script from CDN, slight modification from original version provided by Microsoft - INSTRUMENTATION KEY is inserted here
   ai.1.0.xx.d.ts - TypeScript definition for main Application Insights script provided by Microsoft (Microsoft.ApplicationInsights.TypeScript)
   ai.1.0.xx.js - main Application Insights script provided by Microsoft in case you want to package and avoid CDN use (Microsoft.ApplicationInsights.JavaScript)
jlattimer.d365appinsights_x.x.x.ts - base TypeScript code for D365 implementation
jlattimer.d365appinsights_x.x.x.js - JavaScript file that needs to be included in D365 to enable Application Inisghts functionality, it combines the TypeScript output with ai.init.js - INSTRUMENTATION KEY is inserted here


Additional information can be found on the GitHub site:
https://github.com/jlattimer/D365AppInsights.Js