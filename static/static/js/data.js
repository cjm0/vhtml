import('lib/loadData.js')

/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */


;(function() {

    "use strict";

    //Declare root variable - window in the browser, global on the server
    var root = this,
        previous = root.Chart;

    //Occupy the global variable of Chart, and create a simple base class
    var Chart = function(context) {
        var chart = this;
        this.canvas = context.canvas;

        this.ctx = context;

        //Variables global to the chart
        var computeDimension = function(element, dimension) {
            if (element['offset' + dimension]) {
                return element['offset' + dimension];
            } else {
                return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
            }
        }

        var width = this.width = computeDimension(context.canvas, 'Width');
        var height = this.height = computeDimension(context.canvas, 'Height');

        // Firefox requires this to work correctly
        context.canvas.width = width;
        context.canvas.height = height;

        var width = this.width = context.canvas.width;
        var height = this.height = context.canvas.height;
        this.aspectRatio = this.width / this.height;
        //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
        helpers.retinaScale(this);

        return this;
    };
    //Globally expose the defaults to allow for user updating/changing
    Chart.defaults = {
        global: {
            // Boolean - Whether to animate the chart
            animation: true,

            // Number - Number of animation steps
            animationSteps: 60,

            // String - Animation easing effect
            animationEasing: "easeOutQuart",

            // Boolean - If we should show the scale at all
            showScale: true,

            // Boolean - If we want to override with a hard coded scale
            scaleOverride: false,

            // ** Required if scaleOverride is true **
            // Number - The number of steps in a hard coded scale
            scaleSteps: null,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            // Number - The scale starting value
            scaleStartValue: null,

            // String - Colour of the scale line
            scaleLineColor: "rgba(0,0,0,.1)",

            // Number - Pixel width of the scale line
            scaleLineWidth: 1,

            // Boolean - Whether to show labels on the scale
            scaleShowLabels: true,

            // Interpolated JS string - can access value
            scaleLabel: "<%=value%>",

            // Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
            scaleIntegersOnly: true,

            // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: false,

            // String - Scale label font declaration for the scale label
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Scale label font size in pixels
            scaleFontSize: 12,

            // String - Scale label font weight style
            scaleFontStyle: "normal",

            // String - Scale label font colour
            scaleFontColor: "#666",

            // Boolean - whether or not the chart should be responsive and resize when the browser does.
            responsive: false,

            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,

            // Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
            showTooltips: true,

            // Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
            customTooltips: false,

            // Array - Array of string names to attach tooltip events
            tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],

            // String - Tooltip background colour
            tooltipFillColor: "rgba(0,0,0,0.8)",

            // String - Tooltip label font declaration for the scale label
            tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip label font size in pixels
            tooltipFontSize: 14,

            // String - Tooltip font weight style
            tooltipFontStyle: "normal",

            // String - Tooltip label font colour
            tooltipFontColor: "#fff",

            // String - Tooltip title font declaration for the scale label
            tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip title font size in pixels
            tooltipTitleFontSize: 14,

            // String - Tooltip title font weight style
            tooltipTitleFontStyle: "bold",

            // String - Tooltip title font colour
            tooltipTitleFontColor: "#fff",

            // Number - pixel width of padding around tooltip text
            tooltipYPadding: 6,

            // Number - pixel width of padding around tooltip text
            tooltipXPadding: 6,

            // Number - Size of the caret on the tooltip
            tooltipCaretSize: 8,

            // Number - Pixel radius of the tooltip border
            tooltipCornerRadius: 6,

            // Number - Pixel offset from point x to tooltip edge
            tooltipXOffset: 10,

            // String - Template string for single tooltips
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

            // String - Template string for single tooltips
            multiTooltipTemplate: "<%= value %>",

            // String - Colour behind the legend colour block
            multiTooltipKeyBackground: '#fff',

            // Function - Will fire on animation progression.
            onAnimationProgress: function() {},

            // Function - Will fire on animation completion.
            onAnimationComplete: function() {}

        }
    };

    //Create a dictionary of chart types, to allow for extension of existing types
    Chart.types = {};

    //Global Chart helpers object for utility methods and classes
    var helpers = Chart.helpers = {};

    //-- Basic js utility methods
    var each = helpers.each = function(loopable, callback, self) {
            var additionalArgs = Array.prototype.slice.call(arguments, 3);
            // Check to see if null or undefined firstly.
            if (loopable) {
                if (loopable.length === +loopable.length) {
                    var i;
                    for (i = 0; i < loopable.length; i++) {
                        callback.apply(self, [loopable[i], i].concat(additionalArgs));
                    }
                } else {
                    for (var item in loopable) {
                        callback.apply(self, [loopable[item], item].concat(additionalArgs));
                    }
                }
            }
        },
        clone = helpers.clone = function(obj) {
            var objClone = {};
            each(obj, function(value, key) {
                if (obj.hasOwnProperty(key)) objClone[key] = value;
            });
            return objClone;
        },
        extend = helpers.extend = function(base) {
            each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {
                each(extensionObject, function(value, key) {
                    if (extensionObject.hasOwnProperty(key)) base[key] = value;
                });
            });
            return base;
        },
        merge = helpers.merge = function(base, master) {
            //Merge properties in left object over to a shallow clone of object right.
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift({});
            return extend.apply(null, args);
        },
        indexOf = helpers.indexOf = function(arrayToSearch, item) {
            if (Array.prototype.indexOf) {
                return arrayToSearch.indexOf(item);
            } else {
                for (var i = 0; i < arrayToSearch.length; i++) {
                    if (arrayToSearch[i] === item) return i;
                }
                return -1;
            }
        },
        where = helpers.where = function(collection, filterCallback) {
            var filtered = [];

            helpers.each(collection, function(item) {
                if (filterCallback(item)) {
                    filtered.push(item);
                }
            });

            return filtered;
        },
        findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
            // Default to start of the array
            if (!startIndex) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        },
        findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) {
            // Default to end of the array
            if (!startIndex) {
                startIndex = arrayToSearch.length;
            }
            for (var i = startIndex - 1; i >= 0; i--) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        },
        inherits = helpers.inherits = function(extensions) {
            //Basic javascript inheritance based on the model created in Backbone.js
            var parent = this;
            var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function() {
                return parent.apply(this, arguments);
            };

            var Surrogate = function() {
                this.constructor = ChartElement;
            };
            Surrogate.prototype = parent.prototype;
            ChartElement.prototype = new Surrogate();

            ChartElement.extend = inherits;

            if (extensions) extend(ChartElement.prototype, extensions);

            ChartElement.__super__ = parent.prototype;

            return ChartElement;
        },
        noop = helpers.noop = function() {},
        uid = helpers.uid = (function() {
            var id = 0;
            return function() {
                return "chart-" + id++;
            };
        })(),
        warn = helpers.warn = function(str) {
            //Method for warning of errors
            if (window.console && typeof window.console.warn == "function") console.warn(str);
        },
        amd = helpers.amd = (typeof define == 'function' && define.amd),
        //-- Math methods
        isNumber = helpers.isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        max = helpers.max = function(array) {
            return Math.max.apply(Math, array);
        },
        min = helpers.min = function(array) {
            return Math.min.apply(Math, array);
        },
        cap = helpers.cap = function(valueToCap, maxValue, minValue) {
            if (isNumber(maxValue)) {
                if (valueToCap > maxValue) {
                    return maxValue;
                }
            } else if (isNumber(minValue)) {
                if (valueToCap < minValue) {
                    return minValue;
                }
            }
            return valueToCap;
        },
        getDecimalPlaces = helpers.getDecimalPlaces = function(num) {
            if (num % 1 !== 0 && isNumber(num)) {
                return num.toString().split(".")[1].length;
            } else {
                return 0;
            }
        },
        toRadians = helpers.radians = function(degrees) {
            return degrees * (Math.PI / 180);
        },
        // Gets the angle from vertical upright to the point about a centre.
        getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x,
                distanceFromYCenter = anglePoint.y - centrePoint.y,
                radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


            var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

            //If the segment is in the top left quadrant, we need to add another rotation to the angle
            if (distanceFromXCenter < 0 && distanceFromYCenter < 0) {
                angle += Math.PI * 2;
            }

            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        },
        aliasPixel = helpers.aliasPixel = function(pixelWidth) {
            return (pixelWidth % 2 === 0) ? 0 : 0.5;
        },
        splineCurve = helpers.splineCurve = function(FirstPoint, MiddlePoint, AfterPoint, t) {
            //Props to Rob Spencer at scaled innovation for his post on splining between points
            //http://scaledinnovation.com/analytics/splines/aboutSplines.html
            var d01 = Math.sqrt(Math.pow(MiddlePoint.x - FirstPoint.x, 2) + Math.pow(MiddlePoint.y - FirstPoint.y, 2)),
                d12 = Math.sqrt(Math.pow(AfterPoint.x - MiddlePoint.x, 2) + Math.pow(AfterPoint.y - MiddlePoint.y, 2)),
                fa = t * d01 / (d01 + d12), // scaling factor for triangle Ta
                fb = t * d12 / (d01 + d12);
            return {
                inner: {
                    x: MiddlePoint.x - fa * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y - fa * (AfterPoint.y - FirstPoint.y)
                },
                outer: {
                    x: MiddlePoint.x + fb * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y + fb * (AfterPoint.y - FirstPoint.y)
                }
            };
        },
        calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val) {
            return Math.floor(Math.log(val) / Math.LN10);
        },
        calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly) {

            //Set a minimum step of two - a point at the top of the graph, and a point at the base
            var minSteps = 2,
                maxSteps = Math.floor(drawingSize / (textSize * 1.5)),
                skipFitting = (minSteps >= maxSteps);

            var maxValue = max(valuesArray),
                minValue = min(valuesArray);

            // We need some degree of seperation here to calculate the scales if all the values are the same
            // Adding/minusing 0.5 will give us a range of 1.
            if (maxValue === minValue) {
                maxValue += 0.5;
                // So we don't end up with a graph with a negative start value if we've said always start from zero
                if (minValue >= 0.5 && !startFromZero) {
                    minValue -= 0.5;
                } else {
                    // Make up a whole number above the values
                    maxValue += 0.5;
                }
            }

            var valueRange = Math.abs(maxValue - minValue),
                rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
                graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphRange = graphMax - graphMin,
                stepValue = Math.pow(10, rangeOrderOfMagnitude),
                numberOfSteps = Math.round(graphRange / stepValue);

            //If we have more space on the graph we'll use it to give more definition to the data
            while ((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
                if (numberOfSteps > maxSteps) {
                    stepValue *= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                    // Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
                    if (numberOfSteps % 1 !== 0) {
                        skipFitting = true;
                    }
                }
                //We can fit in double the amount of scale points on the scale
                else {
                    //If user has declared ints only, and the step value isn't a decimal
                    if (integersOnly && rangeOrderOfMagnitude >= 0) {
                        //If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
                        if (stepValue / 2 % 1 === 0) {
                            stepValue /= 2;
                            numberOfSteps = Math.round(graphRange / stepValue);
                        }
                        //If it would make it a float break out of the loop
                        else {
                            break;
                        }
                    }
                    //If the scale doesn't have to be an int, make the scale more granular anyway.
                    else {
                        stepValue /= 2;
                        numberOfSteps = Math.round(graphRange / stepValue);
                    }

                }
            }

            if (skipFitting) {
                numberOfSteps = minSteps;
                stepValue = graphRange / numberOfSteps;
            }

            return {
                steps: numberOfSteps,
                stepValue: stepValue,
                min: graphMin,
                max: graphMin + (numberOfSteps * stepValue)
            };

        },
        /* jshint ignore:start */
        // Blows up jshint errors based on the new Function constructor
        //Templating methods
        //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
        template = helpers.template = function(templateString, valuesObject) {

            // If templateString is function rather than string-template - call the function for valuesObject

            if (templateString instanceof Function) {
                return templateString(valuesObject);
            }

            var cache = {};

            function tmpl(str, data) {
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                    cache[str] = cache[str] :

                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached).
                    new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                        str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'") +
                        "');}return p.join('');"
                    );

                // Provide some basic currying to the user
                return data ? fn(data) : fn;
            }
            return tmpl(templateString, valuesObject);
        },
        /* jshint ignore:end */
        generateLabels = helpers.generateLabels = function(templateString, numberOfSteps, graphMin, stepValue) {
            var labelsArray = new Array(numberOfSteps);
            if (labelTemplateString) {
                each(labelsArray, function(val, index) {
                    labelsArray[index] = template(templateString, {
                        value: (graphMin + (stepValue * (index + 1)))
                    });
                });
            }
            return labelsArray;
        },
        //--Animation methods
        //Easing functions adapted from Robert Penner's easing equations
        //http://www.robertpenner.com/easing/
        easingEffects = helpers.easingEffects = {
            linear: function(t) {
                return t;
            },
            easeInQuad: function(t) {
                return t * t;
            },
            easeOutQuad: function(t) {
                return -1 * t * (t - 2);
            },
            easeInOutQuad: function(t) {
                if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
                return -1 / 2 * ((--t) * (t - 2) - 1);
            },
            easeInCubic: function(t) {
                return t * t * t;
            },
            easeOutCubic: function(t) {
                return 1 * ((t = t / 1 - 1) * t * t + 1);
            },
            easeInOutCubic: function(t) {
                if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
                return 1 / 2 * ((t -= 2) * t * t + 2);
            },
            easeInQuart: function(t) {
                return t * t * t * t;
            },
            easeOutQuart: function(t) {
                return -1 * ((t = t / 1 - 1) * t * t * t - 1);
            },
            easeInOutQuart: function(t) {
                if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
                return -1 / 2 * ((t -= 2) * t * t * t - 2);
            },
            easeInQuint: function(t) {
                return 1 * (t /= 1) * t * t * t * t;
            },
            easeOutQuint: function(t) {
                return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
            },
            easeInOutQuint: function(t) {
                if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
                return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
            },
            easeInSine: function(t) {
                return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
            },
            easeOutSine: function(t) {
                return 1 * Math.sin(t / 1 * (Math.PI / 2));
            },
            easeInOutSine: function(t) {
                return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
            },
            easeInExpo: function(t) {
                return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
            },
            easeOutExpo: function(t) {
                return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
            },
            easeInOutExpo: function(t) {
                if (t === 0) return 0;
                if (t === 1) return 1;
                if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
                return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
            },
            easeInCirc: function(t) {
                if (t >= 1) return t;
                return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
            },
            easeOutCirc: function(t) {
                return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
            },
            easeInOutCirc: function(t) {
                if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
                return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
            },
            easeInElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) return 0;
                if ((t /= 1) == 1) return 1;
                if (!p) p = 1 * 0.3;
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(1 / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            },
            easeOutElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) return 0;
                if ((t /= 1) == 1) return 1;
                if (!p) p = 1 * 0.3;
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(1 / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
            },
            easeInOutElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) return 0;
                if ((t /= 1 / 2) == 2) return 1;
                if (!p) p = 1 * (0.3 * 1.5);
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(1 / a);
                if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
            },
            easeInBack: function(t) {
                var s = 1.70158;
                return 1 * (t /= 1) * t * ((s + 1) * t - s);
            },
            easeOutBack: function(t) {
                var s = 1.70158;
                return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
            },
            easeInOutBack: function(t) {
                var s = 1.70158;
                if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
                return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
            },
            easeInBounce: function(t) {
                return 1 - easingEffects.easeOutBounce(1 - t);
            },
            easeOutBounce: function(t) {
                if ((t /= 1) < (1 / 2.75)) {
                    return 1 * (7.5625 * t * t);
                } else if (t < (2 / 2.75)) {
                    return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
                } else if (t < (2.5 / 2.75)) {
                    return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
                } else {
                    return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
                }
            },
            easeInOutBounce: function(t) {
                if (t < 1 / 2) return easingEffects.easeInBounce(t * 2) * 0.5;
                return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
            }
        },
        //Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimFrame = helpers.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
        })(),
        cancelAnimFrame = helpers.cancelAnimFrame = (function() {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                function(callback) {
                    return window.clearTimeout(callback, 1000 / 60);
                };
        })(),
        animationLoop = helpers.animationLoop = function(callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {

            var currentStep = 0,
                easingFunction = easingEffects[easingString] || easingEffects.linear;

            var animationFrame = function() {
                currentStep++;
                var stepDecimal = currentStep / totalSteps;
                var easeDecimal = easingFunction(stepDecimal);

                callback.call(chartInstance, easeDecimal, stepDecimal, currentStep);
                onProgress.call(chartInstance, easeDecimal, stepDecimal);
                if (currentStep < totalSteps) {
                    chartInstance.animationFrame = requestAnimFrame(animationFrame);
                } else {
                    onComplete.apply(chartInstance);
                }
            };
            requestAnimFrame(animationFrame);
        },
        //-- DOM methods
        getRelativePosition = helpers.getRelativePosition = function(evt) {
            var mouseX, mouseY;
            var e = evt.originalEvent || evt,
                canvas = evt.currentTarget || evt.srcElement,
                boundingRect = canvas.getBoundingClientRect();

            if (e.touches) {
                mouseX = e.touches[0].clientX - boundingRect.left;
                mouseY = e.touches[0].clientY - boundingRect.top;

            } else {
                mouseX = e.clientX - boundingRect.left;
                mouseY = e.clientY - boundingRect.top;
            }

            return {
                x: mouseX,
                y: mouseY
            };

        },
        addEvent = helpers.addEvent = function(node, eventType, method) {
            if (node.addEventListener) {
                node.addEventListener(eventType, method);
            } else if (node.attachEvent) {
                node.attachEvent("on" + eventType, method);
            } else {
                node["on" + eventType] = method;
            }
        },
        removeEvent = helpers.removeEvent = function(node, eventType, handler) {
            if (node.removeEventListener) {
                node.removeEventListener(eventType, handler, false);
            } else if (node.detachEvent) {
                node.detachEvent("on" + eventType, handler);
            } else {
                node["on" + eventType] = noop;
            }
        },
        bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler) {
            // Create the events object if it's not already present
            if (!chartInstance.events) chartInstance.events = {};

            each(arrayOfEvents, function(eventName) {
                chartInstance.events[eventName] = function() {
                    handler.apply(chartInstance, arguments);
                };
                addEvent(chartInstance.chart.canvas, eventName, chartInstance.events[eventName]);
            });
        },
        unbindEvents = helpers.unbindEvents = function(chartInstance, arrayOfEvents) {
            each(arrayOfEvents, function(handler, eventName) {
                removeEvent(chartInstance.chart.canvas, eventName, handler);
            });
        },
        getMaximumWidth = helpers.getMaximumWidth = function(domNode) {
            var container = domNode.parentNode;
            // TODO = check cross browser stuff with this.
            return container.clientWidth;
        },
        getMaximumHeight = helpers.getMaximumHeight = function(domNode) {
            var container = domNode.parentNode;
            // TODO = check cross browser stuff with this.
            return container.clientHeight;
        },
        getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support
        retinaScale = helpers.retinaScale = function(chart) {
            var ctx = chart.ctx,
                width = chart.canvas.width,
                height = chart.canvas.height;

            if (window.devicePixelRatio) {
                ctx.canvas.style.width = width + "px";
                ctx.canvas.style.height = height + "px";
                ctx.canvas.height = height * window.devicePixelRatio;
                ctx.canvas.width = width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        },
        //-- Canvas methods
        clear = helpers.clear = function(chart) {
            chart.ctx.clearRect(0, 0, chart.width, chart.height);
        },
        fontString = helpers.fontString = function(pixelSize, fontStyle, fontFamily) {
            return fontStyle + " " + pixelSize + "px " + fontFamily;
        },
        longestText = helpers.longestText = function(ctx, font, arrayOfStrings) {
            ctx.font = font;
            var longest = 0;
            each(arrayOfStrings, function(string) {
                var textWidth = ctx.measureText(string).width;
                longest = (textWidth > longest) ? textWidth : longest;
            });
            return longest;
        },
        drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };


    //Store a reference to each instance - allowing us to globally resize chart instances on window resize.
    //Destroy method on the chart will remove the instance of the chart from this reference.
    Chart.instances = {};

    Chart.Type = function(data, options, chart) {
        this.options = options;
        this.chart = chart;
        this.id = uid();
        //Add the chart instance to the global namespace
        Chart.instances[this.id] = this;

        // Initialize is always called when a chart type is created
        // By default it is a no op, but it should be extended
        if (options.responsive) {
            this.resize();
        }
        this.initialize.call(this, data);
    };

    //Core methods that'll be a part of every chart type
    extend(Chart.Type.prototype, {
        initialize: function() {
            return this;
        },
        clear: function() {
            clear(this.chart);
            return this;
        },
        stop: function() {
            // Stops any current animation loop occuring
            cancelAnimFrame(this.animationFrame);
            return this;
        },
        resize: function(callback) {
            this.stop();
            var canvas = this.chart.canvas,
                newWidth = getMaximumWidth(this.chart.canvas),
                newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);

            canvas.width = this.chart.width = newWidth;
            canvas.height = this.chart.height = newHeight;

            retinaScale(this.chart);

            if (typeof callback === "function") {
                callback.apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return this;
        },
        reflow: noop,
        render: function(reflow) {
            if (reflow) {
                this.reflow();
            }
            if (this.options.animation && !reflow) {
                helpers.animationLoop(
                    this.draw,
                    this.options.animationSteps,
                    this.options.animationEasing,
                    this.options.onAnimationProgress,
                    this.options.onAnimationComplete,
                    this
                );
            } else {
                this.draw();
                this.options.onAnimationComplete.call(this);
            }
            return this;
        },
        generateLegend: function() {
            return template(this.options.legendTemplate, this);
        },
        destroy: function() {
            this.clear();
            unbindEvents(this, this.events);
            var canvas = this.chart.canvas;

            // Reset canvas height/width attributes starts a fresh with the canvas context
            canvas.width = this.chart.width;
            canvas.height = this.chart.height;

            // < IE9 doesn't support removeProperty
            if (canvas.style.removeProperty) {
                canvas.style.removeProperty('width');
                canvas.style.removeProperty('height');
            } else {
                canvas.style.removeAttribute('width');
                canvas.style.removeAttribute('height');
            }

            delete Chart.instances[this.id];
        },
        showTooltip: function(ChartElements, forceRedraw) {
            // Only redraw the chart if we've actually changed what we're hovering on.
            if (typeof this.activeElements === 'undefined') this.activeElements = [];

            var isChanged = (function(Elements) {
                var changed = false;

                if (Elements.length !== this.activeElements.length) {
                    changed = true;
                    return changed;
                }

                each(Elements, function(element, index) {
                    if (element !== this.activeElements[index]) {
                        changed = true;
                    }
                }, this);
                return changed;
            }).call(this, ChartElements);

            if (!isChanged && !forceRedraw) {
                return;
            } else {
                this.activeElements = ChartElements;
            }
            this.draw();
            if (this.options.customTooltips) {
                this.options.customTooltips(false);
            }
            if (ChartElements.length > 0) {
                // If we have multiple datasets, show a MultiTooltip for all of the data points at that index
                if (this.datasets && this.datasets.length > 1) {
                    var dataArray,
                        dataIndex;

                    for (var i = this.datasets.length - 1; i >= 0; i--) {
                        dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
                        dataIndex = indexOf(dataArray, ChartElements[0]);
                        if (dataIndex !== -1) {
                            break;
                        }
                    }
                    var tooltipLabels = [],
                        tooltipColors = [],
                        medianPosition = (function(index) {

                            // Get all the points at that particular index
                            var Elements = [],
                                dataCollection,
                                xPositions = [],
                                yPositions = [],
                                xMax,
                                yMax,
                                xMin,
                                yMin;
                            helpers.each(this.datasets, function(dataset) {
                                dataCollection = dataset.points || dataset.bars || dataset.segments;
                                if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()) {
                                    Elements.push(dataCollection[dataIndex]);
                                }
                            });

                            helpers.each(Elements, function(element) {
                                xPositions.push(element.x);
                                yPositions.push(element.y);


                                //Include any colour information about the element
                                tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
                                tooltipColors.push({
                                    fill: element._saved.fillColor || element.fillColor,
                                    stroke: element._saved.strokeColor || element.strokeColor
                                });

                            }, this);

                            yMin = min(yPositions);
                            yMax = max(yPositions);

                            xMin = min(xPositions);
                            xMax = max(xPositions);

                            return {
                                x: (xMin > this.chart.width / 2) ? xMin : xMax,
                                y: (yMin + yMax) / 2
                            };
                        }).call(this, dataIndex);

                    new Chart.MultiTooltip({
                        x: medianPosition.x,
                        y: medianPosition.y,
                        xPadding: this.options.tooltipXPadding,
                        yPadding: this.options.tooltipYPadding,
                        xOffset: this.options.tooltipXOffset,
                        fillColor: this.options.tooltipFillColor,
                        textColor: this.options.tooltipFontColor,
                        fontFamily: this.options.tooltipFontFamily,
                        fontStyle: this.options.tooltipFontStyle,
                        fontSize: this.options.tooltipFontSize,
                        titleTextColor: this.options.tooltipTitleFontColor,
                        titleFontFamily: this.options.tooltipTitleFontFamily,
                        titleFontStyle: this.options.tooltipTitleFontStyle,
                        titleFontSize: this.options.tooltipTitleFontSize,
                        cornerRadius: this.options.tooltipCornerRadius,
                        labels: tooltipLabels,
                        legendColors: tooltipColors,
                        legendColorBackground: this.options.multiTooltipKeyBackground,
                        title: ChartElements[0].label,
                        chart: this.chart,
                        ctx: this.chart.ctx,
                        custom: this.options.customTooltips
                    }).draw();

                } else {
                    each(ChartElements, function(Element) {
                        var tooltipPosition = Element.tooltipPosition();
                        new Chart.Tooltip({
                            x: Math.round(tooltipPosition.x),
                            y: Math.round(tooltipPosition.y),
                            xPadding: this.options.tooltipXPadding,
                            yPadding: this.options.tooltipYPadding,
                            fillColor: this.options.tooltipFillColor,
                            textColor: this.options.tooltipFontColor,
                            fontFamily: this.options.tooltipFontFamily,
                            fontStyle: this.options.tooltipFontStyle,
                            fontSize: this.options.tooltipFontSize,
                            caretHeight: this.options.tooltipCaretSize,
                            cornerRadius: this.options.tooltipCornerRadius,
                            text: template(this.options.tooltipTemplate, Element),
                            chart: this.chart,
                            custom: this.options.customTooltips
                        }).draw();
                    }, this);
                }
            }
            return this;
        },
        toBase64Image: function() {
            return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
        }
    });

    Chart.Type.extend = function(extensions) {

        var parent = this;

        var ChartType = function() {
            return parent.apply(this, arguments);
        };

        //Copy the prototype object of the this class
        ChartType.prototype = clone(parent.prototype);
        //Now overwrite some of the properties in the base class with the new extensions
        extend(ChartType.prototype, extensions);

        ChartType.extend = Chart.Type.extend;

        if (extensions.name || parent.prototype.name) {

            var chartName = extensions.name || parent.prototype.name;
            //Assign any potential default values of the new chart type

            //If none are defined, we'll use a clone of the chart type this is being extended from.
            //I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
            //doesn't define some defaults of their own.

            var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};

            Chart.defaults[chartName] = extend(baseDefaults, extensions.defaults);

            Chart.types[chartName] = ChartType;

            //Register this new chart type in the Chart prototype
            Chart.prototype[chartName] = function(data, options) {
                var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
                return new ChartType(data, config, this);
            };
        } else {
            warn("Name not provided for this chart, so it hasn't been registered");
        }
        return parent;
    };

    Chart.Element = function(configuration) {
        extend(this, configuration);
        this.initialize.apply(this, arguments);
        this.save();
    };
    extend(Chart.Element.prototype, {
        initialize: function() {},
        restore: function(props) {
            if (!props) {
                extend(this, this._saved);
            } else {
                each(props, function(key) {
                    this[key] = this._saved[key];
                }, this);
            }
            return this;
        },
        save: function() {
            this._saved = clone(this);
            delete this._saved._saved;
            return this;
        },
        update: function(newProps) {
            each(newProps, function(value, key) {
                this._saved[key] = this[key];
                this[key] = value;
            }, this);
            return this;
        },
        transition: function(props, ease) {
            each(props, function(value, key) {
                this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
            }, this);
            return this;
        },
        tooltipPosition: function() {
            return {
                x: this.x,
                y: this.y
            };
        },
        hasValue: function() {
            return isNumber(this.value);
        }
    });

    Chart.Element.extend = inherits;


    Chart.Point = Chart.Element.extend({
        display: true,
        inRange: function(chartX, chartY) {
            var hitDetectionRange = this.hitDetectionRadius + this.radius;
            return ((Math.pow(chartX - this.x, 2) + Math.pow(chartY - this.y, 2)) < Math.pow(hitDetectionRange, 2));
        },
        draw: function() {
            if (this.display) {
                var ctx = this.ctx;
                ctx.beginPath();

                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.closePath();

                ctx.strokeStyle = this.strokeColor;
                ctx.lineWidth = this.strokeWidth;

                ctx.fillStyle = this.fillColor;

                ctx.fill();
                ctx.stroke();
            }


            //Quick debug for bezier curve splining
            //Highlights control points and the line between them.
            //Handy for dev - stripped in the min version.

            // ctx.save();
            // ctx.fillStyle = "black";
            // ctx.strokeStyle = "black"
            // ctx.beginPath();
            // ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);
            // ctx.fill();

            // ctx.beginPath();
            // ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);
            // ctx.fill();

            // ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);
            // ctx.lineTo(this.x, this.y);
            // ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);
            // ctx.stroke();

            // ctx.restore();



        }
    });

    Chart.Arc = Chart.Element.extend({
        inRange: function(chartX, chartY) {

            var pointRelativePosition = helpers.getAngleFromPoint(this, {
                x: chartX,
                y: chartY
            });

            //Check if within the range of the open/close angle
            var betweenAngles = (pointRelativePosition.angle >= this.startAngle && pointRelativePosition.angle <= this.endAngle),
                withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

            return (betweenAngles && withinRadius);
            //Ensure within the outside of the arc centre, but inside arc outer
        },
        tooltipPosition: function() {
            var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
                rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
            return {
                x: this.x + (Math.cos(centreAngle) * rangeFromCentre),
                y: this.y + (Math.sin(centreAngle) * rangeFromCentre)
            };
        },
        draw: function(animationPercent) {

            var easingDecimal = animationPercent || 1;

            var ctx = this.ctx;

            ctx.beginPath();

            ctx.arc(this.x, this.y, this.outerRadius, this.startAngle, this.endAngle);

            ctx.arc(this.x, this.y, this.innerRadius, this.endAngle, this.startAngle, true);

            ctx.closePath();
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            ctx.fillStyle = this.fillColor;

            ctx.fill();
            ctx.lineJoin = 'bevel';

            if (this.showStroke) {
                ctx.stroke();
            }
        }
    });

    Chart.Rectangle = Chart.Element.extend({
        draw: function() {
            var ctx = this.ctx,
                halfWidth = this.width / 2,
                leftX = this.x - halfWidth,
                rightX = this.x + halfWidth,
                top = this.base - (this.base - this.y),
                halfStroke = this.strokeWidth / 2;

            // Canvas doesn't allow us to stroke inside the width so we can
            // adjust the sizes to fit if we're setting a stroke on the line
            if (this.showStroke) {
                leftX += halfStroke;
                rightX -= halfStroke;
                top += halfStroke;
            }

            ctx.beginPath();

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            // It'd be nice to keep this class totally generic to any rectangle
            // and simply specify which border to miss out.
            ctx.moveTo(leftX, this.base);
            ctx.lineTo(leftX, top);
            ctx.lineTo(rightX, top);
            ctx.lineTo(rightX, this.base);
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            }
        },
        height: function() {
            return this.base - this.y;
        },
        inRange: function(chartX, chartY) {
            return (chartX >= this.x - this.width / 2 && chartX <= this.x + this.width / 2) && (chartY >= this.y && chartY <= this.base);
        }
    });

    Chart.Tooltip = Chart.Element.extend({
        draw: function() {

            var ctx = this.chart.ctx;

            ctx.font = fontString(this.fontSize, this.fontStyle, this.fontFamily);

            this.xAlign = "center";
            this.yAlign = "above";

            //Distance between the actual element.y position and the start of the tooltip caret
            var caretPadding = this.caretPadding = 2;

            var tooltipWidth = ctx.measureText(this.text).width + 2 * this.xPadding,
                tooltipRectHeight = this.fontSize + 2 * this.yPadding,
                tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

            if (this.x + tooltipWidth / 2 > this.chart.width) {
                this.xAlign = "left";
            } else if (this.x - tooltipWidth / 2 < 0) {
                this.xAlign = "right";
            }

            if (this.y - tooltipHeight < 0) {
                this.yAlign = "below";
            }


            var tooltipX = this.x - tooltipWidth / 2,
                tooltipY = this.y - tooltipHeight;

            ctx.fillStyle = this.fillColor;

            // Custom Tooltips
            if (this.custom) {
                this.custom(this);
            } else {
                switch (this.yAlign) {
                    case "above":
                        //Draw a caret above the x/y
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y - caretPadding);
                        ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
                        ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case "below":
                        tooltipY = this.y + caretPadding + this.caretHeight;
                        //Draw a caret below the x/y
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y + caretPadding);
                        ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
                        ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }

                switch (this.xAlign) {
                    case "left":
                        tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
                        break;
                    case "right":
                        tooltipX = this.x - (this.cornerRadius + this.caretHeight);
                        break;
                }

                drawRoundedRectangle(ctx, tooltipX, tooltipY, tooltipWidth, tooltipRectHeight, this.cornerRadius);

                ctx.fill();

                ctx.fillStyle = this.textColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, tooltipX + tooltipWidth / 2, tooltipY + tooltipRectHeight / 2);
            }
        }
    });

    Chart.MultiTooltip = Chart.Element.extend({
        initialize: function() {
            this.font = fontString(this.fontSize, this.fontStyle, this.fontFamily);

            this.titleFont = fontString(this.titleFontSize, this.titleFontStyle, this.titleFontFamily);

            this.height = (this.labels.length * this.fontSize) + ((this.labels.length - 1) * (this.fontSize / 2)) + (this.yPadding * 2) + this.titleFontSize * 1.5;

            this.ctx.font = this.titleFont;

            var titleWidth = this.ctx.measureText(this.title).width,
                //Label has a legend square as well so account for this.
                labelWidth = longestText(this.ctx, this.font, this.labels) + this.fontSize + 3,
                longestTextWidth = max([labelWidth, titleWidth]);

            this.width = longestTextWidth + (this.xPadding * 2);


            var halfHeight = this.height / 2;

            //Check to ensure the height will fit on the canvas
            if (this.y - halfHeight < 0) {
                this.y = halfHeight;
            } else if (this.y + halfHeight > this.chart.height) {
                this.y = this.chart.height - halfHeight;
            }

            //Decide whether to align left or right based on position on canvas
            if (this.x > this.chart.width / 2) {
                this.x -= this.xOffset + this.width;
            } else {
                this.x += this.xOffset;
            }


        },
        getLineHeight: function(index) {
            var baseLineHeight = this.y - (this.height / 2) + this.yPadding,
                afterTitleIndex = index - 1;

            //If the index is zero, we're getting the title
            if (index === 0) {
                return baseLineHeight + this.titleFontSize / 2;
            } else {
                return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize / 2) + this.titleFontSize * 1.5;
            }

        },
        draw: function() {
            // Custom Tooltips
            if (this.custom) {
                this.custom(this);
            } else {
                drawRoundedRectangle(this.ctx, this.x, this.y - this.height / 2, this.width, this.height, this.cornerRadius);
                var ctx = this.ctx;
                ctx.fillStyle = this.fillColor;
                ctx.fill();
                ctx.closePath();

                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillStyle = this.titleTextColor;
                ctx.font = this.titleFont;

                ctx.fillText(this.title, this.x + this.xPadding, this.getLineHeight(0));

                ctx.font = this.font;
                helpers.each(this.labels, function(label, index) {
                    ctx.fillStyle = this.textColor;
                    ctx.fillText(label, this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

                    //A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)
                    //ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);
                    //Instead we'll make a white filled block to put the legendColour palette over.

                    ctx.fillStyle = this.legendColorBackground;
                    ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize / 2, this.fontSize, this.fontSize);

                    ctx.fillStyle = this.legendColors[index].fill;
                    ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize / 2, this.fontSize, this.fontSize);


                }, this);
            }
        }
    });

    Chart.Scale = Chart.Element.extend({
        initialize: function() {
            this.fit();
        },
        buildYLabels: function() {
            this.yLabels = [];

            var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

            for (var i = 0; i <= this.steps; i++) {
                this.yLabels.push(template(this.templateString, {
                    value: (this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)
                }));
            }
            this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx, this.font, this.yLabels) : 0;
        },
        addXLabel: function(label) {
            this.xLabels.push(label);
            this.valuesCount++;
            this.fit();
        },
        removeXLabel: function() {
            this.xLabels.shift();
            this.valuesCount--;
            this.fit();
        },
        // Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
        fit: function() {
            // First we need the width of the yLabels, assuming the xLabels aren't rotated

            // To do that we need the base line at the top and base of the chart, assuming there is no x label rotation
            this.startPoint = (this.display) ? this.fontSize : 0;
            this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels

            // Apply padding settings to the start and end point.
            this.startPoint += this.padding;
            this.endPoint -= this.padding;

            // Cache the starting height, so can determine if we need to recalculate the scale yAxis
            var cachedHeight = this.endPoint - this.startPoint,
                cachedYLabelWidth;

            // Build the current yLabels so we have an idea of what size they'll be to start
            /*
             *	This sets what is returned from calculateScaleRange as static properties of this class:
             *
            	this.steps;
            	this.stepValue;
            	this.min;
            	this.max;
             *
             */
            this.calculateYRange(cachedHeight);

            // With these properties set we can now build the array of yLabels
            // and also the width of the largest yLabel
            this.buildYLabels();

            this.calculateXLabelRotation();

            while ((cachedHeight > this.endPoint - this.startPoint)) {
                cachedHeight = this.endPoint - this.startPoint;
                cachedYLabelWidth = this.yLabelWidth;

                this.calculateYRange(cachedHeight);
                this.buildYLabels();

                // Only go through the xLabel loop again if the yLabel width has changed
                if (cachedYLabelWidth < this.yLabelWidth) {
                    this.calculateXLabelRotation();
                }
            }

        },
        calculateXLabelRotation: function() {
            //Get the width of each grid by calculating the difference
            //between x offsets between 0 and 1.

            this.ctx.font = this.font;

            var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
                lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
                firstRotated,
                lastRotated;


            this.xScalePaddingRight = lastWidth / 2 + 3;
            this.xScalePaddingLeft = (firstWidth / 2 > this.yLabelWidth + 10) ? firstWidth / 2 : this.yLabelWidth + 10;

            this.xLabelRotation = 0;
            if (this.display) {
                var originalLabelWidth = longestText(this.ctx, this.font, this.xLabels),
                    cosRotation,
                    firstRotatedWidth;
                this.xLabelWidth = originalLabelWidth;
                //Allow 3 pixels x2 padding either side for label readability
                var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

                //Max label rotate should be 90 - also act as a loop counter
                while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)) {
                    cosRotation = Math.cos(toRadians(this.xLabelRotation));

                    firstRotated = cosRotation * firstWidth;
                    lastRotated = cosRotation * lastWidth;

                    // We're right aligning the text now.
                    if (firstRotated + this.fontSize / 2 > this.yLabelWidth + 8) {
                        this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
                    }
                    this.xScalePaddingRight = this.fontSize / 2;


                    this.xLabelRotation++;
                    this.xLabelWidth = cosRotation * originalLabelWidth;

                }
                if (this.xLabelRotation > 0) {
                    this.endPoint -= Math.sin(toRadians(this.xLabelRotation)) * originalLabelWidth + 3;
                }
            } else {
                this.xLabelWidth = 0;
                this.xScalePaddingRight = this.padding;
                this.xScalePaddingLeft = this.padding;
            }

        },
        // Needs to be overidden in each Chart type
        // Otherwise we need to pass all the data into the scale class
        calculateYRange: noop,
        drawingArea: function() {
            return this.startPoint - this.endPoint;
        },
        calculateY: function(value) {
            var scalingFactor = this.drawingArea() / (this.min - this.max);
            return this.endPoint - (scalingFactor * (value - this.min));
        },
        calculateX: function(index) {
            var isRotated = (this.xLabelRotation > 0),
                // innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,
                innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
                valueWidth = innerWidth / Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),
                valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

            if (this.offsetGridLines) {
                valueOffset += (valueWidth / 2);
            }

            return Math.round(valueOffset);
        },
        update: function(newProps) {
            helpers.extend(this, newProps);
            this.fit();
        },
        draw: function() {
            var ctx = this.ctx,
                yLabelGap = (this.endPoint - this.startPoint) / this.steps,
                xStart = Math.round(this.xScalePaddingLeft);
            if (this.display) {
                ctx.fillStyle = this.textColor;
                ctx.font = this.font;
                each(this.yLabels, function(labelString, index) {
                    var yLabelCenter = this.endPoint - (yLabelGap * index),
                        linePositionY = Math.round(yLabelCenter),
                        drawHorizontalLine = this.showHorizontalLines;

                    ctx.textAlign = "right";
                    ctx.textBaseline = "middle";
                    if (this.showLabels) {
                        ctx.fillText(labelString, xStart - 10, yLabelCenter);
                    }

                    // This is X axis, so draw it
                    if (index === 0 && !drawHorizontalLine) {
                        drawHorizontalLine = true;
                    }

                    if (drawHorizontalLine) {
                        ctx.beginPath();
                    }

                    if (index > 0) {
                        // This is a grid line in the centre, so drop that
                        ctx.lineWidth = this.gridLineWidth;
                        ctx.strokeStyle = this.gridLineColor;
                    } else {
                        // This is the first line on the scale
                        ctx.lineWidth = this.lineWidth;
                        ctx.strokeStyle = this.lineColor;
                    }

                    linePositionY += helpers.aliasPixel(ctx.lineWidth);

                    if (drawHorizontalLine) {
                        ctx.moveTo(xStart, linePositionY);
                        ctx.lineTo(this.width, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
                    }

                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;
                    ctx.beginPath();
                    ctx.moveTo(xStart - 5, linePositionY);
                    ctx.lineTo(xStart, linePositionY);
                    ctx.stroke();
                    ctx.closePath();

                }, this);

                each(this.xLabels, function(label, index) {
                    var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
                        // Check to see if line/bar here and decide where to place the line
                        linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
                        isRotated = (this.xLabelRotation > 0),
                        drawVerticalLine = this.showVerticalLines;

                    // This is Y axis, so draw it
                    if (index === 0 && !drawVerticalLine) {
                        drawVerticalLine = true;
                    }

                    if (drawVerticalLine) {
                        ctx.beginPath();
                    }

                    if (index > 0) {
                        // This is a grid line in the centre, so drop that
                        ctx.lineWidth = this.gridLineWidth;
                        ctx.strokeStyle = this.gridLineColor;
                    } else {
                        // This is the first line on the scale
                        ctx.lineWidth = this.lineWidth;
                        ctx.strokeStyle = this.lineColor;
                    }

                    if (drawVerticalLine) {
                        ctx.moveTo(linePos, this.endPoint);
                        ctx.lineTo(linePos, this.startPoint - 3);
                        ctx.stroke();
                        ctx.closePath();
                    }


                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;


                    // Small lines at the bottom of the base grid line
                    ctx.beginPath();
                    ctx.moveTo(linePos, this.endPoint);
                    ctx.lineTo(linePos, this.endPoint + 5);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.save();
                    ctx.translate(xPos, (isRotated) ? this.endPoint + 12 : this.endPoint + 8);
                    ctx.rotate(toRadians(this.xLabelRotation) * -1);
                    ctx.font = this.font;
                    ctx.textAlign = (isRotated) ? "right" : "center";
                    ctx.textBaseline = (isRotated) ? "middle" : "top";
                    ctx.fillText(label, 0, 0);
                    ctx.restore();
                }, this);

            }
        }

    });

    Chart.RadialScale = Chart.Element.extend({
        initialize: function() {
            this.size = min([this.height, this.width]);
            this.drawingArea = (this.display) ? (this.size / 2) - (this.fontSize / 2 + this.backdropPaddingY) : (this.size / 2);
        },
        calculateCenterOffset: function(value) {
            // Take into account half font size + the yPadding of the top value
            var scalingFactor = this.drawingArea / (this.max - this.min);

            return (value - this.min) * scalingFactor;
        },
        update: function() {
            if (!this.lineArc) {
                this.setScaleSize();
            } else {
                this.drawingArea = (this.display) ? (this.size / 2) - (this.fontSize / 2 + this.backdropPaddingY) : (this.size / 2);
            }
            this.buildYLabels();
        },
        buildYLabels: function() {
            this.yLabels = [];

            var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

            for (var i = 0; i <= this.steps; i++) {
                this.yLabels.push(template(this.templateString, {
                    value: (this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)
                }));
            }
        },
        getCircumference: function() {
            return ((Math.PI * 2) / this.valuesCount);
        },
        setScaleSize: function() {
            /*
             * Right, this is really confusing and there is a lot of maths going on here
             * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
             *
             * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
             *
             * Solution:
             *
             * We assume the radius of the polygon is half the size of the canvas at first
             * at each index we check if the text overlaps.
             *
             * Where it does, we store that angle and that index.
             *
             * After finding the largest index and angle we calculate how much we need to remove
             * from the shape radius to move the point inwards by that x.
             *
             * We average the left and right distances to get the maximum shape radius that can fit in the box
             * along with labels.
             *
             * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
             * on each side, removing that from the size, halving it and adding the left x protrusion width.
             *
             * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
             * and position it in the most space efficient manner
             *
             * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
             */


            // Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
            // Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
            var largestPossibleRadius = min([(this.height / 2 - this.pointLabelFontSize - 5), this.width / 2]),
                pointPosition,
                i,
                textWidth,
                halfTextWidth,
                furthestRight = this.width,
                furthestRightIndex,
                furthestRightAngle,
                furthestLeft = 0,
                furthestLeftIndex,
                furthestLeftAngle,
                xProtrusionLeft,
                xProtrusionRight,
                radiusReductionRight,
                radiusReductionLeft,
                maxWidthRadius;
            this.ctx.font = fontString(this.pointLabelFontSize, this.pointLabelFontStyle, this.pointLabelFontFamily);
            for (i = 0; i < this.valuesCount; i++) {
                // 5px to space the text slightly out - similar to what we do in the draw function.
                pointPosition = this.getPointPosition(i, largestPossibleRadius);
                textWidth = this.ctx.measureText(template(this.templateString, {
                    value: this.labels[i]
                })).width + 5;
                if (i === 0 || i === this.valuesCount / 2) {
                    // If we're at index zero, or exactly the middle, we're at exactly the top/bottom
                    // of the radar chart, so text will be aligned centrally, so we'll half it and compare
                    // w/left and right text sizes
                    halfTextWidth = textWidth / 2;
                    if (pointPosition.x + halfTextWidth > furthestRight) {
                        furthestRight = pointPosition.x + halfTextWidth;
                        furthestRightIndex = i;
                    }
                    if (pointPosition.x - halfTextWidth < furthestLeft) {
                        furthestLeft = pointPosition.x - halfTextWidth;
                        furthestLeftIndex = i;
                    }
                } else if (i < this.valuesCount / 2) {
                    // Less than half the values means we'll left align the text
                    if (pointPosition.x + textWidth > furthestRight) {
                        furthestRight = pointPosition.x + textWidth;
                        furthestRightIndex = i;
                    }
                } else if (i > this.valuesCount / 2) {
                    // More than half the values means we'll right align the text
                    if (pointPosition.x - textWidth < furthestLeft) {
                        furthestLeft = pointPosition.x - textWidth;
                        furthestLeftIndex = i;
                    }
                }
            }

            xProtrusionLeft = furthestLeft;

            xProtrusionRight = Math.ceil(furthestRight - this.width);

            furthestRightAngle = this.getIndexAngle(furthestRightIndex);

            furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

            radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI / 2);

            radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI / 2);

            // Ensure we actually need to reduce the size of the chart
            radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
            radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

            this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2;

            //this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])
            this.setCenterPoint(radiusReductionLeft, radiusReductionRight);

        },
        setCenterPoint: function(leftMovement, rightMovement) {

            var maxRight = this.width - rightMovement - this.drawingArea,
                maxLeft = leftMovement + this.drawingArea;

            this.xCenter = (maxLeft + maxRight) / 2;
            // Always vertically in the centre as the text height doesn't change
            this.yCenter = (this.height / 2);
        },

        getIndexAngle: function(index) {
            var angleMultiplier = (Math.PI * 2) / this.valuesCount;
            // Start from the top instead of right, so remove a quarter of the circle

            return index * angleMultiplier - (Math.PI / 2);
        },
        getPointPosition: function(index, distanceFromCenter) {
            var thisAngle = this.getIndexAngle(index);
            return {
                x: (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,
                y: (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter
            };
        },
        draw: function() {
            if (this.display) {
                var ctx = this.ctx;
                each(this.yLabels, function(label, index) {
                    // Don't draw a centre value
                    if (index > 0) {
                        var yCenterOffset = index * (this.drawingArea / this.steps),
                            yHeight = this.yCenter - yCenterOffset,
                            pointPosition;

                        // Draw circular lines around the scale
                        if (this.lineWidth > 0) {
                            ctx.strokeStyle = this.lineColor;
                            ctx.lineWidth = this.lineWidth;

                            if (this.lineArc) {
                                ctx.beginPath();
                                ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI * 2);
                                ctx.closePath();
                                ctx.stroke();
                            } else {
                                ctx.beginPath();
                                for (var i = 0; i < this.valuesCount; i++) {
                                    pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));
                                    if (i === 0) {
                                        ctx.moveTo(pointPosition.x, pointPosition.y);
                                    } else {
                                        ctx.lineTo(pointPosition.x, pointPosition.y);
                                    }
                                }
                                ctx.closePath();
                                ctx.stroke();
                            }
                        }
                        if (this.showLabels) {
                            ctx.font = fontString(this.fontSize, this.fontStyle, this.fontFamily);
                            if (this.showLabelBackdrop) {
                                var labelWidth = ctx.measureText(label).width;
                                ctx.fillStyle = this.backdropColor;
                                ctx.fillRect(
                                    this.xCenter - labelWidth / 2 - this.backdropPaddingX,
                                    yHeight - this.fontSize / 2 - this.backdropPaddingY,
                                    labelWidth + this.backdropPaddingX * 2,
                                    this.fontSize + this.backdropPaddingY * 2
                                );
                            }
                            ctx.textAlign = 'center';
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = this.fontColor;
                            ctx.fillText(label, this.xCenter, yHeight);
                        }
                    }
                }, this);

                if (!this.lineArc) {
                    ctx.lineWidth = this.angleLineWidth;
                    ctx.strokeStyle = this.angleLineColor;
                    for (var i = this.valuesCount - 1; i >= 0; i--) {
                        if (this.angleLineWidth > 0) {
                            var outerPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max));
                            ctx.beginPath();
                            ctx.moveTo(this.xCenter, this.yCenter);
                            ctx.lineTo(outerPosition.x, outerPosition.y);
                            ctx.stroke();
                            ctx.closePath();
                        }
                        // Extra 3px out for some label spacing
                        var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);
                        ctx.font = fontString(this.pointLabelFontSize, this.pointLabelFontStyle, this.pointLabelFontFamily);
                        ctx.fillStyle = this.pointLabelFontColor;

                        var labelsCount = this.labels.length,
                            halfLabelsCount = this.labels.length / 2,
                            quarterLabelsCount = halfLabelsCount / 2,
                            upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
                            exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
                        if (i === 0) {
                            ctx.textAlign = 'center';
                        } else if (i === halfLabelsCount) {
                            ctx.textAlign = 'center';
                        } else if (i < halfLabelsCount) {
                            ctx.textAlign = 'left';
                        } else {
                            ctx.textAlign = 'right';
                        }

                        // Set the correct text baseline based on outer positioning
                        if (exactQuarter) {
                            ctx.textBaseline = 'middle';
                        } else if (upperHalf) {
                            ctx.textBaseline = 'bottom';
                        } else {
                            ctx.textBaseline = 'top';
                        }

                        ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);
                    }
                }
            }
        }
    });

    // Attach global event to resize each chart instance when the browser resizes
    helpers.addEvent(window, "resize", (function() {
        // Basic debounce of resize function so it doesn't hurt performance when resizing browser.
        var timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                each(Chart.instances, function(instance) {
                    // If the responsive flag is set in the chart instance config
                    // Cascade the resize event down to the chart.
                    if (instance.options.responsive) {
                        instance.resize(instance.render, true);
                    }
                });
            }, 50);
        };
    })());


    if (amd) {
        define(function() {
            return Chart;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = Chart;
    }

    root.Chart = Chart;

    Chart.noConflict = function() {
        root.Chart = previous;
        return Chart;
    };

}).call(this);

