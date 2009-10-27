MTK Static Maps
===

What is it?
---

2 things:
 1. a small bit of javascript to take the same query string parameters as given to the Google Static Maps API and render a map using the BBC's Mapping ToolKit.
 2. a tiny Sinatra service to proxy the map to a screenshot tool and to cache the results. This should mean that for every unique URL requested, it will only need to be generated once.
 
Tests
---

ADD CENTER AND ZOOM TO END OF QUERY STRING OTHERWISE THE MARKERS DON'T APPEAR.

center=40.714728,-73.998672

center=40.714728,-73.998672&zoom=10&size=512x512&maptype=roadmap

center=40.714728,-73.998672&zoom=10&size=512x512&maptype=roadmap

center=40.714728,-73.998672&zoom=10&size=512x512&maptype=roadmap&markers=color:blue|label:S|40.702147,-74.015794

http://localhost/Projects/mtk-static-maps/src/html/test.html?size=512x512&maptype=roadmap&markers=color:blue|label:S|40.702147,-74.015794&markers=color:green|label:G|40.711614,-74.012318&markers=color:red|label:C|40.718217,-73.998284&sensor=false&key=MAPS_API_KEY&center=40.714728,-73.998672&zoom=10