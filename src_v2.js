/**
  * Things to consider:
  *
  * 1. This code has been tested in a lot of scenarios and it seems to be working very well. It's worth testing in the wild after a bit more testing from others.
  * 2. Given that intervalInMilliseconds is the one option that only applies to the polling version, I updated it to pollingIntervalInMilliseconds
  * - Any better option names than pollingIntervalInMilliseconds?
  * 3. Is it ok to use method in options.method? Wondering if it's a reserved word in JS
  * 4. Given the widespread availability of DOM Mutation Observers, I wonder if the pollingIntervalInMilliseconds option is even needed
  * - Thinking about if there are any other options we can clean up for simplicity
 */

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
 * PARAMETER CONTEXT:
 *
 * @param {String} selectorToChange - The single element you want to change and hide *
 * @param {Function} changeFn - The code, passed in through a funtion that you want to run when the "selector" is found - (e.g. function(){$("body > h1.header-image").html("New Header"); $("body > h1.header-image").css("color", "#0081ba");})
 * @param {Object} options - (optional) The elements you want to change and hide
 * @param {Boolean} options.repeat - (optional) When set to true, this code will continue to modify new page elements that match the selectorToChange paramter. This works best for browsers that support DOM Mutation Observers, but can also work with the recursive timeout polling.
 * @param {Integer} options.timeoutInSeconds - (optional) Time in seconds this function will take to "timeout" or stop trying. If this argument is not specified, the interval will not timeout - (e.g. 2)
 * @param {String} options.selectorToHide - (optional)  The element to hide until the delayed element is changed.
 * @param {Integer} options.unhideDelayInMilliseconds - (optional) Time in milliseconds before selectorToChange (or options.selectorToHide if provided) is unhidden - after changeFn runs. If this argument is not specified, the timeout is 0 - (e.g. 500)
 * @param {Integer} options.pollingIntervalInMilliseconds - (optional) Time in milliseconds between interval polls for "selector" when using the recursive timeout polling option. If this argument is not specified, the interval poll will be set up 50 milliseconds - (e.g. 100)
 * @param {String} options.method - (optional) If "POLL", recursive timeout polling will be used, overriding the default functionality. If not provided, the code will default to using DOM Mutation Observers if available in the browser and fallback on recursive timeout polling.
 *
 * GLOBAL ABANDON FUNCTION:
 *
 * When called, the _waitForDelayedContent.stop() function will stop all instances of the waitForDelayedContent() function.
 * You can use _waitForDelayedContent.start() if you want to later use waitForDelayedContent().
 *
 * IMPLEMENTATION INSTRUCTIONS: Minify and add code below via this link and instructions. (via http://jscompress.com/)
 *
 * The minified code can either be added to Experiment JS or Project JS (for Enterprise subscriptions).
 * If you place it in Experiment JS, you must add the waitForDelayedContent() function definition within the "_optimizely_evaluate=force" comments
 * You can then call the window.waitForDelayedContent() function as many times as neceesary within the experiment variation's "< edit code >" section.
 * The window.waitForDelayedContent() function in the "< edit code >" section must also be wrapped in the "_optimizely_evaluate=force" comments
 * Optiverse info on "_optimizely_evaluate=force" comments - https://help.optimizely.com/hc/en-us/articles/200040185-Force-variation-code-or-Experiment-JavaScript-to-execute-immediately-when-Optimizely-loads
 */

/**
 * UNMINIFIED CODE:
 */

/* _optimizely_evaluate=force */
var waitForDelayedContent = function(selectorToChange, changeFn, options) {
  /* This function will stop all instances of waitForDelayedContent() */
  window._waitForDelayedContent = {
    start : function() {
      window._waitForDelayedContent.running = true;
    },
    stop : function() {
      window._waitForDelayedContent.running = false;
    },
    running : true
  }
  /* Default info */
  var startTime = (+new Date());
  var elementWasChanged = "optlyTagged_" + startTime;
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  /* Options configuration */
  var options = options || {};
  var repeat = options.repeat || null;
  var timeout = options.timeoutInSeconds * 1000 || null;
  var selectorToChange = selectorToChange + ":not([" + elementWasChanged + "])";
  var selectorToHide = options.selectorToHide || selectorToChange;
  var unhideDelay = options.unhideDelayInMilliseconds || 0;
  var interval = options.pollingIntervalInMilliseconds || 50;
  var method = options.method || "DOM";
  /* Adds an atribute to replaceWith(). If the repeat option is used, this modifies the CSS Selecotrs in changeFn() */
  eval("var changeFn = " + changeFn.toString().replace(/\$\(["'](.*)["']\)\.replaceWith\((["']<\w*)\W{0}/g, '$("$1").replaceWith($2 ' + elementWasChanged));
  repeat ? eval("var changeFn = " + changeFn.toString().replace(/\$\(["'](.*)["']\)\./g, '$("$1'+ ":not([" + elementWasChanged + "])" +'").')) : null;
  /* Function that hides original content and returns a function to unhide it */
  var hideContent = function(selector) {
    var selector = selector;
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
  /* DOM MutationObserver */
  if(MutationObserver && method !== "POLL") {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        /* Override and timeout checker */
        var now = (+new Date());
        if (!_waitForDelayedContent.running || timeout && now - startTime > timeout) {
          observer.disconnect();
          unhideContent();
          $("*").removeAttr(elementWasChanged)
        }
        if(typeof(mutation.addedNodes[0]) !== "undefined" && mutation.addedNodes[0] == $(selectorToChange)[0]) {
          window.mutation = mutation;
          /* If repeat option is set to true, observer will not be disconnected */
          if(repeat) {
            changeFn();
            $(selectorToHide).attr(elementWasChanged, "");
          } else {
            observer.disconnect();
            changeContent();
          }
        }
      });
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  /* Recursive Timeout */
  } else {
    var pollForElement = function () {
      var now = (+new Date());
      if ($(selectorToChange).length) {
        /* If repeat option is set to true, pollForElement() will be called again */
        if(repeat) {
          changeFn();
          $(selectorToHide).attr(elementWasChanged, "");
          setTimeout(pollForElement, interval);
        } else {
          changeContent();
        }
      /* Override and timeout checker */
      } else if (!_waitForDelayedContent.running || timeout && now - startTime > timeout) {
        unhideContent();
        $("*").removeAttr(elementWasChanged)
      } else {
        setTimeout(pollForElement, interval);
      }
    }
    pollForElement();
  }
}
/* _optimizely_evaluate=safe */

/**
 * DEBUG CODE FOR ADDING ELEMENTS TO PAGE ON DEMAND - The code below will work on http://www.derekehammond.com/public/jQuery-Experiments
 */

$(document).keydown(function(e) {
  if(e.keyCode == 37) { // Left arrow
      $("#a h2").after("<p class='test'>.text ORIGINAL</p>")
  } else if(e.keyCode == 39) { // Right arrow
      $("#a h2").after("<p id='test'>#test ORIGINAL</p>")
  } else if(e.keyCode == 38) { // Up arrow
    $(".test:eq(0)").html(".text Don't Change")
    $("#b > h2").html("Don't Change")
  } else if(e.keyCode == 40) { // Down arrow
    $("#test").html("#text Don't Change")
  }
});

/**
 * USAGE EXAMPLES:
 */

waitForDelayedContent(".test", function() {
  $(".test").html(".text CHANGED");
  $("body").css({"background":"#000"});
  $("#b").replaceWith('<div id="b" class="block left"> <h2>Changed</h2> <a href="info.html"><img src="image.jpg" alt=""></a> </div>');
  $("#a > h2").html("TEST RUN")
},{
  // selectorToHide: "body",
  // timeoutInSeconds: 10,
  // unhideDelayInMilliseconds: 500,
  // pollingIntervalInMilliseconds: 1,
  // method: "POLL",
  repeat: true,
});

waitForDelayedContent("#test", function() {
  $("#test").html("#text CHANGED");
},{
  // selectorToHide: "body",
  // timeoutInSeconds: 10,
  // unhideDelayInMilliseconds: 500,
  // pollingIntervalInMilliseconds: 1,
  method: "POLL",
  repeat: true,
});
