MTK Static Maps
===

What is it?
---

2 things:
 1. a small bit of javascript to take the same query string parameters as given to the Google Static Maps API and render a map using the BBC's Mapping ToolKit.
 2. a tiny Sinatra service to proxy the map to a screenshot tool and to cache the results. This should mean that for every unique URL requested, it will only need to be generated once.
 
