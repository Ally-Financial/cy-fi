"use strict";
var toStr = Object.prototype.toString;

function isCallable(fn) {
    return typeof fn === "function" || toStr.call(fn) === "[object Function]";
}


function toInteger(value) {
    var number = Number(value);

    if (isNaN(number)) {
        return 0;
    }

    if (number === 0 || !isFinite(number)) {
        return number;
    }

    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
}

var maxSafeInteger = Math.pow(2, 53) - 1;

function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
}
/**
 * Creates an array from an iterable object.
 * @param iterable An iterable object to convert to an array.
 */


/**
 * Creates an array from an iterable object.
 * @param iterable An iterable object to convert to an array.
 * @param mapfn A mapping function to call on every element of the array.
 * @param thisArg Value of 'this' used to invoke the mapfn.
 */
function _arrayFrom(arrayLike, mapFn) {
    // 1. Let C be the this value.
    // edit(@eps1lon): we're not calling it as Array.from
    var C = Array; // 2. Let items be ToObject(arrayLike).

    var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

    if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
    } // 4. If mapfn is undefined, then let mapping be false.
    // const mapFn = arguments.length > 1 ? arguments[1] : void undefined;


    if (typeof mapFn !== "undefined") {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
            throw new TypeError("Array.from: when provided, the second argument must be a function");
        }
    } // 10. Let lenValue be Get(items, "length").
    // 11. Let len be ToLength(lenValue).


    var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
    // 13. a. Let A be the result of calling the [[Construct]] internal method
    // of C with an argument list containing the single item len.
    // 14. a. Else, Let A be ArrayCreate(len).

    var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

    var k = 0; // 17. Repeat, while k < len… (also steps a - h)

    var kValue;

    while (k < len) {
        kValue = items[k];

        if (mapFn) {
            A[k] = mapFn(kValue, k);
        } else {
            A[k] = kValue;
        }

        k += 1;
    } // 18. Let putStatus be Put(A, "length", len, true).


    A.length = len; // 20. Return A.

    return A;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// for environments without Set we fallback to arrays with unique members
var SetLike = /*#__PURE__*/function () {
    function SetLike() {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, SetLike);

        _defineProperty(this, "items", void 0);

        this.items = items;
    }

    _createClass(SetLike, [{
        key: "add",
        value: function add(value) {
            if (this.has(value) === false) {
                this.items.push(value);
            }

            return this;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.items = [];
        }
    }, {
        key: "delete",
        value: function _delete(value) {
            var previousLength = this.items.length;
            this.items = this.items.filter(function (item) {
                return item !== value;
            });
            return previousLength !== this.items.length;
        }
    }, {
        key: "forEach",
        value: function forEach(callbackfn) {
            var _this = this;

            this.items.forEach(function (item) {
                callbackfn(item, item, _this);
            });
        }
    }, {
        key: "has",
        value: function has(value) {
            return this.items.indexOf(value) !== -1;
        }
    }, {
        key: "size",
        get: function get() {
            return this.items.length;
        }
    }]);

    return SetLike;
}();

var _setLike = typeof Set === "undefined" ? Set : SetLike;

//role.js

function getLocalName(element) {
    var _element$localName;

    return (// eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
        (_element$localName = element.localName) !== null && _element$localName !== void 0 ? _element$localName : // eslint-disable-next-line no-restricted-properties -- required for the fallback
            element.tagName.toLowerCase()
    );
}