(function() {
    "use strict";

    var root = this,
        Chart = root.Chart,
        helpers = Chart.helpers;


    var defaultConfig = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };


    Chart.Type.extend({
        name: "Bar",
        defaults: defaultConfig,
        initialize: function(data) {

            //Expose options as a scope variable here so we can access it in the ScaleClass
            var options = this.options;

            this.ScaleClass = Chart.Scale.extend({
                offsetGridLines: true,
                calculateBarX: function(datasetCount, datasetIndex, barIndex) {
                    //Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
                    var xWidth = this.calculateBaseWidth(),
                        xAbsolute = this.calculateX(barIndex) - (xWidth / 2),
                        barWidth = this.calculateBarWidth(datasetCount);

                    return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth / 2;
                },
                calculateBaseWidth: function() {
                    return (this.calculateX(1) - this.calculateX(0)) - (2 * options.barValueSpacing);
                },
                calculateBarWidth: function(datasetCount) {
                    //The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
                    var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

                    return (baseWidth / datasetCount);
                }
            });

            this.datasets = [];

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

                    this.eachBars(function(bar) {
                        bar.restore(['fillColor', 'strokeColor']);
                    });
                    helpers.each(activeBars, function(activeBar) {
                        activeBar.fillColor = activeBar.highlightFill;
                        activeBar.strokeColor = activeBar.highlightStroke;
                    });
                    this.showTooltip(activeBars);
                });
            }

            //Declare the extension of the default point, to cater for the options passed in to the constructor
            this.BarClass = Chart.Rectangle.extend({
                strokeWidth: this.options.barStrokeWidth,
                showStroke: this.options.barShowStroke,
                ctx: this.chart.ctx
            });

            //Iterate through each of the datasets, and build this into a property of the chart
            helpers.each(data.datasets, function(dataset, datasetIndex) {

                var datasetObject = {
                    label: dataset.label || null,
                    fillColor: dataset.fillColor,
                    strokeColor: dataset.strokeColor,
                    bars: []
                };

                this.datasets.push(datasetObject);

                helpers.each(dataset.data, function(dataPoint, index) {
                    //Add a new point for each piece of data, passing any required data to draw.
                    datasetObject.bars.push(new this.BarClass({
                        value: dataPoint,
                        label: data.labels[index],
                        datasetLabel: dataset.label,
                        strokeColor: dataset.strokeColor,
                        fillColor: dataset.fillColor,
                        highlightFill: dataset.highlightFill || dataset.fillColor,
                        highlightStroke: dataset.highlightStroke || dataset.strokeColor
                    }));
                }, this);

            }, this);

            this.buildScale(data.labels);

            this.BarClass.prototype.base = this.scale.endPoint;

            this.eachBars(function(bar, index, datasetIndex) {
                helpers.extend(bar, {
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                    y: this.scale.endPoint
                });
                bar.save();
            }, this);

            this.render();
        },
        update: function() {
            this.scale.update();
            // Reset any highlight colours before updating.
            helpers.each(this.activeElements, function(activeElement) {
                activeElement.restore(['fillColor', 'strokeColor']);
            });

            this.eachBars(function(bar) {
                bar.save();
            });
            this.render();
        },
        eachBars: function(callback) {
            helpers.each(this.datasets, function(dataset, datasetIndex) {
                helpers.each(dataset.bars, callback, this, datasetIndex);
            }, this);
        },
        getBarsAtEvent: function(e) {
            var barsArray = [],
                eventPosition = helpers.getRelativePosition(e),
                datasetIterator = function(dataset) {
                    barsArray.push(dataset.bars[barIndex]);
                },
                barIndex;

            for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
                for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
                    if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x, eventPosition.y)) {
                        helpers.each(this.datasets, datasetIterator);
                        return barsArray;
                    }
                }
            }

            return barsArray;
        },
        buildScale: function(labels) {
            var self = this;

            var dataTotal = function() {
                var values = [];
                self.eachBars(function(bar) {
                    values.push(bar.value);
                });
                return values;
            };

            var scaleOptions = {
                templateString: this.options.scaleLabel,
                height: this.chart.height,
                width: this.chart.width,
                ctx: this.chart.ctx,
                textColor: this.options.scaleFontColor,
                fontSize: this.options.scaleFontSize,
                fontStyle: this.options.scaleFontStyle,
                fontFamily: this.options.scaleFontFamily,
                valuesCount: labels.length,
                beginAtZero: this.options.scaleBeginAtZero,
                integersOnly: this.options.scaleIntegersOnly,
                calculateYRange: function(currentHeight) {
                    var updatedRanges = helpers.calculateScaleRange(
                        dataTotal(),
                        currentHeight,
                        this.fontSize,
                        this.beginAtZero,
                        this.integersOnly
                    );
                    helpers.extend(this, updatedRanges);
                },
                xLabels: labels,
                font: helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
                lineWidth: this.options.scaleLineWidth,
                lineColor: this.options.scaleLineColor,
                showHorizontalLines: this.options.scaleShowHorizontalLines,
                showVerticalLines: this.options.scaleShowVerticalLines,
                gridLineWidth: (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
                gridLineColor: (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                padding: (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,
                showLabels: this.options.scaleShowLabels,
                display: this.options.showScale
            };

            if (this.options.scaleOverride) {
                helpers.extend(scaleOptions, {
                    calculateYRange: helpers.noop,
                    steps: this.options.scaleSteps,
                    stepValue: this.options.scaleStepWidth,
                    min: this.options.scaleStartValue,
                    max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
                });
            }

            this.scale = new this.ScaleClass(scaleOptions);
        },
        addData: function(valuesArray, label) {
            //Map the values array for each of the datasets
            helpers.each(valuesArray, function(value, datasetIndex) {
                //Add a new point for each piece of data, passing any required data to draw.
                this.datasets[datasetIndex].bars.push(new this.BarClass({
                    value: value,
                    label: label,
                    x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount + 1),
                    y: this.scale.endPoint,
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    base: this.scale.endPoint,
                    strokeColor: this.datasets[datasetIndex].strokeColor,
                    fillColor: this.datasets[datasetIndex].fillColor
                }));
            }, this);

            this.scale.addXLabel(label);
            //Then re-render the chart.
            this.update();
        },
        removeData: function() {
            this.scale.removeXLabel();
            //Then re-render the chart.
            helpers.each(this.datasets, function(dataset) {
                dataset.bars.shift();
            }, this);
            this.update();
        },
        reflow: function() {
            helpers.extend(this.BarClass.prototype, {
                y: this.scale.endPoint,
                base: this.scale.endPoint
            });
            var newScaleProps = helpers.extend({
                height: this.chart.height,
                width: this.chart.width
            });
            this.scale.update(newScaleProps);
        },
        draw: function(ease) {
            var easingDecimal = ease || 1;
            this.clear();

            var ctx = this.chart.ctx;

            this.scale.draw(easingDecimal);

            //Draw all the bars for each dataset
            helpers.each(this.datasets, function(dataset, datasetIndex) {
                helpers.each(dataset.bars, function(bar, index) {
                    if (bar.hasValue()) {
                        bar.base = this.scale.endPoint;
                        //Transition then draw
                        bar.transition({
                            x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                            y: this.scale.calculateY(bar.value),
                            width: this.scale.calculateBarWidth(this.datasets.length)
                        }, easingDecimal).draw();
                    }
                }, this);

            }, this);
        }
    });


}).call(this);

