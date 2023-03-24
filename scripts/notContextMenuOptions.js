var notContextMenuOptions = {
    cat1: {
        label: "Element Assertions",
        values: [
            {
                label: "not.exist",
                command: "should",
                params: []
            },
            {
                label: "not.be.visible",
                command: "should",
                params: []
            },
            {
                label: "not.be.checked",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        var checked = computeAriaChecked(element);
                        return (checked != undefined && !checked);
                    }
                    return false;
                },
                params: []
            },
            {
                label: "not.be.disabled",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return (element.disabled == undefined || element.disabled == false);
                    }
                    return false;
                },
                params: []
            },
            {
                label: "not.have.focus",
                command: "should",
                enabler: function (element) {
                    if (element instanceof HTMLElement) {
                        return computeIsFocusable(element);;
                    }
                    return false;
                },
                params: []
            },
            {
                label: "not.have.value",
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
                    optional: false,
                    default: (element) => element.value
                }]
            },
            {
                label: "not.have.css",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "value",
                    type: "text",
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
                label: "not.have.class",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "Class",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "not.have.attr",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "Attribute",
                    type: "text",
                    optional: false
                }, {
                    name: "Value",
                    type: "text",
                    optional: true
                }
                ]
            }

        ]
    },
    cat2: {
        label: "Value Assertions",
        values: [
            {
                label: "not.be.empty",
                command: "invoke('val').should",
                enabler: (element) => checkIfItsTypable(element),
                params: []
            }
        ]
    },
    cat3: {
        label: "Text Assertions",
        values: [
            {
                label: "not.have.text",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "value",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "not.include.text",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "value",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "not.contain",
                command: "should",
                enabler: (element) => element instanceof HTMLElement,
                params: [{
                    name: "value",
                    type: "text",
                    optional: false
                }]
            },
            {
                label: "not.match",
                command: "and",
                enabler: (element) => element instanceof HTMLElement,
                customCodeCreator: (element, values) => {
                    if (Array.isArray(values) && values.length == 2) {
                        var selector = getElementCySelector(element);
                        if (selector) {
                            var code = `${selector.selector}.invoke('${values[0]}').should("not.match",${values[1]})`
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