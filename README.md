#OPTIMIZELY POLL FOR DELAYED CONTENT:

The pollForDelayedContent() helper function is an alternative solution to some of the approaches listed here: https://help.optimizely.com/hc/en-us/articles/200457495.  
It will be able to be used as many times as it's needed within an experiment or variation. When the Optimizely snippet is implemented correctly, it should provide a way to eliminate all content flashing.
The function allows for a an "options" element, to allow for more flexibility as well.
Feel free to file a ticket at optimizely.com/support with any feedback or questions - as the comments on this page will not be responded to.

##SIMPLE USAGE EXAMPLE:
######This does not use the optional options object to specify selectorToHide, timeoutInSeconds, or intervalInMilliseconds, causing them to default to hide the no timeout and 50 milliseconds.

```
/* _optimizely_evaluate=force */
window.pollForDelayedContent("body > h1.header-image", function() {
  $("body > h1.header-image").html("New Header");
  $("body > h1.header-image").css("color", "#0081ba");
});
/* _optimizely_evaluate=safe */
```

##ADVANCED USAGE EXAMPLE:
######This uses the optional options object to specify selectorToHide, unhideDelayInMilliseconds, timeoutInSeconds, or intervalInMilliseconds. This will hide any .header-image elements until "body > h1.header-image" is added to the page - afterwords unhiding .header-image elements in 500 milliseconds. It will also set the timeout to 3 seconds and set polling to 100 milliseconds.

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

##PARAMETER CONTEXT:

@param {String} selectorToChange - The single element you want to change and hide *
@param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
@param {Object} options - (optional) The elements you want to change and hide
@param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
@param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
@param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
@param {Integer} options.intervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector". If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)

##IMPLEMENTATION INSTRUCTIONS:
######Add minified code below via these instructions.##

The minified code can either be added to Experiment JS or Project JS (for Enterprise subscriptions).
If you place it in Experiment JS, you must add the pollForDelayedContent() function definition within the "_optimizely_evaluate=force" comments
You can then call the window.pollForDelayedContent() function as many times as neceesary within the experiment variation's "< edit code >" section.
The window.pollForDelayedContent() function in the "< edit code >" section must also be wrapped in the "_optimizely_evaluate=force" comments
Optiverse info on "_optimizely_evaluate=force" comments - https://help.optimizely.com/hc/en-us/articles/200040185-Force-variation-code-or-Experiment-JavaScript-to-execute-immediately-when-Optimizely-loads