(function() {
    "use strict";

    var root = this,
        Chart = root.Chart,
        //Cache a local reference to Chart.helpers
        helpers = Chart.helpers;

    var defaultConfig = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //The percentage of the chart that we cut out of the middle.
        percentageInnerCutout: 50,

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect
        animationEasing: "easeOutBounce",

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    };


    Chart.Type.extend({
        //Passing in a name registers this chart in the Chart namespace
        name: "Doughnut",
        //Providing a defaults will also register the deafults in the chart namespace
        defaults: defaultConfig,
        //Initialize is fired when the chart is initialized - Data is passed in as a parameter
        //Config is automatically merged by the core of Chart.js, and is available at this.options
        initialize: function(data) {

            //Declare segments as a static property to prevent inheriting across the Chart type prototype
            this.segments = [];
            this.outerRadius = (helpers.min([this.chart.width, this.chart.height]) - this.options.segmentStrokeWidth / 2) / 2;

            this.SegmentArc = Chart.Arc.extend({
                ctx: this.chart.ctx,
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];

                    helpers.each(this.segments, function(segment) {
                        segment.restore(["fillColor"]);
                    });
                    helpers.each(activeSegments, function(activeSegment) {
                        activeSegment.fillColor = activeSegment.highlightColor;
                    });
                    this.showTooltip(activeSegments);
                });
            }
            this.calculateTotal(data);

            helpers.each(data, function(datapoint, index) {
                this.addData(datapoint, index, true);
            }, this);

            this.render();
        },
        getSegmentsAtEvent: function(e) {
            var segmentsArray = [];

            var location = helpers.getRelativePosition(e);

            helpers.each(this.segments, function(segment) {
                if (segment.inRange(location.x, location.y)) segmentsArray.push(segment);
            }, this);
            return segmentsArray;
        },
        addData: function(segment, atIndex, silent) {
            var index = atIndex || this.segments.length;
            this.segments.splice(index, 0, new this.SegmentArc({
                value: segment.value,
                outerRadius: (this.options.animateScale) ? 0 : this.outerRadius,
                innerRadius: (this.options.animateScale) ? 0 : (this.outerRadius / 100) * this.options.percentageInnerCutout,
                fillColor: segment.color,
                highlightColor: segment.highlight || segment.color,
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                startAngle: Math.PI * 1.5,
                circumference: (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
                label: segment.label
            }));
            if (!silent) {
                this.reflow();
                this.update();
            }
        },
        calculateCircumference: function(value) {
            return (Math.PI * 2) * (Math.abs(value) / this.total);
        },
        calculateTotal: function(data) {
            this.total = 0;
            helpers.each(data, function(segment) {
                this.total += Math.abs(segment.value);
            }, this);
        },
        update: function() {
            this.calculateTotal(this.segments);

            // Reset any highlight colours before updating.
            helpers.each(this.activeElements, function(activeElement) {
                activeElement.restore(['fillColor']);
            });

            helpers.each(this.segments, function(segment) {
                segment.save();
            });
            this.render();
        },

        removeData: function(atIndex) {
            var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length - 1;
            this.segments.splice(indexToDelete, 1);
            this.reflow();
            this.update();
        },

        reflow: function() {
            helpers.extend(this.SegmentArc.prototype, {
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.outerRadius = (helpers.min([this.chart.width, this.chart.height]) - this.options.segmentStrokeWidth / 2) / 2;
            helpers.each(this.segments, function(segment) {
                segment.update({
                    outerRadius: this.outerRadius,
                    innerRadius: (this.outerRadius / 100) * this.options.percentageInnerCutout
                });
            }, this);
        },
        draw: function(easeDecimal) {
            var animDecimal = (easeDecimal) ? easeDecimal : 1;
            this.clear();
            helpers.each(this.segments, function(segment, index) {
                segment.transition({
                    circumference: this.calculateCircumference(segment.value),
                    outerRadius: this.outerRadius,
                    innerRadius: (this.outerRadius / 100) * this.options.percentageInnerCutout
                }, animDecimal);

                segment.endAngle = segment.startAngle + segment.circumference;

                segment.draw();
                if (index === 0) {
                    segment.startAngle = Math.PI * 1.5;
                }
                //Check to see if it's the last segment, if not get the next and update the start angle
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
            }, this);

        }
    });

    Chart.types.Doughnut.extend({
        name: "Pie",
        defaults: helpers.merge(defaultConfig, {
            percentageInnerCutout: 0
        })
    });

}).call(this);
(function() {
    "use strict";

    var root = this,
        Chart = root.Chart,
        helpers = Chart.helpers;

    var defaultConfig = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - Whether the line is curved between points
        bezierCurve: true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };


    Chart.Type.extend({
        name: "Line",
        defaults: defaultConfig,
        initialize: function(data) {
            //Declare the extension of the default point, to cater for the options passed in to the constructor
            this.PointClass = Chart.Point.extend({
                strokeWidth: this.options.pointDotStrokeWidth,
                radius: this.options.pointDotRadius,
                display: this.options.pointDot,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                ctx: this.chart.ctx,
                inRange: function(mouseX) {
                    return (Math.pow(mouseX - this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius, 2));
                }
            });

            this.datasets = [];

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
                    this.eachPoints(function(point) {
                        point.restore(['fillColor', 'strokeColor']);
                    });
                    helpers.each(activePoints, function(activePoint) {
                        activePoint.fillColor = activePoint.highlightFill;
                        activePoint.strokeColor = activePoint.highlightStroke;
                    });
                    this.showTooltip(activePoints);
                });
            }

            //Iterate through each of the datasets, and build this into a property of the chart
            helpers.each(data.datasets, function(dataset) {

                var datasetObject = {
                    label: dataset.label || null,
                    fillColor: dataset.fillColor,
                    strokeColor: dataset.strokeColor,
                    pointColor: dataset.pointColor,
                    pointStrokeColor: dataset.pointStrokeColor,
                    points: []
                };

                this.datasets.push(datasetObject);


                helpers.each(dataset.data, function(dataPoint, index) {
                    //Add a new point for each piece of data, passing any required data to draw.
                    datasetObject.points.push(new this.PointClass({
                        value: dataPoint,
                        label: data.labels[index],
                        datasetLabel: dataset.label,
                        strokeColor: dataset.pointStrokeColor,
                        fillColor: dataset.pointColor,
                        highlightFill: dataset.pointHighlightFill || dataset.pointColor,
                        highlightStroke: dataset.pointHighlightStroke || dataset.pointStrokeColor
                    }));
                }, this);

                this.buildScale(data.labels);


                this.eachPoints(function(point, index) {
                    helpers.extend(point, {
                        x: this.scale.calculateX(index),
                        y: this.scale.endPoint
                    });
                    point.save();
                }, this);

            }, this);


            this.render();
        },
        update: function() {
            this.scale.update();
            // Reset any highlight colours before updating.
            helpers.each(this.activeElements, function(activeElement) {
                activeElement.restore(['fillColor', 'strokeColor']);
            });
            this.eachPoints(function(point) {
                point.save();
            });
            this.render();
        },
        eachPoints: function(callback) {
            helpers.each(this.datasets, function(dataset) {
                helpers.each(dataset.points, callback, this);
            }, this);
        },
        getPointsAtEvent: function(e) {
            var pointsArray = [],
                eventPosition = helpers.getRelativePosition(e);
            helpers.each(this.datasets, function(dataset) {
                helpers.each(dataset.points, function(point) {
                    if (point.inRange(eventPosition.x, eventPosition.y)) pointsArray.push(point);
                });
            }, this);
            return pointsArray;
        },
        buildScale: function(labels) {
            var self = this;

            var dataTotal = function() {
                var values = [];
                self.eachPoints(function(point) {
                    values.push(point.value);
                });

                return values;
            };

            var scaleOptions = {
                templateString: this.options.scaleLabel,
                height: this.chart.height,
                width: this.chart.width,
                ctx: this.chart.ctx,
                textColor: this.options.scaleFontColor,
                fontSize: this.options.scaleFontSize,
                fontStyle: this.options.scaleFontStyle,
                fontFamily: this.options.scaleFontFamily,
                valuesCount: labels.length,
                beginAtZero: this.options.scaleBeginAtZero,
                integersOnly: this.options.scaleIntegersOnly,
                calculateYRange: function(currentHeight) {
                    var updatedRanges = helpers.calculateScaleRange(
                        dataTotal(),
                        currentHeight,
                        this.fontSize,
                        this.beginAtZero,
                        this.integersOnly
                    );
                    helpers.extend(this, updatedRanges);
                },
                xLabels: labels,
                font: helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
                lineWidth: this.options.scaleLineWidth,
                lineColor: this.options.scaleLineColor,
                showHorizontalLines: this.options.scaleShowHorizontalLines,
                showVerticalLines: this.options.scaleShowVerticalLines,
                gridLineWidth: (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
                gridLineColor: (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
                showLabels: this.options.scaleShowLabels,
                display: this.options.showScale
            };

            if (this.options.scaleOverride) {
                helpers.extend(scaleOptions, {
                    calculateYRange: helpers.noop,
                    steps: this.options.scaleSteps,
                    stepValue: this.options.scaleStepWidth,
                    min: this.options.scaleStartValue,
                    max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
                });
            }


            this.scale = new Chart.Scale(scaleOptions);
        },
        addData: function(valuesArray, label) {
            //Map the values array for each of the datasets

            helpers.each(valuesArray, function(value, datasetIndex) {
                //Add a new point for each piece of data, passing any required data to draw.
                this.datasets[datasetIndex].points.push(new this.PointClass({
                    value: value,
                    label: label,
                    x: this.scale.calculateX(this.scale.valuesCount + 1),
                    y: this.scale.endPoint,
                    strokeColor: this.datasets[datasetIndex].pointStrokeColor,
                    fillColor: this.datasets[datasetIndex].pointColor
                }));
            }, this);

            this.scale.addXLabel(label);
            //Then re-render the chart.
            this.update();
        },
        removeData: function() {
            this.scale.removeXLabel();
            //Then re-render the chart.
            helpers.each(this.datasets, function(dataset) {
                dataset.points.shift();
            }, this);
            this.update();
        },
        reflow: function() {
            var newScaleProps = helpers.extend({
                height: this.chart.height,
                width: this.chart.width
            });
            this.scale.update(newScaleProps);
        },
        draw: function(ease) {
            var easingDecimal = ease || 1;
            this.clear();

            var ctx = this.chart.ctx;

            // Some helper methods for getting the next/prev points
            var hasValue = function(item) {
                    return item.value !== null;
                },
                nextPoint = function(point, collection, index) {
                    return helpers.findNextWhere(collection, hasValue, index) || point;
                },
                previousPoint = function(point, collection, index) {
                    return helpers.findPreviousWhere(collection, hasValue, index) || point;
                };

            this.scale.draw(easingDecimal);


            helpers.each(this.datasets, function(dataset) {
                var pointsWithValues = helpers.where(dataset.points, hasValue);

                //Transition each point first so that the line and point drawing isn't out of sync
                //We can use this extra loop to calculate the control points of this dataset also in this loop

                helpers.each(dataset.points, function(point, index) {
                    if (point.hasValue()) {
                        point.transition({
                            y: this.scale.calculateY(point.value),
                            x: this.scale.calculateX(index)
                        }, easingDecimal);
                    }
                }, this);


                // Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
                // This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
                if (this.options.bezierCurve) {
                    helpers.each(pointsWithValues, function(point, index) {
                        var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
                        point.controlPoints = helpers.splineCurve(
                            previousPoint(point, pointsWithValues, index),
                            point,
                            nextPoint(point, pointsWithValues, index),
                            tension
                        );

                        // Prevent the bezier going outside of the bounds of the graph

                        // Cap puter bezier handles to the upper/lower scale bounds
                        if (point.controlPoints.outer.y > this.scale.endPoint) {
                            point.controlPoints.outer.y = this.scale.endPoint;
                        } else if (point.controlPoints.outer.y < this.scale.startPoint) {
                            point.controlPoints.outer.y = this.scale.startPoint;
                        }

                        // Cap inner bezier handles to the upper/lower scale bounds
                        if (point.controlPoints.inner.y > this.scale.endPoint) {
                            point.controlPoints.inner.y = this.scale.endPoint;
                        } else if (point.controlPoints.inner.y < this.scale.startPoint) {
                            point.controlPoints.inner.y = this.scale.startPoint;
                        }
                    }, this);
                }


                //Draw the line between all the points
                ctx.lineWidth = this.options.datasetStrokeWidth;
                ctx.strokeStyle = dataset.strokeColor;
                ctx.beginPath();

                helpers.each(pointsWithValues, function(point, index) {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        if (this.options.bezierCurve) {
                            var previous = previousPoint(point, pointsWithValues, index);

                            ctx.bezierCurveTo(
                                previous.controlPoints.outer.x,
                                previous.controlPoints.outer.y,
                                point.controlPoints.inner.x,
                                point.controlPoints.inner.y,
                                point.x,
                                point.y
                            );
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                }, this);

                ctx.stroke();

                if (this.options.datasetFill && pointsWithValues.length > 0) {
                    //Round off the line by going to the base of the chart, back to the start, then fill.
                    ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
                    ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
                    ctx.fillStyle = dataset.fillColor;
                    ctx.closePath();
                    ctx.fill();
                }

                //Now draw the points over the line
                //A little inefficient double looping, but better than the line
                //lagging behind the point positions
                helpers.each(pointsWithValues, function(point) {
                    point.draw();
                });
            }, this);
        }
    });


}).call(this);

(function() {
    "use strict";

    var root = this,
        Chart = root.Chart,
        //Cache a local reference to Chart.helpers
        helpers = Chart.helpers;

    var defaultConfig = {
        //Boolean - Show a backdrop to the scale label
        scaleShowLabelBackdrop: true,

        //String - The colour of the label backdrop
        scaleBackdropColor: "rgba(255,255,255,0.75)",

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //Number - The backdrop padding above & below the label in pixels
        scaleBackdropPaddingY: 2,

        //Number - The backdrop padding to the side of the label in pixels
        scaleBackdropPaddingX: 2,

        //Boolean - Show line for each value in the scale
        scaleShowLine: true,

        //Boolean - Stroke a line around each segment in the chart
        segmentShowStroke: true,

        //String - The colour of the stroke on each segement.
        segmentStrokeColor: "#fff",

        //Number - The width of the stroke value in pixels
        segmentStrokeWidth: 2,

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect.
        animationEasing: "easeOutBounce",

        //Boolean - Whether to animate the rotation of the chart
        animateRotate: true,

        //Boolean - Whether to animate scaling the chart from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };


    Chart.Type.extend({
        //Passing in a name registers this chart in the Chart namespace
        name: "PolarArea",
        //Providing a defaults will also register the deafults in the chart namespace
        defaults: defaultConfig,
        //Initialize is fired when the chart is initialized - Data is passed in as a parameter
        //Config is automatically merged by the core of Chart.js, and is available at this.options
        initialize: function(data) {
            this.segments = [];
            //Declare segment class as a chart instance specific class, so it can share props for this instance
            this.SegmentArc = Chart.Arc.extend({
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                ctx: this.chart.ctx,
                innerRadius: 0,
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.scale = new Chart.RadialScale({
                display: this.options.showScale,
                fontStyle: this.options.scaleFontStyle,
                fontSize: this.options.scaleFontSize,
                fontFamily: this.options.scaleFontFamily,
                fontColor: this.options.scaleFontColor,
                showLabels: this.options.scaleShowLabels,
                showLabelBackdrop: this.options.scaleShowLabelBackdrop,
                backdropColor: this.options.scaleBackdropColor,
                backdropPaddingY: this.options.scaleBackdropPaddingY,
                backdropPaddingX: this.options.scaleBackdropPaddingX,
                lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
                lineColor: this.options.scaleLineColor,
                lineArc: true,
                width: this.chart.width,
                height: this.chart.height,
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2,
                ctx: this.chart.ctx,
                templateString: this.options.scaleLabel,
                valuesCount: data.length
            });

            this.updateScaleRange(data);

            this.scale.update();

            helpers.each(data, function(segment, index) {
                this.addData(segment, index, true);
            }, this);

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
                    helpers.each(this.segments, function(segment) {
                        segment.restore(["fillColor"]);
                    });
                    helpers.each(activeSegments, function(activeSegment) {
                        activeSegment.fillColor = activeSegment.highlightColor;
                    });
                    this.showTooltip(activeSegments);
                });
            }

            this.render();
        },
        getSegmentsAtEvent: function(e) {
            var segmentsArray = [];

            var location = helpers.getRelativePosition(e);

            helpers.each(this.segments, function(segment) {
                if (segment.inRange(location.x, location.y)) segmentsArray.push(segment);
            }, this);
            return segmentsArray;
        },
        addData: function(segment, atIndex, silent) {
            var index = atIndex || this.segments.length;

            this.segments.splice(index, 0, new this.SegmentArc({
                fillColor: segment.color,
                highlightColor: segment.highlight || segment.color,
                label: segment.label,
                value: segment.value,
                outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
                circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
                startAngle: Math.PI * 1.5
            }));
            if (!silent) {
                this.reflow();
                this.update();
            }
        },
        removeData: function(atIndex) {
            var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length - 1;
            this.segments.splice(indexToDelete, 1);
            this.reflow();
            this.update();
        },
        calculateTotal: function(data) {
            this.total = 0;
            helpers.each(data, function(segment) {
                this.total += segment.value;
            }, this);
            this.scale.valuesCount = this.segments.length;
        },
        updateScaleRange: function(datapoints) {
            var valuesArray = [];
            helpers.each(datapoints, function(segment) {
                valuesArray.push(segment.value);
            });

            var scaleSizes = (this.options.scaleOverride) ? {
                    steps: this.options.scaleSteps,
                    stepValue: this.options.scaleStepWidth,
                    min: this.options.scaleStartValue,
                    max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
                } :
                helpers.calculateScaleRange(
                    valuesArray,
                    helpers.min([this.chart.width, this.chart.height]) / 2,
                    this.options.scaleFontSize,
                    this.options.scaleBeginAtZero,
                    this.options.scaleIntegersOnly
                );

            helpers.extend(
                this.scale,
                scaleSizes, {
                    size: helpers.min([this.chart.width, this.chart.height]),
                    xCenter: this.chart.width / 2,
                    yCenter: this.chart.height / 2
                }
            );

        },
        update: function() {
            this.calculateTotal(this.segments);

            helpers.each(this.segments, function(segment) {
                segment.save();
            });

            this.reflow();
            this.render();
        },
        reflow: function() {
            helpers.extend(this.SegmentArc.prototype, {
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.updateScaleRange(this.segments);
            this.scale.update();

            helpers.extend(this.scale, {
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2
            });

            helpers.each(this.segments, function(segment) {
                segment.update({
                    outerRadius: this.scale.calculateCenterOffset(segment.value)
                });
            }, this);

        },
        draw: function(ease) {
            var easingDecimal = ease || 1;
            //Clear & draw the canvas
            this.clear();
            helpers.each(this.segments, function(segment, index) {
                segment.transition({
                    circumference: this.scale.getCircumference(),
                    outerRadius: this.scale.calculateCenterOffset(segment.value)
                }, easingDecimal);

                segment.endAngle = segment.startAngle + segment.circumference;

                // If we've removed the first segment we need to set the first one to
                // start at the top.
                if (index === 0) {
                    segment.startAngle = Math.PI * 1.5;
                }

                //Check to see if it's the last segment, if not get the next and update the start angle
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
                segment.draw();
            }, this);
            this.scale.draw();
        }
    });

}).call(this);
(function() {
    "use strict";

    var root = this,
        Chart = root.Chart,
        helpers = Chart.helpers;



    Chart.Type.extend({
        name: "Radar",
        defaults: {
            //Boolean - Whether to show lines for each scale point
            scaleShowLine: true,

            //Boolean - Whether we show the angle lines out of the radar
            angleShowLineOut: true,

            //Boolean - Whether to show labels on the scale
            scaleShowLabels: false,

            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero: true,

            //String - Colour of the angle line
            angleLineColor: "rgba(0,0,0,.1)",

            //Number - Pixel width of the angle line
            angleLineWidth: 1,

            //String - Point label font declaration
            pointLabelFontFamily: "'Arial'",

            //String - Point label font weight
            pointLabelFontStyle: "normal",

            //Number - Point label font size in pixels
            pointLabelFontSize: 10,

            //String - Point label font colour
            pointLabelFontColor: "#666",

            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Number - Radius of each point dot in pixels
            pointDotRadius: 3,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,

            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        },

        initialize: function(data) {
            this.PointClass = Chart.Point.extend({
                strokeWidth: this.options.pointDotStrokeWidth,
                radius: this.options.pointDotRadius,
                display: this.options.pointDot,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                ctx: this.chart.ctx
            });

            this.datasets = [];

            this.buildScale(data);

            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function(evt) {
                    var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];

                    this.eachPoints(function(point) {
                        point.restore(['fillColor', 'strokeColor']);
                    });
                    helpers.each(activePointsCollection, function(activePoint) {
                        activePoint.fillColor = activePoint.highlightFill;
                        activePoint.strokeColor = activePoint.highlightStroke;
                    });

                    this.showTooltip(activePointsCollection);
                });
            }

            //Iterate through each of the datasets, and build this into a property of the chart
            helpers.each(data.datasets, function(dataset) {

                var datasetObject = {
                    label: dataset.label || null,
                    fillColor: dataset.fillColor,
                    strokeColor: dataset.strokeColor,
                    pointColor: dataset.pointColor,
                    pointStrokeColor: dataset.pointStrokeColor,
                    points: []
                };

                this.datasets.push(datasetObject);

                helpers.each(dataset.data, function(dataPoint, index) {
                    //Add a new point for each piece of data, passing any required data to draw.
                    var pointPosition;
                    if (!this.scale.animation) {
                        pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));
                    }
                    datasetObject.points.push(new this.PointClass({
                        value: dataPoint,
                        label: data.labels[index],
                        datasetLabel: dataset.label,
                        x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,
                        y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,
                        strokeColor: dataset.pointStrokeColor,
                        fillColor: dataset.pointColor,
                        highlightFill: dataset.pointHighlightFill || dataset.pointColor,
                        highlightStroke: dataset.pointHighlightStroke || dataset.pointStrokeColor
                    }));
                }, this);

            }, this);

            this.render();
        },
        eachPoints: function(callback) {
            helpers.each(this.datasets, function(dataset) {
                helpers.each(dataset.points, callback, this);
            }, this);
        },

        getPointsAtEvent: function(evt) {
            var mousePosition = helpers.getRelativePosition(evt),
                fromCenter = helpers.getAngleFromPoint({
                    x: this.scale.xCenter,
                    y: this.scale.yCenter
                }, mousePosition);

            var anglePerIndex = (Math.PI * 2) / this.scale.valuesCount,
                pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),
                activePointsCollection = [];

            // If we're at the top, make the pointIndex 0 to get the first of the array.
            if (pointIndex >= this.scale.valuesCount || pointIndex < 0) {
                pointIndex = 0;
            }

            if (fromCenter.distance <= this.scale.drawingArea) {
                helpers.each(this.datasets, function(dataset) {
                    activePointsCollection.push(dataset.points[pointIndex]);
                });
            }

            return activePointsCollection;
        },

        buildScale: function(data) {
            this.scale = new Chart.RadialScale({
                display: this.options.showScale,
                fontStyle: this.options.scaleFontStyle,
                fontSize: this.options.scaleFontSize,
                fontFamily: this.options.scaleFontFamily,
                fontColor: this.options.scaleFontColor,
                showLabels: this.options.scaleShowLabels,
                showLabelBackdrop: this.options.scaleShowLabelBackdrop,
                backdropColor: this.options.scaleBackdropColor,
                backdropPaddingY: this.options.scaleBackdropPaddingY,
                backdropPaddingX: this.options.scaleBackdropPaddingX,
                lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
                lineColor: this.options.scaleLineColor,
                angleLineColor: this.options.angleLineColor,
                angleLineWidth: (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,
                // Point labels at the edge of each line
                pointLabelFontColor: this.options.pointLabelFontColor,
                pointLabelFontSize: this.options.pointLabelFontSize,
                pointLabelFontFamily: this.options.pointLabelFontFamily,
                pointLabelFontStyle: this.options.pointLabelFontStyle,
                height: this.chart.height,
                width: this.chart.width,
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2,
                ctx: this.chart.ctx,
                templateString: this.options.scaleLabel,
                labels: data.labels,
                valuesCount: data.datasets[0].data.length
            });

            this.scale.setScaleSize();
            this.updateScaleRange(data.datasets);
            this.scale.buildYLabels();
        },
        updateScaleRange: function(datasets) {
            var valuesArray = (function() {
                var totalDataArray = [];
                helpers.each(datasets, function(dataset) {
                    if (dataset.data) {
                        totalDataArray = totalDataArray.concat(dataset.data);
                    } else {
                        helpers.each(dataset.points, function(point) {
                            totalDataArray.push(point.value);
                        });
                    }
                });
                return totalDataArray;
            })();


            var scaleSizes = (this.options.scaleOverride) ? {
                    steps: this.options.scaleSteps,
                    stepValue: this.options.scaleStepWidth,
                    min: this.options.scaleStartValue,
                    max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
                } :
                helpers.calculateScaleRange(
                    valuesArray,
                    helpers.min([this.chart.width, this.chart.height]) / 2,
                    this.options.scaleFontSize,
                    this.options.scaleBeginAtZero,
                    this.options.scaleIntegersOnly
                );

            helpers.extend(
                this.scale,
                scaleSizes
            );

        },
        addData: function(valuesArray, label) {
            //Map the values array for each of the datasets
            this.scale.valuesCount++;
            helpers.each(valuesArray, function(value, datasetIndex) {
                var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));
                this.datasets[datasetIndex].points.push(new this.PointClass({
                    value: value,
                    label: label,
                    x: pointPosition.x,
                    y: pointPosition.y,
                    strokeColor: this.datasets[datasetIndex].pointStrokeColor,
                    fillColor: this.datasets[datasetIndex].pointColor
                }));
            }, this);

            this.scale.labels.push(label);

            this.reflow();

            this.update();
        },
        removeData: function() {
            this.scale.valuesCount--;
            this.scale.labels.shift();
            helpers.each(this.datasets, function(dataset) {
                dataset.points.shift();
            }, this);
            this.reflow();
            this.update();
        },
        update: function() {
            this.eachPoints(function(point) {
                point.save();
            });
            this.reflow();
            this.render();
        },
        reflow: function() {
            helpers.extend(this.scale, {
                width: this.chart.width,
                height: this.chart.height,
                size: helpers.min([this.chart.width, this.chart.height]),
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2
            });
            this.updateScaleRange(this.datasets);
            this.scale.setScaleSize();
            this.scale.buildYLabels();
        },
        draw: function(ease) {
            var easeDecimal = ease || 1,
                ctx = this.chart.ctx;
            this.clear();
            this.scale.draw();

            helpers.each(this.datasets, function(dataset) {

                //Transition each point first so that the line and point drawing isn't out of sync
                helpers.each(dataset.points, function(point, index) {
                    if (point.hasValue()) {
                        point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);
                    }
                }, this);



                //Draw the line between all the points
                ctx.lineWidth = this.options.datasetStrokeWidth;
                ctx.strokeStyle = dataset.strokeColor;
                ctx.beginPath();
                helpers.each(dataset.points, function(point, index) {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }, this);
                ctx.closePath();
                ctx.stroke();

                ctx.fillStyle = dataset.fillColor;
                ctx.fill();

                //Now draw the points over the line
                //A little inefficient double looping, but better than the line
                //lagging behind the point positions
                helpers.each(dataset.points, function(point) {
                    if (point.hasValue()) {
                        point.draw();
                    }
                });

            }, this);

        }

    });





}).call(this);