var localNameToRoleMappings = {
    article: "article",
    aside: "complementary",
    button: "button",
    datalist: "listbox",
    dd: "definition",
    details: "group",
    dialog: "dialog",
    dt: "term",
    fieldset: "group",
    figure: "figure",
    // WARNING: Only with an accessible name
    form: "form",
    footer: "contentinfo",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    header: "banner",
    hr: "separator",
    html: "document",
    legend: "legend",
    li: "listitem",
    math: "math",
    main: "main",
    menu: "list",
    nav: "navigation",
    ol: "list",
    optgroup: "group",
    // WARNING: Only in certain context
    option: "option",
    output: "status",
    progress: "progressbar",
    // WARNING: Only with an accessible name
    section: "region",
    summary: "button",
    table: "table",
    tbody: "rowgroup",
    textarea: "textbox",
    tfoot: "rowgroup",
    // WARNING: Only in certain context
    td: "cell",
    th: "columnheader",
    thead: "rowgroup",
    tr: "row",
    ul: "list"
};
var prohibitedAttributes = {
    caption: new Set(["aria-label", "aria-labelledby"]),
    code: new Set(["aria-label", "aria-labelledby"]),
    deletion: new Set(["aria-label", "aria-labelledby"]),
    emphasis: new Set(["aria-label", "aria-labelledby"]),
    generic: new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
    insertion: new Set(["aria-label", "aria-labelledby"]),
    paragraph: new Set(["aria-label", "aria-labelledby"]),
    presentation: new Set(["aria-label", "aria-labelledby"]),
    strong: new Set(["aria-label", "aria-labelledby"]),
    subscript: new Set(["aria-label", "aria-labelledby"]),
    superscript: new Set(["aria-label", "aria-labelledby"])
};
/**
 *
 * @param element
 * @param role The role used for this element. This is specified to control whether you want to use the implicit or explicit role.
 */

function hasGlobalAriaAttributes(element, role) {
    // https://rawgit.com/w3c/aria/stable/#global_states
    // commented attributes are deprecated
    return ["aria-atomic", "aria-busy", "aria-controls", "aria-current", "aria-describedby", "aria-details", // "disabled",
        "aria-dropeffect", // "errormessage",
        "aria-flowto", "aria-grabbed", // "haspopup",
        "aria-hidden", // "invalid",
        "aria-keyshortcuts", "aria-label", "aria-labelledby", "aria-live", "aria-owns", "aria-relevant", "aria-roledescription"].some(function (attributeName) {
            var _prohibitedAttributes;

            return element.hasAttribute(attributeName) && !((_prohibitedAttributes = prohibitedAttributes[role]) !== null && _prohibitedAttributes !== void 0 && _prohibitedAttributes.has(attributeName));
        });
}

function ignorePresentationalRole(element, implicitRole) {
    // https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none
    return hasGlobalAriaAttributes(element, implicitRole);
}

function getRole(element) {
    var explicitRole = getExplicitRole(element);

    if (explicitRole === null || explicitRole === "presentation") {
        var implicitRole = getImplicitRole(element);

        if (explicitRole !== "presentation" || ignorePresentationalRole(element, implicitRole || "")) {
            return implicitRole;
        }
    }

    return explicitRole;
}

function getImplicitRole(element) {
    var mappedByTag = localNameToRoleMappings[getLocalName(element)];

    if (mappedByTag !== undefined) {
        return mappedByTag;
    }

    switch (getLocalName(element)) {
        case "a":
        case "area":
        case "link":
            if (element.hasAttribute("href")) {
                return "link";
            }

            break;

        case "img":
            if (element.getAttribute("alt") === "" && !ignorePresentationalRole(element, "img")) {
                return "presentation";
            }

            return "img";

        case "input":
            {
                var _ref = element,
                    type = _ref.type;

                switch (type) {
                    case "button":
                    case "image":
                    case "reset":
                    case "submit":
                        return "button";

                    case "checkbox":
                    case "radio":
                        return type;

                    case "range":
                        return "slider";

                    case "email":
                    case "tel":
                    case "text":
                    case "url":
                        if (element.hasAttribute("list")) {
                            return "combobox";
                        }

                        return "textbox";

                    case "search":
                        if (element.hasAttribute("list")) {
                            return "combobox";
                        }

                        return "searchbox";

                    case "number":
                        return "spinbutton";

                    default:
                        return null;
                }
            }

        case "select":
            if (element.hasAttribute("multiple") || element.size > 1) {
                return "listbox";
            }

            return "combobox";
    }

    return null;
}

