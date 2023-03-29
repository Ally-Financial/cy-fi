// types: text, number, select, multi_select, regex
// properties:
//1) label: the name of the assertion
//2) command: the command on which the assertion can be provided as option
//3) considerAllElements: true of the assertion to be considered when considerAllElements in switched on in settings irrespective of the value from the enabler function.
//4) enabler(optional): element: HTMLElement){} => The callback which takes HTMLElement as parameter and returns true or false on whether the assertion should be enabled or not
//5) params: A list of parameters that the assertion needs as inputs
//6) customCodeCreator(optional): (element,values){} => Callback which returns the code for the given element with the given list of values
// Params properties:
// 1) name : the name of the option to ask as input from the user
// 2) type: the type of the option.
//      Currently there are 5 types: 
//      a) text: A normal text input
//      b) number: Number input
//      c) select/multi_select: A select dropdown with 1 or multiple options to select from.
//         The select option can have few other properties
//         i) values: (element){} => A list of values for the dropdown
//        ii) addNewField(optional): (value,element){} => A list of params to add based on the select option selected. This will be added as an extra input at the user side.
//      d) regex: A regex input field which takes the input as regex.
// 3) optioanl: true or false. Whether this param can be optional
// 4) optionalRegex : true or false. Whether the text input can be conerted into regex. Only applicable for text inputs.
// 5) default(optional): (element){} | string => Return a default value for the param.

//files used :: variables.js, dom_accessibility_api.js, helpers.js

//Checks:
//1) Should the click be available for all the elements or to the clickable elements?