var chinaMapConfig = {
	width: 565,
	height: 475,
	shapes: {
		heilongjiang: 'M464.838,96.639l6.787-1.19l2.854,5.241l4.285,3.095l2.856-1.188h2.386l4.285-2.501l3.094,3.094l2.024,0.357l5.357-2.023l3.813,2.023l1.666,4.288h2.857l1.43,1.904l3.689,4.049l1.426-0.833l-0.594-5.12l2.026-1.432l2.854,5.716l2.621,1.074l2.858,3.212l2.021-0.357l0.836-1.427l4.523-5.12l2.022,1.428l1.43-2.022l1.431,2.619l4.283,1.429h2.86l2.07,0.088l-1.238-2.113l-0.598-6.906l-5.115-7.978l2.855-2.857l2.616-4.883h9.646l1.785-1.665l-0.597-3.69l2.025-3.691l-0.596-2.024l0.832-3.451l-0.236-17.742l2.855-5.715l-3.214-3.692l0.595-2.261l-1.427-2.024l-3.69,1.429l-4.289,4.884l-4.283,2.023l-4.289,5.951l-10.598,3.692l-4.879-3.692l0.594-2.262l-2.5-3.689l-1.191-3.811l-4.047-0.239l-7.145-3.69l-2.859,1.071l-3.33-1.667l-4.887,0.834l-4.283-1.429l-2.621-3.69l-2.498-2.857l-0.951-2.857l-3.334-3.452l-2.026-3.099l-4.644-6.31l-1.428-3.69l-5.119-6.548l-1.432-3.454l-6.549-3.216l-4.287,1.429l-3.689-0.833l-8.336-1.668l-11.07,3.932l-2.024,1.786l2.262,3.096l-2.856,7.499l0.834,0.835l4.881,3.096l2.621-4.286l4.524,2.856l-0.235,2.022l1.664,5.119l2.854,3.218l5.717,0.833l1.668-1.787l3.451-0.477l6.547-5.476l8.576,6.31l-2.858,11.669l0.594,8.333v5.119l-2.26,1.191l-0.238,13.335l-0.597-0.476l-2.26-2.858h-1.192l-0.595,1.073c0,0-8.797,13.044-7.146,10.596c1.652-2.448-3.451,4.523-3.451,4.523l0.357,1.428l7.145,4.886l3.926-1.071l0.599,1.071l-0.834,1.189l-3.689,1.667l-0.359,3.214L464.838,96.639z',
		jilin: 'M544.896,113.042l-2.07-0.088h-2.858l-4.285-1.431l-1.43-2.619l-1.431,2.024l-2.022-1.428l-4.523,5.12l-0.834,1.427l-2.022,0.357l-2.859-3.214l-2.621-1.072l-2.854-5.715l-2.027,1.431l0.594,5.12l-1.426,0.833l-3.689-4.05l-1.432-1.903h-2.854l-1.666-4.288l-3.813-2.023l-5.354,2.023l-2.025-0.357l-3.098-3.094l-4.285,2.5h-2.383l-2.857,1.191l-4.285-3.096l-2.854-5.24l-6.787,1.189l-2.621,3.099l-0.238,3.45l-7.502-2.023l-1.074,2.381l0.601,1.667l3.928,2.859v4.046l0.594,3.929l2.265,3.456l0.356,3.095l1.666,1.191l5.717-5.479l5.953,7.502v4.288l3.213,1.667l0.238-1.431l4.885,1.431l3.451,4.046l1.666-1.784l0.357-1.074l8.217,11.075l0.594,4.286l4.527,5.239l0.592,4.761l4.051-2.499l3.689-10.598l1.67-0.595l4.047,2.263l6.549-0.834l2.26-2.024l-3.092-4.763l0.832-1.191c0,0,7.84-2.611,6.072-2.022c-1.766,0.588,2.5-4.883,2.5-4.883l3.215-1.428l0.238-4.766l0.832-3.212l1.785-0.596l1.668,1.789l1.668,1.426l4.287-5.715l1.188-4.288L544.896,113.042z',
		liaoning: 'M491.15,173.2l6.783-10.002l4.287-4.881l-0.595-4.763l-4.524-5.239l-0.594-4.286l-8.216-11.075l-0.358,1.074l-1.666,1.786l-3.453-4.05l-4.883-1.429l-0.236,1.429v2.264l-2.022,2.022l-4.047,4.05H467.1l-1.666,2.856h-1.789l-3.094,3.096h-1.787l-3.691,3.691l-2.262,0.596l-4.881,7.5l-3.096-4.644l-3.453-2.262l-1.666,1.667l1.903,10.002l-1.666,3.453l-1.668,5.12l4.763,3.215l2.621,0.238l3.45,4.881l2.5-1.429c0,0,2.857-2.881,4.05-4.882c1.192-2.002,4.049-6.788,4.049-6.788l6.787-1.429l4.287,4.286l-3.099,6.787l-4.049,6.311l3.688,2.62l-0.233,3.098l-2.857,2.855l0.597,1.19l4.881-2.619l7.143-9.407l10.836-6.072L491.15,173.2z',
		hebei: 'M413.04,235.229l0.357-1.426l-1.783-3.453l6.902-12.5c0,0,8.725-7.9,6.313-5.718c-2.411,2.185,4.523-1.188,4.523-1.188l4.268-5.423l-1.647-1.125l-1.56-3.907l-3.319,1.286l-5.479-1.428l-0.237-1.428l-0.238-9.17l3.69-1.667l-0.419-1.563l-0.177-0.104l0.81-3.557l-5.094,2.128l0.832,1.905l0.178,1.424l0.18,1.433l-2.857,1.19l-1.785,1.667l-3.692-1.071l-4.881,0.834l-0.832-2.264l0.594-4.287l3.693-4.286l0.831-4.88l3.691-3.691l6.666,3.454h1.668l1.189,4.762l1.905,0.95l0.953,3.1l-0.356,2.024l4.047,2.854l0.594,2.264l3.338,1.428l8.332-4.523v-2.621l4.883-7.143l-3.45-4.881l-2.621-0.238l-4.763-3.218l1.668-5.118l-7.387-0.595l-3.213-4.765l0.357-2.619l-6.31-6.906l-4.051,2.026l-3.451,3.452l1.191,2.62l-0.834,1.667l-4.882,0.237l-2.264,2.022l-2.022-0.835l-2.021,2.026l-4.527,3.453l-2.024-1.43v-4.644l-1.666-0.832l-2.619,1.189l-3.096,6.547l-1.189,6.311l3.689,6.19l3.215,2.858v5.24l1.904,4.286l-0.834,4.764l-4.884,3.213l-2.26,7.382l4.049,4.645l2.857,5.717l-1.785,2.857l-0.477,3.928l-1.787,2.619l-0.834,2.859l2.621,3.446l11.43,1.431l4.524-1.787L413.04,235.229z',
		shandong: 'M425.661,252.611l0.597-2.856l2.5-1.069l4.645,3.927h1.433l4.284-0.476l2.5-2.022l3.453,2.856l1.429-2.62l0.356-1.43l2.857-1.667l0.834-3.45l2.854-0.595l7.98-13.454l-1.429-2.264l1.429-1.427l1.666,0.595l2.619-1.429l1.432-3.094l6.545-6.073l5.121-1.666l2.381-2.266l-0.592-4.88l-3.457-0.355l-7.738,0.952l-5.356-2.62l-3.216,0.596l-7.977,10.239l-2.262,1.429l-5.117-2.263l-0.359-2.619l-1.069-4.523l-2.859-1.669l-4.643,1.073l-2.882-1.971l-4.266,5.423l-4.523,1.188c0,0-8.514,7.798-6.313,5.718c2.201-2.081-6.902,12.5-6.902,12.5l1.783,3.45l-0.357,1.431v1.666l0.957,1.429l2.261-1.669l3.69-0.834l-10.002,11.074v2.621l2.023,0.596l4.524,3.93l7.146-0.835L425.661,252.611z',
		jiangsu: 'M483.646,282.616l-1.426,4.286l-1.898,2.251l-3.225,3.824l-4.879-0.835l-3.929-2.383l-2.383,1.19l-8.571-0.832l-0.238-3.454l-4.287-2.856l-1.428-2.618l2.02-2.264v-1.665v-2.267l5.121-0.594l0.24-2.023l-1.666-2.263l-2.621-0.355l-1.666,2.854l-4.287-0.831l-1.188-2.263l-2.857-1.666l0.955-6.074l-0.598-1.072l-2.859,0.479l-2.021-1.667l-5.118-1.429l-2.861-2.857l-6.307-2.621l0.592-2.856l2.5-1.069l4.645,3.927h1.433l4.284-0.476l2.5-2.022l3.453,2.856l1.427-2.62l0.358-1.43l2.857-1.667l0.834-3.45l2.854-0.597l7.148,4.881c0,0,3.365,0.754,5.117,2.025c1.754,1.271,9.766,16.313,9.766,16.313l-0.357,1.666l6.548,3.095l1.784,2.859l3.099,1.429l1.428,2.855l-2.023,0.951l-3.334-1.188h-4.645l-4.287-1.432l-1.666,1.432l3.932,1.188l3.813,1.669L483.646,282.616z',
		zhejiang: 'M483.793,336.063l-6.455,2.276l-3.693-3.69l-2.498,3.215h-4.049l-1.666-3.454l-2.023-5.118l-3.692-0.596l-4.047-7.501l-2.619-3.69l1.903-1.818l0.716-0.685c0,0,6.241-8.84,4.286-6.07c-1.954,2.769-0.239-4.882-0.239-4.882l1.43-1.906l3.336-0.594l0.951-1.43l-1.189-2.263l1.666-2.382v-4.524l2.384-1.189l3.928,2.382l4.879,0.835l3.225-3.824l3.998,3.332l-1.744,1.324l-2.021,3.096l-3.217,0.952l-1.074,0.833l3.098,1.666l5.715-2.499l9.406,3.929l0.953,7.979h-3.809l-0.24,2.382l2.024,3.332l-1.784,2.024l2.022,3.214l-3.096,3.69l-1.43-1.787l-4.644,11.788L483.793,336.063z',
		anhui: 'M423.637,253.208l2.024-0.597l6.312,2.621c0,0,1.768,2.299,2.861,2.856c1.092,0.557,5.118,1.43,5.118,1.43l2.021,1.667l2.858-0.479l0.599,1.072l-0.957,6.074l2.858,1.666l1.189,2.263l4.287,0.831l1.666-2.854l2.621,0.356l1.666,2.265l-0.24,2.021l-5.121,0.596v2.264v1.665l-2.021,2.265l1.43,2.618l4.287,2.856l0.237,3.454l8.572,0.832v4.525l-1.666,2.381l1.191,2.263l-0.951,1.43l-3.338,0.594l-1.428,1.906l0.235,4.882l-4.285,6.072l-0.715,0.683l-2.381-2.111H446.5l-2.498-2.855l-4.884,4.761l-1.786-0.834l2.026-3.69l-0.24-1.188l-1.786-0.479l-5.718,3.099l-5.356-10.241l1.666-3.214l-0.595-1.071l-2.858-0.952l-4.76-2.858l1.903-3.928l2.855-1.43l0.598-3.214l-1.07-5.716l-0.596-0.479l-2.856,2.86c0,0-5.978-4.647-4.287-3.453c1.69,1.192-3.217-4.049-3.217-4.049l3.217-2.261l0.834-4.05l2.021-1.431l-0.354-5.359l1.43-1.188l2.619,1.787l1.664,2.26l3.453-2.26l1.192-1.434l-0.598-2.617l-4.049-2.263L423.637,253.208z',
		henan: 'M371.131,276.068l9.405,8.336l7.742,1.665l7.144-1.072l2.262,1.072l2.5-1.43l1.783,1.787l0.834,2.856l3.455,1.905h4.524l3.451,2.857l3.098-1.428l2.382,1.428l1.903-3.929l2.855-1.43l0.598-3.216l-1.07-5.715l-0.596-0.479l-2.856,2.86l-4.287-3.453l-3.218-4.049l3.218-2.263l0.834-4.048l2.021-1.431l-0.354-5.359l1.43-1.188l2.619,1.787l1.664,2.26l3.455-2.26l1.19-1.434l-0.598-2.617l-4.049-2.263l-0.834-2.619l-7.142,0.835l-4.524-3.93l-2.021-0.596v-2.621l10-11.074l-3.69,0.834l-2.261,1.669l-0.957-1.429v-1.666l-1.663-0.6l-4.525,1.785l-11.43-1.428l-0.597,9.408c0,0-6.604,5.169-5.479,4.287c1.129-0.884-7.381,1.429-7.381,1.429l-10.359,7.142l-8.215,2.264v1.43l7.738,11.666L371.131,276.068L371.131,276.068z',
		shanxi: 'M363.393,259.519l8.217-2.265l10.357-7.142l7.381-1.431l5.477-4.287l0.599-9.405l-2.623-3.449l0.836-2.856l1.787-2.619l0.477-3.929l1.785-2.86l-2.859-5.713l-4.047-4.645l2.262-7.383l4.886-3.212l0.83-4.765l-1.904-4.286v-5.242l-3.215-2.854l-7.381,3.809l-1.191-1.189l-3.93,2.855l-3.213-0.235l-6.312,9.048h-1.906l-3.452,2.858l0.237,4.046l-1.67,3.452l-0.594,4.525l-3.096,4.884l3.334,6.905l-1.07,3.929l-2.619,4.286c0,0,4.146,18.996,3.689,16.903s-2.498,8.81-2.498,8.81L363.393,259.519z',
		shaanxi: 'M363.393,259.519l-1.428-3.454l2.498-8.81l-3.689-16.903c0,0,3.262-5.777,2.619-4.286c-0.646,1.49,1.07-3.929,1.07-3.929l-3.334-6.905l3.096-4.884l0.594-4.525l1.67-3.452l-0.238-4.046l-1.432-1.074l-2.26,2.502l-6.072,0.356l-3.096,4.526l0.236,2.62l-0.593,1.665l-2.502,0.834l-9.406,13.454l-1.19-0.836l-2.617-0.594l-5.359,0.359l-1.789,2.499l-0.233,5.478l0.834,1.667l9.166,4.637l4.883,3.099l0.832,2.855l-2.619,3.691l1.431,4.286l-0.835,2.021l-6.784,0.6l-1.433,0.835l0.478,1.188v1.904l-5.355,0.596l-2.856-1.428h-3.691l-0.596,0.832l0.596,2.026l-1.789,2.022l-0.592,2.261l3.451,2.861l-2.5,5.117l1.071,2.619l-0.237,1.191h-4.052l-2.854,1.429l2.262,3.098l-1.43,4.048l2.383,0.478l0.238,2.617l2.021,0.237l7.386-1.427l1.43,0.593l0.354,2.025l3.099,0.835l6.547,3.216l3.69-1.434l8.097,2.857l1.666,2.26l4.051-0.829l-0.596-4.288l-0.834-1.191l0.834-3.451l4.286-2.021l1.068-1.668l-2.26-0.837l-2.5-0.593l-2.619-2.62l1.189-1.068h8.571h1.908l1.189,0.83l2.616-2.022v-3.454l-7.737-11.668L363.393,259.519L363.393,259.519z',
		gansu: 'M196.462,200.108l-1.43-16.55l0.836-3.453l4.879-2.262c0,0,5.209-5.03,6.903-5.717c1.696-0.686,10.6-4.285,10.6-4.285l4.285-2.025v-4.047l1.905-2.262l1.788,0.237l7.144,1.192l-0.358,3.095l1.43,4.88l-0.834,7.978l6.072,8.929l3.097,2.026l4.883-3.812h10.237l2.623,0.953l1.429,2.264l-1.193,2.499l-5.714,4.645l0.597,2.261l6.549,4.882h2.618l0.834,1.07l-0.596,2.025l4.05,3.217l9.404,1.429l4.525-1.19l5.718-5.719l6.903,0.598l2.855,4.287l-1.664,3.929l0.475,2.382l-3.688,2.263l-1.668,2.024l0.596,4.763l6.545,4.646l2.875-0.653l7.725,9.458l1.668,7.145l-0.834,3.451l5.357,2.859v2.26l4.883,1.192h1.426v-4.05l3.693-0.595l0.951-4.763l-2.619-2.026l-2.025-2.021l0.834-9.166l2.023-1.071l3.453,1.43l1.432-0.598l0.834,1.667l9.166,4.639l4.883,3.1l0.832,2.856l-2.619,3.691l1.431,4.285l-0.834,2.021l-6.785,0.6l-1.433,0.833l0.478,1.191v1.903l-5.355,0.594l-2.856-1.428h-3.691l-0.596,0.834l0.596,2.024l-1.789,2.023l-0.592,2.262l3.449,2.857l-2.498,5.119l1.072,2.622l-0.238,1.188h-4.051l-2.854,1.435l2.26,3.091l-1.428,4.051l-4.287,1.07l0.357,2.023l-1.189,1.428l-7.383-0.596l-2.854-2.021l-0.601-4.525l-1.664-1.669l-2.62,1.669l-4.523-4.521l-3.455-2.385l-0.354-3.335l-1.074-2.619h-1.787l-7.144,3.096l0.356,3.454h-2.618l-4.287-4.288l-4.525-0.593l-1.786-2.499l1.431-2.86l2.617,2.5l3.097,0.954l2.62-2.025v-4.881l2.857-2.62l2.265-2.263l-1.073-2.856l5.716-4.522l0.832-7.147l-2.619-3.688l-1.429-6.071l-7.144-9.405l-3.692,1.431l-5.118-4.524l-6.907-4.287l-2.856-6.905l-5.359,2.023l-9.999-6.309l-4.883,2.616l-7.501-1.188l-5.714,3.452l-3.691,0.237l-5.715-3.451l-3.93-2.265L196.462,200.108z',
		hubei: 'M356.486,329.29l1.787-4.048l5.119-4.287l4.881,2.026l3.096-2.026l-2.621-3.093l1.429-1.433l13.219,0.836l4.525,3.097l2.264,1.425l3.451-2.26l2.619-0.833l0.596,3.093h1.904l1.43-2.021l2.856-2.86l1.431,2.027v4.049l1.19,1.667l2.619,0.594l2.855-2.854l4.287-1.433l7.979-7.381l3.691,0.236l4.522-1.428l-5.358-10.24l1.668-3.214l-0.593-1.071l-2.862-0.952l-4.761-2.858l-2.381-1.427l-3.098,1.427l-3.451-2.854h-4.524l-3.455-1.907l-0.83-2.856l-1.787-1.786l-2.5,1.428L395.421,285c0,0-9.509,0.927-7.146,1.071c2.363,0.146-7.736-1.666-7.736-1.666l-9.407-8.334l-2.619,2.023l-1.188-0.831h-1.907h-8.572l-1.189,1.068l2.619,2.62l2.5,0.593l2.26,0.837l-1.067,1.668l-4.287,2.021l-0.834,3.451l0.834,1.191l0.596,4.288l2.5,0.238l2.619,3.452l1.07,6.548l-0.832,2.262l-1.666-0.594l-4.883,3.812l-8.336,1.429l-2.261,2.263l1.783,2.262l0.24,4.882l2.262,0.598L356.486,329.29z',
		jiangxi: 'M408.279,325.242l3.336,6.549l0.355,3.452l-1.785,3.454l-2.502,2.024l-0.594,6.188l0.832,0.955l1.43-0.596l0.834,0.596v3.927l1.785,4.647l2.026,0.831l0.234,6.789l-1.193,4.642l1.193,2.021l2.266,2.265l5.474-1.429l1.071,2.022l-1.665,2.263l-2.859,4.287v1.07l1.67,1.192l11.43-4.525l4.047,2.263l1.191-1.19l-1.191-2.499l0.281-1.663l1.742-10.365l1.67-2.62l0.832-2.854l2.025-4.286l-1.072-1.668l0.238-3.691l4.881-5.475l-0.355-3.691l3.213-5.478l3.095,0.834l6.311-4.524l1.193-2.263l-4.049-7.501l-2.619-3.69l1.901-1.818l-2.381-2.111H446.5l-2.5-2.855l-4.884,4.762l-1.784-0.835l2.024-3.69l-0.24-1.188l-1.784-0.479l-5.716,3.099l-4.524,1.429l-3.689-0.238c0,0-9.709,9.669-7.979,7.381c1.731-2.287-4.287,1.433-4.287,1.433L408.279,325.242z',
		fujian: 'M435.945,374.779c0,0,2.881-12.508,1.742-10.365c-1.137,2.144,1.672-2.62,1.672-2.62l0.83-2.854l2.023-4.286l-1.072-1.668l0.24-3.691l4.881-5.475l-0.357-3.691l3.215-5.478l3.095,0.834l6.311-4.524l1.193-2.26l3.69,0.593l2.025,5.118l1.666,3.454h4.047l2.498-3.215l3.693,3.69l6.454-2.276l-4.069,9.776l-2.385-1.192l-1.666,0.835l-0.238,0.954l2.262,2.501l-0.598,8.929l0.598,2.859l-0.598,0.834l-2.617-0.599l-1.668,1.667l1.191,2.384l-3.214,3.095l0.595,1.189l-3.097,1.665l0.478,2.264l-1.072,1.191h-4.285l-2.264,2.025l-0.357,0.832l2.023,1.428l-2.26,3.452l-2.859,3.691l-1.189-0.356l-3.1,3.216l-3.447-7.502l-3.098-3.929l-2.023,0.24l-1.43-1.072L435.945,374.779z',
		hunan: 'M408.279,325.242l-2.619-0.594l-1.188-1.667v-4.05l-1.43-2.026l-2.857,2.86l-1.43,2.023h-1.904l-0.594-3.096l-2.621,0.833l-3.451,2.263l-2.264-1.428c0,0-2.666-2.521-4.525-3.097c-1.857-0.576-13.217-0.832-13.217-0.832l-1.43,1.429l2.62,3.093l-3.096,2.026l-4.883-2.026l-5.117,4.287l-1.787,4.05c0,0-0.19,6.479,0.357,9.405c0.551,2.926,2.5,10.002,2.5,10.002l-5.717,6.31l0.596,0.833l5.121-1.428l1.785,2.263l-1.429,7.144l2.857,5.121l2.856,0.832l2.857-3.931l1.43,3.099l0.834-0.238l4.523-4.288l1.191,0.24l2.021-1.073l3.693,1.073v4.048l2.856,0.595l-0.832,3.929l-2.623,4.29l-1.188,3.688h1.188l3.103-2.854l2.617,5.713l2.021-1.43h2.264l2.263-1.666v-3.45l1.188-1.072l2.859,0.235l4.879,2.264l0.834-1.667l-1.188-2.023l0.354-1.429l3.098-2.619l5.478,1.428l3.096-1.906l-1.193-2.021l1.193-4.642l-0.234-6.789l-2.026-0.831l-1.785-4.647v-3.927l-0.834-0.596l-1.43,0.596l-0.832-0.955l0.594-6.188l2.502-2.024l1.785-3.454l-0.355-3.452L408.279,325.242z',
		guizhou: 'M313.622,349.296l-1.666,4.761l-2.856,0.951l-6.313-0.951l-1.43,1.429l-3.453-1.07l-3.094,4.286l1.428,1.43v2.856l1.431,2.501l6.309-1.906l1.908,1.667l-2.859,12.027l3.81,3.689l-1.188,6.907l3.688,0.238l4.051-3.695l1.668,1.073l7.737,3.216l1.429-0.832l0.235-2.622l1.433-1.429l10.955-7.144l1.903,2.265l6.668,2.021l3.689-4.883l1.668,1.192h2.619v-1.432l3.453-1.189v-1.071l1.43-1.428l0.832,0.237l3.453-3.452l-2.857-5.123l1.429-7.142l-1.785-2.263l-5.121,1.428l-0.596-0.834l5.717-6.309l-2.5-10.001l-3.81,2.855l-3.334-3.45l-3.215-4.29l-0.24-2.619l-2.26-0.477l-2.621,0.834l-4.287-2.024l-2.022,4.883l-3.691,0.239l-2.619,4.049l-1.666-0.834l-2.623,0.834l-3.928-2.266l-3.213,3.69v1.668l6.312,3.453l1.426,2.621c0,0-6.094,2.245-4.523,1.667C322.1,348.955,313.622,349.296,313.622,349.296z',
		sichuan: 'M279.33,280.95l1.788-4.05l-2.025-2.261l-0.357-3.454l7.145-3.096h1.787l1.069,2.619l0.357,3.336l3.455,2.384l4.522,4.521l2.621-1.669l1.664,1.669l0.6,4.525l2.855,2.021l7.383,0.599l1.189-1.431l-0.357-2.023l4.287-1.07l2.381,0.478l0.238,2.617l2.024,0.237l7.382-1.427l1.43,0.593l0.354,2.026l3.099,0.834l6.549,3.214v7.47l-3.932,1.059l-1.351,7.671l-5.346,3.72l-1.014,5.811l-4.564-2.092l-5.58,2.092l-0.231,4.416l-0.464,4.53l6.507,4.07l2.28,6.977l-2.623,0.833l-3.928-2.263l-3.213,3.691v1.666l6.311,3.452l1.427,2.62l-4.523,1.666l-6.904-0.238l-0.831-2.855l-2.621-0.954l-4.285,2.623l-2.859-1.429l-0.238-3.694l-1.43-1.786v-1.903l-4.047-0.952l-1.072,1.188l0.599,2.858l-3.215,1.431l-0.836,2.021l0.836,2.504l-7.146,8.334l1.191,9.764l-3.453,2.855l-1.666-1.784l-6.906,4.049l-2.621-1.431l-10.001-19.17l-3.931-2.854l-3.216-0.835l-1.428-2.623l1.787-2.854l-2.857-2.264l-3.455,2.858l-3.45,0.595l-2.264-10.359l-0.597-2.499c0,0-2.04-22.568-0.594-16.55c1.446,6.017-3.099-8.336-3.099-8.336l2.267-1.665l-6.55-12.027l-7.977-6.311l1.069-3.692l0.953-1.188l11.669-1.666l7.738,2.262l4.523-1.431l1.785,2.859l5.717,5.715l4.524-0.833v-3.453l1.191-2.266l4.522-1.783l1.667,2.856l2.621-1.903l3.689,0.478v-0.241H279.33z',
		yunnan: 'M313.622,349.296l-0.836-2.858l-2.618-0.954l-4.283,2.622l-2.859-1.432l-0.238-3.688l-1.43-1.79v-1.903l-4.049-0.952l-1.07,1.188l0.599,2.859l-3.217,1.43l-0.834,2.021l0.834,2.5l-7.146,8.336l1.191,9.766l-3.453,2.854l-1.666-1.784l-6.907,4.048l-2.618-1.431c0,0-11.535-22.106-10.002-19.172c1.533,2.938-3.931-2.854-3.931-2.854l-3.213-0.834l-1.432-2.619l1.787-2.859l-2.857-2.263l-3.455,2.859l-3.451,0.598l-2.263-10.363l-0.596-2.499l-3.454,4.286l-1.427,0.831l0.356,6.551l-0.834,1.431h-1.784l-1.43-1.431l-1.667,2.026l1.667,7.381h2.024l1.667,1.19c0,0,0.468,2.396,0.594,4.521c0.125,2.125-0.833,15.719-0.833,15.719l-10.837,9.766l-0.594,3.689l-2.024,1.787l-0.238,1.903l1.669,4.643l-1.431,3.454l0.834,0.478l5.478-1.433l7.738-0.476l-0.834,3.098l1.431,2.857l0.475,4.287l0.955,1.426l4.524,0.243l2.024,1.425l-2.264,2.856l-0.356,3.453l-1.667,4.05l1.068,1.43l2.86,0.238l4.881,1.784l-0.593,1.667l3.212,4.881h4.524l5.716-3.213l1.786,0.952v1.906l0.832,2.856l1.432,1.429l3.092-0.477l1.192,0.834l1.072-1.192v-4.525l-1.906-8.333l1.431-2.5h4.762h1.192l2.62-3.213l6.783,2.261l2.858-2.503l1.431,1.432l2.858-1.786l2.615,2.618h1.073l0.953-1.428l2.261-2.263l1.073,0.833l3.213-0.595l3.099-2.502l2.619-3.811l3.688-0.831l2.023,2.021l1.43-4.048l2.857-0.235l1.069-0.834l0.957-3.691l-1.192-2.023l-9.765-1.785l-1.668-2.857h-2.854h-2.619l-1.906-3.097l0.24-1.665l1.188-6.907l-3.809-3.689l2.859-12.027l-1.908-1.667l-6.309,1.906l-1.431-2.501v-2.856l-1.428-1.43l3.094-4.286l3.453,1.07l1.43-1.429l6.313,0.951l2.856-0.951L313.622,349.296z',
		qinghai: 'M153.954,234.989l4.523,1.667l7.742-2.617l-1.193-1.429h-2.021l-0.834-2.259l0.594-2.024l3.692-1.668l2.617-4.286l-7.977-6.548l-0.356-6.906c0,0,2.08-2.545,3.689-2.856c1.609-0.313,26.317-5.119,26.317-5.119l1.783-1.428l3.931,0.594l13.215,3.095l3.93,2.265l5.714,3.451l3.692-0.237l5.714-3.452l7.501,1.188l4.882-2.616l9.999,6.309l5.36-2.023l2.856,6.903l6.907,4.286l5.119,4.527l3.691-1.431l7.146,9.405l1.426,6.071l2.619,3.688l-0.832,7.146l-5.715,4.524l1.073,2.856l-2.265,2.263l-2.856,2.62v4.879l-2.621,2.027l-3.097-0.954l-2.617-2.5l-1.431,2.859l1.787,2.499l4.524,0.594l4.287,4.288h2.618l2.024,2.265l-1.787,4.046v0.239l-3.688-0.479l-2.621,1.905l-1.666-2.856l-4.524,1.785l-1.19,2.264v3.451l-4.524,0.836l-5.715-5.716l-1.787-2.856l-4.524,1.428l-7.738-2.262l-11.67,1.666l-0.952,1.189l-1.071,3.69l-2.263,1.43l0.238,3.692l-6.906,8.931l-11.43-2.383l-0.833-4.285l-7.146-5.718l-15.717-2.498l-6.786-1.19l-2.621-0.238l-5.953-4.883l-12.384-2.857l-8.57-16.551l-0.238-4.642l3.451-1.672v-5.117l2.502-6.313l-2.858-2.856L153.954,234.989z',
		hainan: 'M385.895,447.523l-5.119,8.93v3.929l-10.238,8.336l-10.598-3.689l-2.025-7.501l0.597-3.454c0,0,8.074-8.075,5.715-5.716c-2.357,2.358,2.025-1.665,2.025-1.665l9.403-1.668l4.289-0.358l1.426-1.666l3.103,0.832L385.895,447.523z',
		shanghai: 'M484.32,292.485l-3.998-3.332c0,0,0.867-0.375,1.898-2.251c1.031-1.875,1.426-4.286,1.426-4.286l4.287,1.788l2.027,2.854l-1.433,2.024L484.32,292.485z',
		chongqing: 'M318.986,317.871l5.58-2.092l4.564,2.092l1.014-5.811l5.346-3.72l1.351-7.671l3.932-1.059v-7.47l3.689-1.432l8.096,2.857l1.666,2.26l4.051-0.829l2.5,0.238l2.619,3.452l1.07,6.548l-0.832,2.262l-1.666-0.594c0,0-3.072,3.501-4.884,3.812c-1.809,0.311-8.336,1.429-8.336,1.429l-2.26,2.263l1.783,2.262l0.24,4.883l2.262,0.597l5.715,7.142l0.357,9.407l-3.218,2.412l-0.592,0.445l-3.334-3.451l-3.215-4.29l-0.24-2.619l-2.26-0.476l-2.621,0.834l-4.287-2.025l-2.022,4.883l-3.691,0.239l-2.619,4.049l-1.666-0.834l-2.28-6.977l-6.507-4.07L318.986,317.871z',
		tianjin: 'M430.413,200.491c0,0-1.832,1.672-3.319,1.284c-1.49-0.388-5.479-1.428-5.479-1.428l-0.237-1.429l-0.238-9.169l3.69-1.667l-0.596-1.666l0.81-3.557l0.385-1.683l1.901,0.95l0.953,3.098l-0.356,2.022l4.047,2.858l0.594,2.263l-2.379,1.668l-0.834,3.809L430.413,200.491z',
		beijing: 'M421.139,189.75l-0.357-2.856l-0.832-1.905l5.095-2.126l0.381-1.683l-1.189-4.767h-1.668l-6.666-3.449l-3.69,3.69c0,0-1.125,6.585-0.832,4.88c0.289-1.704-3.693,4.288-3.693,4.288l-0.594,4.286l0.832,2.263l4.881-0.834l3.693,1.071l1.784-1.667L421.139,189.75z',
		ningxia: 'M329.934,230.111l0.24-5.476l1.785-2.499l-0.832-2.62l-9.168-3.454l0.594-3.691l2.858-4.049l-1.786-6.19l-0.835-0.952l-5.954,4.049l-2.855,9.168l-0.953,6.31l-4.762,3.93l-2.859,1.189l-3.438,0.779c0,0,9.184,11.236,7.729,9.458c-1.455-1.78,1.664,7.146,1.664,7.146l-0.834,3.449l5.357,2.859v2.262l4.881,1.19h1.43v-4.048l3.691-0.597l0.951-4.763l-2.619-2.026l-2.023-2.021l0.832-9.163l2.023-1.073l3.453,1.43L329.934,230.111z',
		neimongol: 'M301.969,226.604l3.438-0.779l2.859-1.188l4.762-3.932l0.953-6.31l2.855-9.168l5.954-4.048l0.835,0.951l1.786,6.19l-2.858,4.049l-0.594,3.691l9.168,3.453l0.832,2.621l5.358-0.359l2.617,0.596l1.191,0.834l9.405-13.454l2.502-0.835l0.593-1.664l-0.236-2.623l3.096-4.523l6.072-0.358l2.262-2.5l1.431,1.074l3.452-2.86h1.904l6.312-9.046l3.215,0.235l3.93-2.855l1.191,1.189l7.381-3.809l-3.689-6.193l1.189-6.311l3.096-6.549l2.619-1.188l1.666,0.832v4.644l2.025,1.43l4.526-3.453l2.021-2.026l2.022,0.835l2.265-2.025l4.881-0.234l0.834-1.667l-1.191-2.622l3.453-3.452l4.049-2.024l6.31,6.908l-0.355,2.618l3.213,4.763l7.385,0.595l1.666-3.453l-1.903-10.002l1.666-1.667l3.453,2.262l3.096,4.644l4.881-7.5l2.264-0.596l3.689-3.692h1.787l3.094-3.095h1.787l1.666-2.856h4.527l4.047-4.051l2.021-2.021v-2.264l-3.213-1.667v-4.286l-5.953-7.502l-5.717,5.478l-1.666-1.19l-0.357-3.096l-2.264-3.453l-0.594-3.931v-4.046l-3.928-2.858l-0.601-1.667l1.074-2.382l7.502,2.022l0.238-3.452l2.621-3.099l-1.789-1.666l0.358-3.214l3.689-1.667l0.834-1.19l-0.598-1.07l-3.927,1.07l-7.145-4.882l-0.357-1.43l3.453-4.524l7.146-10.597l0.594-1.072h1.193l2.26,2.858l0.596,0.479l0.238-13.336l2.26-1.191v-5.121l-0.594-8.333l2.858-11.668l-8.575-6.312l-6.548,5.478l-3.45,0.476l-1.668,1.786l-5.718-0.832l-2.854-3.215l-1.664-5.122l0.236-2.021l-4.525-2.858l-2.621,4.289l-4.881-3.096l-0.834-0.835l2.856-7.5L433.4,7.223h-2.024l-5.119,3.688l-4.285,6.311l1.668,1.071l3.211,0.359l2.504,6.548l-1.43,2.618l-2.502,3.689l-4.644,17.147l1.785,2.856l-1.428,2.498l-10.599,7.742l-5.713-1.071l-3.215-1.191l-0.479,1.667l-4.642,18.577l-2.264,2.378l1.191,3.335l2.854,2.382l4.764-2.623l7.74,0.598l2.26-3.692l4.052-0.951l7.737,2.856l9.408,9.765v2.023l-2.024,1.429l-10.836,0.599l-3.691,2.854l-2.857-0.355l-2.022,3.214l-5.121,1.07l-3.457,5.12l-0.592,3.81l-7.379,4.763l-4.646,0.598l-5.119,6.904l-4.883,2.859l-9.408-2.025l-3.092-1.431l-3.692,3.694l-1.785,6.548l5.119,7.501l-3.335,3.451l-4.643,2.859c0,0-8.422,10.638-6.787,8.571c1.637-2.064-6.619,3.36-8.93,3.93c-2.31,0.568-14.525,1.429-14.525,1.429l-2.264-0.237l-16.906,7.144l-7.742,4.881l-2.262-1.19l-0.83-2.262l-10.36-0.597l-11.909-3.688l-3.211-3.69l-17.385-2.025l-3.217,1.43l-21.072-2.022l-0.358,3.095l1.43,4.883l-0.834,7.976l6.073,8.929l3.096,2.026l4.883-3.812h10.237l2.623,0.953l1.426,2.262l-1.19,2.5l-5.714,4.646l0.597,2.261l6.549,4.88h2.618l0.834,1.072l-0.596,2.023l4.05,3.217l9.403,1.429l4.527-1.19l5.716-5.719l6.903,0.598l2.857,4.289l-1.664,3.926l0.473,2.382l-3.688,2.263l-1.668,2.024l0.596,4.76l6.545,4.647L301.969,226.604z',
		guangxi: 'M305.646,387.87l3.688,0.241l4.051-3.694l1.668,1.072l7.737,3.216l1.429-0.835l0.235-2.619l1.433-1.429l10.955-7.145l1.903,2.266l6.668,2.021l3.691-4.883l1.666,1.192h2.619v-1.431l3.453-1.192v-1.069l1.43-1.428l0.832,0.236l3.453-3.451l2.856,0.832l2.857-3.931l1.432,3.099l0.832-0.238l4.525-4.288l1.188,0.24l2.021-1.073l3.693,1.073v4.048l2.856,0.595l-0.832,3.929l-2.623,4.29l-1.188,3.688h1.188l3.101-2.854l2.616,5.713l2.025-1.43h2.26l1.666,5.717l-1.666,2.383l0.24,2.5l-5.119,6.547l0.355,6.905l-6.668,5.12l-0.476,4.285l-3.809,1.787l0.354,2.5l-3.694,0.831l-2.853,4.646l-7.502,1.071l-3.93-2.856l-4.049-1.669l-4.049,4.05l-4.158,0.241l-4.058,0.234c0,0-10.996-6.139-9.168-5.119c1.828,1.021-1.666-4.526-1.666-4.526l2.261-4.646l-2.617-1.902h-3.455l-0.832-0.952l-3.691,0.952l-3.692-2.62l1.432-4.048l2.855-0.235l1.069-0.834l0.957-3.69l-1.192-2.024l-9.765-1.785l-1.668-2.856h-2.854h-2.619l-1.906-3.099L305.646,387.87z',
		xinjiang: 'M153.889,69.508l2.327-0.014l-1.428,4.525l2.025,2.38l0.236,1.666l4.525,4.524l1.191,3.453l5.953,0.357l2.62,2.265h1.429l3.453,7.379l3.451,8.931l-1.784,5.357l0.358,2.025l-3.215,5.477l0.833,4.286l11.192,4.763l12.025,1.788l12.503,8.571l4.049,1.429l0.237,2.261l2.619,5.478l2.619,7.146l3.333,5.953l-1.903,2.263v4.047l-4.286,2.026l-10.596,4.284l-6.907,5.719l-4.881,2.26l-0.834,3.453l1.43,16.55l-3.931-0.596l-1.783,1.431l-26.315,5.119l-3.691,2.856l0.358,6.906l7.978,6.548l-2.62,4.286l-3.69,1.668l-0.597,2.024l0.835,2.259h2.021l1.192,1.429l-7.738,2.617l-4.525-1.667l-2.382-1.424h-5.715l-10.24-4.642h-6.546l-5.121,1.428h-5.714l-8.931,4.879l-7.143-0.834l-7.145,2.5l-5.956-1.907l-3.689-3.211l-9.525-1.427l-6.191,4.28l-3.452-1.425l-2.858-2.263l-6.907-1.667l-1.07-1.189l-2.857-0.237l-9.782,5.945l-10.037-1.25l-0.822-0.359l1.113-8.623l-4.524-1.191l-9.406-6.902l-2.62-0.241l-2.023-4.525l1.427-4.643l-0.477-2.26l-3.451-2.266l-1.192-2.26l-7.143-4.049v-1.189l3.452-1.431l2.023,1.19l2.025-2.025l-0.598-6.785l0.598-5.716l-4.646-4.642l-3.095,0.833l-1.189-3.336l1.785-3.452l-0.952-3.214l3.038-2.749l1.248-1.182v-2.618l4.285-2.024l4.286-0.833l3.811-1.429l3.099,0.832l2.26-0.832l0.833,0.595l0.356,2.859l2.022,0.832l4.765-0.238c0,0,3.566-4.729,5.478-6.073c1.911-1.346,11.19,2.381,11.19,2.381l5.717-4.048l16.552-3.689l1.069-2.264l1.43-6.31l4.643-3.69h1.433v-1.906l0.236-15.836l0.833-3.212l-4.521-1.668l-0.24-1.191l4.762-1.428l12.384-1.073l1.905,2.501l4.287,0.952l1.192,0.239l1.665-2.262l-2.265-2.263l9.169-18.574l1.431-0.953l8.335,4.047h3.689l1.667,2.264l7.979-2.502l2.023-13.212l3.452-2.265l4.048-0.238l2.859-3.452l1.071-3.454l2.263-1.191L153.889,69.508z',
		xizang: 'M152.525,339.529l6.787,0.834l2.265,3.216l1.189,0.477l10.239-1.904l0.594-1.787l2.023-1.07l4.884-4.05l4.285-0.594l3.93-2.501l7.74-4.286l0.832,1.428l5.716,1.904l8.334-4.285l2.618,1.787l-2.379,3.452l0.952,0.833h3.332l0.359,1.427l-2.857,5.121l0.833,0.834h1.666l8.336,2.265l3.691-3.099l5.478,4.289l1.667-2.026l1.43,1.431h1.784l0.834-1.431l-0.356-6.549l1.429-0.835l3.451-4.284l-0.594-16.549l-3.099-8.337l2.265-1.665l-6.548-12.027l-7.979-6.311l-2.26,1.43l0.238,3.692l-6.908,8.931l-11.428-2.384l-0.833-4.286l-7.146-5.716l-15.717-2.498l-6.787-1.188l-2.619-0.241l-5.952-4.883l-12.385-2.857l-8.57-16.551l-0.238-4.642l3.451-1.672v-5.117l2.502-6.311l-2.858-2.858l3.811-3.095l-2.383-1.425h-5.716l-10.238-4.644h-6.549l-5.118,1.43h-5.715l-8.931,4.879l-7.144-0.834l-7.146,2.5l-5.954-1.906l-3.688-3.212l-9.526-1.427l-6.192,4.28l-3.45-1.425l-2.859-2.263l-6.908-1.667l-1.065-1.189l-2.857-0.237l-9.782,5.945l-10.412-1.297l2.428,4.398l2.68,1.995l-0.821,3.842l-0.231,3.758l0.256,2.672l0,0l-0.193,3.208l3.451,3.454l0.239,4.884l-1.072,1.907l-5.119,0.591l-2.621-2.854l-2.619,0.355l-0.476,2.265l1.428,3.688l0.479,2.62v3.333l-0.833,2.381l0.354,1.909l3.336,0.356l1.785,3.094l7.739,6.071v1.906l5.716,6.311l1.902,2.262l1.79,0.595l3.451-3.451l3.096,2.856c0,0,15.395,13.684,13.098,11.193c-2.297-2.491,2.381,5.715,2.381,5.715h2.859l1.667-1.665l1.426,1.428v5.117l7.741,4.287l1.667-0.357l1.191,4.287l6.548,3.81l0.238,2.501l1.188,0.835l5.717-0.24h3.098l4.644,3.457l10.24-0.359l5.476-0.239l1.428,2.265l-1.188,4.883l1.427,1.664l5.715-4.761l7.146-5.239l5.12,0.95L152.525,339.529z',
		guangdong: 'M391.37,382.632l2.265-1.666v-3.45l1.188-1.072l2.859,0.235l4.879,2.264l0.834-1.667l-1.188-2.025l0.354-1.427l3.098-2.619l5.478,1.427l3.096-1.905l2.264,2.265l5.478-1.429l1.07,2.021l-1.666,2.264l-2.859,4.288v1.069l1.67,1.192l11.43-4.525l4.048,2.264l1.19-1.191l-1.19-2.499l0.28-1.663l7.459,1.663l1.431,1.072l2.022-0.24l3.094,3.929l3.451,7.502l-2.26,1.667l-2.023,3.689l-1.786,0.596l-1.664,3.455l-5.716,2.854l-2.266-1.188l-1.426,2.382v0.833h-1.787h-3.098l-2.857,2.023l-2.021-1.188l-2.5,1.663l-6.314,2.619l-5.121-4.05l-0.354,3.217l1.788,4.882l-4.646,1.904l-2.498,3.452l-4.887,1.191l-2.617,1.073h-5.119c0,0-0.869,2.545-3.453,3.452c-2.584,0.904-9.168,3.213-9.168,3.213l-4.522,3.098l-2.265,2.263l4.287,6.903l-2.856,2.501l-3.451-0.238l-4.053-7.381l0.954-5.238v-2.501l2.854-4.646l3.695-0.831l-0.355-2.501l3.809-1.785l0.476-4.288l6.668-5.119l-0.355-6.905l5.119-6.547l-0.24-2.5l1.666-2.381L391.37,382.632z',
		hongkong: 'M417.745,409.005l3.394,0.773l3.453-2.558l1.666,4.582c0,0-5.521,2.673-3.691,1.785c1.828-0.884-4.641-0.355-4.641-0.355l-0.834-3.454L417.745,409.005z',
		taiwan: 'M505.438,371.203l-3.217,19.169l-1.664,6.07v5.123l-1.43,1.427l-3.451-5.119l-3.693-2.858l-3.215-8.571c0,0-0.451-5.62,0.357-7.74c0.809-2.118,5.356-14.05,5.356-14.05l6.313-5.357l4.051,1.904L505.438,371.203z',
		macau: 'M412.032,413.183l-0.96,1.752c0,0,0.889,0.883,3.98,1.086s5.995-0.493,5.995-0.493L410.032,420.183z'
	},
	names: {
		heilongjiang: '黑龙江',
		jilin: '吉林', 
		liaoning: '辽宁', 
		hebei: '河北', 
		shandong: '山东', 
		jiangsu: '江苏', 
		zhejiang: '浙江', 
		anhui: '安徽', 
		henan: '河南', 
		shanxi: '山西', 
		shaanxi: '陕西', 
		gansu: '甘肃', 
		hubei: '湖北', 
		jiangxi: '江西', 
		fujian: '福建', 
		hunan: '湖南', 
		guizhou: '贵州', 
		sichuan: '四川', 
		yunnan: '云南', 
		qinghai: '青海', 
		hainan: '海南', 
		shanghai: '上海', 
		chongqing: '重庆', 
		tianjin: '天津', 
		beijing: '北京', 
		ningxia: '宁夏', 
		neimongol: '内蒙古', 
		guangxi: '广西', 
		xinjiang: '新疆', 
		xizang: '西藏', 
		guangdong: '广东', 
		hongkong: '香港', 
		taiwan: '台湾', 
		macau: '澳门'
	}
};
/*!
 * SVG Map
 * @version v1.0.2
 * @author  Rocky(rockyuse@163.com)
 * @date    2014-01-16
 *
 * (c) 2012-2013 Rocky, http://rockydo.com
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */

;!function (win, $, undefined) {
	var SVGMap = (function () {
		function SVGMap(dom, options) {
			this.dom = dom;
			this.setOptions(options);
			this.render();
		}
		SVGMap.prototype.options = {
			mapName: 'china',
			mapWidth: 500,
			mapHeight: 400,
			stateColorList: ['2770B5', '429DD4', '5AABDA', '1C8DFF', '70B3DD', 'C6E1F4', 'EDF2F6'],
			stateDataAttr: ['stateInitColor', 'stateHoverColor', 'stateSelectedColor', 'baifenbi'],
			stateDataType: 'json',
			stateSettingsXmlPath: '',
			stateData: {},

			strokeWidth: 1,
			strokeColor: 'F9FCFE',

			stateInitColor: 'AAD5FF',
			stateHoverColor: 'feb41c',
			stateSelectedColor: 'E32F02',
			stateDisabledColor: 'eeeeee',

			showTip: true,
			stateTipWidth: 100,
			//stateTipHeight: 50,
			stateTipX: 0,
			stateTipY: -10,
			stateTipHtml: function (stateData, obj) {
				return obj.name;
			},

			hoverCallback: function (stateData, obj) {},
			clickCallback: function (stateData, obj) {},
			external: false
		};

		SVGMap.prototype.setOptions = function (options) {
			if (options == null) {
				options = null;
			}
			this.options = $.extend({}, this.options, options);
			return this;
		};

		SVGMap.prototype.scaleRaphael = function (container, width, height) {
			var wrapper = document.getElementById(container);
			if (!wrapper.style.position) wrapper.style.position = "relative";
			wrapper.style.width = width + "px";
			wrapper.style.height = height + "px";
			wrapper.style.overflow = "hidden";
			var nestedWrapper;
			if (Raphael.type == "VML") {
				wrapper.innerHTML = "<rvml:group style='position : absolute; width: 1000px; height: 1000px; top: 0px; left: 0px' coordsize='1000,1000' class='rvml' id='vmlgroup_" + container + "'><\/rvml:group>";
				nestedWrapper = document.getElementById("vmlgroup_" + container);
			} else {
				wrapper.innerHTML = '<div class="svggroup"></div>';
				nestedWrapper = wrapper.getElementsByClassName("svggroup")[0];
			}
			var paper = new Raphael(nestedWrapper, width, height);
			var vmlDiv;
			if (Raphael.type == "SVG") {
				paper.canvas.setAttribute("viewBox", "0 0 " + width + " " + height);
			} else {
				vmlDiv = wrapper.getElementsByTagName("div")[0];
			}
			paper.changeSize = function (w, h, center, clipping) {
				clipping = !clipping;
				var ratioW = w / width;
				var ratioH = h / height;
				var scale = ratioW < ratioH ? ratioW : ratioH;
				var newHeight = parseInt(height * scale);
				var newWidth = parseInt(width * scale);
				if (Raphael.type == "VML") {
					var txt = document.getElementsByTagName("textpath");
					for (var i in txt) {
						var curr = txt[i];
						if (curr.style) {
							if (!curr._fontSize) {
								var mod = curr.style.font.split("px");
								curr._fontSize = parseInt(mod[0]);
								curr._font = mod[1];
							}
							curr.style.font = curr._fontSize * scale + "px" + curr._font;
						}
					}
					var newSize;
					if (newWidth < newHeight) {
						newSize = newWidth * 1000 / width;
					} else {
						newSize = newHeight * 1000 / height;
					}
					newSize = parseInt(newSize);
					nestedWrapper.style.width = newSize + "px";
					nestedWrapper.style.height = newSize + "px";
					if (clipping) {
						nestedWrapper.style.left = parseInt((w - newWidth) / 2) + "px";
						nestedWrapper.style.top = parseInt((h - newHeight) / 2) + "px";
					}
					vmlDiv.style.overflow = "visible";
				}
				if (clipping) {
					newWidth = w;
					newHeight = h;
				}
				wrapper.style.width = newWidth + "px";
				wrapper.style.height = newHeight + "px";
				paper.setSize(newWidth, newHeight);
				if (center) {
					wrapper.style.position = "absolute";
					wrapper.style.left = parseInt((w - newWidth) / 2) + "px";
					wrapper.style.top = parseInt((h - newHeight) / 2) + "px";
				}
			};
			paper.scaleAll = function (amount) {
				paper.changeSize(width * amount, height * amount);
			};
			paper.changeSize(width, height);
			paper.w = width;
			paper.h = height;
			return paper;
		};

		SVGMap.prototype.render = function () {
			var opt = this.options,
				_self = this.dom,
				mapName = opt.mapName,
				mapConfig = eval(mapName + 'MapConfig');

			var stateData = {};

			if (opt.stateDataType == 'xml') {
				var mapSettings = opt.stateSettingsXmlPath;
				$.ajax({
					type: 'GET',
					url: mapSettings,
					async: false,
					dataType: $.browser.msie ? 'text' : 'xml',
					success: function (data) {
						var xml;
						if ($.browser.msie) {
							xml = new ActiveXObject('Microsoft.XMLDOM');
							xml.async = false;
							xml.loadXML(data);
						} else {
							xml = data;
						}
						var $xml = $(xml);
						$xml.find('stateData').each(function (i) {
							var $node = $(this),
								stateName = $node.attr('stateName');

							stateData[stateName] = {};
							// var attrs = $node[0].attributes;
							// alert(attrs);
							// for(var i in attrs){
							//     stateData[stateName][attrs[i].name] = attrs[i].value;
							// }
							for (var i = 0, len = opt.stateDataAttr.length; i < len; i++) {
								stateData[stateName][opt.stateDataAttr[i]] = $node.attr(opt.stateDataAttr[i]);
							}
						});
					}
				});
			} else {
				stateData = opt.stateData;
			};

			var offsetXY = function (e) {
					var mouseX, mouseY, tipWidth = $('.stateTip').outerWidth(),
						tipHeight = $('.stateTip').outerHeight();
					if (e && e.pageX) {
						mouseX = e.pageX;
						mouseY = e.pageY;
					} else {
						mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
						mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					}
					mouseX = mouseX - tipWidth / 2 + opt.stateTipX < 0 ? 0 : mouseX - tipWidth / 2 + opt.stateTipX;
					mouseY = mouseY - tipHeight + opt.stateTipY < 0 ? mouseY - opt.stateTipY : mouseY - tipHeight + opt.stateTipY;
					return [mouseX, mouseY];
				};

			var current, reTimer;

			var r = this.scaleRaphael(_self.attr('id'), mapConfig.width, mapConfig.height),
				attributes = {
					fill: '#' + opt.stateInitColor,
					cursor: 'pointer',
					stroke: '#' + opt.strokeColor,
					'stroke-width': opt.strokeWidth,
					'stroke-linejoin': 'round'
				};

			var stateColor = {};

			for (var state in mapConfig.shapes) {
				var thisStateData = stateData[state],
					initColor = '#' + (thisStateData && opt.stateColorList[thisStateData.stateInitColor] || opt.stateInitColor),
					hoverColor = '#' + (thisStateData && thisStateData.stateHoverColor || opt.stateHoverColor),
					selectedColor = '#' + (thisStateData && thisStateData.stateSelectedColor || opt.stateSelectedColor),
					disabledColor = '#' + (thisStateData && thisStateData.stateDisabledColor || opt.stateDisabledColor);

				stateColor[state] = {};

				stateColor[state].initColor = initColor;
				stateColor[state].hoverColor = hoverColor;
				stateColor[state].selectedColor = selectedColor;

				var obj = r.path(mapConfig['shapes'][state]);
				obj.id = state;
				obj.name = mapConfig['names'][state];
				obj.attr(attributes);

				if (opt.external) {
					opt.external[obj.id] = obj;
				}

				if (stateData[state] && stateData[state].diabled) {
					obj.attr({
						fill: disabledColor,
						cursor: 'default'
					});
				} else {
					obj.attr({
						fill: initColor
					});

					obj.hover(function (e) {
						if (this != current) {
							this.animate({
								fill: stateColor[this.id].hoverColor
							}, 250);
						}
						if (opt.showTip) {
							clearTimeout(reTimer);
							if ($('.stateTip').length == 0) {
								$(document.body).append('<div class="stateTip"></div');
							}
							$('.stateTip').html(opt.stateTipHtml(stateData, this));
							var _offsetXY = new offsetXY(e);

							$('.stateTip').css({
								width: opt.stateTipWidth || 'auto',
								height: opt.stateTipHeight || 'auto',
								left: _offsetXY[0],
								top: _offsetXY[1]
							}).show();
						}

						opt.hoverCallback(stateData, this);
					});

					obj.mouseout(function () {
						if (this != current) {
							this.animate({
								fill: stateColor[this.id].initColor
							}, 250);
						}
						// $('.stateTip').hide();
						if (opt.showTip) {
							reTimer = setTimeout(function () {
								$('.stateTip').remove();
							}, 100);
						}
					});

					obj.mouseup(function (e) {
						if (current) {
							current.animate({
								fill: stateColor[current.id].initColor
							}, 250);
						}

						this.animate({
							fill: stateColor[this.id].selectedColor
						}, 250);

						current = this;
						opt.clickCallback(stateData, this);
					});
				}
				r.changeSize(opt.mapWidth, opt.mapHeight, false, false);
			}
			document.body.onmousemove = function (e) {
				var _offsetXY = new offsetXY(e);
				$('.stateTip').css({
					left: _offsetXY[0],
					top: _offsetXY[1]
				});
			};
		}
		return SVGMap;
	})();

	$.fn.SVGMap = function (opts) {
		var $this = $(this),
			data = $this.data();

		if (data.SVGMap) {
			delete data.SVGMap;
		}
		if (opts !== false) {
			data.SVGMap = new SVGMap($this, opts);
		}
		return data.SVGMap;
	};
}(window, jQuery);

// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(a){var b="0.3.4",c="hasOwnProperty",d=/[\.\/]/,e="*",f=function(){},g=function(a,b){return a-b},h,i,j={n:{}},k=function(a,b){var c=j,d=i,e=Array.prototype.slice.call(arguments,2),f=k.listeners(a),l=0,m=!1,n,o=[],p={},q=[],r=h,s=[];h=a,i=0;for(var t=0,u=f.length;t<u;t++)"zIndex"in f[t]&&(o.push(f[t].zIndex),f[t].zIndex<0&&(p[f[t].zIndex]=f[t]));o.sort(g);while(o[l]<0){n=p[o[l++]],q.push(n.apply(b,e));if(i){i=d;return q}}for(t=0;t<u;t++){n=f[t];if("zIndex"in n)if(n.zIndex==o[l]){q.push(n.apply(b,e));if(i)break;do{l++,n=p[o[l]],n&&q.push(n.apply(b,e));if(i)break}while(n)}else p[n.zIndex]=n;else{q.push(n.apply(b,e));if(i)break}}i=d,h=r;return q.length?q:null};k.listeners=function(a){var b=a.split(d),c=j,f,g,h,i,k,l,m,n,o=[c],p=[];for(i=0,k=b.length;i<k;i++){n=[];for(l=0,m=o.length;l<m;l++){c=o[l].n,g=[c[b[i]],c[e]],h=2;while(h--)f=g[h],f&&(n.push(f),p=p.concat(f.f||[]))}o=n}return p},k.on=function(a,b){var c=a.split(d),e=j;for(var g=0,h=c.length;g<h;g++)e=e.n,!e[c[g]]&&(e[c[g]]={n:{}}),e=e[c[g]];e.f=e.f||[];for(g=0,h=e.f.length;g<h;g++)if(e.f[g]==b)return f;e.f.push(b);return function(a){+a==+a&&(b.zIndex=+a)}},k.stop=function(){i=1},k.nt=function(a){if(a)return(new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)")).test(h);return h},k.off=k.unbind=function(a,b){var f=a.split(d),g,h,i,k,l,m,n,o=[j];for(k=0,l=f.length;k<l;k++)for(m=0;m<o.length;m+=i.length-2){i=[m,1],g=o[m].n;if(f[k]!=e)g[f[k]]&&i.push(g[f[k]]);else for(h in g)g[c](h)&&i.push(g[h]);o.splice.apply(o,i)}for(k=0,l=o.length;k<l;k++){g=o[k];while(g.n){if(b){if(g.f){for(m=0,n=g.f.length;m<n;m++)if(g.f[m]==b){g.f.splice(m,1);break}!g.f.length&&delete g.f}for(h in g.n)if(g.n[c](h)&&g.n[h].f){var p=g.n[h].f;for(m=0,n=p.length;m<n;m++)if(p[m]==b){p.splice(m,1);break}!p.length&&delete g.n[h].f}}else{delete g.f;for(h in g.n)g.n[c](h)&&g.n[h].f&&delete g.n[h].f}g=g.n}}},k.once=function(a,b){var c=function(){var d=b.apply(this,arguments);k.unbind(a,c);return d};return k.on(a,c)},k.version=b,k.toString=function(){return"You are running Eve "+b},typeof module!="undefined"&&module.exports?module.exports=k:typeof define!="undefined"?define("eve",[],function(){return k}):a.eve=k})(this),function(){function cF(a){for(var b=0;b<cy.length;b++)cy[b].el.paper==a&&cy.splice(b--,1)}function cE(b,d,e,f,h,i){e=Q(e);var j,k,l,m=[],o,p,q,t=b.ms,u={},v={},w={};if(f)for(y=0,z=cy.length;y<z;y++){var x=cy[y];if(x.el.id==d.id&&x.anim==b){x.percent!=e?(cy.splice(y,1),l=1):k=x,d.attr(x.totalOrigin);break}}else f=+v;for(var y=0,z=b.percents.length;y<z;y++){if(b.percents[y]==e||b.percents[y]>f*b.top){e=b.percents[y],p=b.percents[y-1]||0,t=t/b.top*(e-p),o=b.percents[y+1],j=b.anim[e];break}f&&d.attr(b.anim[b.percents[y]])}if(!!j){if(!k){for(var A in j)if(j[g](A))if(U[g](A)||d.paper.customAttributes[g](A)){u[A]=d.attr(A),u[A]==null&&(u[A]=T[A]),v[A]=j[A];switch(U[A]){case C:w[A]=(v[A]-u[A])/t;break;case"colour":u[A]=a.getRGB(u[A]);var B=a.getRGB(v[A]);w[A]={r:(B.r-u[A].r)/t,g:(B.g-u[A].g)/t,b:(B.b-u[A].b)/t};break;case"path":var D=bR(u[A],v[A]),E=D[1];u[A]=D[0],w[A]=[];for(y=0,z=u[A].length;y<z;y++){w[A][y]=[0];for(var F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(E[y][F]-u[A][y][F])/t}break;case"transform":var H=d._,I=ca(H[A],v[A]);if(I){u[A]=I.from,v[A]=I.to,w[A]=[],w[A].real=!0;for(y=0,z=u[A].length;y<z;y++){w[A][y]=[u[A][y][0]];for(F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(v[A][y][F]-u[A][y][F])/t}}else{var J=d.matrix||new cb,K={_:{transform:H.transform},getBBox:function(){return d.getBBox(1)}};u[A]=[J.a,J.b,J.c,J.d,J.e,J.f],b$(K,v[A]),v[A]=K._.transform,w[A]=[(K.matrix.a-J.a)/t,(K.matrix.b-J.b)/t,(K.matrix.c-J.c)/t,(K.matrix.d-J.d)/t,(K.matrix.e-J.e)/t,(K.matrix.f-J.f)/t]}break;case"csv":var L=r(j[A])[s](c),M=r(u[A])[s](c);if(A=="clip-rect"){u[A]=M,w[A]=[],y=M.length;while(y--)w[A][y]=(L[y]-u[A][y])/t}v[A]=L;break;default:L=[][n](j[A]),M=[][n](u[A]),w[A]=[],y=d.paper.customAttributes[A].length;while(y--)w[A][y]=((L[y]||0)-(M[y]||0))/t}}var O=j.easing,P=a.easing_formulas[O];if(!P){P=r(O).match(N);if(P&&P.length==5){var R=P;P=function(a){return cC(a,+R[1],+R[2],+R[3],+R[4],t)}}else P=bf}q=j.start||b.start||+(new Date),x={anim:b,percent:e,timestamp:q,start:q+(b.del||0),status:0,initstatus:f||0,stop:!1,ms:t,easing:P,from:u,diff:w,to:v,el:d,callback:j.callback,prev:p,next:o,repeat:i||b.times,origin:d.attr(),totalOrigin:h},cy.push(x);if(f&&!k&&!l){x.stop=!0,x.start=new Date-t*f;if(cy.length==1)return cA()}l&&(x.start=new Date-x.ms*f),cy.length==1&&cz(cA)}else k.initstatus=f,k.start=new Date-k.ms*f;eve("raphael.anim.start."+d.id,d,b)}}function cD(a,b){var c=[],d={};this.ms=b,this.times=1;if(a){for(var e in a)a[g](e)&&(d[Q(e)]=a[e],c.push(Q(e)));c.sort(bd)}this.anim=d,this.top=c[c.length-1],this.percents=c}function cC(a,b,c,d,e,f){function o(a,b){var c,d,e,f,j,k;for(e=a,k=0;k<8;k++){f=m(e)-a;if(z(f)<b)return e;j=(3*i*e+2*h)*e+g;if(z(j)<1e-6)break;e=e-f/j}c=0,d=1,e=a;if(e<c)return c;if(e>d)return d;while(c<d){f=m(e);if(z(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}function n(a,b){var c=o(a,b);return((l*c+k)*c+j)*c}function m(a){return((i*a+h)*a+g)*a}var g=3*b,h=3*(d-b)-g,i=1-g-h,j=3*c,k=3*(e-c)-j,l=1-j-k;return n(a,1/(200*f))}function cq(){return this.x+q+this.y+q+this.width+" × "+this.height}function cp(){return this.x+q+this.y}function cb(a,b,c,d,e,f){a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function bH(b,c,d){b=a._path2curve(b),c=a._path2curve(c);var e,f,g,h,i,j,k,l,m,n,o=d?0:[];for(var p=0,q=b.length;p<q;p++){var r=b[p];if(r[0]=="M")e=i=r[1],f=j=r[2];else{r[0]=="C"?(m=[e,f].concat(r.slice(1)),e=m[6],f=m[7]):(m=[e,f,e,f,i,j,i,j],e=i,f=j);for(var s=0,t=c.length;s<t;s++){var u=c[s];if(u[0]=="M")g=k=u[1],h=l=u[2];else{u[0]=="C"?(n=[g,h].concat(u.slice(1)),g=n[6],h=n[7]):(n=[g,h,g,h,k,l,k,l],g=k,h=l);var v=bG(m,n,d);if(d)o+=v;else{for(var w=0,x=v.length;w<x;w++)v[w].segment1=p,v[w].segment2=s,v[w].bez1=m,v[w].bez2=n;o=o.concat(v)}}}}}return o}function bG(b,c,d){var e=a.bezierBBox(b),f=a.bezierBBox(c);if(!a.isBBoxIntersect(e,f))return d?0:[];var g=bB.apply(0,b),h=bB.apply(0,c),i=~~(g/5),j=~~(h/5),k=[],l=[],m={},n=d?0:[];for(var o=0;o<i+1;o++){var p=a.findDotsAtSegment.apply(a,b.concat(o/i));k.push({x:p.x,y:p.y,t:o/i})}for(o=0;o<j+1;o++)p=a.findDotsAtSegment.apply(a,c.concat(o/j)),l.push({x:p.x,y:p.y,t:o/j});for(o=0;o<i;o++)for(var q=0;q<j;q++){var r=k[o],s=k[o+1],t=l[q],u=l[q+1],v=z(s.x-r.x)<.001?"y":"x",w=z(u.x-t.x)<.001?"y":"x",x=bD(r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y);if(x){if(m[x.x.toFixed(4)]==x.y.toFixed(4))continue;m[x.x.toFixed(4)]=x.y.toFixed(4);var y=r.t+z((x[v]-r[v])/(s[v]-r[v]))*(s.t-r.t),A=t.t+z((x[w]-t[w])/(u[w]-t[w]))*(u.t-t.t);y>=0&&y<=1&&A>=0&&A<=1&&(d?n++:n.push({x:x.x,y:x.y,t1:y,t2:A}))}}return n}function bF(a,b){return bG(a,b,1)}function bE(a,b){return bG(a,b)}function bD(a,b,c,d,e,f,g,h){if(!(x(a,c)<y(e,g)||y(a,c)>x(e,g)||x(b,d)<y(f,h)||y(b,d)>x(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(!k)return;var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(n<+y(a,c).toFixed(2)||n>+x(a,c).toFixed(2)||n<+y(e,g).toFixed(2)||n>+x(e,g).toFixed(2)||o<+y(b,d).toFixed(2)||o>+x(b,d).toFixed(2)||o<+y(f,h).toFixed(2)||o>+x(f,h).toFixed(2))return;return{x:l,y:m}}}function bC(a,b,c,d,e,f,g,h,i){if(!(i<0||bB(a,b,c,d,e,f,g,h)<i)){var j=1,k=j/2,l=j-k,m,n=.01;m=bB(a,b,c,d,e,f,g,h,l);while(z(m-i)>n)k/=2,l+=(m<i?1:-1)*k,m=bB(a,b,c,d,e,f,g,h,l);return l}}function bB(a,b,c,d,e,f,g,h,i){i==null&&(i=1),i=i>1?1:i<0?0:i;var j=i/2,k=12,l=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],m=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0;for(var o=0;o<k;o++){var p=j*l[o]+j,q=bA(p,a,c,e,g),r=bA(p,b,d,f,h),s=q*q+r*r;n+=m[o]*w.sqrt(s)}return j*n}function bA(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function by(a,b){var c=[];for(var d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function bx(){return this.hex}function bv(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];if(h[g](f)){bu(i,f);return c?c(h[f]):h[f]}i.length>=1e3&&delete h[i.shift()],i.push(f),h[f]=a[m](b,e);return c?c(h[f]):h[f]}return d}function bu(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function bm(a){if(Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[g](c)&&(b[c]=bm(a[c]));return b}function a(c){if(a.is(c,"function"))return b?c():eve.on("raphael.DOMload",c);if(a.is(c,E))return a._engine.create[m](a,c.splice(0,3+a.is(c[0],C))).add(c);var d=Array.prototype.slice.call(arguments,0);if(a.is(d[d.length-1],"function")){var e=d.pop();return b?e.call(a._engine.create[m](a,d)):eve.on("raphael.DOMload",function(){e.call(a._engine.create[m](a,d))})}return a._engine.create[m](a,arguments)}a.version="2.1.0",a.eve=eve;var b,c=/[, ]+/,d={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},e=/\{(\d+)\}/g,f="prototype",g="hasOwnProperty",h={doc:document,win:window},i={was:Object.prototype[g].call(h.win,"Raphael"),is:h.win.Raphael},j=function(){this.ca=this.customAttributes={}},k,l="appendChild",m="apply",n="concat",o="createTouch"in h.doc,p="",q=" ",r=String,s="split",t="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[s](q),u={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},v=r.prototype.toLowerCase,w=Math,x=w.max,y=w.min,z=w.abs,A=w.pow,B=w.PI,C="number",D="string",E="array",F="toString",G="fill",H=Object.prototype.toString,I={},J="push",K=a._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,L=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,M={NaN:1,Infinity:1,"-Infinity":1},N=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,O=w.round,P="setAttribute",Q=parseFloat,R=parseInt,S=r.prototype.toUpperCase,T=a._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},U=a._availableAnimAttrs={blur:C,"clip-rect":"csv",cx:C,cy:C,fill:"colour","fill-opacity":C,"font-size":C,height:C,opacity:C,path:"path",r:C,rx:C,ry:C,stroke:"colour","stroke-opacity":C,"stroke-width":C,transform:"transform",width:C,x:C,y:C},V=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,W=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,X={hs:1,rg:1},Y=/,?([achlmqrstvxz]),?/gi,Z=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,$=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,_=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,ba=a._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,bb={},bc=function(a,b){return a.key-b.key},bd=function(a,b){return Q(a)-Q(b)},be=function(){},bf=function(a){return a},bg=a._rectPath=function(a,b,c,d,e){if(e)return[["M",a+e,b],["l",c-e*2,0],["a",e,e,0,0,1,e,e],["l",0,d-e*2],["a",e,e,0,0,1,-e,e],["l",e*2-c,0],["a",e,e,0,0,1,-e,-e],["l",0,e*2-d],["a",e,e,0,0,1,e,-e],["z"]];return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},bh=function(a,b,c,d){d==null&&(d=c);return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},bi=a._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return bg(b.x,b.y,b.width,b.height)}},bj=a.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;a=bR(a);for(e=0,g=a.length;e<g;e++){i=a[e];for(f=1,h=i.length;f<h;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d}return a};a._g=h,a.type=h.win.SVGAngle||h.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(a.type=="VML"){var bk=h.doc.createElement("div"),bl;bk.innerHTML='<v:shape adj="1"/>',bl=bk.firstChild,bl.style.behavior="url(#default#VML)";if(!bl||typeof bl.adj!="object")return a.type=p;bk=null}a.svg=!(a.vml=a.type=="VML"),a._Paper=j,a.fn=k=j.prototype=a.prototype,a._id=0,a._oid=0,a.is=function(a,b){b=v.call(b);if(b=="finite")return!M[g](+a);if(b=="array")return a instanceof Array;return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||H.call(a).slice(8,-1).toLowerCase()==b},a.angle=function(b,c,d,e,f,g){if(f==null){var h=b-d,i=c-e;if(!h&&!i)return 0;return(180+w.atan2(-i,-h)*180/B+360)%360}return a.angle(b,c,f,g)-a.angle(d,e,f,g)},a.rad=function(a){return a%360*B/180},a.deg=function(a){return a*180/B%360},a.snapTo=function(b,c,d){d=a.is(d,"finite")?d:10;if(a.is(b,E)){var e=b.length;while(e--)if(z(b[e]-c)<=d)return b[e]}else{b=+b;var f=c%b;if(f<d)return c-f;if(f>b-d)return c-f+b}return c};var bn=a.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=w.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)});a.setWindow=function(b){eve("raphael.setWindow",a,h.win,b),h.win=b,h.doc=h.win.document,a._engine.initWin&&a._engine.initWin(h.win)};var bo=function(b){if(a.vml){var c=/^\s+|\s+$/g,d;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),d=e.body}catch(f){d=createPopup().document.body}var g=d.createTextRange();bo=bv(function(a){try{d.style.color=r(a).replace(c,p);var b=g.queryCommandValue("ForeColor");b=(b&255)<<16|b&65280|(b&16711680)>>>16;return"#"+("000000"+b.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=h.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",h.doc.body.appendChild(i),bo=bv(function(a){i.style.color=a;return h.doc.defaultView.getComputedStyle(i,p).getPropertyValue("color")})}return bo(b)},bp=function(){return"hsb("+[this.h,this.s,this.b]+")"},bq=function(){return"hsl("+[this.h,this.s,this.l]+")"},br=function(){return this.hex},bs=function(b,c,d){c==null&&a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b&&(d=b.b,c=b.g,b=b.r);if(c==null&&a.is(b,D)){var e=a.getRGB(b);b=e.r,c=e.g,d=e.b}if(b>1||c>1||d>1)b/=255,c/=255,d/=255;return[b,c,d]},bt=function(b,c,d,e){b*=255,c*=255,d*=255;var f={r:b,g:c,b:d,hex:a.rgb(b,c,d),toString:br};a.is(e,"finite")&&(f.opacity=e);return f};a.color=function(b){var c;a.is(b,"object")&&"h"in b&&"s"in b&&"b"in b?(c=a.hsb2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):a.is(b,"object")&&"h"in b&&"s"in b&&"l"in b?(c=a.hsl2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):(a.is(b,"string")&&(b=a.getRGB(b)),a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b?(c=a.rgb2hsl(b),b.h=c.h,b.s=c.s,b.l=c.l,c=a.rgb2hsb(b),b.v=c.b):(b={hex:"none"},b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1)),b.toString=br;return b},a.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;a=a%360/60,i=c*b,h=i*(1-z(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);if(a>1||b>1||c>1)a/=360,b/=100,c/=100;a*=360;var e,f,g,h,i;a=a%360/60,i=2*b*(c<.5?c:1-c),h=i*(1-z(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.rgb2hsb=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;f=x(a,b,c),g=f-y(a,b,c),d=g==0?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=g==0?0:g/f;return{h:d,s:e,b:f,toString:bp}},a.rgb2hsl=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;g=x(a,b,c),h=y(a,b,c),i=g-h,d=i==0?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=i==0?0:f<.5?i/(2*f):i/(2-2*f);return{h:d,s:e,l:f,toString:bq}},a._path2string=function(){return this.join(",").replace(Y,"$1")};var bw=a._preload=function(a,b){var c=h.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,h.doc.body.removeChild(this)},c.onerror=function(){h.doc.body.removeChild(this)},h.doc.body.appendChild(c),c.src=a};a.getRGB=bv(function(b){if(!b||!!((b=r(b)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx};if(b=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:bx};!X[g](b.toLowerCase().substring(0,2))&&b.charAt()!="#"&&(b=bo(b));var c,d,e,f,h,i,j,k=b.match(L);if(k){k[2]&&(f=R(k[2].substring(5),16),e=R(k[2].substring(3,5),16),d=R(k[2].substring(1,3),16)),k[3]&&(f=R((i=k[3].charAt(3))+i,16),e=R((i=k[3].charAt(2))+i,16),d=R((i=k[3].charAt(1))+i,16)),k[4]&&(j=k[4][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),k[1].toLowerCase().slice(0,4)=="rgba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100));if(k[5]){j=k[5][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsb2rgb(d,e,f,h)}if(k[6]){j=k[6][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsla"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsl2rgb(d,e,f,h)}k={r:d,g:e,b:f,toString:bx},k.hex="#"+(16777216|f|e<<8|d<<16).toString(16).slice(1),a.is(h,"finite")&&(k.opacity=h);return k}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx}},a),a.hsb=bv(function(b,c,d){return a.hsb2rgb(b,c,d).hex}),a.hsl=bv(function(b,c,d){return a.hsl2rgb(b,c,d).hex}),a.rgb=bv(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),a.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b}));return c.hex},a.getColor.reset=function(){delete this.start},a.parsePathString=function(b){if(!b)return null;var c=bz(b);if(c.arr)return bJ(c.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];a.is(b,E)&&a.is(b[0],E)&&(e=bJ(b)),e.length||r(b).replace(Z,function(a,b,c){var f=[],g=b.toLowerCase();c.replace(_,function(a,b){b&&f.push(+b)}),g=="m"&&f.length>2&&(e.push([b][n](f.splice(0,2))),g="l",b=b=="m"?"l":"L");if(g=="r")e.push([b][n](f));else while(f.length>=d[g]){e.push([b][n](f.splice(0,d[g])));if(!d[g])break}}),e.toString=a._path2string,c.arr=bJ(e);return e},a.parseTransformString=bv(function(b){if(!b)return null;var c={r:3,s:4,t:2,m:6},d=[];a.is(b,E)&&a.is(b[0],E)&&(d=bJ(b)),d.length||r(b).replace($,function(a,b,c){var e=[],f=v.call(b);c.replace(_,function(a,b){b&&e.push(+b)}),d.push([b][n](e))}),d.toString=a._path2string;return d});var bz=function(a){var b=bz.ps=bz.ps||{};b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[g](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])});return b[a]};a.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=A(j,3),l=A(j,2),m=i*i,n=m*i,o=k*a+l*3*i*c+j*3*i*i*e+n*g,p=k*b+l*3*i*d+j*3*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,x=j*e+i*g,y=j*f+i*h,z=90-w.atan2(q-s,r-t)*180/B;(q>s||r<t)&&(z+=180);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:x,y:y},alpha:z}},a.bezierBBox=function(b,c,d,e,f,g,h,i){a.is(b,"array")||(b=[b,c,d,e,f,g,h,i]);var j=bQ.apply(null,b);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},a.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},a.isBBoxIntersect=function(b,c){var d=a.isPointInsideBBox;return d(c,b.x,b.y)||d(c,b.x2,b.y)||d(c,b.x,b.y2)||d(c,b.x2,b.y2)||d(b,c.x,c.y)||d(b,c.x2,c.y)||d(b,c.x,c.y2)||d(b,c.x2,c.y2)||(b.x<c.x2&&b.x>c.x||c.x<b.x2&&c.x>b.x)&&(b.y<c.y2&&b.y>c.y||c.y<b.y2&&c.y>b.y)},a.pathIntersection=function(a,b){return bH(a,b)},a.pathIntersectionNumber=function(a,b){return bH(a,b,1)},a.isPointInsidePath=function(b,c,d){var e=a.pathBBox(b);return a.isPointInsideBBox(e,c,d)&&bH(b,[["M",c,d],["H",e.x2+10]],1)%2==1},a._removedFactory=function(a){return function(){eve("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var bI=a.pathBBox=function(a){var b=bz(a);if(b.bbox)return b.bbox;if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=bR(a);var c=0,d=0,e=[],f=[],g;for(var h=0,i=a.length;h<i;h++){g=a[h];if(g[0]=="M")c=g[1],d=g[2],e.push(c),f.push(d);else{var j=bQ(c,d,g[1],g[2],g[3],g[4],g[5],g[6]);e=e[n](j.min.x,j.max.x),f=f[n](j.min.y,j.max.y),c=g[5],d=g[6]}}var k=y[m](0,e),l=y[m](0,f),o=x[m](0,e),p=x[m](0,f),q={x:k,y:l,x2:o,y2:p,width:o-k,height:p-l};b.bbox=bm(q);return q},bJ=function(b){var c=bm(b);c.toString=a._path2string;return c},bK=a._pathToRelative=function(b){var c=bz(b);if(c.rel)return bJ(c.rel);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=b[0][1],f=b[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=b.length;j<k;j++){var l=d[j]=[],m=b[j];if(m[0]!=v.call(m[0])){l[0]=v.call(m[0]);switch(l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;n<o;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}}else{l=d[j]=[],m[0]=="m"&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;p<q;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}d.toString=a._path2string,c.rel=bJ(d);return d},bL=a._pathToAbsolute=function(b){var c=bz(b);if(c.abs)return bJ(c.abs);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);if(!b||!b.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=+b[0][1],f=+b[0][2],g=e,h=f,i++,d[0]=["M",e,f]);var j=b.length==3&&b[0][0]=="M"&&b[1][0].toUpperCase()=="R"&&b[2][0].toUpperCase()=="Z";for(var k,l,m=i,o=b.length;m<o;m++){d.push(k=[]),l=b[m];if(l[0]!=S.call(l[0])){k[0]=S.call(l[0]);switch(k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":var p=[e,f][n](l.slice(1));for(var q=2,r=p.length;q<r;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[n](by(p,j));break;case"M":g=+l[1]+e,h=+l[2]+f;default:for(q=1,r=l.length;q<r;q++)k[q]=+l[q]+(q%2?e:f)}}else if(l[0]=="R")p=[e,f][n](l.slice(1)),d.pop(),d=d[n](by(p,j)),k=["R"][n](l.slice(-2));else for(var s=0,t=l.length;s<t;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=h;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],h=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}d.toString=a._path2string,c.abs=bJ(d);return d},bM=function(a,b,c,d){return[a,b,c,d,c,d]},bN=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},bO=function(a,b,c,d,e,f,g,h,i,j){var k=B*120/180,l=B/180*(+e||0),m=[],o,p=bv(function(a,b,c){var d=a*w.cos(c)-b*w.sin(c),e=a*w.sin(c)+b*w.cos(c);return{x:d,y:e}});if(!j){o=p(a,b,-l),a=o.x,b=o.y,o=p(h,i,-l),h=o.x,i=o.y;var q=w.cos(B/180*e),r=w.sin(B/180*e),t=(a-h)/2,u=(b-i)/2,v=t*t/(c*c)+u*u/(d*d);v>1&&(v=w.sqrt(v),c=v*c,d=v*d);var x=c*c,y=d*d,A=(f==g?-1:1)*w.sqrt(z((x*y-x*u*u-y*t*t)/(x*u*u+y*t*t))),C=A*c*u/d+(a+h)/2,D=A*-d*t/c+(b+i)/2,E=w.asin(((b-D)/d).toFixed(9)),F=w.asin(((i-D)/d).toFixed(9));E=a<C?B-E:E,F=h<C?B-F:F,E<0&&(E=B*2+E),F<0&&(F=B*2+F),g&&E>F&&(E=E-B*2),!g&&F>E&&(F=F-B*2)}else E=j[0],F=j[1],C=j[2],D=j[3];var G=F-E;if(z(G)>k){var H=F,I=h,J=i;F=E+k*(g&&F>E?1:-1),h=C+c*w.cos(F),i=D+d*w.sin(F),m=bO(h,i,c,d,e,0,g,I,J,[F,H,C,D])}G=F-E;var K=w.cos(E),L=w.sin(E),M=w.cos(F),N=w.sin(F),O=w.tan(G/4),P=4/3*c*O,Q=4/3*d*O,R=[a,b],S=[a+P*L,b-Q*K],T=[h+P*N,i-Q*M],U=[h,i];S[0]=2*R[0]-S[0],S[1]=2*R[1]-S[1];if(j)return[S,T,U][n](m);m=[S,T,U][n](m).join()[s](",");var V=[];for(var W=0,X=m.length;W<X;W++)V[W]=W%2?p(m[W-1],m[W],l).y:p(m[W],m[W+1],l).x;return V},bP=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:A(j,3)*a+A(j,2)*3*i*c+j*3*i*i*e+A(i,3)*g,y:A(j,3)*b+A(j,2)*3*i*d+j*3*i*i*f+A(i,3)*h}},bQ=bv(function(a,b,c,d,e,f,g,h){var i=e-2*c+a-(g-2*e+c),j=2*(c-a)-2*(e-c),k=a-c,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,o=[b,h],p=[a,g],q;z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y)),i=f-2*d+b-(h-2*f+d),j=2*(d-b)-2*(f-d),k=b-d,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y));return{min:{x:y[m](0,p),y:y[m](0,o)},max:{x:x[m](0,p),y:x[m](0,o)}}}),bR=a._path2curve=bv(function(a,b){var c=!b&&bz(a);if(!b&&c.curve)return bJ(c.curve);var d=bL(a),e=b&&bL(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null);switch(a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][n](bO[m](0,[b.x,b.y][n](a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d][n](a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"][n](bN(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][n](bN(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][n](bM(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][n](bM(b.x,b.y,a[1],b.y));break;case"V":a=["C"][n](bM(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][n](bM(b.x,b.y,b.X,b.Y))}return a},i=function(a,b){if(a[b].length>7){a[b].shift();var c=a[b];while(c.length)a.splice(b++,0,["C"][n](c.splice(0,6)));a.splice(b,1),l=x(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&a[g][0]=="M"&&b[g][0]!="M"&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=x(d.length,e&&e.length||0))};for(var k=0,l=x(d.length,e&&e.length||0);k<l;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var o=d[k],p=e&&e[k],q=o.length,r=e&&p.length;f.x=o[q-2],f.y=o[q-1],f.bx=Q(o[q-4])||f.x,f.by=Q(o[q-3])||f.y,g.bx=e&&(Q(p[r-4])||g.x),g.by=e&&(Q(p[r-3])||g.y),g.x=e&&p[r-2],g.y=e&&p[r-1]}e||(c.curve=bJ(d));return e?[d,e]:d},null,bJ),bS=a._parseDots=bv(function(b){var c=[];for(var d=0,e=b.length;d<e;d++){var f={},g=b[d].match(/^([^:]*):?([\d\.]*)/);f.color=a.getRGB(g[1]);if(f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),c.push(f)}for(d=1,e=c.length-1;d<e;d++)if(!c[d].offset){var h=Q(c[d-1].offset||0),i=0;for(var j=d+1;j<e;j++)if(c[j].offset){i=c[j].offset;break}i||(i=100,j=e),i=Q(i);var k=(i-h)/(j-d+1);for(;d<j;d++)h+=k,c[d].offset=h+"%"}return c}),bT=a._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)},bU=a._tofront=function(a,b){b.top!==a&&(bT(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},bV=a._toback=function(a,b){b.bottom!==a&&(bT(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},bW=a._insertafter=function(a,b,c){bT(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},bX=a._insertbefore=function(a,b,c){bT(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},bY=a.toMatrix=function(a,b){var c=bI(a),d={_:{transform:p},getBBox:function(){return c}};b$(d,b);return d.matrix},bZ=a.transformPath=function(a,b){return bj(a,bY(a,b))},b$=a._extractTransform=function(b,c){if(c==null)return b._.transform;c=r(c).replace(/\.{3}|\u2026/g,b._.transform||p);var d=a.parseTransformString(c),e=0,f=0,g=0,h=1,i=1,j=b._,k=new cb;j.transform=d||[];if(d)for(var l=0,m=d.length;l<m;l++){var n=d[l],o=n.length,q=r(n[0]).toLowerCase(),s=n[0]!=q,t=s?k.invert():0,u,v,w,x,y;q=="t"&&o==3?s?(u=t.x(0,0),v=t.y(0,0),w=t.x(n[1],n[2]),x=t.y(n[1],n[2]),k.translate(w-u,x-v)):k.translate(n[1],n[2]):q=="r"?o==2?(y=y||b.getBBox(1),k.rotate(n[1],y.x+y.width/2,y.y+y.height/2),e+=n[1]):o==4&&(s?(w=t.x(n[2],n[3]),x=t.y(n[2],n[3]),k.rotate(n[1],w,x)):k.rotate(n[1],n[2],n[3]),e+=n[1]):q=="s"?o==2||o==3?(y=y||b.getBBox(1),k.scale(n[1],n[o-1],y.x+y.width/2,y.y+y.height/2),h*=n[1],i*=n[o-1]):o==5&&(s?(w=t.x(n[3],n[4]),x=t.y(n[3],n[4]),k.scale(n[1],n[2],w,x)):k.scale(n[1],n[2],n[3],n[4]),h*=n[1],i*=n[2]):q=="m"&&o==7&&k.add(n[1],n[2],n[3],n[4],n[5],n[6]),j.dirtyT=1,b.matrix=k}b.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,h==1&&i==1&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1},b_=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return a.length==4?[b,0,a[2],a[3]]:[b,0];case"s":return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]}},ca=a._equaliseTransform=function(b,c){c=r(c).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],c=a.parseTransformString(c)||[];var d=x(b.length,c.length),e=[],f=[],g=0,h,i,j,k;for(;g<d;g++){j=b[g]||b_(c[g]),k=c[g]||b_(j);if(j[0]!=k[0]||j[0].toLowerCase()=="r"&&(j[2]!=k[2]||j[3]!=k[3])||j[0].toLowerCase()=="s"&&(j[3]!=k[3]||j[4]!=k[4]))return;e[g]=[],f[g]=[];for(h=0,i=x(j.length,k.length);h<i;h++)h in j&&(e[g][h]=j[h]),h in k&&(f[g][h]=k[h])}return{from:e,to:f}};a._getContainer=function(b,c,d,e){var f;f=e==null&&!a.is(b,"object")?h.doc.getElementById(b):b;if(f!=null){if(f.tagName)return c==null?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:c,height:d};return{container:1,x:b,y:c,width:d,height:e}}},a.pathToRelative=bK,a._engine={},a.path2curve=bR,a.matrix=function(a,b,c,d,e,f){return new cb(a,b,c,d,e,f)},function(b){function d(a){var b=w.sqrt(c(a));a[0]&&(a[0]/=b),a[1]&&(a[1]/=b)}function c(a){return a[0]*a[0]+a[1]*a[1]}b.add=function(a,b,c,d,e,f){var g=[[],[],[]],h=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],i=[[a,c,e],[b,d,f],[0,0,1]],j,k,l,m;a&&a instanceof cb&&(i=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]);for(j=0;j<3;j++)for(k=0;k<3;k++){m=0;for(l=0;l<3;l++)m+=h[j][l]*i[l][k];g[j][k]=m}this.a=g[0][0],this.b=g[1][0],this.c=g[0][1],this.d=g[1][1],this.e=g[0][2],this.f=g[1][2]},b.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new cb(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},b.clone=function(){return new cb(this.a,this.b,this.c,this.d,this.e,this.f)},b.translate=function(a,b){this.add(1,0,0,1,a,b)},b.scale=function(a,b,c,d){b==null&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},b.rotate=function(b,c,d){b=a.rad(b),c=c||0,d=d||0;var e=+w.cos(b).toFixed(9),f=+w.sin(b).toFixed(9);this.add(e,f,-f,e,c,d),this.add(1,0,0,1,-c,-d)},b.x=function(a,b){return a*this.a+b*this.c+this.e},b.y=function(a,b){return a*this.b+b*this.d+this.f},b.get=function(a){return+this[r.fromCharCode(97+a)].toFixed(4)},b.toString=function(){return a.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},b.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},b.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},b.split=function(){var b={};b.dx=this.e,b.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];b.scalex=w.sqrt(c(e[0])),d(e[0]),b.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*b.shear,e[1][1]-e[0][1]*b.shear],b.scaley=w.sqrt(c(e[1])),d(e[1]),b.shear/=b.scaley;var f=-e[0][1],g=e[1][1];g<0?(b.rotate=a.deg(w.acos(g)),f<0&&(b.rotate=360-b.rotate)):b.rotate=a.deg(w.asin(f)),b.isSimple=!+b.shear.toFixed(9)&&(b.scalex.toFixed(9)==b.scaley.toFixed(9)||!b.rotate),b.isSuperSimple=!+b.shear.toFixed(9)&&b.scalex.toFixed(9)==b.scaley.toFixed(9)&&!b.rotate,b.noRotation=!+b.shear.toFixed(9)&&!b.rotate;return b},b.toTransformString=function(a){var b=a||this[s]();if(b.isSimple){b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4);return(b.dx||b.dy?"t"+[b.dx,b.dy]:p)+(b.scalex!=1||b.scaley!=1?"s"+[b.scalex,b.scaley,0,0]:p)+(b.rotate?"r"+[b.rotate,0,0]:p)}return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(cb.prototype);var cc=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(cc&&cc[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&cc&&cc[1]<8?k.safari=function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:k.safari=be;var cd=function(){this.returnValue=!1},ce=function(){return this.originalEvent.preventDefault()},cf=function(){this.cancelBubble=!0},cg=function(){return this.originalEvent.stopPropagation()},ch=function(){if(h.doc.addEventListener)return function(a,b,c,d){var e=o&&u[b]?u[b]:b,f=function(e){var f=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,i=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,j=e.clientX+i,k=e.clientY+f;if(o&&u[g](b))for(var l=0,m=e.targetTouches&&e.targetTouches.length;l<m;l++)if(e.targetTouches[l].target==a){var n=e;e=e.targetTouches[l],e.originalEvent=n,e.preventDefault=ce,e.stopPropagation=cg;break}return c.call(d,e,j,k)};a.addEventListener(e,f,!1);return function(){a.removeEventListener(e,f,!1);return!0}};if(h.doc.attachEvent)return function(a,b,c,d){var e=function(a){a=a||h.win.event;var b=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;a.preventDefault=a.preventDefault||cd,a.stopPropagation=a.stopPropagation||cf;return c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){a.detachEvent("on"+b,e);return!0};return f}}(),ci=[],cj=function(a){var b=a.clientX,c=a.clientY,d=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f,g=ci.length;while(g--){f=ci[g];if(o){var i=a.touches.length,j;while(i--){j=a.touches[i];if(j.identifier==f.el._drag.id){b=j.clientX,c=j.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}}else a.preventDefault();var k=f.el.node,l,m=k.nextSibling,n=k.parentNode,p=k.style.display;h.win.opera&&n.removeChild(k),k.style.display="none",l=f.el.paper.getElementByPoint(b,c),k.style.display=p,h.win.opera&&(m?n.insertBefore(k,m):n.appendChild(k)),l&&eve("raphael.drag.over."+f.el.id,f.el,l),b+=e,c+=d,eve("raphael.drag.move."+f.el.id,f.move_scope||f.el,b-f.el._drag.x,c-f.el._drag.y,b,c,a)}},ck=function(b){a.unmousemove(cj).unmouseup(ck);var c=ci.length,d;while(c--)d=ci[c],d.el._drag={},eve("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,b);ci=[]},cl=a.el={};for(var cm=t.length;cm--;)(function(b){a[b]=cl[b]=function(c,d){a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:ch(this.shape||this.node||h.doc,b,c,d||this)}));return this},a["un"+b]=cl["un"+b]=function(a){var c=this.events||[],d=c.length;while(d--)if(c[d].name==b&&c[d].f==a){c[d].unbind(),c.splice(d,1),!c.length&&delete this.events;return this}return this}})(t[cm]);cl.data=function(b,c){var d=bb[this.id]=bb[this.id]||{};if(arguments.length==1){if(a.is(b,"object")){for(var e in b)b[g](e)&&this.data(e,b[e]);return this}eve("raphael.data.get."+this.id,this,d[b],b);return d[b]}d[b]=c,eve("raphael.data.set."+this.id,this,c,b);return this},cl.removeData=function(a){a==null?bb[this.id]={}:bb[this.id]&&delete bb[this.id][a];return this},cl.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},cl.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var cn=[];cl.drag=function(b,c,d,e,f,g){function i(i){(i.originalEvent||i).preventDefault();var j=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,k=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft;this._drag.x=i.clientX+k,this._drag.y=i.clientY+j,this._drag.id=i.identifier,!ci.length&&a.mousemove(cj).mouseup(ck),ci.push({el:this,move_scope:e,start_scope:f,end_scope:g}),c&&eve.on("raphael.drag.start."+this.id,c),b&&eve.on("raphael.drag.move."+this.id,b),d&&eve.on("raphael.drag.end."+this.id,d),eve("raphael.drag.start."+this.id,f||e||this,i.clientX+k,i.clientY+j,i)}this._drag={},cn.push({el:this,start:i}),this.mousedown(i);return this},cl.onDragOver=function(a){a?eve.on("raphael.drag.over."+this.id,a):eve.unbind("raphael.drag.over."+this.id)},cl.undrag=function(){var b=cn.length;while(b--)cn[b].el==this&&(this.unmousedown(cn[b].start),cn.splice(b,1),eve.unbind("raphael.drag.*."+this.id));!cn.length&&a.unmousemove(cj).unmouseup(ck)},k.circle=function(b,c,d){var e=a._engine.circle(this,b||0,c||0,d||0);this.__set__&&this.__set__.push(e);return e},k.rect=function(b,c,d,e,f){var g=a._engine.rect(this,b||0,c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.ellipse=function(b,c,d,e){var f=a._engine.ellipse(this,b||0,c||0,d||0,e||0);this.__set__&&this.__set__.push(f);return f},k.path=function(b){b&&!a.is(b,D)&&!a.is(b[0],E)&&(b+=p);var c=a._engine.path(a.format[m](a,arguments),this);this.__set__&&this.__set__.push(c);return c},k.image=function(b,c,d,e,f){var g=a._engine.image(this,b||"about:blank",c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.text=function(b,c,d){var e=a._engine.text(this,b||0,c||0,r(d));this.__set__&&this.__set__.push(e);return e},k.set=function(b){!a.is(b,"array")&&(b=Array.prototype.splice.call(arguments,0,arguments.length));var c=new cG(b);this.__set__&&this.__set__.push(c);return c},k.setStart=function(a){this.__set__=a||this.set()},k.setFinish=function(a){var b=this.__set__;delete this.__set__;return b},k.setSize=function(b,c){return a._engine.setSize.call(this,b,c)},k.setViewBox=function(b,c,d,e,f){return a._engine.setViewBox.call(this,b,c,d,e,f)},k.top=k.bottom=null,k.raphael=a;var co=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,i=b.top+(h.win.pageYOffset||e.scrollTop||d.scrollTop)-f,j=b.left+(h.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:i,x:j}};k.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=h.doc.elementFromPoint(a,b);if(h.win.opera&&e.tagName=="svg"){var f=co(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var i=d.getIntersectionList(g,null);i.length&&(e=i[i.length-1])}if(!e)return null;while(e.parentNode&&e!=d.parentNode&&!e.raphael)e=e.parentNode;e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null;return e},k.getById=function(a){var b=this.bottom;while(b){if(b.id==a)return b;b=b.next}return null},k.forEach=function(a,b){var c=this.bottom;while(c){if(a.call(b,c)===!1)return this;c=c.next}return this},k.getElementsByPoint=function(a,b){var c=this.set();this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)});return c},cl.isPointInside=function(b,c){var d=this.realPath=this.realPath||bi[this.type](this);return a.isPointInsidePath(d,b,c)},cl.getBBox=function(a){if(this.removed)return{};var b=this._;if(a){if(b.dirty||!b.bboxwt)this.realPath=bi[this.type](this),b.bboxwt=bI(this.realPath),b.bboxwt.toString=cq,b.dirty=0;return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath)b.bboxwt=0,this.realPath=bi[this.type](this);b.bbox=bI(bj(this.realPath,this.matrix)),b.bbox.toString=cq,b.dirty=b.dirtyT=0}return b.bbox},cl.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(a);return a},cl.glow=function(a){if(this.type=="text")return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||bi[this.type](this);f=this.matrix?bj(f,this.matrix):f;for(var g=1;g<c+1;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cr={},cs=function(b,c,d,e,f,g,h,i,j){return j==null?bB(b,c,d,e,f,g,h,i):a.findDotsAtSegment(b,c,d,e,f,g,h,i,bC(b,c,d,e,f,g,h,i,j))},ct=function(b,c){return function(d,e,f){d=bR(d);var g,h,i,j,k="",l={},m,n=0;for(var o=0,p=d.length;o<p;o++){i=d[o];if(i[0]=="M")g=+i[1],h=+i[2];else{j=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6]);if(n+j>e){if(c&&!l.start){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),k+=["C"+m.start.x,m.start.y,m.m.x,m.m.y,m.x,m.y];if(f)return k;l.start=k,k=["M"+m.x,m.y+"C"+m.n.x,m.n.y,m.end.x,m.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!b&&!c){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n);return{x:m.x,y:m.y,alpha:m.alpha}}}n+=j,g=+i[5],h=+i[6]}k+=i.shift()+i}l.end=k,m=b?n:c?l:a.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),m.alpha&&(m={x:m.x,y:m.y,alpha:m.alpha});return m}},cu=ct(1),cv=ct(),cw=ct(0,1);a.getTotalLength=cu,a.getPointAtLength=cv,a.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return cw(a,b).end;var d=cw(a,c,1);return b?cw(d,b).end:d},cl.getTotalLength=function(){if(this.type=="path"){if(this.node.getTotalLength)return this.node.getTotalLength();return cu(this.attrs.path)}},cl.getPointAtLength=function(a){if(this.type=="path")return cv(this.attrs.path,a)},cl.getSubpath=function(b,c){if(this.type=="path")return a.getSubpath(this.attrs.path,b,c)};var cx=a.easing_formulas={linear:function(a){return a},"<":function(a){return A(a,1.7)},">":function(a){return A(a,.48)},"<>":function(a){var b=.48-a/1.04,c=w.sqrt(.1734+b*b),d=c-b,e=A(z(d),1/3)*(d<0?-1:1),f=-c-b,g=A(z(f),1/3)*(f<0?-1:1),h=e+g+.5;return(1-h)*3*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a=a-1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){if(a==!!a)return a;return A(2,-10*a)*w.sin((a-.075)*2*B/.3)+1},bounce:function(a){var b=7.5625,c=2.75,d;a<1/c?d=b*a*a:a<2/c?(a-=1.5/c,d=b*a*a+.75):a<2.5/c?(a-=2.25/c,d=b*a*a+.9375):(a-=2.625/c,d=b*a*a+.984375);return d}};cx.easeIn=cx["ease-in"]=cx["<"],cx.easeOut=cx["ease-out"]=cx[">"],cx.easeInOut=cx["ease-in-out"]=cx["<>"],cx["back-in"]=cx.backIn,cx["back-out"]=cx.backOut;var cy=[],cz=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,16)},cA=function(){var b=+(new Date),c=0;for(;c<cy.length;c++){var d=cy[c];if(d.el.removed||d.paused)continue;var e=b-d.start,f=d.ms,h=d.easing,i=d.from,j=d.diff,k=d.to,l=d.t,m=d.el,o={},p,r={},s;d.initstatus?(e=(d.initstatus*d.anim.top-d.prev)/(d.percent-d.prev)*f,d.status=d.initstatus,delete d.initstatus,d.stop&&cy.splice(c--,1)):d.status=(d.prev+(d.percent-d.prev)*(e/f))/d.anim.top;if(e<0)continue;if(e<f){var t=h(e/f);for(var u in i)if(i[g](u)){switch(U[u]){case C:p=+i[u]+t*f*j[u];break;case"colour":p="rgb("+[cB(O(i[u].r+t*f*j[u].r)),cB(O(i[u].g+t*f*j[u].g)),cB(O(i[u].b+t*f*j[u].b))].join(",")+")";break;case"path":p=[];for(var v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(var x=1,y=i[u][v].length;x<y;x++)p[v][x]=+i[u][v][x]+t*f*j[u][v][x];p[v]=p[v].join(q)}p=p.join(q);break;case"transform":if(j[u].real){p=[];for(v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(x=1,y=i[u][v].length;x<y;x++)p[v][x]=i[u][v][x]+t*f*j[u][v][x]}}else{var z=function(a){return+i[u][a]+t*f*j[u][a]};p=[["m",z(0),z(1),z(2),z(3),z(4),z(5)]]}break;case"csv":if(u=="clip-rect"){p=[],v=4;while(v--)p[v]=+i[u][v]+t*f*j[u][v]}break;default:var A=[][n](i[u]);p=[],v=m.paper.customAttributes[u].length;while(v--)p[v]=+A[v]+t*f*j[u][v]}o[u]=p}m.attr(o),function(a,b,c){setTimeout(function(){eve("raphael.anim.frame."+a,b,c)})}(m.id,m,d.anim)}else{(function(b,c,d){setTimeout(function(){eve("raphael.anim.frame."+c.id,c,d),eve("raphael.anim.finish."+c.id,c,d),a.is(b,"function")&&b.call(c)})})(d.callback,m,d.anim),m.attr(k),cy.splice(c--,1);if(d.repeat>1&&!d.next){for(s in k)k[g](s)&&(r[s]=d.totalOrigin[s]);d.el.attr(r),cE(d.anim,d.el,d.anim.percents[0],null,d.totalOrigin,d.repeat-1)}d.next&&!d.stop&&cE(d.anim,d.el,d.next,null,d.totalOrigin,d.repeat)}}a.svg&&m&&m.paper&&m.paper.safari(),cy.length&&cz(cA)},cB=function(a){return a>255?255:a<0?0:a};cl.animateWith=function(b,c,d,e,f,g){var h=this;if(h.removed){g&&g.call(h);return h}var i=d instanceof cD?d:a.animation(d,e,f,g),j,k;cE(i,h,i.percents[0],null,h.attr());for(var l=0,m=cy.length;l<m;l++)if(cy[l].anim==c&&cy[l].el==b){cy[m-1].start=cy[l].start;break}return h},cl.onAnimation=function(a){a?eve.on("raphael.anim.frame."+this.id,a):eve.unbind("raphael.anim.frame."+this.id);return this},cD.prototype.delay=function(a){var b=new cD(this.anim,this.ms);b.times=this.times,b.del=+a||0;return b},cD.prototype.repeat=function(a){var b=new cD(this.anim,this.ms);b.del=this.del,b.times=w.floor(x(a,0))||1;return b},a.animation=function(b,c,d,e){if(b instanceof cD)return b;if(a.is(d,"function")||!d)e=e||d||null,d=null;b=Object(b),c=+c||0;var f={},h,i;for(i in b)b[g](i)&&Q(i)!=i&&Q(i)+"%"!=i&&(h=!0,f[i]=b[i]);if(!h)return new cD(b,c);d&&(f.easing=d),e&&(f.callback=e);return new cD({100:f},c)},cl.animate=function(b,c,d,e){var f=this;if(f.removed){e&&e.call(f);return f}var g=b instanceof cD?b:a.animation(b,c,d,e);cE(g,f,g.percents[0],null,f.attr());return f},cl.setTime=function(a,b){a&&b!=null&&this.status(a,y(b,a.ms)/a.ms);return this},cl.status=function(a,b){var c=[],d=0,e,f;if(b!=null){cE(a,this,-1,y(b,1));return this}e=cy.length;for(;d<e;d++){f=cy[d];if(f.el.id==this.id&&(!a||f.anim==a)){if(a)return f.status;c.push({anim:f.anim,status:f.status})}}if(a)return 0;return c},cl.pause=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.pause."+this.id,this,cy[b].anim)!==!1&&(cy[b].paused=!0);return this},cl.resume=function(a){for(var b=0;b<cy.length;b++)if(cy[b].el.id==this.id&&(!a||cy[b].anim==a)){var c=cy[b];eve("raphael.anim.resume."+this.id,this,c.anim)!==!1&&(delete c.paused,this.status(c.anim,c.status))}return this},cl.stop=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.stop."+this.id,this,cy[b].anim)!==!1&&cy.splice(b--,1);return this},eve.on("raphael.remove",cF),eve.on("raphael.clear",cF),cl.toString=function(){return"Raphaël’s object"};var cG=function(a){this.items=[],this.length=0,this.type="set";if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==cl.constructor||a[b].constructor==cG)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},cH=cG.prototype;cH.push=function(){var a,b;for(var c=0,d=arguments.length;c<d;c++)a=arguments[c],a&&(a.constructor==cl.constructor||a.constructor==cG)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},cH.pop=function(){this.length&&delete this[this.length--];return this.items.pop()},cH.forEach=function(a,b){for(var c=0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var cI in cl)cl[g](cI)&&(cH[cI]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][m](c,b)})}}(cI));cH.attr=function(b,c){if(b&&a.is(b,E)&&a.is(b[0],"object"))for(var d=0,e=b.length;d<e;d++)this.items[d].attr(b[d]);else for(var f=0,g=this.items.length;f<g;f++)this.items[f].attr(b,c);return this},cH.clear=function(){while(this.length)this.pop()},cH.splice=function(a,b,c){a=a<0?x(this.length+a,0):a,b=x(0,y(this.length-a,b));var d=[],e=[],f=[],g;for(g=2;g<arguments.length;g++)f.push(arguments[g]);for(g=0;g<b;g++)e.push(this[a+g]);for(;g<this.length-a;g++)d.push(this[a+g]);var h=f.length;for(g=0;g<h+d.length;g++)this.items[a+g]=this[a+g]=g<h?f[g]:d[g-h];g=this.items.length=this.length-=b-h;while(this[g])delete this[g++];return new cG(e)},cH.exclude=function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]==a){this.splice(b,1);return!0}},cH.animate=function(b,c,d,e){(a.is(d,"function")||!d)&&(e=d||null);var f=this.items.length,g=f,h,i=this,j;if(!f)return this;e&&(j=function(){!--f&&e.call(i)}),d=a.is(d,D)?d:j;var k=a.animation(b,c,d,j);h=this.items[--g].animate(k);while(g--)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(h,k,k);return this},cH.insertAfter=function(a){var b=this.items.length;while(b--)this.items[b].insertAfter(a);return this},cH.getBBox=function(){var a=[],b=[],c=[],d=[];for(var e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}a=y[m](0,a),b=y[m](0,b),c=x[m](0,c),d=x[m](0,d);return{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},cH.clone=function(a){a=new cG;for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());return a},cH.toString=function(){return"Raphaël‘s set"},a.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[g](d)&&(b.face[d]=a.face[d]);this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b];if(!a.svg){b.face["units-per-em"]=R(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[g](e)){var f=a.glyphs[e];b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"};if(f.k)for(var h in f.k)f[g](h)&&(b.glyphs[e].k[h]=f.k[h])}}return a},k.getFont=function(b,c,d,e){e=e||"normal",d=d||"normal",c=+c||{normal:400,bold:700,lighter:300,bolder:800}[c]||400;if(!!a.fonts){var f=a.fonts[b];if(!f){var h=new RegExp("(^|\\s)"+b.replace(/[^\w\d\s+!~.:_-]/g,p)+"(\\s|$)","i");for(var i in a.fonts)if(a.fonts[g](i)&&h.test(i)){f=a.fonts[i];break}}var j;if(f)for(var k=0,l=f.length;k<l;k++){j=f[k];if(j.face["font-weight"]==c&&(j.face["font-style"]==d||!j.face["font-style"])&&j.face["font-stretch"]==e)break}return j}},k.print=function(b,d,e,f,g,h,i){h=h||"middle",i=x(y(i||0,1),-1);var j=r(e)[s](p),k=0,l=0,m=p,n;a.is(f,e)&&(f=this.getFont(f));if(f){n=(g||16)/f.face["units-per-em"];var o=f.face.bbox[s](c),q=+o[0],t=o[3]-o[1],u=0,v=+o[1]+(h=="baseline"?t+ +f.face.descent:t/2);for(var w=0,z=j.length;w<z;w++){if(j[w]=="\n")k=0,B=0,l=0,u+=t;else{var A=l&&f.glyphs[j[w-1]]||{},B=f.glyphs[j[w]];k+=l?(A.w||f.w)+(A.k&&A.k[j[w]]||0)+f.w*i:0,l=1}B&&B.d&&(m+=a.transformPath(B.d,["t",k*n,u*n,"s",n,n,q,v,"t",(b-q)/n,(d-v)/n]))}}return this.path(m).attr({fill:"#000",stroke:"none"})},k.add=function(b){if(a.is(b,"array")){var c=this.set(),e=0,f=b.length,h;for(;e<f;e++)h=b[e]||{},d[g](h.type)&&c.push(this[h.type]().attr(h))}return c},a.format=function(b,c){var d=a.is(c,E)?[0][n](c):arguments;b&&a.is(b,D)&&d.length-1&&(b=b.replace(e,function(a,b){return d[++b]==null?p:d[b]}));return b||p},a.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),typeof e=="function"&&f&&(e=e()))}),e=(e==null||e==d?a:e)+"";return e};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),a.ninja=function(){i.was?h.win.Raphael=i.is:delete Raphael;return a},a.st=cH,function(b,c,d){function e(){/in/.test(b.readyState)?setTimeout(e,9):a.eve("raphael.DOMload")}b.readyState==null&&b.addEventListener&&(b.addEventListener(c,d=function(){b.removeEventListener(c,d,!1),b.readyState="complete"},!1),b.readyState="loading"),e()}(document,"DOMContentLoaded"),i.was?h.win.Raphael=a:Raphael=a,eve.on("raphael.DOMload",function(){b=!0})}(),window.Raphael.svg&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=a.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};a.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){typeof d=="string"&&(d=q(d));for(var f in e)e[b](f)&&(f.substring(0,6)=="xlink:"?d.setAttributeNS(n,f.substring(6),c(e[f])):d.setAttribute(f,c(e[f])))}else d=a._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(b,e){var j="linear",k=b.id+e,m=.5,n=.5,o=b.node,p=b.paper,r=o.style,s=a._g.doc.getElementById(k);if(!s){e=c(e).replace(a._radial_gradient,function(a,b,c){j="radial";if(b&&c){m=d(b),n=d(c);var e=(n>.5)*2-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&n!=.5&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/);if(j=="linear"){var t=e.shift();t=-d(t);if(isNaN(t))return null;var u=[0,0,f.cos(a.rad(t)),f.sin(a.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=a._parseDots(e);if(!w)return null;k=k.replace(/[\(\)\s,\xb0#]/g,"_"),b.gradient&&k!=b.gradient.id&&(p.defs.removeChild(b.gradient),delete b.gradient);if(!b.gradient){s=q(j+"Gradient",{id:k}),b.gradient=s,q(s,j=="radial"?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:b.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;x<y;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1;return 1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if(d.type=="path"){var g=c(e).toLowerCase().split("-"),h=d.paper,i=f?"end":"start",j=d.node,k=d.attrs,m=k["stroke-width"],n=g.length,r="classic",s,t,u,v,w,x=3,y=3,z=5;while(n--)switch(g[n]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":r=g[n];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}r=="open"?(x+=2,y+=2,z+=2,u=1,v=f?4:1,w={fill:"none",stroke:k.stroke}):(v=u=x/2,w={fill:k.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={};if(r!="none"){var A="raphael-marker-"+r,B="raphael-marker-"+i+r+x+y;a._g.doc.getElementById(A)?p[A]++:(h.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[r],id:A})),p[A]=1);var C=a._g.doc.getElementById(B),D;C?(p[B]++,D=C.getElementsByTagName("use")[0]):(C=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:v,refY:y/2}),D=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),C.appendChild(D),h.defs.appendChild(C),p[B]=1),q(D,w);var F=u*(r!="diamond"&&r!="oval");f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-F*m):(s=F*m,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),w={},w["marker-"+i]="url(#"+B+")";if(t||s)w.d=Raphael.getSubpath(k.path,s,t);q(j,w),d._.arrows[i+"Path"]=A,d._.arrows[i+"Marker"]=B,d._.arrows[i+"dx"]=F,d._.arrows[i+"Type"]=r,d._.arrows[i+"String"]=e}else f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-s):(s=0,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),d._.arrows[i+"Path"]&&q(j,{d:Raphael.getSubpath(k.path,s,t)}),delete d._.arrows[i+"Path"],delete d._.arrows[i+"Marker"],delete d._.arrows[i+"dx"],delete d._.arrows[i+"Type"],delete d._.arrows[i+"String"];for(w in p)if(p[b](w)&&!p[w]){var G=a._g.doc.getElementById(w);G&&G.parentNode.removeChild(G)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,b,d){b=u[c(b).toLowerCase()];if(b){var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=b.length;while(h--)g[h]=b[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[b](o)){if(!a._availableAttrs[b](o))continue;var p=f[o];k[o]=p;switch(o){case"blur":d.blur(p);break;case"href":case"title":case"target":var u=i.parentNode;if(u.tagName.toLowerCase()!="a"){var w=q("a");u.insertBefore(w,i),w.appendChild(i),u=w}o=="target"?u.setAttributeNS(n,"show",p=="blank"?"new":p):u.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var x=c(p).split(j);if(x.length==4){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var z=q("clipPath"),A=q("rect");z.id=a.createUUID(),q(A,{x:x[0],y:x[1],width:x[2],height:x[3]}),z.appendChild(A),d.paper.defs.appendChild(z),q(i,{"clip-path":"url(#"+z.id+")"}),d.clip=A}if(!p){var B=i.getAttribute("clip-path");if(B){var C=a._g.doc.getElementById(B.replace(/(^url\(#|\)$)/g,l));C&&C.parentNode.removeChild(C),q(i,{"clip-path":l}),delete d.clip}}break;case"path":d.type=="path"&&(q(i,{d:p?k.path=a._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":i.setAttribute(o,p),d._.dirty=1;if(k.fx)o="x",p=k.x;else break;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if(o=="rx"&&d.type=="rect")break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":i.setAttribute(o,p),d._.dirty=1;if(k.fy)o="y",p=k.y;else break;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if(o=="ry"&&d.type=="rect")break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":d.type=="rect"?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":d.type=="image"&&i.setAttributeNS(n,"href",p);break;case"stroke-width":if(d._.sx!=1||d._.sy!=1)p/=g(h(d._.sx),h(d._.sy))||1;d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var D=c(p).match(a._ISURL);if(D){z=q("pattern");var F=q("image");z.id=a.createUUID(),q(z,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":D[1]}),z.appendChild(F),function(b){a._preload(D[1],function(){var a=this.offsetWidth,c=this.offsetHeight;q(b,{width:a,height:c}),q(F,{width:a,height:c}),d.paper.safari()})}(z),d.paper.defs.appendChild(z),q(i,{fill:"url(#"+z.id+")"}),d.pattern=z,d.pattern&&s(d);break}var G=a.getRGB(p);if(!G.error)delete f.gradient,delete k.gradient,!a.is(k.opacity,"undefined")&&a.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!a.is(k["fill-opacity"],"undefined")&&a.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});else if((d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}G[b]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=a.getRGB(p),i.setAttribute(o,G.hex),o=="stroke"&&G[b]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),o=="stroke"&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":(d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p);break;case"opacity":k.gradient&&!k[b]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break};default:o=="font-size"&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if(d.type=="text"&&!!(f[b]("text")||f[b]("font")||f[b]("font-size")||f[b]("x")||f[b]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(a._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;if(f[b]("text")){g.text=f.text;while(h.firstChild)h.removeChild(h.firstChild);var j=c(f.text).split("\n"),k=[],m;for(var n=0,o=j.length;n<o;n++)m=q("tspan"),n&&q(m,{dy:i*x,x:g.x}),m.appendChild(a._g.doc.createTextNode(j[n])),h.appendChild(m),k[n]=m}else{k=h.getElementsByTagName("tspan");for(n=0,o=k.length;n<o;n++)n?q(k[n],{dy:i*x,x:g.x}):q(k[0],{dy:0})}q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&a.is(r,"finite")&&q(k[0],{dy:r})}},z=function(b,c){var d=0,e=0;this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.matrix=a.matrix(),this.realPath=null,this.paper=c,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},A=a.el;z.prototype=A,A.constructor=z,a._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);d.type="path",w(d,{fill:"none",stroke:"#000",path:a});return d},A.rotate=function(a,b,e){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this.transform(this._.transform.concat([["r",a,b,e]]));return this},A.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]]));return this},A.translate=function(a,b){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this.transform(this._.transform.concat([["t",a,b]]));return this},A.transform=function(c){var d=this._;if(c==null)return d.transform;a._extractTransform(this,c),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix});if(d.sx!=1||d.sy!=1){var e=this.attrs[b]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this},A.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this},A.remove=function(){if(!this.removed&&!!this.node.parentNode){var b=this.paper;b.__set__&&b.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&b.defs.removeChild(this.gradient),a._tear(this,b),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var c in this)this[c]=typeof this[c]=="function"?a._removedFactory(c):null;this.removed=!0}},A._getBBox=function(){if(this.node.style.display=="none"){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}a&&this.hide();return b},A.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(c=="transform")return this._.transform;var g=c.split(j),h={};for(var i=0,l=g.length;i<l;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return l-1?h:h[g[0]]}if(d==null&&a.is(c,"array")){h={};for(i=0,l=c.length;i<l;i++)h[c[i]]=this.attr(c[i]);return h}if(d!=null){var m={};m[c]=d}else c!=null&&a.is(c,"object")&&(m=c);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[b](n)&&m[b](n)&&a.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[b](p)&&(m[p]=o[p])}w(this,m);return this},A.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var b=this.paper;b.top!=this&&a._tofront(this,b);return this},A.toBack=function(){if(this.removed)return this;var b=this.node.parentNode;b.tagName.toLowerCase()=="a"?b.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):b.firstChild!=this.node&&b.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper);var c=this.paper;return this},A.insertAfter=function(b){if(this.removed)return this;var c=b.node||b[b.length-1].node;c.nextSibling?c.parentNode.insertBefore(this.node,c.nextSibling):c.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},A.insertBefore=function(b){if(this.removed)return this;var c=b.node||b[0].node;c.parentNode.insertBefore(this.node,c),a._insertbefore(this,b,this.paper);return this},A.blur=function(b){var c=this;if(+b!==0){var d=q("filter"),e=q("feGaussianBlur");c.attrs.blur=b,d.id=a.createUUID(),q(e,{stdDeviation:+b||1.5}),d.appendChild(e),c.paper.defs.appendChild(d),c._blur=d,q(c.node,{filter:"url(#"+d.id+")"})}else c._blur&&(c._blur.parentNode.removeChild(c._blur),delete c._blur,delete c.attrs.blur),c.node.removeAttribute("filter")},a._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs);return f},a._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs);return h},a._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs);return g},a._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image";return h},a._engine.text=function(b,c,d,e){var f=q("text");b.canvas&&b.canvas.appendChild(f);var g=new z(f,b);g.attrs={x:c,y:d,"text-anchor":"middle",text:e,font:a._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs);return g},a._engine.setSize=function(a,b){this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox);return this},a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b&&b.container,d=b.x,e=b.y,f=b.width,g=b.height;if(!c)throw new Error("SVG container not found.");var h=q("svg"),i="overflow:hidden;",j;d=d||0,e=e||0,f=f||512,g=g||342,q(h,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),c==1?(h.style.cssText=i+"position:absolute;left:"+d+"px;top:"+e+"px",a._g.doc.body.appendChild(h),j=1):(h.style.cssText=i+"position:relative",c.firstChild?c.insertBefore(h,c.firstChild):c.appendChild(h)),c=new a._Paper,c.width=f,c.height=g,c.canvas=h,c.clear(),c._left=c._top=0,j&&(c.renderfix=function(){}),c.renderfix();return c},a._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f=g(c/this.width,d/this.height),h=this.top,i=e?"meet":"xMinYMin",j,l;a==null?(this._vbSize&&(f=1),delete this._vbSize,j="0 0 "+this.width+m+this.height):(this._vbSize=f,j=a+m+b+m+c+m+d),q(this.canvas,{viewBox:j,preserveAspectRatio:i});while(f&&h)l="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":l}),h._.dirty=1,h._.dirtyT=1,h=h.prev;this._viewBox=[a,b,c,d,!!e];return this},a.prototype.renderfix=function(){var a=this.canvas,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}var e=-c.e%1,f=-c.f%1;if(e||f)e&&(this._left=(this._left+e)%1,b.left=this._left+"px"),f&&(this._top=(this._top+f)%1,b.top=this._top+"px")},a.prototype.clear=function(){a.eve("raphael.clear",this);var b=this.canvas;while(b.firstChild)b.removeChild(b.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(a._g.doc.createTextNode("Created with Raphaël "+a.version)),b.appendChild(this.desc),b.appendChild(this.defs=q("defs"))},a.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null};var B=a.st;for(var C in A)A[b](C)&&!B[b](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}(window.Raphael),window.Raphael.vml&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=a.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(b){var d=/[ahqstv]/ig,e=a._pathToAbsolute;c(b).match(d)&&(e=a._path2curve),d=/[clmz]/g;if(e==a._pathToAbsolute&&!c(b).match(d)){var g=c(b).replace(q,function(a,b,c){var d=[],e=b.toLowerCase()=="m",g=p[b];c.replace(s,function(a){e&&d.length==2&&(g+=d+p[b=="m"?"l":"L"],d=[]),d.push(f(a*u))});return g+d});return g}var h=e(b),i,j;g=[];for(var k=0,l=h.length;k<l;k++){i=h[k],j=h[k][0].toLowerCase(),j=="z"&&(j="x");for(var m=1,r=i.length;m<r;m++)j+=f(i[m]*u)+(m!=r-1?",":o);g.push(j)}return g.join(n)},y=function(b,c,d){var e=a.matrix();e.rotate(-b,.5,.5);return{dx:e.x(c,d),dy:e.y(c,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q,r=u/b,s=u/c;m.visibility="hidden";if(!!b&&!!c){l.coordsize=i(r)+n+i(s),m.rotation=f*(b*c<0?-1:1);if(f){var t=y(f,d,e);d=t.dx,e=t.dy}b<0&&(p+="x"),c<0&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-r+n+e*-s;if(k||g.fillsize){var v=l.getElementsByTagName(j);v=v&&v[0],l.removeChild(v),k&&(t=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),v.position=t.dx*o+n+t.dy*o),g.fillsize&&(v.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(v)}m.visibility="visible"}};a.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,b,d){var e=c(b).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";while(g--)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q,r=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),s=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),t=e;for(var y in i)i[b](y)&&(m[y]=i[y]);r&&(m.path=a._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur);if(i.path&&e.type=="path"||r)l.path=x(~c(m.path).toLowerCase().indexOf("r")?a._pathToAbsolute(m.path):m.path),e.type=="image"&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0));"transform"in i&&e.transform(i.transform);if(s){var B=+m.cx,D=+m.cy,E=+m.rx||+m.r||0,G=+m.ry||+m.r||0;l.path=a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((B-E)*u),f((D-G)*u),f((B+E)*u),f((D+G)*u),f(B*u))}if("clip-rect"in i){var H=c(i["clip-rect"]).split(k);if(H.length==4){H[2]=+H[2]+ +H[0],H[3]=+H[3]+ +H[1];var I=l.clipRect||a._g.doc.createElement("div"),J=I.style;J.clip=a.format("rect({1}px {2}px {3}px {0}px)",H),l.clipRect||(J.position="absolute",J.top=0,J.left=0,J.width=e.paper.width+"px",J.height=e.paper.height+"px",l.parentNode.insertBefore(I,l),I.appendChild(l),l.clipRect=I)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var K=e.textpath.style;i.font&&(K.font=i.font),i["font-family"]&&(K.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(K.fontSize=i["font-size"]),i["font-weight"]&&(K.fontWeight=i["font-weight"]),i["font-style"]&&(K.fontStyle=i["font-style"])}"arrow-start"in i&&A(t,i["arrow-start"]),"arrow-end"in i&&A(t,i["arrow-end"],1);if(i.opacity!=null||i["stroke-width"]!=null||i.fill!=null||i.src!=null||i.stroke!=null||i["stroke-width"]!=null||i["stroke-opacity"]!=null||i["fill-opacity"]!=null||i["stroke-dasharray"]!=null||i["stroke-miterlimit"]!=null||i["stroke-linejoin"]!=null||i["stroke-linecap"]!=null){var L=l.getElementsByTagName(j),M=!1;L=L&&L[0],!L&&(M=L=F(j)),e.type=="image"&&i.src&&(L.src=i.src),i.fill&&(L.on=!0);if(L.on==null||i.fill=="none"||i.fill===null)L.on=!1;if(L.on&&i.fill){var N=c(i.fill).match(a._ISURL);if(N){L.parentNode==l&&l.removeChild(L),L.rotate=!0,L.src=N[1],L.type="tile";var O=e.getBBox(1);L.position=O.x+n+O.y,e._.fillpos=[O.x,O.y],a._preload(N[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else L.color=a.getRGB(i.fill).hex,L.src=o,L.type="solid",a.getRGB(i.fill).error&&(t.type in{circle:1,ellipse:1}||c(i.fill).charAt()!="r")&&C(t,i.fill,L)&&(m.fill="none",m.gradient=i.fill,L.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var P=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+a.getRGB(i.fill).o+1||2)-1);P=h(g(P,0),1),L.opacity=P,L.src&&(L.color="none")}l.appendChild(L);var Q=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],T=!1;!Q&&(T=Q=F("stroke"));if(i.stroke&&i.stroke!="none"||i["stroke-width"]||i["stroke-opacity"]!=null||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])Q.on=!0;(i.stroke=="none"||i.stroke===null||Q.on==null||i.stroke==0||i["stroke-width"]==0)&&(Q.on=!1);var U=a.getRGB(i.stroke);Q.on&&i.stroke&&(Q.color=U.hex),P=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+U.o+1||2)-1);var V=(d(i["stroke-width"])||1)*.75;P=h(g(P,0),1),i["stroke-width"]==null&&(V=m["stroke-width"]),i["stroke-width"]&&(Q.weight=V),V&&V<1&&(P*=V)&&(Q.weight=1),Q.opacity=P,i["stroke-linejoin"]&&(Q.joinstyle=i["stroke-linejoin"]||"miter"),Q.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(Q.endcap=i["stroke-linecap"]=="butt"?"flat":i["stroke-linecap"]=="square"?"square":"round");if(i["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};Q.dashstyle=W[b](i["stroke-dasharray"])?W[i["stroke-dasharray"]]:o}T&&l.appendChild(Q)}if(t.type=="text"){t.paper.canvas.style.display=o;var X=t.paper.span,Y=100,Z=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=X.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),Z=d(m["font-size"]||Z&&Z[0])||10,p.fontSize=Z*Y+"px",t.textpath.string&&(X.innerHTML=c(t.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();t.W=m.w=($.right-$.left)/Y,t.H=m.h=($.bottom-$.top)/Y,t.X=m.x,t.Y=m.y+t.H/2,("x"in i||"y"in i)&&(t.path.v=a.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));var _=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var ba=0,bb=_.length;ba<bb;ba++)if(_[ba]in i){t._.dirty=1;break}switch(m["text-anchor"]){case"start":t.textpath.style["v-text-align"]="left",t.bbx=t.W/2;break;case"end":t.textpath.style["v-text-align"]="right",t.bbx=-t.W/2;break;default:t.textpath.style["v-text-align"]="center",t.bbx=0}t.textpath.style["v-text-kern"]=!0}},C=function(b,f,g){b.attrs=b.attrs||{};var h=b.attrs,i=Math.pow,j,k,l="linear",m=".5 .5";b.attrs.gradient=f,f=c(f).replace(a._radial_gradient,function(a,b,c){l="radial",b&&c&&(b=d(b),c=d(c),i(b-.5,2)+i(c-.5,2)>.25&&(c=e.sqrt(.25-i(b-.5,2))*((c>.5)*2-1)+.5),m=b+n+c);return o}),f=f.split(/\s*\-\s*/);if(l=="linear"){var p=f.shift();p=-d(p);if(isNaN(p))return null}var q=a._parseDots(f);if(!q)return null;b=b.shape||b.node;if(q.length){b.removeChild(g),g.on=!0,g.method="none",g.color=q[0].color,g.color2=q[q.length-1].color;var r=[];for(var s=0,t=q.length;s<t;s++)q[s].offset&&r.push(q[s].offset+n+q[s].color);g.colors=r.length?r.join():"0% "+g.color,l=="radial"?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=m,g.angle=0):(g.type="gradient",g.angle=(270-p)%360),b.appendChild(g)}return 1},D=function(b,c){this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=c,this.matrix=a.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},E=a.el;D.prototype=E,E.constructor=D,E.transform=function(b){if(b==null)return this._.transform;var d=this.paper._viewBoxShift,e=d?"s"+[d.scale,d.scale]+"-1-1t"+[d.dx,d.dy]:o,f;d&&(f=b=c(b).replace(/\.{3}|\u2026/g,this._.transform||o)),a._extractTransform(this,e+b);var g=this.matrix.clone(),h=this.skew,i=this.node,j,k=~c(this.attrs.fill).indexOf("-"),l=!c(this.attrs.fill).indexOf("url(");g.translate(-0.5,-0.5);if(l||k||this.type=="image"){h.matrix="1 0 0 1",h.offset="0 0",j=g.split();if(k&&j.noRotation||!j.isSimple){i.style.filter=g.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;i.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else i.style.filter=o,z(this,j.scalex,j.scaley,j.dx,j.dy,j.rotate)}else i.style.filter=o,h.matrix=c(g),h.offset=g.offset();f&&(this._.transform=f);return this},E.rotate=function(a,b,e){if(this.removed)return this;if(a!=null){a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,b,e]]));return this}},E.translate=function(a,b){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=b),this.transform(this._.transform.concat([["t",a,b]]));return this},E.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]])),this._.dirtyT=1;return this},E.hide=function(){!this.removed&&(this.node.style.display="none");return this},E.show=function(){!this.removed&&(this.node.style.display=o);return this},E._getBBox=function(){if(this.removed)return{};return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),a.eve.unbind("raphael.*.*."+this.id),a._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;this.removed=!0}},E.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c==j&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var g=c.split(k),h={};for(var i=0,m=g.length;i<m;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return m-1?h:h[g[0]]}if(this.attrs&&d==null&&a.is(c,"array")){h={};for(i=0,m=c.length;i<m;i++)h[c[i]]=this.attr(c[i]);return h}var n;d!=null&&(n={},n[c]=d),d==null&&a.is(c,"object")&&(n=c);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[b](o)&&n[b](o)&&a.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[b](q)&&(n[q]=p[q])}n.text&&this.type=="text"&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&a._tofront(this,this.paper);return this},E.toBack=function(){if(this.removed)return this;this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper));return this},E.insertAfter=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[b.length-1]),b.node.nextSibling?b.node.parentNode.insertBefore(this.node,b.node.nextSibling):b.node.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},E.insertBefore=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[0]),b.node.parentNode.insertBefore(this.node,b.node),a._insertbefore(this,b,this.paper);return this},E.blur=function(b){var c=this.node.runtimeStyle,d=c.filter;d=d.replace(r,o),+b!==0?(this.attrs.blur=b,c.filter=d+n+m+".Blur(pixelradius="+(+b||1.5)+")",c.margin=a.format("-{0}px 0 0 -{0}px",f(+b||1.5))):(c.filter=d,c.margin=0,delete this.attrs.blur)},a._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");f.on=!0,c.appendChild(f),d.skew=f,d.transform(o);return d},a._engine.rect=function(b,c,d,e,f,g){var h=a._rectPath(c,d,e,f,g),i=b.path(h),j=i.attrs;i.X=j.x=c,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect";return i},a._engine.ellipse=function(a,b,c,d,e){var f=a.path(),g=f.attrs;f.X=b-d,f.Y=c-e,f.W=d*2,f.H=e*2,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e});return f},a._engine.circle=function(a,b,c,d){var e=a.path(),f=e.attrs;e.X=b-d,e.Y=c-d,e.W=e.H=d*2,e.type="circle",B(e,{cx:b,cy:c,r:d});return e},a._engine.image=function(b,c,d,e,f,g){var h=a._rectPath(d,e,f,g),i=b.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];k.src=c,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=c,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0);return i},a._engine.text=function(b,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=a.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=c(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,b),l={fill:"#000",stroke:"none",font:a._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=c(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),b.canvas.appendChild(h);var m=F("skew");m.on=!0,h.appendChild(m),k.skew=m,k.transform(o);return k},a._engine.setSize=function(b,c){var d=this.canvas.style;this.width=b,this.height=c,b==+b&&(b+="px"),c==+c&&(c+="px"),d.width=b,d.height=c,d.clip="rect(0 "+b+" "+c+" 0)",this._viewBox&&a._engine.setViewBox.apply(this,this._viewBox);return this},a._engine.setViewBox=function(b,c,d,e,f){a.eve("raphael.setViewBox",this,this._viewBox,[b,c,d,e,f]);var h=this.width,i=this.height,j=1/g(d/h,e/i),k,l;f&&(k=i/e,l=h/d,d*k<h&&(b-=(h-d*k)/2/k),e*l<i&&(c-=(i-e*l)/2/l)),this._viewBox=[b,c,d,e,!!f],this._viewBoxShift={dx:-b,dy:-c,scale:j},this.forEach(function(a){a.transform("...")});return this};var F;a._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},a._engine.initWin(a._g.win),a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b.container,d=b.height,e,f=b.width,g=b.x,h=b.y;if(!c)throw new Error("VML container not found.");var i=new a._Paper,j=i.canvas=a._g.doc.createElement("div"),k=j.style;g=g||0,h=h||0,f=f||512,d=d||342,i.width=f,i.height=d,f==+f&&(f+="px"),d==+d&&(d+="px"),i.coordsize=u*1e3+n+u*1e3,i.coordorigin="0 0",i.span=a._g.doc.createElement("span"),i.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",j.appendChild(i.span),k.cssText=a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",f,d),c==1?(a._g.doc.body.appendChild(j),k.left=g+"px",k.top=h+"px",k.position="absolute"):c.firstChild?c.insertBefore(j,c.firstChild):c.appendChild(j),i.renderfix=function(){};return i},a.prototype.clear=function(){a.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=a._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},a.prototype.remove=function(){a.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;return!0};var G=a.st;for(var H in E)E[b](H)&&!G[b](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}(window.Raphael)
! function() {
    var cache = {}

    this.tmpl = function(str, data) {
        var fn = cache[str] ? cache[str] :
            (cache[str] = new Function("data",
                "var p=[];" +
                "p.push('" +
                str
                .replace(/&lt;!--/g, "<!--")
                .replace(/--&gt;/g, "-->")
                .replace(/[\r\t\n]/g, " ")
                .split("<!--").join("\t")
                .replace(/((^|-->)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)-->/g, "',$1,'")
                .split("\t").join("');")
                .split("-->").join("p.push('")
                .split("\r").join("\\'") + "');return p.join('');"))
        return data ? fn(data) : fn
    }
}();