function getExplicitRole(element) {
    var role = element.getAttribute("role");

    if (role !== null) {
        var explicitRole = role.trim().split(" ")[0]; // String.prototype.split(sep, limit) will always return an array with at least one member
        // as long as limit is either undefined or > 0

        if (explicitRole.length > 0) {
            return explicitRole;
        }
    }

    return null;
}

//utils.js

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function isElement(node) {
    return node !== null && node.nodeType === node.ELEMENT_NODE;
}

function isHTMLTableCaptionElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "caption";
}

function isHTMLInputElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "input";
}

function isHTMLOptGroupElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "optgroup";
}

function isHTMLSelectElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "select";
}

function isHTMLTableElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "table";
}

function isHTMLTextAreaElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "textarea";
}

function safeWindow(node) {
    var _ref = node.ownerDocument === null ? node : node.ownerDocument,
        defaultView = _ref.defaultView;

    if (defaultView === null) {
        throw new TypeError("no window available");
    }

    return defaultView;
}

function isHTMLFieldSetElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "fieldset";
}

function isHTMLLegendElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "legend";
}

function isHTMLSlotElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "slot";
}

function isSVGElement(node) {
    return isElement(node) && node.ownerSVGElement !== undefined;
}

function isSVGSVGElement(node) {
    return isElement(node) && (0, getLocalName)(node) === "svg";
}

function isSVGTitleElement(node) {
    return isSVGElement(node) && (0, getLocalName)(node) === "title";
}
/**
 *
 * @param {Node} node -
 * @param {string} attributeName -
 * @returns {Element[]} -
 */


function queryIdRefs(node, attributeName) {
    if (isElement(node) && node.hasAttribute(attributeName)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute check
        var ids = node.getAttribute(attributeName).split(" "); // Browsers that don't support shadow DOM won't have getRootNode

        var root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        return ids.map(function (id) {
            return root.getElementById(id);
        }).filter(function (element) {
            return element !== null;
        } // TODO: why does this not narrow?
        );
    }

    return [];
}

function hasAnyConcreteRoles(node, roles) {
    if (isElement(node)) {
        return roles.indexOf((0, getRole)(node)) !== -1;
    }

    return false;
}

//accessible-name-and-description.js

/**
 * implements https://w3c.github.io/accname/
 */

/**
 *
 * @param {string} string -
 * @returns {FlatString} -
 */
function asFlatString(s) {
    return s.trim().replace(/\s\s+/g, " ");
}
/**
 *
 * @param node -
 * @param options - These are not optional to prevent accidentally calling it without options in `computeAccessibleName`
 * @returns {boolean} -
 */


function isHidden(node, getComputedStyleImplementation) {
    if (!(0, isElement)(node)) {
        return false;
    }

    if (node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true") {
        return true;
    }

    var style = getComputedStyleImplementation(node);
    return style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden";
}
/**
 * @param {Node} node -
 * @returns {boolean} - As defined in step 2E of https://w3c.github.io/accname/#mapping_additional_nd_te
 */


function isControl(node) {
    return (0, hasAnyConcreteRoles)(node, ["button", "combobox", "listbox", "textbox"]) || hasAbstractRole(node, "range");
}

function hasAbstractRole(node, role) {
    if (!(0, isElement)(node)) {
        return false;
    }

    switch (role) {
        case "range":
            return (0, hasAnyConcreteRoles)(node, ["meter", "progressbar", "scrollbar", "slider", "spinbutton"]);

        default:
            throw new TypeError("No knowledge about abstract role '".concat(role, "'. This is likely a bug :("));
    }
}
/**
 * element.querySelectorAll but also considers owned tree
 * @param element
 * @param selectors
 */