var contextMenuOptions = {
    cat1: {
        label: "Actions",
        values: [
            {
                label: "type",
                command: "",
                enabler: (element) => (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false) && checkIfItsTypable(element)),
                params: [{
                    name: "value",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "click",
                command: "",
                considerAllElements: true,
                customCodeCreator: (element, values) => {
                    var parents = maxNumberOfParents;
                    while (element && element.tagName != "BODY" && parents > 0) {
                        var role = dom_accessibility_api.getRole(element);
                        var tagName = element.tagName.toLowerCase();
                        if ((checkIfItsTypable(element) || element.tagName == "LABEL" || changeableInputTypes.indexOf(element.type) != -1 || clickableElements.indexOf(tagName) != -1 || clickableElementRoles.indexOf(role) != -1 || element.getAttribute("onclick") || element.getAttribute("aria-pressed") || (element.getAttribute("aria-haspopup") && element.getAttribute("aria-haspopup") != "false") || element.getAttribute("tabindex"))) {
                            var selector = getElementCySelector(element);
                            if (selector) {
                                return { code: selector.selector + ".click()", selector: selector };
                            }
                            return null;
                        }
                        element = element.parentElement;
                        parents -= 1;
                    }
                    return null;
                },
                enabler: (element) => ((element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) && isClickable(element)),
                params: []
            },
            {
                label: "dblclick",
                command: "",
                customCodeCreator: (element, values) => {
                    var parents = maxNumberOfParents;
                    while (element && element.tagName != "BODY" && parents > 0) {
                        var role = dom_accessibility_api.getRole(element);
                        var tagName = element.tagName.toLowerCase();
                        if ((checkIfItsTypable(element) || element.tagName == "LABEL" || changeableInputTypes.indexOf(element.type) != -1 || clickableElements.indexOf(tagName) != -1 || clickableElementRoles.indexOf(role) != -1 || element.getAttribute("onclick") || element.getAttribute("aria-pressed") || (element.getAttribute("aria-haspopup") && element.getAttribute("aria-haspopup") != "false") || element.getAttribute("tabindex"))) {
                            var selector = getElementCySelector(element);
                            if (selector) {
                                return { code: selector.selector + ".dblclick()", selector: selector };
                            }
                            return null;
                        }
                        element = element.parentElement;
                        parents -= 1;
                    }
                    return null;
                },
                enabler: (element) => ((element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) && isClickable(element)),
                params: []
            },
            {
                label: "rightclick",
                command: "",
                params: []
            },
            {
                label: "check",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        var checked = computeAriaChecked(element);
                        return checked != undefined && checked;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "uncheck",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        var checked = computeAriaChecked(element);
                        return checked != undefined && !checked;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "select",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        return isDropDown(element);
                    }
                    return false;
                },
                params: [{
                    name: "values",
                    optional: false,
                    type: "multi_select",
                    canSupportMultiple: true
                }]
            },
            {
                label: "focus",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        return computeIsFocusable(element);
                    }
                    return false;
                },
                params: []
            },
            {
                label: "blur",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        return computeIsFocusable(element);
                    }
                    return false;
                },
                params: []
            },
            {
                label: "submit",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        while (element && element.parentElement && element.tagName != "BODY") {
                            if (element.tagName.toLowerCase() == "form") {
                                return true;
                            }
                            element = element.parentElement;
                        }
                    }
                    return false;
                },
                params: []
            },
            {
                label: "clear",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement && (element.disabled == undefined || element.disabled == false)) {
                        return checkIfItsTypable(element);
                    }
                    return false;
                },
                params: []
            }
        ]
    },
    cat2: {
        label: "Element Assertions",
        values: [
            {
                label: "exist",
                command: "should",
                params: []
            },
            {
                label: "be.visible",
                command: "should",
                params: []
            },
            {
                label: "be.checked",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        var checked = computeAriaChecked(element);
                        return checked != undefined && checked;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "be.disabled",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement && element.disabled == true) {
                        return true;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "have.focus",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return document.activeElement == element;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "have.value",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return (["input", "textarea", "select"].indexOf(element.tagName.toLowerCase()) || changeableInputTypes.indexOf(element.type) != -1 || [...changeableRoles, ...typableElementsRoles, "checkbox", "radio", "spinbutton"].indexOf(dom_accessibility_api.getRole(element)) != -1);
                    }
                    return false;
                },
                params: [{
                    name: "value",
                    type: "text",
                    optionalRegex: true,
                    optional: false,
                    default: (element) => element.value
                }]
            },
            {
                label: "have.css",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "CSS Property",
                    type: "select",
                    optional: false,
                    addNewField: (value, element) => {
                        var data = { name: "Value", optional: false };
                        var v = css_properties[value];
                        if (v) {
                            if ("values" in v) {
                                data["type"] = "select";
                                data["values"] = function (e) {
                                    return v["values"];
                                };
                            } else {
                                data["type"] = "text";
                            }
                            if (element) {
                                var d = element.style.getPropertyValue(value);
                                data["default"] = (d && d != "") ? d : v["initial"];
                            } else {
                                data["default"] = v["initial"];
                            }
                            return [data];
                        }
                        return null;
                    },
                    values: function (element) {
                        return Object.keys(css_properties);
                    }
                }]
            },
            {
                label: "have.class",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return element.classList.length > 0;
                    }
                    return false;
                },
                params: [{
                    name: "Select A Class",
                    type: "select",
                    optional: false,
                    values: function (element) {
                        var values = [];
                        for (var i = 0; i < element.classList.length; i++) {
                            values.push(element.classList[i]);
                        }
                        return values;
                    }
                }]
            },
            {
                label: "have.attr",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return element.attributes && element.attributes.length > 0;
                    }
                    return false;
                },
                params: [{
                    name: "Attribute",
                    type: "select",
                    optional: false,
                    addNewField: function (value, element) {
                        var attrs = element.attributes;
                        var attrValue = "";
                        for (var i = 0; i < attrs.length; i++) {
                            if (attrs[i].name == value) {
                                attrValue = attrs[i].value;
                                break;
                            }
                        }
                        return [{ type: "text", default: attrValue, name: "Value", optional: true }];
                    },
                    values: function (element) {
                        var values = [];
                        for (var i = 0; i < element.attributes.length; i++) {
                            values.push(element.attributes[i].name);
                        }
                        return values;
                    }
                }]
            }

        ]
    },
    cat3: {
        label: "Value Assertions",
        values: [
            {
                label: "contains",
                command: "",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return (element.nodeType == Node.TEXT_NODE || element.innerText != "" || checkIfValueAttrPresent(element));
                    }
                    return false;
                },
                params: [{
                    name: "value",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "be.empty",
                command: "invoke('val').should",
                enabler: (element) => checkIfItsTypable(element),
                params: []
            }
        ]
    },
    cat4: {
        label: "Text Assertions",
        values: [
            {
                label: "have.text",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return element.innerText && element.innerText != "";
                    }
                    return false;
                },
                params: [{
                    name: "value",
                    type: "text",
                    optional: false,
                    default: (element) => element.innerText
                }]
            },
            {
                label: "include.text",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return element.innerText && element.innerText != "";
                    }
                    return false;
                },
                params: [{
                    name: "value",
                    type: "text",
                    optional: false,
                    default: (element) => element.innerText
                }]
            },
            {
                label: "match",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                customCodeCreator: (element, values) => {
                    if (Array.isArray(values) && values.length == 2) {
                        var selector = getElementCySelector(element);
                        if (selector) {
                            var code = `${selector.selector}.invoke('${values[0]}').should("match",${values[1]})`
                            return { code: code, selector: selector };
                        }
                    }
                    return null;
                },
                params: [{
                    name: "Type",
                    type: "select",
                    optional: false,
                    addNewField: (value, element) => {
                        return [{ name: "Value", optional: false, type: "regex" }];
                    },
                    values: (element) => {
                        var v = ["text"];
                        if ((["input", "textarea", "select"].indexOf(element.tagName.toLowerCase()) || changeableInputTypes.indexOf(element.type) != -1 || [...changeableRoles, ...typableElementsRoles, "checkbox", "radio", "spinbutton"].indexOf(dom_accessibility_api.getRole(element)) != -1)) {
                            v.push("val");
                        }
                        return v;
                    }
                }]
            }

        ]
    }
}