function _init(result) {
    ! function() {

        function renderTable(data, id) {
            var tmp = []
            var date = []
            for (var i = 0; i < data.value.length; i++) {
                tmp.push(data.value[i] / 1000000)
                date.push(data.txt[i].replace(/201[5-9]\/|^1[5-9]-/g,''))
            }
            var barChartData = {
                labels: date,
                datasets: [{
                    fillColor: "#ff775f",
                    strokeColor: "#ff775f",
                    highlightFill: "rgba(218,73,69,0.9)",
                    highlightStroke: "rgba(0,0,0,.1)",
                    data: tmp
                }]
            }
            try {
                var ctx = document.getElementById(id).getContext("2d");
                new Chart(ctx).Bar(barChartData, {
                    responsive: true,
                    barValueSpacing: 20,
                    scaleLabel: "<%=value%>万"
                });
            } catch (e) {
                $('.m-data').hide()
            }
        }
        renderTable(result['month_trans'], 'canvas3')
    }()

    var key_map = {
        "北京市": "beijing",
        "天津市": "tianjin",
        "河北省": "hebei",
        "山西省": "shanxi",
        "内蒙古自治区": "neimongol",
        "辽宁省": "liaoning",
        "吉林省": "jilin",
        "黑龙江省": "heilongjiang",
        "上海市": "shanghai",
        "江苏省": "jiangsu",
        "浙江省": "zhejiang",
        "安徽省": "anhui",
        "福建省": "fujian",
        "江西省": "jiangxi",
        "山东省": "shandong",
        "河南省": "henan",
        "湖北省": "hubei",
        "湖南省": "hunan",
        "广东省": "guangdong",
        "广西壮族自治区": "guangxi",
        "海南省": "hainan",
        "重庆市": "chongqing",
        "四川省": "sichuan",
        "贵州省": "guizhou",
        "云南省": "yunnan",
        "西藏自治区": "xizang",
        "陕西省": "shaanxi",
        "甘肃省": "gansu",
        "青海省": "qinghai",
        "宁夏回族自治区": "ningxia",
        "新疆维吾尔自治区": "xinjiang",
        "台湾省": "taiwan",
        "香港特别行政区": "hongkong",
        "澳门特别行政区": "macau"
    }

    function getMaxmin(arr) {
        var len = arr.length,
            max = arr[0],
            min = max
        cun = 0
        for (; len--;) {
            var tmp = arr[len];
            if (tmp > max) {
                max = tmp;
            } else if (tmp < min) {
                min = tmp;
            }
            cun += tmp
        }
        return {
            max: max,
            min: min,
            cun: cun
        };
    };

    ! function() {
        var data = result.invest_province_map
        var value = getMaxmin(data.totalMoney)
        var max = value.max
        var cun = value.cun
        var _data = {}
        var _array = []
        for (var i = 0; i < data.provinceName.length; i++) {
            var tmp = {
                'stateInitColor': Math.ceil(data.totalMoney[i] * 10 / max - 1),
                'amount': Math.round(data.totalMoney[i] / 10000) / 100,
                'proportion': Math.round(data.totalMoney[i] * 10000 / cun) / 100,
                'cityKey': data.provinceName[i]
            }

            _data[key_map[data.provinceName[i]]] = tmp
            _array.push(tmp)
        }

        _array.sort(function(a, b) {
            return b.proportion - a.proportion;
        })
        renderMap(_data, _array)
    }()

    function renderMap(data, arr) {
        var order = $('#order')
        var tpl = order.html()
        var color = ['fff2ef', 'ffe4df', 'ffd6cf', 'ffc9bf', 'ffbbaf', 'ffad9f', 'ffa08f', 'ff927f', 'ff846f', 'ff775f']
        $('#ChinaMap').SVGMap({
            mapName: 'china',
            mapWidth: 600,
            mapHeight: 500,
            stateColorList: color,
            stateInitColor: 'e4e4e4',
            strokeColor: 'ffffff',
            stateHoverColor: '64a0e9',
            stateSelectedColor: '82cb78',
            stateDisabledColor: 'eeeeee',
            stateTipWidth: 'auto',
            stateData: data,
            stateTipHtml: function(stateData, obj) {
                var str = obj.name + "<br>投资金额：" + data[obj.id].amount + " 万元<br>投资比例：" + data[obj.id].proportion + "%"
                return str;
            }
        })

        order.html(tmpl(tpl, {
            arr: arr,
            color: color
        }))

    }
}