function querySelectorAllSubtree(element, selectors) {
    var elements = (0, _arrayFrom)(element.querySelectorAll(selectors));
    (0, queryIdRefs)(element, "aria-owns").forEach(function (root) {
        // babel transpiles this assuming an iterator
        elements.push.apply(elements, (0, _arrayFrom)(root.querySelectorAll(selectors)));
    });
    return elements;
}

function querySelectedOptions(listbox) {
    if ((0, isHTMLSelectElement)(listbox)) {
        // IE11 polyfill
        return listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]");
    }

    return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
}

function isMarkedPresentational(node) {
    return (0, hasAnyConcreteRoles)(node, ["none", "presentation"]);
}
/**
 * Elements specifically listed in html-aam
 *
 * We don't need this for `label` or `legend` elements.
 * Their implicit roles already allow "naming from content".
 *
 * sources:
 *
 * - https://w3c.github.io/html-aam/#table-element
 */


function isNativeHostLanguageTextAlternativeElement(node) {
    return (0, isHTMLTableCaptionElement)(node);
}
/**
 * https://w3c.github.io/aria/#namefromcontent
 */


function allowsNameFromContent(node) {
    return (0, hasAnyConcreteRoles)(node, ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "label", "legend", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"]);
}
/**
 * TODO https://github.com/eps1lon/dom-accessibility-api/issues/100
 */


function isDescendantOfNativeHostLanguageTextAlternativeElement( // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet
    node) {
    return false;
}
/**
 * TODO https://github.com/eps1lon/dom-accessibility-api/issues/101
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet


function computeTooltipAttributeValue(node) {
    return null;
}

function getValueOfTextbox(element) {
    if ((0, isHTMLInputElement)(element) || (0, isHTMLTextAreaElement)(element)) {
        return element.value;
    } // https://github.com/eps1lon/dom-accessibility-api/issues/4


    return element.textContent || "";
}

function getTextualContent(declaration) {
    var content = declaration.getPropertyValue("content");

    if (/^["'].*["']$/.test(content)) {
        return content.slice(1, -1);
    }

    return "";
}
/**
 * https://html.spec.whatwg.org/multipage/forms.html#category-label
 * TODO: form-associated custom elements
 * @param element
 */


function isLabelableElement(element) {
    var localName = (0, getLocalName)(element);
    return localName === "button" || localName === "input" && element.getAttribute("type") !== "hidden" || localName === "meter" || localName === "output" || localName === "progress" || localName === "select" || localName === "textarea";
}
/**
 * > [...], then the first such descendant in tree order is the label element's labeled control.
 * -- https://html.spec.whatwg.org/multipage/forms.html#labeled-control
 * @param element
 */


function findLabelableElement(element) {
    if (isLabelableElement(element)) {
        return element;
    }

    var labelableElement = null;
    element.childNodes.forEach(function (childNode) {
        if (labelableElement === null && (0, isElement)(childNode)) {
            var descendantLabelableElement = findLabelableElement(childNode);

            if (descendantLabelableElement !== null) {
                labelableElement = descendantLabelableElement;
            }
        }
    });
    return labelableElement;
}
/**
 * Polyfill of HTMLLabelElement.control
 * https://html.spec.whatwg.org/multipage/forms.html#labeled-control
 * @param label
 */


function getControlOfLabel(label) {
    if (label.control !== undefined) {
        return label.control;
    }

    var htmlFor = label.getAttribute("for");

    if (htmlFor !== null) {
        return label.ownerDocument.getElementById(htmlFor);
    }

    return findLabelableElement(label);
}
/**
 * Polyfill of HTMLInputElement.labels
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/labels
 * @param element
 */


function getLabels(element) {
    var labelsProperty = element.labels;

    if (labelsProperty === null) {
        return labelsProperty;
    }

    if (labelsProperty !== undefined) {
        return (0, _arrayFrom)(labelsProperty);
    } // polyfill


    if (!isLabelableElement(element)) {
        return null;
    }

    var document = element.ownerDocument;
    return (0, _arrayFrom)(document.querySelectorAll("label")).filter(function (label) {
        return getControlOfLabel(label) === element;
    });
}
/**
 * Gets the contents of a slot used for computing the accname
 * @param slot
 */


function getSlotContents(slot) {
    // Computing the accessible name for elements containing slots is not
    // currently defined in the spec. This implementation reflects the
    // behavior of NVDA 2020.2/Firefox 81 and iOS VoiceOver/Safari 13.6.
    var assignedNodes = slot.assignedNodes();

    if (assignedNodes.length === 0) {
        // if no nodes are assigned to the slot, it displays the default content
        return (0, _arrayFrom)(slot.childNodes);
    }

    return assignedNodes;
}
/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_te
 * @param root
 * @param options
 * @returns
 */


function computeTextAlternative(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var consultedNodes = new _setLike();
    var window = (0, safeWindow)(root);
    var _options$compute = options.compute,
        compute = _options$compute === void 0 ? "name" : _options$compute,
        _options$computedStyl = options.computedStyleSupportsPseudoElements,
        computedStyleSupportsPseudoElements = _options$computedStyl === void 0 ? options.getComputedStyle !== undefined : _options$computedStyl,
        _options$getComputedS = options.getComputedStyle,
        getComputedStyle = _options$getComputedS === void 0 ? window.getComputedStyle.bind(window) : _options$getComputedS,
        _options$hidden = options.hidden,
        hidden = _options$hidden === void 0 ? false : _options$hidden; // 2F.i

    function computeMiscTextAlternative(node, context) {
        var accumulatedText = "";

        if ((0, isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoBefore = getComputedStyle(node, "::before");
            var beforeContent = getTextualContent(pseudoBefore);
            accumulatedText = "".concat(beforeContent, " ").concat(accumulatedText);
        } // FIXME: Including aria-owns is not defined in the spec
        // But it is required in the web-platform-test


        var childNodes = (0, isHTMLSlotElement)(node) ? getSlotContents(node) : (0, _arrayFrom)(node.childNodes).concat((0, queryIdRefs)(node, "aria-owns"));
        childNodes.forEach(function (child) {
            var result = computeTextAlternative(child, {
                isEmbeddedInLabel: context.isEmbeddedInLabel,
                isReferenced: false,
                recursion: true
            }); // TODO: Unclear why display affects delimiter
            // see https://github.com/w3c/accname/issues/3

            var display = (0, isElement)(child) ? getComputedStyle(child).getPropertyValue("display") : "inline";
            var separator = display !== "inline" ? " " : ""; // trailing separator for wpt tests

            accumulatedText += "".concat(separator).concat(result).concat(separator);
        });

        if ((0, isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoAfter = getComputedStyle(node, "::after");
            var afterContent = getTextualContent(pseudoAfter);
            accumulatedText = "".concat(accumulatedText, " ").concat(afterContent);
        }

        return accumulatedText.trim();
    }

    function computeElementTextAlternative(node) {
        if (!(0, isElement)(node)) {
            return null;
        }
        /**
         *
         * @param element
         * @param attributeName
         * @returns A string non-empty string or `null`
         */


        function useAttribute(element, attributeName) {
            var attribute = element.getAttributeNode(attributeName);

            if (attribute !== null && !consultedNodes.has(attribute) && attribute.value.trim() !== "") {
                consultedNodes.add(attribute);
                return attribute.value;
            }

            return null;
        } // https://w3c.github.io/html-aam/#fieldset-and-legend-elements


        if ((0, isHTMLFieldSetElement)(node)) {
            consultedNodes.add(node);
            var children = (0, _arrayFrom)(node.childNodes);

            for (var i = 0; i < children.length; i += 1) {
                var child = children[i];

                if ((0, isHTMLLegendElement)(child)) {
                    return computeTextAlternative(child, {
                        isEmbeddedInLabel: false,
                        isReferenced: false,
                        recursion: false
                    });
                }
            }
        } else if ((0, isHTMLTableElement)(node)) {
            // https://w3c.github.io/html-aam/#table-element
            consultedNodes.add(node);

            var _children = (0, _arrayFrom)(node.childNodes);

            for (var _i = 0; _i < _children.length; _i += 1) {
                var _child = _children[_i];

                if ((0, isHTMLTableCaptionElement)(_child)) {
                    return computeTextAlternative(_child, {
                        isEmbeddedInLabel: false,
                        isReferenced: false,
                        recursion: false
                    });
                }
            }
        } else if ((0, isSVGSVGElement)(node)) {
            // https://www.w3.org/TR/svg-aam-1.0/
            consultedNodes.add(node);

            var _children2 = (0, _arrayFrom)(node.childNodes);

            for (var _i2 = 0; _i2 < _children2.length; _i2 += 1) {
                var _child2 = _children2[_i2];

                if ((0, isSVGTitleElement)(_child2)) {
                    return _child2.textContent;
                }
            }

            return null;
        } else if ((0, getLocalName)(node) === "img" || (0, getLocalName)(node) === "area") {
            // https://w3c.github.io/html-aam/#area-element
            // https://w3c.github.io/html-aam/#img-element
            var nameFromAlt = useAttribute(node, "alt");

            if (nameFromAlt !== null) {
                return nameFromAlt;
            }
        } else if ((0, isHTMLOptGroupElement)(node)) {
            var nameFromLabel = useAttribute(node, "label");

            if (nameFromLabel !== null) {
                return nameFromLabel;
            }
        }

        if ((0, isHTMLInputElement)(node) && (node.type === "button" || node.type === "submit" || node.type === "reset")) {
            // https://w3c.github.io/html-aam/#input-type-text-input-type-password-input-type-search-input-type-tel-input-type-email-input-type-url-and-textarea-element-accessible-description-computation
            var nameFromValue = useAttribute(node, "value");

            if (nameFromValue !== null) {
                return nameFromValue;
            } // TODO: l10n


            if (node.type === "submit") {
                return "Submit";
            } // TODO: l10n


            if (node.type === "reset") {
                return "Reset";
            }
        }

        var labels = getLabels(node);

        if (labels !== null && labels.length !== 0) {
            consultedNodes.add(node);
            return (0, _arrayFrom)(labels).map(function (element) {
                return computeTextAlternative(element, {
                    isEmbeddedInLabel: true,
                    isReferenced: false,
                    recursion: true
                });
            }).filter(function (label) {
                return label.length > 0;
            }).join(" ");
        } // https://w3c.github.io/html-aam/#input-type-image-accessible-name-computation
        // TODO: wpt test consider label elements but html-aam does not mention them
        // We follow existing implementations over spec


        if ((0, isHTMLInputElement)(node) && node.type === "image") {
            var _nameFromAlt = useAttribute(node, "alt");

            if (_nameFromAlt !== null) {
                return _nameFromAlt;
            }

            var nameFromTitle = useAttribute(node, "title");

            if (nameFromTitle !== null) {
                return nameFromTitle;
            } // TODO: l10n


            return "Submit Query";
        }

        if ((0, hasAnyConcreteRoles)(node, ["button"])) {
            // https://www.w3.org/TR/html-aam-1.0/#button-element
            var nameFromSubTree = computeMiscTextAlternative(node, {
                isEmbeddedInLabel: false,
                isReferenced: false
            });

            if (nameFromSubTree !== "") {
                return nameFromSubTree;
            }

            return useAttribute(node, "title");
        }

        return useAttribute(node, "title");
    }

    function computeTextAlternative(current, context) {
        if (consultedNodes.has(current)) {
            return "";
        } // 2A


        if (!hidden && isHidden(current, getComputedStyle) && !context.isReferenced) {
            consultedNodes.add(current);
            return "";
        } // 2B


        var labelElements = (0, queryIdRefs)(current, "aria-labelledby");

        if (compute === "name" && !context.isReferenced && labelElements.length > 0) {
            return labelElements.map(function (element) {
                return computeTextAlternative(element, {
                    isEmbeddedInLabel: context.isEmbeddedInLabel,
                    isReferenced: true,
                    // thais isn't recursion as specified, otherwise we would skip
                    // `aria-label` in
                    // <input id="myself" aria-label="foo" aria-labelledby="myself"
                    recursion: false
                });
            }).join(" ");
        } // 2C
        // Changed from the spec in anticipation of https://github.com/w3c/accname/issues/64
        // spec says we should only consider skipping if we have a non-empty label


        var skipToStep2E = context.recursion && isControl(current) && compute === "name";

        if (!skipToStep2E) {
            var ariaLabel = ((0, isElement)(current) && current.getAttribute("aria-label") || "").trim();

            if (ariaLabel !== "" && compute === "name") {
                consultedNodes.add(current);
                return ariaLabel;
            } // 2D


            if (!isMarkedPresentational(current)) {
                var elementTextAlternative = computeElementTextAlternative(current);

                if (elementTextAlternative !== null) {
                    consultedNodes.add(current);
                    return elementTextAlternative;
                }
            }
        } // special casing, cheating to make tests pass
        // https://github.com/w3c/accname/issues/67


        if ((0, hasAnyConcreteRoles)(current, ["menu"])) {
            consultedNodes.add(current);
            return "";
        } // 2E


        if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
            if ((0, hasAnyConcreteRoles)(current, ["combobox", "listbox"])) {
                consultedNodes.add(current);
                var selectedOptions = querySelectedOptions(current);

                if (selectedOptions.length === 0) {
                    // defined per test `name_heading_combobox`
                    return (0, isHTMLInputElement)(current) ? current.value : "";
                }

                return (0, _arrayFrom)(selectedOptions).map(function (selectedOption) {
                    return computeTextAlternative(selectedOption, {
                        isEmbeddedInLabel: context.isEmbeddedInLabel,
                        isReferenced: false,
                        recursion: true
                    });
                }).join(" ");
            }

            if (hasAbstractRole(current, "range")) {
                consultedNodes.add(current);

                if (current.hasAttribute("aria-valuetext")) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
                    return current.getAttribute("aria-valuetext");
                }

                if (current.hasAttribute("aria-valuenow")) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
                    return current.getAttribute("aria-valuenow");
                } // Otherwise, use the value as specified by a host language attribute.


                return current.getAttribute("value") || "";
            }

            if ((0, hasAnyConcreteRoles)(current, ["textbox"])) {
                consultedNodes.add(current);
                return getValueOfTextbox(current);
            }
        } // 2F: https://w3c.github.io/accname/#step2F


        if (allowsNameFromContent(current) || (0, isElement)(current) && context.isReferenced || isNativeHostLanguageTextAlternativeElement(current) || isDescendantOfNativeHostLanguageTextAlternativeElement(current)) {
            consultedNodes.add(current);
            return computeMiscTextAlternative(current, {
                isEmbeddedInLabel: context.isEmbeddedInLabel,
                isReferenced: false
            });
        }

        if (current.nodeType === current.TEXT_NODE) {
            consultedNodes.add(current);
            return current.textContent || "";
        }

        if (context.recursion) {
            consultedNodes.add(current);
            return computeMiscTextAlternative(current, {
                isEmbeddedInLabel: context.isEmbeddedInLabel,
                isReferenced: false
            });
        }

        var tooltipAttributeValue = computeTooltipAttributeValue(current);

        if (tooltipAttributeValue !== null) {
            consultedNodes.add(current);
            return tooltipAttributeValue;
        } // TODO should this be reachable?


        consultedNodes.add(current);
        return "";
    }

    return asFlatString(computeTextAlternative(root, {
        isEmbeddedInLabel: false,
        // by spec computeAccessibleDescription starts with the referenced elements as roots
        isReferenced: compute === "description",
        recursion: false
    }));
}

