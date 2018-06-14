# D365AppInsights.Js
## Dynamics 365/CE Application Insights logging for JavaScript/TypeScript

This contains the minified, unminified, map, TypeScript, and TypeScript definition files needed to implement Azure Application Insights logging as well as the content from the original Microsoft implementation.   

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

Build Status:  ![Build status](https://jlattimer.visualstudio.com/_apis/public/build/definitions/361a4432-eb0a-46be-bead-c7412245eeae/26/badge)

https://www.nuget.org/packages/JLattimer.D365AppInsights.Js/

*This is only marked as prerelease because it takes dependencies on 2 Microsoft libraries that are versioned in such a way that they show up in NuGet as prerelease. NuGet currently forbids packaging prerelease dependencies with non-prerelease packages.*
