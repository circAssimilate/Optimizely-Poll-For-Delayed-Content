#OPTIMIZELY WAIT FOR DELAYED CONTENT

The pollForDelayedContent() is a simple, efficient way to wait for dynamic content. It can be used with platforms like Optimizely, which alter dynamically created web content. Read more [here](https://help.optimizely.com/Troubleshoot_Problems/Fix_a_timing_issue).

These methods can be used as many times as they are needed within an experiment or variation. When the Optimizely snippet is implemented correctly, it should provide a way to eliminate all content flashing.
The function allows for a an "options" element, to allow for more flexibility as well.
While **Optimizely does not officially support or maintain this custom code**, feel free to file a ticket at optimizely.com/support with any feedback or questions.

###CONTRIBUTING TO THIS REPOSITORY:
When contributing and changing the core code, please update this Readme, the compressed code and "UNCOMPRESSED CODE" sections. You can compress via http://jscompress.com/ and replace the minified code.

###IMPLEMENTATION INSTRUCTIONS:
Add minified code below via these instructions.

- The minified code can either be added to Experiment JS or Project JS (for Enterprise subscriptions)
- If you place it in Experiment JS, you must add the pollForDelayedContent() function definition within the `_optimizely_evaluate=force` comments
- You can then call the window.pollForDelayedContent() function as many times as neceesary within the experiment variation's "< edit code >" section
- The window.pollForDelayedContent() function in the "< edit code >" section must also be wrapped in the `_optimizely_evaluate=force` comments
- [Optiverse info](https://help.optimizely.com/hc/en-us/articles/200040185-Force-variation-code-or-Experiment-JavaScript-to-execute-immediately-when-Optimizely-loads) on `_optimizely_evaluate=force` comments.

##V1 CODE:
This code uses CSS stylesheets to hide elements before they are added to the page and recursive timeout polling to detect, change and unhide elements after they are added. This code is in the process of being revamped as polling is less performant that DOM Mutation Observers.

###UNCOMPRESSED CODE:
View *src_v1.js* for this.

###COMPRESSED CODE:
```
/* pollForDelayedContent function v1.1.0 */
/* _optimizely_evaluate=force */
window.pollForDelayedContent=function(a,b,c){var d=+new Date,e=50;c=c||{};var f=c.selectorToHide||a,g=c.unhideDelayInMilliseconds||0,h=1e3*c.timeoutInSeconds||null,i=c.intervalInMilliseconds||e,j=function(a){var b="optlyHide_"+ +new Date;return $("head").prepend("<style id='"+b+"' type='text/css'>"+a+" {visibility:hidden !important;}</style>"),function(){$("#"+b).remove()}},k=j(f),l=function(){b(),setTimeout(k,g)},m=function(){var b=+new Date;$(a).length>=a.split(",").length?l():h&&b-d>h?k():setTimeout(m,i)};m()};
/* _optimizely_evaluate=safe */
```

###SIMPLE USAGE EXAMPLE:
This does not use the optional options object to specify selectorToHide, timeoutInSeconds, or intervalInMilliseconds, causing them to default to hide the no timeout and 50 milliseconds.

```
/* _optimizely_evaluate=force */
window.pollForDelayedContent("body > h1.header-image", function() {
  $("body > h1.header-image").html("New Header");
  $("body > h1.header-image").css("color", "#0081ba");
});
/* _optimizely_evaluate=safe */
```

###ADVANCED USAGE EXAMPLE:
This uses the optional options object to specify selectorToHide, unhideDelayInMilliseconds, timeoutInSeconds, or intervalInMilliseconds. This will hide any .header-image elements until "body > h1.header-image" is added to the page - afterwords unhiding .header-image elements in 500 milliseconds. It will also set the timeout to 3 seconds and set polling to 100 milliseconds.

```
/* _optimizely_evaluate=force */
window.pollForDelayedContent("body > h1.header-image", function() {
  $("body > h1.header-image").html("New Header");
  $("body > h1.header-image").css("color", "#0081ba");
}, {
  selectorToHide : '.header-image',
  unhideDelayInMilliseconds: 500 ,
  timeoutInSeconds : 5,
  intervalInMilliseconds : 100
});
/* _optimizely_evaluate=safe */
```

###V1 PARAMETER CONTEXT:
```
@param {String} selectorToChange - The single element you want to change and hide
@param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
@param {Object} options - (optional) The elements you want to change and hide
@param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
@param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
@param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
@param {Integer} options.intervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector". If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)
```

##V2 CODE
By default, the code below will detect whether or not the browser allows for DOM Mutation Observers, and use that performance efficient way to hide and change page elements.
If DOM Mutation Observers aren't available, the code will fallback to recursive timeout polling. This is less performant and uses a recursive JavaScript setTimeout().

###UNCOMPRESSED CODE:
View *src_v2.js* for this.

###COMPRESSED CODE:
View *src_v2.js* for this.

###V2 PARAMETER CONTEXT:
```
@param {String} selectorToChange - The single element you want to change and hide *
@param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
@param {Object} options - (optional) The elements you want to change and hide
@param {Boolean} options.repeat - (optional) When set to true, this code will continue to modify new page elements that match the selectorToChange paramter. This works best for browsers that support DOM Mutation Observers, but can also work with the recursive timeout polling.
@param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
@param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
@param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
@param {Integer} options.pollingIntervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector" when using the recursive timeout polling option. If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)
@param {String} options.method - (optional) If "POLL", recursive timeout polling will be used, overriding the default functionality. If not provided, the code will default to using DOM Mutation Observers if available in the browser and fallback on recursive timeout polling.
```