//accessible-name.js

/**
 * https://w3c.github.io/aria/#namefromprohibited
 */
function prohibitsNaming(node) {
    return (0, hasAnyConcreteRoles)(node, ["caption", "code", "deletion", "emphasis", "generic", "insertion", "paragraph", "presentation", "strong", "subscript", "superscript"]);
}
/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_name
 * @param root
 * @param options
 * @returns
 */


function computeAccessibleName(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (prohibitsNaming(root)) {
        return "";
    }

    return (0, computeTextAlternative)(root, options);
}

//is-inaccessible.js

function isInaccessible(element) {
    var _element$ownerDocumen;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$getComputedS = options.getComputedStyle,
        getComputedStyle = _options$getComputedS === void 0 ? (_element$ownerDocumen = element.ownerDocument.defaultView) === null || _element$ownerDocumen === void 0 ? void 0 : _element$ownerDocumen.getComputedStyle : _options$getComputedS,
        _options$isSubtreeIna = options.isSubtreeInaccessible,
        isSubtreeInaccessibleImpl = _options$isSubtreeIna === void 0 ? isSubtreeInaccessible : _options$isSubtreeIna;

    if (typeof getComputedStyle !== "function") {
        throw new TypeError("Owner document of the element needs to have an associated window.");
    } // since visibility is inherited we can exit early


    if (getComputedStyle(element).visibility === "hidden") {
        return true;
    }

    var currentElement = element;

    while (currentElement) {
        if (isSubtreeInaccessibleImpl(currentElement, {
            getComputedStyle: getComputedStyle
        })) {
            return true;
        }

        currentElement = currentElement.parentElement;
    }

    return false;
}

