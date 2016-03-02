/**
 * OPTIMIZELY POLL FOR DELAYED CONTENT:
 *
 * The pollForDelayedContent() helper function is an alternative solution to some of the approaches listed here: https://help.optimizely.com/hc/en-us/articles/200457495.
 * It will be able to be used as many times as it's needed within an experiment or variation. When the Optimizely snippet is implemented correctly, it should provide a way to eliminate all content flashing.
 * The function allows for a an "options" element, to allow for more flexibility as well.
 * Feel free to file a ticket at optimizely.com/support with any feedback or questions - as the comments on this page will not be responded to.
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

/* _optimizely_evaluate=force */
window.pollForDelayedContent=function(e,n,t){var i=+new Date,o=50;t=t||{};var l=t.selectorToHide||e,d=t.unhideDelayInMilliseconds||0,s=1e3*t.timeoutInSeconds||null,a=t.intervalInMilliseconds||o,r=function(e){var n="optlyHide_"+ +new Date;return $("head").prepend("<style id='"+n+"' type='text/css'>"+e+" {visibility:hidden !important;}</style>"),function(){$("#"+n).remove()}},u=r(l),c=function(){n(),setTimeout(u,d)},v=function(){var n=+new Date;$(e).length?c():s&&n-i>s?u():setTimeout(v,a)};v()};
/* _optimizely_evaluate=safe */

/*
 * UNCOMPRESSED CODE - Using the minified code is recommended; but, please add via the instructions above.
 */

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
    if ($(selectorToChange).length) {
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
