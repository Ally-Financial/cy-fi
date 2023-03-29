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

// files used :: dom_accessibility_api.js

const labelledNodeNames$labels = ['button', 'meter', 'output', 'progress', 'select', 'textarea', 'input'];

function getTextContent(node) {
    if (labelledNodeNames$labels.includes(node.nodeName.toLowerCase())) {
        return '';
    }

    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    return Array.from(node.childNodes).map(childNode => getTextContent(childNode)).join('');
}
function computeAriaSelected(element) {

    if (element.tagName === 'OPTION') {
        return element.selected;
    }
    return checkBooleanAttribute(element, 'aria-selected');
}

function computeAriaChecked(element) {
    if ('indeterminate' in element && element.indeterminate) {
        return undefined;
    }

    if ('checked' in element) {
        return element.checked;
    }
    return checkBooleanAttribute(element, 'aria-checked');
}

function computeAriaPressed(element) {
    return checkBooleanAttribute(element, 'aria-pressed');
}

function computeAriaCurrent(element) {
    var _ref, _checkBooleanAttribut;
    return (_ref = (_checkBooleanAttribut = checkBooleanAttribute(element, 'aria-current')) != null ? _checkBooleanAttribut : element.getAttribute('aria-current')) != null ? _ref : false;
}

function computeAriaExpanded(element) {
    return checkBooleanAttribute(element, 'aria-expanded');
}

function checkBooleanAttribute(element, attribute) {
    const attributeValue = element.getAttribute(attribute);

    if (attributeValue === 'true') {
        return true;
    }

    if (attributeValue === 'false') {
        return false;
    }

    return undefined;
}

function computeHeadingLevel(element) {
    const implicitHeadingLevels = {
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
        H5: 5,
        H6: 6
    };
    const ariaLevelAttribute = element.getAttribute('aria-level') && Number(element.getAttribute('aria-level'));
    return ariaLevelAttribute || implicitHeadingLevels[element.tagName];
}

function queryAllByAttribute(element, attribute, text, trim = false) {
    return Array.from(element.querySelectorAll(`[${attribute}]`)).filter(node => matchStrings(node.getAttribute(attribute), text, trim))
}

function queryByAttribute(element, attribute, text, trim = false) {
    var elements = queryAllByAttribute(element, attribute, text, { trim: trim });
    if (elements.length > 1) {
        return none;
    }
    return elements[0] || null;
}

function evaluateXpath(xpath, contextNode = document, count = 1) {
    var res = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (res.snapshotLength == count || count == -1) {
        return res;
    }
    return null;
}

function getAttributesByRegex(element, regex) {
    var attributes = element.attributes;
    var results = [];
    for (let i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        var isMatched = regex.test(attr.name);
        if (isMatched) {
            results.push({ attribute: attr.name, value: attr.value });
        }
    }
    return results;
}

function isVisible(ele) {
    var style = window.getComputedStyle(ele);
    return style.width !== "0" &&
        style.height !== "0" &&
        style.opacity !== "0" &&
        style.display !== 'none' &&
        style.visibility !== 'hidden';
}
function removeQuotes(str) {
    if (str.indexOf("'") != -1) {
        str = "\"" + str + "\"";
    } else if (str.indexOf('"') != -1) {
        str = "\'" + str + "\'";
    } else {
        str = "\"" + str + "\"";
    }
    return str;
}

function matchStrings(textToMatch, matcher, trim = false) {
    if (trim)
        textToMatch = textToMatch.trim();
    return textToMatch === String(matcher);
}

function getNodeText(node) {
    if (node.matches('input[type=submit], input[type=button], input[type=reset]')) {
        return node.value;
    }

    return Array.from(node.childNodes).filter(child => child.nodeType === Node.TEXT_NODE && Boolean(child.textContent)).map(c => c.textContent).join('');
}

function isDropDown(element) {
    if (element.getAttribute("list")) {
        element = document.getElementById(element.getAttribute("list"));
    }
    if (dom_accessibility_api.getRole(element) == "option") {
        element = element.parentElement;
    }
    if (["listbox", "combobox"].indexOf(dom_accessibility_api.getRole(element)) != -1)
        return element;
    return undefined;
}

