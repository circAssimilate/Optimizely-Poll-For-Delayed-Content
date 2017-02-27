/**
 * V1.1.0 CODE:
 *
 * This code uses CSS stylesheets to hide elements before they are added to the page and recursive timeout polling to detect, change and unhide elements after they are added.
 * This code is in the process of being revamped as polling is less performant that DOM Mutation Observers.
 *
 * SIMPLE USAGE EXAMPLE: this does not use the optional options object to specify selectorToHide, timeoutInSeconds, or intervalInMilliseconds, causing them to default to hide the no timeout and 50 milliseconds.
 *
 * /* _optimizely_evaluate=force */
/*  window.pollForDelayedContent("body > h1.header-image", function() {
 *    $("body > h1.header-image").html("New Header");
 *    $("body > h1.header-image").css("color", "#0081ba");
 *  });
 * /* _optimizely_evaluate=safe */
/*
 *
 * ADVANCED USAGE EXAMPLE: this uses the optional options object to specify selectorToHide, unhideDelayInMilliseconds, timeoutInSeconds, or intervalInMilliseconds.
 * This will hide any .header-image elements until "body > h1.header-image" is added to the page - afterwords unhiding .header-image elements in 500 milliseconds.
 * It will also set the timeout to 3 seconds and set polling to 100 milliseconds.
 *
 * /* _optimizely_evaluate=force */
/*  window.pollForDelayedContent("body > h1.header-image", function() {
 *   $("body > h1.header-image").html("New Header");
 *    $("body > h1.header-image").css("color", "#0081ba");
 *  }, {
 *    selectorToHide : '.header-image',
 *    unhideDelayInMilliseconds: 500 ,
 *    timeoutInSeconds : 5,
 *    intervalInMilliseconds : 100
 *  });
 * /* _optimizely_evaluate=safe */
/*
 *
 *
 * PARAMETER CONTEXT:
 *
 * @param {String} selectorToChange - The single element you want to change and hide *
 * @param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
 * @param {Object} options - (optional) The elements you want to change and hide
 * @param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
 * @param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
 * @param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
 * @param {Integer} options.intervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector". If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)
 *
 */

/*
 * IMPLEMENTATION INSTRUCTIONS: Add minified code below via these instructions. (via http://jscompress.com/)
 *
 * The minified code can either be added to Experiment JS or Project JS (for Enterprise subscriptions).
 * If you place it in Experiment JS, you must add the pollForDelayedContent() function definition within the "_optimizely_evaluate=force" comments
 * You can then call the window.pollForDelayedContent() function as many times as neceesary within the experiment variation's "< edit code >" section.
 * The window.pollForDelayedContent() function in the "< edit code >" section must also be wrapped in the "_optimizely_evaluate=force" comments
 * Optiverse info on "_optimizely_evaluate=force" comments - https://help.optimizely.com/hc/en-us/articles/200040185-Force-variation-code-or-Experiment-JavaScript-to-execute-immediately-when-Optimizely-loads
 */

/* pollForDelayedContent function v1.1.0 */
/* _optimizely_evaluate=force */
window.pollForDelayedContent=function(a,b,c){var d=+new Date,e=50;c=c||{};var f=c.selectorToHide||a,g=c.unhideDelayInMilliseconds||0,h=1e3*c.timeoutInSeconds||null,i=c.intervalInMilliseconds||e,j=function(a){var b="optlyHide_"+ +new Date;return $("head").prepend("<style id='"+b+"' type='text/css'>"+a+" {visibility:hidden !important;}</style>"),function(){$("#"+b).remove()}},k=j(f),l=function(){b(),setTimeout(k,g)},m=function(){var b=+new Date;$(a).length>=a.split(",").length?l():h&&b-d>h?k():setTimeout(m,i)};m()};
/* _optimizely_evaluate=safe */

/*
 * UNCOMPRESSED CODE - Using the minified code is recommended; but, please add via the instructions above.
 */

/* pollForDelayedContent function v1.1.0 */
/* _optimizely_evaluate=force */
window.pollForDelayedContent = function(selectorToChange, changeFn, options) {
  /* Default info for polling */
  var START_TIME = (+new Date());
  var DEFAULT_INTERVAL = 50;
  options = options || {};
  var selectorToHide = options.selectorToHide || selectorToChange;
  var unhideDelay = options.unhideDelayInMilliseconds || 0;
  var timeout = options.timeoutInSeconds * 1000 || null;
  var interval = options.intervalInMilliseconds || DEFAULT_INTERVAL;
  var hideContent = function(selector) {
    var uniqueStyleID = "optlyHide_" + (+new Date());
    $("head").prepend("<style id='" + uniqueStyleID + "' type='text/css'>"+ selector + " {visibility:hidden !important;}</style>");
    return function() {
      $("#" + uniqueStyleID).remove();
    };
  }
  var unhideContent = hideContent(selectorToHide);
  var changeContent = function() {
    changeFn();
    setTimeout(unhideContent, unhideDelay);
  }

  var pollForElement = function () {
    var now = (+new Date());
    if ($(selectorToChange).length >= selectorToChange.split(',').length) {
      changeContent();
    } else if (timeout && now - START_TIME > timeout) {
      unhideContent();
    } else {
      setTimeout(pollForElement, interval);
    }
  }
  pollForElement();
};
/* _optimizely_evaluate=safe */

/*
 * DEMO CODE - To see this function in action, copy from the "UNCOMPRESSED CODE" comment to the end of this file and paste it into the JavaScript Console while on any page with jQuery
 */

/* _optimizely_evaluate=force */
window.pollForDelayedContent(".test", function() {
  $(".test").html("Changed Element");
  $(".test").css("color", "white");
}, {
  selectorToHide : 'img',
  unhideDelayInMilliseconds: 500,
  timeoutInSeconds : 5,
  intervalInMilliseconds : 100
});
/* _optimizely_evaluate=safe */

$(".test").remove();
setTimeout(function(){
    $("body").prepend("<h1 class='test'>Original Element</h1>");
},2000);