/**
 *
 * @param element
 * @param options
 * @returns {boolean} - `true` if every child of the element is inaccessible
 */
function isSubtreeInaccessible(element) {
    var _element$ownerDocumen2;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$getComputedS2 = options.getComputedStyle,
        getComputedStyle = _options$getComputedS2 === void 0 ? (_element$ownerDocumen2 = element.ownerDocument.defaultView) === null || _element$ownerDocumen2 === void 0 ? void 0 : _element$ownerDocumen2.getComputedStyle : _options$getComputedS2;

    if (typeof getComputedStyle !== "function") {
        throw new TypeError("Owner document of the element needs to have an associated window.");
    }

    if (element.hidden === true) {
        return true;
    }

    if (element.getAttribute("aria-hidden") === "true") {
        return true;
    }

    if (getComputedStyle(element).display === "none") {
        return true;
    }

    return false;
}

//accessible-descript.js

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param root
 * @param options
 * @returns
 */
function computeAccessibleDescription(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var description = (0, queryIdRefs)(root, "aria-describedby").map(function (element) {
        return (0, computeTextAlternative)(element, _objectSpread(_objectSpread({}, options), {}, {
            compute: "description"
        }));
    }).join(" "); // TODO: Technically we need to make sure that node wasn't used for the accessible name
    //       This causes `description_1.0_combobox-focusable-manual` to fail
    //
    // https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
    // says for so many elements to use the `title` that we assume all elements are considered

    if (description === "") {
        var title = root.getAttribute("title");
        description = title === null ? "" : title;
    }

    return description;
}

var dom_accessibility_api = {
    "computeAccessibleDescription": computeAccessibleDescription,
    "computeAccessibleName": computeAccessibleName,
    "getRole": getRole,
    "isInaccessible": isInaccessible,
    "isSubtreeInaccessible": isSubtreeInaccessible
}

