/**
 * V2 CODE:
 *
 * This code uses CSS stylesheets to hide elements before they are added to the page and recursive timeout polling to detect, change and unhide elements after they are added.
 * This code is in the process of being revamped as polling is less performant that DOM Mutation Observers.
 *
 * DOM MUTATION OBSERVERS vs RECURSIVE TIMEOUT POLLING:
 *
 * By default, the code below will detect whether or not the browser allos for DOM Mutation Observers, and use that performance efficient way to hide and change page elements.
 * If DOM Mutation Observers aren't available, the code will fallback to recursive timeout polling. This is less performant and uses a recursive JavaScript setTimeout().
 *
 * OPEN ISSUES:
 *
 * 1. Consider how .detach() iteracts with both versions below
 * 2. Consider if eval will work everywhere
 * 3. Consider adding START_TIME to the customTagName to allow removal when using waitForDelayedContent() multiple times
 * 4. Test test test for all the different use cases and any errors.
 *
 * PARAMETER CONTEXT:
 *
 * @param {String} selectorToChange - The single element you want to change and hide *
 * @param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
 * @param {Object} options - (optional) The elements you want to change and hide
 * @param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
 * @param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
 * @param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
 * @param {Integer} options.intervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector". If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)
 * @param {String} options.domMutationObserver - (optional) A boolean written as string (e.g. "false") If "false", recursive timeout polling will be used, overriding the default functionality. If not provided, the code will default to using DOM Mutation Observers if available in the browser and fallback on recursive timeout polling.
 * @param {Boolean} options.repeat - (optional) When set to true, this code will continue to modify new page elements that match the selectorToChange paramter. This works best for browsers that support DOM Mutation Observers, but can also work with the recursive timeout polling.
 * @param {String} options.customTagName - (optional) Will tag certain elements with this string for performance. If the repeat option is set to true, this will also be added to elements after changFn is ran on them, which prevents the code from being applied again. Only include alphanumeric characters, dashes and underscores in this string. If not provided, "optly-changed" will be used.
 *
 * IMPLEMENTATION INSTRUCTIONS: Add minified code below via these instructions. (via http://jscompress.com/)
 *
 * The minified code can either be added to Experiment JS or Project JS (for Enterprise subscriptions).
 * If you place it in Experiment JS, you must add the pollForDelayedContent() function definition within the "_optimizely_evaluate=force" comments
 * You can then call the window.pollForDelayedContent() function as many times as neceesary within the experiment variation's "< edit code >" section.
 * The window.pollForDelayedContent() function in the "< edit code >" section must also be wrapped in the "_optimizely_evaluate=force" comments
 * Optiverse info on "_optimizely_evaluate=force" comments - https://help.optimizely.com/hc/en-us/articles/200040185-Force-variation-code-or-Experiment-JavaScript-to-execute-immediately-when-Optimizely-loads
 */

/**
 * UNMINIFIED CODE (WIP):
 */

/* _optimizely_evaluate=force */
var waitForDelayedContent = function(selectorToChange, changeFn, options) {
  /* Default info */
  var START_TIME = (+new Date());
  var DEFAULT_INTERVAL = 50;
  options = options || {};
  var customTagName = options.customTagName || "optly-changed";
  var tagBuilder = function(tagName){
    return ":not([" + tagName + "])";
  }
  var excludedTags = tagBuilder(customTagName);
  var selectorToChange = selectorToChange + excludedTags;
  var selectorToHide = options.selectorToHide || selectorToChange;
  var unhideDelay = options.unhideDelayInMilliseconds || 0;
  var timeout = options.timeoutInSeconds * 1000 || null;
  var repeat = options.repeat || null;
  var domMutationObserver = options.domMutationObserver || "true";
  var interval = options.intervalInMilliseconds || DEFAULT_INTERVAL;

  // Replaces CSS Selecotrs with not attribute selectors and adds an atribute to replaceWith()
  fixReplaceWith = "var changeFn = " + changeFn.toString().replace(/\$\(["'](.*)["']\)\.replaceWith\((["']<\w*)\W{0}/g, '$("$1").replaceWith($2 ' + customTagName);
  eval(fixReplaceWith);
  if(repeat) {
    addTags = "var changeFn = " + changeFn.toString().replace(/\$\(["'](.*)["']\)\./g, '$("$1'+ excludedTags +'").');
    eval(addTags);
    // console.log(changeFn);
  }

  var hideContent = function(selector) {
    var selector = selector;
    var uniqueStyleID = "optlyHide_" + (+new Date());
    $("head").prepend("<style id='" + uniqueStyleID + "' type='text/css'>"+ selector + " {visibility:hidden !important;}</style>");
    return function() {
      $("#" + uniqueStyleID).remove();
      // $(selector).removeAttr(customTagName);
    };
  }
  var unhideContent = hideContent(selectorToHide);
  var changeContent = function() {
    changeFn();
    setTimeout(unhideContent, unhideDelay);
  }

  if((window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) && domMutationObserver == "true") {
    /* DOM MutationObserver */
    console.log("DOM MutationObserver");
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(typeof(mutation.addedNodes[0]) !== "undefined" && mutation.addedNodes[0] == $(selectorToChange)[0]) {
                window.mutation = mutation;
                if(repeat) {
                  changeFn();
                  $(selectorToHide).attr(customTagName, "");
                } else if (timeout && now - START_TIME > timeout) {
                  unhideContent();
                  observer.disconnect();
                } else {
                  changeContent();
                  observer.disconnect();
                }
            }
        });
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  } else {
    /* Recursive Timeout */
    console.log("Recursive Timeout");
    var pollForElement = function () {
      var now = (+new Date());
      if ($(selectorToChange).length) {
        if(repeat) {
          changeFn();
          $(selectorToHide).attr(customTagName, "");
          setTimeout(pollForElement, interval);
        } else {
          changeContent();
        }
      } else if (timeout && now - START_TIME > timeout) {
        unhideContent();
      } else {
        setTimeout(pollForElement, interval);
      }
    }
    pollForElement();
  }
}
/* _optimizely_evaluate=safe */


/**
 * DEBUG CODE FOR ADDING ELEMENTS TO PAGE ON DEMAND
 */

$("body").dblclick(function(){
  $("#a h2").after("<p class='test'>.text ORIGINAL</p>")
});

$("body").bind("keypress", function(){
  $("#a h2").after("<p id='test'>#test ORIGINAL</p>")
});

/**
 * USAGE EXAMPLES:
 */

waitForDelayedContent(".test", function() {
  $(".test").html(".text CHANGED");
  $("body").css({"background":"#000"});
  $("#b").replaceWith('<div id="b" class="block left"> <h2>Column B</h2> <a href="info.html"><img src="image.jpg" alt=""></a> </div>');
  $("#a > h2").html("TEST RUN")
  console.warn("test");
},{
  // selectorToHide: "body",
  // timeoutInSeconds: 5,
  // unhideDelayInMilliseconds: 500,
  // intervalInMilliseconds: 1,
  // domMutationObserver: "false",
  repeat: true,
  // customTagName : "other-tag",
});

waitForDelayedContent("#test", function() {
  $("#test").html("#text CHANGED");
},{
  // selectorToHide: "body",
  // timeoutInSeconds: 5,
  // unhideDelayInMilliseconds: 500,
  // intervalInMilliseconds: 1,
  domMutationObserver: "false",
  repeat: true,
  // customTagName : "other-tag",
});
