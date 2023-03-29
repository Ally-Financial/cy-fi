/*
 * Copyright 2022 Ally Financial, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

var debug = false;
var settings = { "selector_order": ["cy.findByRole", "cy.findByText", "cy.findByLabelText", "cy.findByPlaceholderText", "cy.findByTestId", "cy.get"], "trim": true, useAllElements: false };
function getCySelectorByRole(element) {
    try {
        var res = { "role": "", "options": {}, "element": element };
        var role = dom_accessibility_api.getRole(element);
        if (!role || !role.trim()) {
            element = element.parentNode;
            if (element.nodeType == Node.DOCUMENT_NODE || element.childElementCount > 1) {
                return null;
            }
            role = dom_accessibility_api.getRole(element);
            if (!role || !role.trim())
                return null;
        }
        res.role = role;
        var name = dom_accessibility_api.computeAccessibleName(element);
        if (name && name.trim())
            res.options.name = name;
        if (!res.options.name) {
            var description = dom_accessibility_api.computeAccessibleDescription(element);
            if (description)
                res.options.description = description;
        }
        var element_role = ariaQuery.roles.get(role);

        if (element_role) {
            if (element_role.props["aria-selected"] !== undefined && computeAriaSelected(element)) {
                res.options.selected = true;
            }
            if (element_role.props["aria-checked"] !== undefined && computeAriaChecked(element)) {
                res.options.checked = true;
            }
            if (element_role.props["aria-pressed"] !== undefined && computeAriaPressed(element)) {
                res.options.pressed = true;
            }
            if (element_role.props["aria-current"] !== undefined && computeAriaCurrent(element)) {
                res.options.current = true;
            }
            if (element_role.props["aria-expanded"] !== undefined && computeAriaExpanded(element)) {
                res.options.expanded = true;
            }
        }
        if (role == "heading") {
            var l = computeHeadingLevel(element);
            if (l) {
                res.options.level = l;
            }
        }
        var iframe = getIframe(element);
        var contextDocument = iframe ? iframe.contentDocument : document;
        var allElementsWithRole = queryAllByRole(contextDocument, role, res.options);
        if (allElementsWithRole.length == 1) {
            return res;
        }
        //TODO :: Find alternate to the current options between all the found elements using role
    } catch (err) {
        if (debug)
            console.log(`Error occured while fetching role for ${element} :: ${err}`);
    }
    return null;
}

function getCySelectorByLabelText(element) {
    var result = { "value": "", "options": { "selector": "" }, "element": element };
    if (settings.trim) {
        result.options.trim = true;
    }
    try {
        if (isLabelable$labels(element)) {
            var tagName = element.tagName.toLowerCase();
            var id = element.id;
            var label_id = element.getAttribute("aria-labelledby");
            var iframe = getIframe(element);
            var contextDocument = iframe ? iframe.contentDocument : document;
            if (id && id.trim()) {
                var xpath = `//label[@for]`;
                var res = evaluateXpath(xpath, contextDocument, -1);
                var el = null;
                var value = "";
                for (var i = 0; i < res.snapshotLength; i++) {
                    var e = res.snapshotItem(i);
                    var f = e.getAttribute("for");
                    if (f && f.trim()) {
                        f = f.trim().split(" ");
                        if (f.indexOf(id) != -1) {
                            var tc = getLabelContent$labels(e) || "";
                            var r = evaluateXpath(`//label[text()=${removeQuotes(tc)}]`, contextDocument);
                            if (r) {
                                el = e;
                                value = settings.trim ? tc.trim() : tc;
                                break;
                            }
                        }

                    }
                }
                if (el) {
                    result.value = value;
                    result.options.selector = tagName;
                    result.element = element;
                    if (queryAllByLabelText$labels(contextDocument, result.value, result.options).length == 1)
                        return result;
                }
            }
            if (label_id && label_id.trim()) {
                var l = label_id.split(" ");
                var tc = "";
                for (var i = 0; i < l.length; i++) {
                    var res = contextDocument.getElementById(l[i]);
                    if (res && res.tagName.toLowerCase() == "label") {
                        var v = (getLabelContent$labels(res) || "");
                        if (v && tc.trim()) {
                            tc += " ";
                        }
                        tc += v;
                        if (tc && tc.trim()) {
                            result.value = settings.trim ? tc.trim() : tc;
                            result.options.selector = tagName;
                            result.element = element;
                            if (queryAllByLabelText$labels(contextDocument, result.value, result.options).length == 1)
                                return result;
                        }

                    }
                }
            }
        }
        else if (element.tagName == "LABEL") {

            var for_attr = element.getAttribute("for");
            var id = element.id;
            if (for_attr && for_attr.trim()) {
                for_attr = for_attr.trim().split(" ").slice(-1)[0];
                var res = contextDocument.getElementById(for_attr);
                if (res && isLabelable$labels(res)) {
                    var tc = getLabelContent$labels(element) || "";
                    if (tc && tc.trim()) {
                        result.value = settings.trim ? tc.trim() : tc;
                        result.options.selector = res.tagName.toLowerCase();
                        result.element = res;
                        if (queryAllByLabelText$labels(contextDocument, result.value, result.options).length == 1)
                            return result;
                    }
                }
            }
            if (id && id.trim()) {
                var res = evaluateXpath(`//*[contains(@aria-labelledby,"${id}")]`, contextDocument);
                if (res) {
                    var e = res.snapshotItem(0);
                    if (isLabelable$labels(e)) {
                        var tc = getLabelContent$labels(element) || "";
                        if (tc && tc.trim()) {
                            result.value = settings.trim ? tc.trim() : tc;
                            result.options.selector = e.tagName.toLowerCase();
                            result.element = e;
                            if (queryAllByLabelText$labels(contextDocument, result.value, result.options).length == 1)
                                return result;
                        }
                    }
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log(`Error occured while finding labeltext for ${element} :: ${err}`);
    }
    return null;
}

function getCySelectorByText(element) {

    try {
        var text = getTextContent(element);
        text = settings.trim ? text.trim() : text;
        if (text && text.trim()) {
            var options = { selector: element.tagName.toLowerCase() };
            if (settings.trim)
                options.trim = true;
            var iframe = getIframe(element);
            var contextDocument = iframe ? iframe.contentDocument : document;
            var res = queryAllByText(contextDocument, text, options)
            if (res && res.length == 1 && res[0] == element) {
                return { "value": text, "options": { ...options }, "element": element };
            }
        }
    } catch (err) {
        if (debug)
            console.log(`Error occured while fetching text for {${element}} :: ${err}`);
    }
    return null;
}


function getCySelectorByPlaceholderText(element) {
    var placeholder = element.getAttribute("placeholder");
    try {
        if (placeholder) {
            placeholder = settings.trim ? placeholder.trim() : placeholder;
            if (placeholder && placeholder.trim()) {
                var iframe = getIframe(element);
                var contextDocument = iframe ? iframe.contentDocument : document;
                var res = queryAllByAttribute(contextDocument, "placeholder", placeholder, settings.trim)
                if (res && res.length == 1) {
                    var options = {};
                    if (settings.trim)
                        options.trim = true;
                    return {
                        "value": placeholder, "options": { ...options }, "element": element
                    };
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log(`Error occured while fetching PlaceHolderText for ${element} :: `, err);
    }
    return null;
}

function getCySelectorByTestId(element) {
    try {
        var testAttribute = element.getAttribute("data-testid");
        if (!testAttribute) {
            element = element.parentNode;
            if (element.nodeType == Node.DOCUMENT_NODE || element.childElementCount > 1) {
                return null;
            }
            testAttribute = element.getAttribute("data-testid");
        }

        if (testAttribute) {
            testAttribute = settings.trim ? testAttribute.trim() : testAttribute;
            if (testAttribute && testAttribute.trim()) {
                var iframe = getIframe(element);
                var contextDocument = iframe ? iframe.contentDocument : document;
                var res = queryAllByAttribute(contextDocument, "data-testid", testAttribute, settings.trim)
                if (res && res.length == 1) {
                    var options = {};
                    if (settings.trim)
                        options.trim = true;
                    return {
                        "value": testAttribute, "options": { ...options }, "element": element
                    };
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log(`Error occured while fetching testid for ${element}:: `, err);
    }
    return null;
}

function getCySelectorByFullHTML(element) {
    // Default 
    try {
        if (element.tagName === 'BODY') {
            return '/html/body'
        } else {
            if (element.parentNode == null) {
                return "";
            }
            const sameTagSiblings = Array.from(element.parentNode.childNodes)
                .filter(e => e.nodeName === element.nodeName)
            const idx = sameTagSiblings.indexOf(element)

            return getCySelectorByFullHTML(element.parentNode) +
                '/' +
                element.tagName.toLowerCase() +
                (sameTagSiblings.length > 1 ? `[${idx + 1}]` : '')
        }
    } catch (err) {
        if (debug)
            console.log("Error occured while fetching full html for element :: ", element, "\nError::", err);
    }
    return null;
}

function getCySelectorByHTMLTag(element) {
    // Default 
    try {
        var tagName = element.tagName.toLowerCase();
        var ind = 0;
        var iframe = getIframe(element);
        var contextDocument = iframe ? iframe.contentDocument : document;
        var ele = contextDocument.getElementsByTagName(tagName);
        var found = false;
        for (var i = 0; i < ele.length; i++) {
            if (ele[i] == element) {
                found = true;
                break;
            }
            ind += 1;
        }
        if (!found)
            return null;
        return { "tagName": tagName, "index": ind };
    } catch (err) {
        if (debug)
            console.log("Error occured while fetching html tag for element :: ", element, "\nError", err);
    }
    return null;
}

function getCySelectorByHTMLSelector(element, ignoreClassNames = false) {
    try {
        if (element.tagName === "HTML") return "HTML";
        if (element.tagName === "BODY") return "BODY";
        var names = [];
        var originalElement = element;
        var isIgnoreClassNames = ignoreClassNames;
        var iframe = getIframe(element);
        var contextDocument = iframe ? iframe.contentDocument : document;
        while (element.parentElement && element.tagName !== "BODY") {
            if (element.id && element.id.trim()) {
                names.unshift("#" + element.getAttribute("id")); // getAttribute, because `element.id` could also return a child element with name "id"
                break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
            } else if (element.className && typeof (element.className) == "string" && !ignoreClassNames) {
                var classes = element.className.split(/\s/);
                var str = element.tagName.toLowerCase();
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].trim())
                        str += "." + classes[i]
                }
                names.unshift(str);
            }
            else {
                let c = 1, e = element;
                for (; e.previousElementSibling; e = e.previousElementSibling, c++);
                names.unshift(element.tagName.toLowerCase() + ":nth-child(" + c + ")");
            }
            ignoreClassNames = false;
            element = element.parentElement;
            try {
                var selector = names.join(">");
                var elements = contextDocument.querySelectorAll(selector);
                if (elements.length == 1 && elements[0] == originalElement) {
                    return selector;
                }
            } catch (err) { }
        }
        names = names.join(">");
        var elements = contextDocument.querySelectorAll(names);
        if (elements.length == 1 && elements[0] == originalElement)
            return names;
        else if (!isIgnoreClassNames)
            return getCySelectorByHTMLSelector(originalElement, true);
        else
            return null;
    } catch (err) {
        if (debug)
            console.log(`Error occured while finding html selector for ${element}.\nError:${err}`);
    }
    return null;
}

function getElementCySelector(element) {
    if (!element) return null;
    if (!(settings && settings.selector_order && typeof (settings.selector_order) == 'object' && settings.selector_order.length == 6)) {
        settings = { "selector_order": ["cy.findByRole", "cy.findByText", "cy.findByLabelText", "cy.findByPlaceholderText", "cy.findByTestId", "cy.get"], "trim": true, useAllElements: false };
    }

    try {
        for (var i = 0; i < settings.selector_order.length; i++) {
            if (settings.selector_order[i].trim() == "cy.findByRole") {
                var role = getCySelectorByRole(element);
                if (role) {
                    return { "selector": `cy.findByRole("${role["role"]}"${Object.keys(role.options).length > 0 ? "," + JSON.stringify(role.options) : ""})`, "element": role.element };
                }
            }
            else if (settings.selector_order[i].trim() == "cy.findByText") {
                var text = getCySelectorByText(element);
                if (text) {
                    return { "selector": `cy.findByText("${text["value"]}", ${JSON.stringify(text.options)})`, "element": text.element };
                }
            } else if (settings.selector_order[i].trim() == "cy.findByLabelText") {
                var labelText = getCySelectorByLabelText(element);
                if (labelText) {
                    return { "selector": `cy.findByLabelText("${labelText["value"]}", ${JSON.stringify(labelText.options)})`, "element": labelText.element };
                }
            } else if (settings.selector_order[i].trim() == "cy.findByPlaceholderText") {
                var placeholderText = getCySelectorByPlaceholderText(element);
                if (placeholderText) {
                    return { "selector": `cy.findByPlaceholderText("${placeholderText["value"]}"${Object.keys(placeholderText.options).length > 0 ? "," + JSON.stringify(placeholderText.options) : ""})`, "element": placeholderText.element };
                }

            } else if (settings.selector_order[i].trim() == "cy.findByTestId") {
                var data_testid = getCySelectorByTestId(element);
                if (data_testid) {
                    return { "selector": `cy.findByTestId("${data_testid["value"]}"${Object.keys(data_testid.options).length > 0 ? "," + JSON.stringify(data_testid.options) : ""})`, "element": data_testid.element };
                }

            } else if (settings.selector_order[i].trim() == "cy.get") {
                var htmlSelector = getCySelectorByHTMLSelector(element);
                var htmlTag = getCySelectorByHTMLTag(element);
                if (htmlSelector) {
                    return { "selector": `cy.get("${htmlSelector}")`, "element": element };
                }
                else if (htmlTag) {
                    return { "selector": `cy.get("${htmlTag.tagName}").eq(${htmlTag.index})`, "element": element };
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log(`Error occured while fetching cy selector for element :: ${element}\nError:: ${err}`);
    }
    return null;
}