function generateValuesForDropDownElement(element) {
    var element = isDropDown(element);
    if (element) {
        var options = element.querySelectorAll("option");
        if (options.length == 0) {
            options = element.childNodes;
        }
        var res = [];
        for (var i = 0; i < options.length; i++) {
            var v = options[i].innerText.trim();
            res.push(v == "" ? options[i].value : v);
        }
        return res;
    }
    return [];
}

function getIframe(element) {
    return element ? element.ownerDocument.defaultView.frameElement : null;
}
function isIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function isIframeParentAccessible() {
    if (isIframe()) {
        try {
            var parentURL = parent.location.href;
        } catch (e) {
            return false;
        }
    }
    return true;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function isInSameForm(element1, element2) {
    try {
        var iframe1 = getIframe(element1);
        var contextDocument1 = iframe1 ? iframe1.contentDocument : document;
        var iframe2 = getIframe(element2);
        var contextDocument2 = iframe2 ? iframe2.contentDocument : document;
        var html1 = getCySelectorByFullHTML(element1);
        var html2 = getCySelectorByFullHTML(element2);
        if (html1 && html2 && iframe1 == iframe2) {
            html1 = html1 + "/ancestor::form[1]";
            html2 = html2 + "/ancestor::form[1]";
            var e1 = evaluateXpath(html1, contextDocument1);
            var e2 = evaluateXpath(html2, contextDocument2);
            if (e1 && e2 && e1.snapshotItem == e2.snapshotItem) {
                return true;
            }
        }
    } catch (err) {
        if (debug)
            console.log("[helpers.js] [isInSameForm] Error:", err)
    }
    return false;
}

// Refer https://allyjs.io/data-tables/focusable.html for list of focusable elements
function computeIsFocusable(element) {
    if (element.disabled == true)
        return false;
    if (element.tabIndex == -1)
        return true;
    var tagName = element.tagName.toLowerCase();
    if (["input", "select", "textarea", "body"].indexOf(tagName) != -1)
        return true;
    if (tagName == "embed" && (element.getAttribute("type") == "video/mp4"))
        return true;
    return false;
}

function checkIfValueAttrPresent(element) {
    for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        var value = (child.getAttribute("value") || child.value);
        if (value && value != "") {
            return true;
        } else
            return checkIfValueAttrPresent(child);
    }
    return false;
}

function isContentEditableEnabled(element) {
    var max_parents = maxNumberOfParents;
    try {
        while (max_parents > 0 && element && element.tagName != "BODY") {
            var contentEditable = element.getAttribute("contenteditable");
            if (contentEditable == "" || contentEditable == "true") {
                return true;
            }
            element = element.parentElement;
            max_parents -= 1;
        }
    } catch (err) { }
    return false;
}

function isClickable(element) {
    var parents = maxNumberOfParents;
    while (element && element.tagName != "BODY" && parents > 0) {
        var role = dom_accessibility_api.getRole(element);
        var tagName = element.tagName.toLowerCase();
        if ((checkIfItsTypable(element) || element.tagName == "LABEL" || changeableInputTypes.indexOf(element.type) != -1 || clickableElements.indexOf(tagName) != -1 || clickableElementRoles.indexOf(role) != -1 || element.getAttribute("onclick") || element.getAttribute("aria-pressed") || (element.getAttribute("aria-haspopup") && element.getAttribute("aria-haspopup") != "false") || element.getAttribute("tabindex"))) {
            return true;
        }
        element = element.parentElement;
        parents -= 1;
    }
    return false;
}

function checkIfItsTypable(element) {
    if (element instanceof HTMLElement) {
        var role = dom_accessibility_api.getRole(element);
        var tagName = element.tagName.toLowerCase();
        var isTypable = (typableElementsRoles.indexOf(role) != -1 || (tagName == "input" && element.type == "password") || isContentEditableEnabled(element));
        return isTypable;
    }
    return false;
}