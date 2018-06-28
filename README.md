## Dynamics 365/CE Application Insights logging for JavaScript/TypeScript

This contains the minified, unminified, map, TypeScript, and TypeScript definition files needed to implement Azure Application Insights logging as well as the content from the original Microsoft implementation.   

[See the wiki for additional details & examples](https://github.com/jlattimer/D365AppInsights.Js/wiki)

Supported telemetry types:
* Trace 
* Event 
* Metric
  * Page load duration (custom metric implementation) 
  * Method execution duration (custom metric implementation) 
* Dependency 
* Exception 
* PageView 

Default D365 Specific Custom Dimensions:
* User Id  
* Entity Name 
* Entity Id 
* Form type 
* Form name
* OrganizationName 
* Organization version
* Source (JavaScript)

Configurations:
* Application Insights logging endpoint 
* Application Insights instrumentation key
* Disable trace tracking 
* Disable exception tracking 
* Disable dependency tracking 
* Disable metric tracking 
* Disable event tracking 
* Disable page view tracking 
* Disable page load duration tracking 
* Percentage of traces logged 
* Percentage of exceptions logged 
* Percentage of dependencies logged 
* Percentage of metrics logged 
* Percentage of events logged 
* Percentage of page views logged 
* Percentage of page load durations logged 
* Debug mode
* Disable default Ajax tracking 
* Max Ajax calls per view logged

Build Status:  ![Build status](https://jlattimer.visualstudio.com/_apis/public/build/definitions/06ce8222-9dda-4377-9d93-63cc2e555086/29/badge)

https://www.nuget.org/packages/JLattimer.D365AppInsights.Js/
