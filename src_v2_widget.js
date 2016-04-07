/**
  * V2 CODE FOR WIDGET:
  *
  * Things to consider:
  *
  * 1. This code has been tested in a lot of scenarios and it seems to be working very well. It's worth testing in the wild after a bit more testing from others.
  * 2. Given that intervalInMilliseconds is the one option that only applies to the polling version, I updated it to pollingIntervalInMilliseconds
  * - Any better option names than pollingIntervalInMilliseconds?
  * 3. Is it ok to use method in options.method? Wondering if it's a reserved word in JS
  * 4. Given the widespread availability of DOM Mutation Observers, I wonder if the pollingIntervalInMilliseconds option is even needed
  * - Thinking about if there are any other options we can clean up for simplicity
  * 5. Don't use Eval(), use new Function() instead
  * 6. Consider any cons of using Optimizely Utils from here: https://gist.github.com/circAssimilate/8e84fc0e87edef9b39e3
  *
  *
  * DOM MUTATION OBSERVERS vs RECURSIVE TIMEOUT POLLING:
  *
  * By default, the code below will detect whether or not the browser allos for DOM Mutation Observers, and use that performance efficient way to hide and change page elements.
  * If DOM Mutation Observers aren't available, the code will fallback to recursive timeout polling. This is less performant and uses a recursive JavaScript setTimeout().
  *
  * IMPLEMENTATION INSTRUCTIONS: Minify and add code below via this link and instructions. (via http://jscompress.com/)
  *
  * GLOBAL ABANDON FUNCTION:
  *
  * When called, the _waitForDelayedContent.stop() function will stop all instances of the waitForDelayedContent() function.
  * You can use _waitForDelayedContent.start() if you want to later use waitForDelayedContent().
  *
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
   };
   /* Default info */
   var startTime = (+new Date());
   var elementWasChanged = "optlyTagged_" + startTime;
   var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
   /* Options configuration */
   var options = options || {};
   var repeat = options.repeat || null;
   if(repeat == "false") {
     repeat = null;
   } else if (repeat == "true") {
     repeat = true;
   }
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
   };
   var unhideContent = hideContent(selectorToHide);
   var changeContent = function() {
     changeFn();
     setTimeout(unhideContent, unhideDelay);
   };
   /* DOM MutationObserver */
   if(MutationObserver && method !== "POLL") {
     var observer = new MutationObserver(function(mutations) {
       mutations.forEach(function(mutation) {
         /* Override and timeout checker */
         var now = (+new Date());
         if (!_waitForDelayedContent.running || timeout && now - startTime > timeout) {
           observer.disconnect();
           unhideContent();
           $("*").removeAttr(elementWasChanged);
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
         $("*").removeAttr(elementWasChanged);
       } else {
         setTimeout(pollForElement, interval);
       }
     };
     pollForElement();
   }
 };


 console.log("Wait For Delayed Content // widget.selectorToChange:", widget.selectorToChange);
 console.log("Wait For Delayed Content // widget.changeFn:", widget.changeFn);
 console.log("Wait For Delayed Content // widget.unhideDelayInMilliseconds:", widget.unhideDelayInMilliseconds);
 console.log("Wait For Delayed Content // widget.repeat:", widget.repeat);
 console.log("Wait For Delayed Content // widget.timeoutInSeconds:", widget.timeoutInSeconds);
 console.log("Wait For Delayed Content // widget.unhideDelayInMilliseconds:", widget.unhideDelayInMilliseconds);
 console.log("Wait For Delayed Content // widget.pollingIntervalInMilliseconds:", widget.pollingIntervalInMilliseconds);
 console.log("Wait For Delayed Content // widget.method:", widget.method);

 waitForDelayedContent(widget.selectorToChange, new Function(widget.changeFn),{
   repeat: widget.repeat,
   selectorToHide: widget.selectorToHide,
   timeoutInSeconds: widget.timeoutInSeconds,
   unhideDelayInMilliseconds: widget.unhideDelayInMilliseconds,
   pollingIntervalInMilliseconds: widget.pollingIntervalInMilliseconds,
   method: widget.method,
 });

 /* _optimizely_evaluate=safe */

/**
 * USE THIS WIDGET ON PERSONALIZATION CAMPAIGN 5539050231 BY VISITING http://www.derekehammond.com/public/jQuery-Experiments AND PRESSING THE LEFT AND RIGHT ARROWS
 */
