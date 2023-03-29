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


// Enable debugging to print errors and requests recieved between content_script, background script and popup
var debug = true;
// Currently hovered element
var inspecting_element = {};
// True if the user clicks during inspecting so that the inspect information of the currently hovered element will be available until the user presses ESCAPE key.
var clicked = false;
// tabId of the current window or tab.
var current_tab;
// The current CY selector generated from the user action.
var current_selector = { element: null, selector: null, text: "" };
// To handle tab presses. (If isTabPressed==1 and onchange event is firedf then the code needs to be corrected by moving the code for onchange event on top of tab press code. As this is how events occur keydown->OnChange->Focus)
var isKeyPressed = -1;
// the Cy selector on which the TAB key is pressed.
var key_pressed_selector_element = {};
var isEnterKeyPressed = false;
// To keep the service worker of chrome extension active. There is a issue of service worker becoming inactive in chrome for chrome extensions with Manifest V3.
var wakeUpTimer;
// time in milli seconds to wait to ping the service worker.
var waitTimeToPingServiceWorker = 2000;
// List of keys pressed
var keysPressed = [];
// KEY codes
const TAB_CODE = 9, ENTER_CODE = 13;
// Element corresponding to the previous line of code
var previous_element = null;

var contextMenuToggle = false;
var cy_selector_inspecting_element = null;
var contextMenuActivatedElement = null;
var contextMenuOptionsDialogToggle = false;
var addMultiSelectDropDown = [];
// Code for getting iframe body
var cypressCodeForIframe = [`  const getIframeBody = (iframe_selector: any) => {`, `    // retry until the body element is not empty`, `    return iframe_selector`, `    .its('0.contentDocument.body').should('not.be.empty')`, `    // wraps "body" DOM element to allow`, `    // chaining more Cypress commands, like ".find(...)"`, `    .then(cy.wrap)`, `  };`];

let notifier = new Notifier();

const delay = ms => new Promise(res => setTimeout(res, ms));

function countLines(target) {
    try {
        var style = window.getComputedStyle(target, null);
        var height = parseInt(style.getPropertyValue("height"));
        var font_size = parseInt(style.getPropertyValue("font-size"));
        var line_height = parseInt(style.getPropertyValue("line-height"));
        var box_sizing = style.getPropertyValue("box-sizing");

        if (isNaN(line_height)) line_height = font_size * 1.2;

        if (box_sizing == 'border-box') {
            var padding_top = parseInt(style.getPropertyValue("padding-top"));
            var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
            var border_top = parseInt(style.getPropertyValue("border-top-width"));
            var border_bottom = parseInt(style.getPropertyValue("border-bottom-width"));
            height = height - padding_top - padding_bottom - border_top - border_bottom
        }
        var lines = Math.ceil(height / line_height);

        return lines > 1 ? lines - 1 : lines;
    }
    catch (err) {

    }
    return null;
}


function isPartOfDialog(element) {
    while (element && ["HTML", "BODY"].indexOf(element.tagName) == -1) {
        if (element.tagName == "DIALOG")
            return element;
        element = element.parentElement;
    }
    return null;
}

/**
 * Highlights and creates a tooltip.
 * @param {HTMLElement} element HTML Element to highlight
 * @param {string} cy_selector Tooltip to show for the given HTML Element
 */
function _createMark(element, cy_selector) {
    try {
        var _isPartOfDialog = isPartOfDialog(element);
        var rect = element.getBoundingClientRect();
        var win = element.ownerDocument.defaultView;
        var top = rect.top;
        var left = rect.left + (_isPartOfDialog ? 0 : win.pageXOffset);
        var right = rect.right;
        var document_width = document.documentElement.clientWidth;
        var document_height = document.documentElement.clientHeight;
        var element_height = rect.height;
        var iframe = getIframe(element);
        if (iframe)
            top = top + iframe.getBoundingClientRect().top;
        var top_updated = top < 36 ? ((isNaN(element_height) ? 16 : element_height) + top + 5) : (top - 32);
        var e = document.getElementById("__ccg_ext_cy_selector_asdwaA1243AWdaRWEq12__");
        if (e != null)
            e.remove();
        var div_ele = document.createElement("div");
        div_ele.id = "__ccg_ext_cy_selector_asdwaA1243AWdaRWEq12__";
        var colors = { "textColor": "white", "backgroundColor": "rgb(0,0,0)" };
        div_ele.innerHTML += "<div id='__ccg_ext_inspect_value_asdwaA1243AWdaRWEq12__' style='pointer-events: none;margin:0;z-index:999999999999;padding: 4px 6px !important;border-radius:6px;color:" + colors["textColor"] + ";background-color:" + colors["backgroundColor"] + ";font-weight:bold;font-size:16px;position:fixed;" + `top:${top_updated}px;` + ((document_width - left < 200) ? `right:${document_width - right}px;` : `left:${left}px;`) + "'>" + cy_selector + "</div>";
        (_isPartOfDialog ? _isPartOfDialog : document.body).append(div_ele);
        cy_selector_inspecting_element = div_ele;
        div_ele = document.getElementById("__ccg_ext_inspect_value_asdwaA1243AWdaRWEq12__");
        var bottomAdded = false;
        if (countLines(div_ele) > 1 && (document_width - left >= 200)) {
            while (countLines(div_ele) > 1 && left > 160) {
                left = left - (document_width * 0.07);
                div_ele.style.left = `${left}px`;
            }
            var div_ele_rect = div_ele.getBoundingClientRect();
            if ((top_updated + div_ele_rect.height) > document_height) {
                div_ele.style.top = "unset";
                div_ele.style.bottom = "2px";
                bottomAdded = true;
            }
            if (countLines(div_ele) > 1 && !bottomAdded) {
                var currentLeft = div_ele.style.left;
                var cl = countLines(div_ele);
                while (cl && cl > 1) {
                    left = left - (document_width * 0.07);
                    div_ele.style.left = `${left}px`;
                    cl = countLines(div_ele);
                }
                if (cl == 1) {
                    div_ele_rect = div_ele.getBoundingClientRect();
                    var height = div_ele_rect.height;
                    div_ele.style.left = currentLeft;
                    div_ele_rect = div_ele.getBoundingClientRect();
                    var top_new = top_updated - (div_ele_rect.height - height) - 4;
                    div_ele.style.top = `${top >= 36 ? (top_new < 36 ? top_new + (38 - top_new) : top_new) : top_updated}px`
                }

            }
        } else {
            var div_ele_rect = div_ele.getBoundingClientRect();
            if ((top_updated + div_ele_rect.height) > document_height) {
                div_ele.style.top = "unset";
                div_ele.style.bottom = "2px";
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [_createMark] Error :: ", err)
    }
}

/**
 * Deletes created tooltip and restores style of the highlighted element.
 */
function _clear() {
    try {
        if ("current_element" in inspecting_element) {
            var ele = inspecting_element["current_element"];
            ele.style = inspecting_element["style"];
            if (inspecting_element["inline-style"] && inspecting_element["inline-style"].trim())
                ele.setAttribute("style", inspecting_element["inline-style"]);
            else
                ele.removeAttribute("style");

        }
        if (cy_selector_inspecting_element) {
            cy_selector_inspecting_element.remove();
            cy_selector_inspecting_element = null;
        }
        clicked = false;
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [_clear] Error :: ", err)
    }
}


/**
 * Handles mouse over events to create element highlights when inspecting is ON.
 * @param {MouseEvent} event
 */
function handleMouseOver(event) {
    try {
        if (data.toggleInspect[current_tab] && !clicked) {
            event = event || window.event;
            var element = event.target;
            var tagName = element.tagName.toLocaleLowerCase();
            if (["html", "body"].indexOf(tagName) == -1) {
                _clear();
                var s = element.style;
                inspecting_element["current_element"] = element;
                inspecting_element["style"] = s;
                inspecting_element["inline-style"] = element.getAttribute("style")
                if (tagName != "iframe")
                    element.style.backgroundColor = "#0175c26b";
                element.style.border = "0.5px solid orange";
                var selector = getElementCySelector(element);
                _createMark(element, selector ? selector.selector : "Not able to retrieve cy selector.");
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleMouseOver] Error :: ", err)
    }
}

/**
 * Sends message to background.js or service worker to perform action or to use chrome api functionality based on given type and
 * receives the response from background.js through callback.
 * @param {JSON} request 
 * @param {string} from 
 * @param {string} type 
 * @param {function(Object)} callback 
 */
function sendMessageToBackground(request, from = "content_script", type = "save", callback = (response) => {
    // When background.js is not available or active, chrome throws a chrome.runtime.lastError
    if (chrome.runtime.lastError) {
        if (debug)
            console.log("[content_script.js] [sendMessageToBackground] chrome.runtime.lastError occured for Request :: ", request, " From::", from, "Type::", type);
    }
}) {
    try {
        chrome.runtime.sendMessage({ from: from, type: type, ...request }, callback);
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [sendMessageToBackground] Not able to send message to background")
    }
}

/**
 * Sends a message to the parent window of iframe to get the cy selector of the given iframe element.
 * We only have access to the elements inside the given iframe, so we won't get the cy selector of the iframe as we are out of context
 * @param {HTMLElement} frame iframe element
 * @param {JSON} data 
 * @returns {Promise} Promise
 */
function getParentIframeSelector(frame, data) {
    return new Promise((resolve) => {
        const channel = new MessageChannel();
        // this will fire when iframe will answer
        channel.port1.onmessage = e => resolve(e.data);
        // let iframe know we're expecting an answer
        // send it in its own port
        frame.contentWindow.window.parent.postMessage({ "fromId": "EQdHKEmLpm5c7HE5", ...data }, '*', [channel.port2]);
    });
}

/**
 * Listens to messages sent using postmessage to this window.
 */
window.addEventListener("message", (messageEvent) => {
    try {
        var mdata = messageEvent.data;
        if (typeof mdata == "object" && messageEvent.ports) {
            // Only process messages which has EQdHKEmLpm5c7HE5 as fromId in the data to restrict processing other messages sent to this window
            if (mdata.fromId == "EQdHKEmLpm5c7HE5") {
                // Get Iframe with the given iframeId
                // data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5 attribute is set during initialization with random ID
                var selector = getElementCySelector(document.querySelector(`[data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5='${mdata.iframeId}']`));
                // Sends back the response to the sender
                messageEvent.ports[0].postMessage({ "selector": selector ? selector.selector : null });
            }
        }
    } catch (err) {
        if (debug)
            console.log("[ERROR] [Content Script] [window.onMessage] Error Occured while retreiving data :: ", err);
    }
});

/**
 * Builds Query for iframe by chaining the iframes.
 * Example: Consider the list of iframe selectors
 * selectors = ["cy.get("#iframe-child1")", "cy.get("#iframe-child2")", "cy.get("#iframe-child3")"]
 * In order to access the first iframe we need to first access second iframe as the first iframe is the child of the second iframe and so on.
 * So the chain is cy.get("#iframe-child3") -> cy.get("#iframe-child2") -> cy.get("#iframe-child1")
 * Which results in getIframeBody(getIframeBody(getIframeBody(cy.get("#iframe-child3")).get("#iframe-child2")).get("#iframe-child1"))
 * Where we are first getting the body of 3rd iframe from which we can access 2nd iframe as it is a child of 3rd and so on.
 * @param {Array<string>} selectors List of iframe cy selectors to build the chain of getIframeBody
 * @returns {string} Generated iframe selector using cypress custom getIframeBody method
 */
function buildGetIframeBodyQuery(selectors) {
    var iframe_selector = "";
    try {
        if (selectors.length == 0)
            return "";
        iframe_selector = `getIframeBody(${selectors.slice(-1)})`;
        for (var i = selectors.length - 2; i >= 0; i--) {
            if (selectors[i]) {
                var code = (selectors[i] || "null").trim();
                var c = code.trim().replace("cy.", "")
                if (c.startsWith("get(")) {
                    code = code.replace("cy.get(", "cy.find(");
                }
                iframe_selector = `getIframeBody(${iframe_selector}.${code.trim().replace("cy.", "")})`
            }
        }
    } catch (err) {
        if (debug)
            console.log("[ERROR] [Content Script] [buildGetIframeBodyQuery] Error occured while building query :: ", err);
    }
    return iframe_selector;
}

/**
 * 1) Adds a line of code to the session storage.
 * 2) Sends the updated code to all the iframes(tabs)
 * 3) Automatically creates getIframeBody code if the element is in iframe.
 *
 * @param {string} code - A line of code or action. Example: cy.findByRole('button').click() 
 * @param {string} selector - The cypress element selector. Example: cy.findByRole('button')
 * @param {HTMLElement} element - The element from which the given selector is created.
 * @param {boolean} onChanged - Whether the code is from onChangeEvent
 * @param {boolean} onClicked - Whether the code is from onClickEvent
 */
async function addToCode(code, selector, element = undefined, onChanged = false, onClicked = false) {
    // Return if the code is empty
    if (!(code && code.trim()))
        return;
    try {
        // Add default code to the data if it is the first time
        if (!data.code[data.activeTab] || data.code[data.activeTab].length <= codeEditorInitialContent.length) {
            data.code[data.activeTab] = [...codeEditorInitialContent, `describe('Automation', () => {`, `  it('Test', () => {`, `    cy.visit("${window.location.href}")`, `  })`, `})`];
        }
        // Get the element role 
        var role = element ? dom_accessibility_api.getRole(element) : null;
        // Get the generated code from data object.
        var code_lines = data.code[data.activeTab];
        // Get the last line
        var last_line = "";
        if (code_lines && code_lines.length >= (codeEditorInitialContent.length + 1)) {
            last_line = code_lines[code_lines.length - 3].trim();
            var index = 4;
            // Get the code not the empty lines and comments
            while ((last_line.startsWith("//") || last_line == "") && index < code_lines.length) {
                last_line = code_lines[code_lines.length - index].trim();
                index += 1;
            }
        }
        var code_updated = false;
        // Get the iframe HTML element if the given element belongs to an iframe
        var iframe = getIframe(element);
        if (iframe) {
            var selectors = [];
            try {
                // Add getIframeBody function code if it is not present
                if (code_lines[codeEditorInitialContent.length + 1] != cypressCodeForIframe[0]) {
                    code_lines = [...code_lines.slice(0, codeEditorInitialContent.length + 1), ...cypressCodeForIframe, ...code_lines.splice(codeEditorInitialContent.length + 1, code_lines.length)]
                }
                // Get the list of parent iframes for chaining getIframeBody function
                selectors.push(getElementCySelector(iframe).selector);
                while (isIframeParentAccessible(iframe) && iframe && iframe.tagName == "IFRAME") {
                    iframe = getIframe(iframe);
                    if (iframe) {
                        // Get the parent iframe from the parent window using the data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5 attribute
                        var selector = await getParentIframeSelector(iframe, { "iframeId": iframe.getAttribute("data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5") });
                        if (selector && selector.selector) {
                            selectors.push(selector.selector);
                        }
                    }
                }
            } catch (err) {
                if (debug)
                    console.log("[ERROR] [Content Script] [addCode] Not able to add iframe code :: ", err);
                if (!iframe_selector)
                    iframe_selector = "";
            }
            // Build the query for the parent iframes
            var iframe_selector = buildGetIframeBodyQuery(selectors);
            // Process the code query by replacing get with find
            if (iframe_selector && iframe_selector.trim()) {
                var c = code.trim().replace("cy.", "")
                if (c.startsWith("get(")) {
                    code = code.replace("cy.get(", "cy.find(");
                }
            }
            code = iframe_selector.trim() ? iframe_selector + code.trim().replace("cy", "") : code;
        }
        // If the onChange event occured when the user pressed TAB key
        // This is to avoid adding the same code twice
        // onChange event is called when the user presses TAB key
        // Example : 
        // cy.get("input").type("testing")
        // cy.get("input").trigger("keyDown",{keyCode: 9, which: 9})
        // 
        // Here the 1 first line is added before adding the trigger.
        // JS automatically triggers onchange event when the element goes out of focus. 
        // Here when we press tab the onChange event is fired as we are moving out of focus from the current element.
        // this avoids adding the first line after the trigger if the onChangeEvent is fired
        if ((isKeyPressed == 1 && onChanged)) {
            // Get the last second line of code to check if it is the same as the given code.
            var last_second_line = code_lines[code_lines.length - 4].trim()
            var index = 5;
            // Get the cypress code, not the comments or empty lines by going up the code
            while ((last_second_line.startsWith("//") || last_second_line.trim() == "") && index < code_lines.length) {
                last_second_line = code_lines[code_lines.length - index].trim();
                index += 1;
            }
            // Add the given code if is not the same as the one before trigger command
            if (code != last_second_line && last_line.endsWith(`.trigger("keydown",{keyCode: ${TAB_CODE}, which: ${TAB_CODE}})`))
                code_lines.splice(-2, 0, "    " + code);
            code_updated = true;
        }
        // Add code if it can be clicked multiple lines or if it is different from the last line
        else if (last_line !== code || ((role == "checkbox" || role == "button" || role == "link" || role == "menuitemcheckbox" || role == "toolbar" || role == "menu" || role == "spinbutton" || role == "switch" || role == "tab" || role == "menu") && isKeyPressed <= 1)) {
            // Add only if the code is not from form submission which got triggered by pressing ENTER key.
            // these are the order of events when a user presses ENTER key in a form. ENTER->onChange->Submit(If submit button is present. It gets clicked automatically)
            // this prevents adding the submit button code if the user pressed ENTER key
            if (!(onClicked && isKeyPressed == 2 && isEnterKeyPressed && element.type == "submit" && isInSameForm(previous_element, element))) {
                if (!isIframeParentAccessible() && isIframe()) {
                    code_lines.splice(-2, 0, "    //Accessed from a protected iframe with source " + window.location.href);
                }
                code_lines.splice(-2, 0, "    " + code);
                code_updated = true;
            }
        }
        // If TAB or ENTER key is pressed. isKeyPressed is 0. this handles the events that occurs after a TAB or ENTER key.
        if (isKeyPressed >= 0)
            isKeyPressed += 1;
        if (isKeyPressed > 2) {
            isKeyPressed = -1;
            isEnterKeyPressed = false;
            key_pressed_selector_element = {};
        }
        // If code updated then send message to background 
        if (code_updated) {
            data.code[data.activeTab] = code_lines;
            previous_element = element;
            // Send data to background for saving it
            sendMessageToBackground(data);
            // Send message to background to update all the tabs(iframes) with the updated code
            sendMessageToBackground(data, "content_script", "update_tab")
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [addToCode] Error :: ", err)
    }
}

/**
 * Handles context menu opened by right clicking in a web page
 * @param {Event} event 
 */
function handleContextMenu(event) {
    // If the dialog for assertion paramas is not active then toggle assertion context menu.
    if (!(contextMenuOptionsDialogToggle)) {
        // Check if the recording is enabled and the ALT Key is pressed
        if (data.state == "start" && data.activeTab == current_tab && keysPressed.length == 1 && keysPressed[0] == 18) {
            // prevent the default context menu of the browser
            event.preventDefault();
            // Toggle assertion menu to open it.
            toggleContextMenu(true, event);
        } else {
            // Toggle assertion menu to close it.
            toggleContextMenu(false);
        }
    }
}

/**
 * Handles Click Events when the extension is enabled.
 * @param {Event} event 
 */
async function handleClick(event) {
    try {
        // If the toggleInspect is enabled
        if (data.toggleInspect[current_tab] && document.getElementById("__ccg_ext_cy_selector_asdwaA1243AWdaRWEq12__") && !clicked) {
            event.preventDefault();
            event.stopPropagation();
            clicked = true;
            var e = document.getElementById("__ccg_ext_inspect_value_asdwaA1243AWdaRWEq12__");
            if (e) {
                e.style.pointerEvents = "auto";
            }
        }
        var id = (event.target.id || "").trim();
        var className = (event.target.className || "").trim();

        var parentId = "", parentclassName = "";
        try {
            parentId = (event.target.parentElement.id || "").trim();
            parentclassName = (event.target.parentElement.className || "").trim();
        } catch (err) { }
        if (!((id && id.indexOf("__ccg_ext") != -1 && id.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (className && className.indexOf("__ccg_ext") != -1 && className.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentId && parentId.indexOf("__ccg_ext") != -1 && parentId.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentclassName && parentclassName.indexOf("__ccg_ext") != -1 && parentclassName.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1))) {
            toggleContextMenu(false);

            if (data.state == "start" && data.activeTab == current_tab) {
                async function verifyClickedAndAddCode(selector) {
                    var element = selector.element;
                    var tagName = element.tagName.toLowerCase();
                    var role = dom_accessibility_api.getRole(element);
                    if (tagName == "html" || tagName == "body" || tagName == "label" || role == "slider" || element.disabled == true) {
                        return true;
                    }
                    if (selector && selector.selector && (settings.useAllElements || checkIfItsTypable(element) || clickableElements.indexOf(tagName) != -1 || clickableElementRoles.indexOf(role) != -1 || element.getAttribute("onclick") || element.getAttribute("aria-pressed") || (element.getAttribute("aria-haspopup") && element.getAttribute("aria-haspopup") != "false") || element.getAttribute("tabindex"))) {
                        var cyCode = selector.selector.selector;
                        cyCode += ".click()";
                        await addToCode(cyCode, selector.selector.selector, selector.selector.element, false, true);
                        return true;
                    }
                    return false;
                }
                var selector = { element: event.target, selector: getElementCySelector(event.target) };
                if (current_selector.element == selector.element) {
                    selector = current_selector;
                }
                else {
                    current_selector = { element: null, selector: null }
                }
                var max_parents = maxNumberOfParents;
                while (!await verifyClickedAndAddCode(selector) && max_parents > 0) {
                    var parent = selector.element.parentNode;
                    if (parent.nodeType != Node.DOCUMENT_NODE) {
                        selector = { element: parent, selector: getElementCySelector(parent) };
                    } else {
                        break;
                    }
                    max_parents -= 1;
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleClick] Error :: ", err)
    }
}


async function handleOnChangeEvent(event) {
    try {
        var id = (event.target.id || "").trim();
        var className = (event.target.className || "").trim();
        var parentId = "", parentclassName = "";
        try {
            parentId = (event.target.parentElement.id || "").trim();
            parentclassName = (event.target.parentElement.className || "").trim();
        } catch (err) { }
        if (!((id && id.indexOf("__ccg_ext") != -1 && id.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (className && className.indexOf("__ccg_ext") != -1 && className.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentId && parentId.indexOf("__ccg_ext") != -1 && parentId.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentclassName && parentclassName.indexOf("__ccg_ext") != -1 && parentclassName.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1))) {

            if (data.state == "start" && data.activeTab == current_tab) {
                var element = null, selector = null;
                if (current_selector.selector) {
                    element = current_selector.element;
                    selector = current_selector.selector;
                } else {
                    element = event.target;
                    selector = getElementCySelector(element);
                }
                if (!selector)
                    return;
                var role = dom_accessibility_api.getRole(element);
                var ignoreRolesForOnChange = clickableElementRoles.filter((v) => { return changeableRoles.indexOf(v) == -1 })
                var tagName = element.tagName.toLowerCase();

                var isTypable = checkIfItsTypable(element);
                if (settings.useAllElements || changeableRoles.indexOf(role) != -1 || changeableInputTypes.indexOf((element.type || "").trim()) != -1 || isTypable) {
                    if (ignoreRolesForOnChange.indexOf(role) == -1) {
                        var value = element.value;
                        if (value) {
                            // Preprocess string value
                            if (typeof (value) == 'string') {
                                if (value.startsWith(current_selector.text))
                                    value = value.replace(current_selector.text, "");
                                else
                                    isTypable = false;

                                if (isKeyPressed == 1) {
                                    var code_lines = data.code[data.activeTab];
                                    var last_line = "";
                                    if (code_lines && code_lines.length >= 3)
                                        last_line = code_lines[code_lines.length - 3].trim();
                                    if (value.startsWith("\n") && last_line.endsWith(`.type('{enter}')`)) {
                                        value = value.replace("\n", "")
                                    }
                                }
                                if (value) {
                                    if (value.indexOf("\n") != -1 || value.indexOf("\"") != -1 || value.indexOf("'") != -1) {
                                        value = `\`${value}\``;
                                    } else {
                                        value = `"${value}"`;
                                    }
                                }
                                value = value.replaceAll("\n", "\\n");
                            }
                            if (value) {
                                var cyCode = selector.selector;
                                if (role == "listbox") {
                                    cyCode += `.select(${value})`;
                                }
                                else if (isTypable) {
                                    cyCode += `.type(${value})`;
                                }
                                else if (element.type == "file") {

                                    if (element.multiple) {
                                        var listOfFiles = [];
                                        for (var i = 0; i < element.files.length; i++) {
                                            listOfFiles.push(`"${element.files[i].name}"`)
                                        }
                                        cyCode += `.selectFile([${listOfFiles}])`;
                                    } else
                                        cyCode += `.selectFile("${element.files[0].name}")`;
                                }
                                else {
                                    cyCode += `.invoke('attr','value',${value})`;
                                }
                                await addToCode(cyCode, selector.selector, selector.element, true);
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleOnChange] Error :: ", err)
    }
}

/**
 * Get's the current selected element by listening to the focus event
 * This is used to get the selector before the value of a element is updated.
 * @param {Event} event 
 */
function handleFocus(event) {
    try {
        if (data.state == "start" && data.activeTab == current_tab) {
            var element = event.target;
            current_selector.element = element;
            current_selector.selector = getElementCySelector(element);
            current_selector.text = "";
            // Get the value of input field before it is updated
            if (element) {
                var text = element.value;
                if (text && typeof text === "string") {
                    current_selector.text = text;
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleFocus] Error :: ", err)
    }
}

function addContextMenuEvents() {
    var contextMenuSearch = document.getElementById("__ccg_ext_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var contextMenuIcon = document.getElementById("__ccg_ext_search_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var check = document.getElementsByClassName("__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")[0];
    var results = document.getElementById("__ccg_ext_contextMenu_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    check.addEventListener("change", (e) => {
        setTimeout(() => {
            handleContextMenuSearch(e);
            results.scrollTop = 0;
        }, 300);
    });
    results.addEventListener("click", handlecontextMenuClick);
    contextMenuIcon.addEventListener("click", handleContextMenuSearchClear);
    contextMenuSearch.addEventListener("keyup", handleContextMenuSearch);
}

function createContextMenu() {
    var contextMenu = document.createElement("div");
    contextMenu.id = "__ccg_ext_contextMenu_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
    contextMenu.innerHTML = `
    <div id="__ccg_ext_controls_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
        <div id="__ccg_ext_search_field_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
            <input type="text" id="__ccg_ext_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" placeholder="Search"
                spellcheck="false">
            <div id="__ccg_ext_search_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" data-ccg-ext-clear-input="false">&#9906;</div>
        </div>
        <div id="__ccg_ext_not_assertion_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
            <svg viewBox="0 0 0 0" style="position: absolute; z-index: -1; opacity: 0;">
                <defs>
                    <linearGradient id="__ccg_ext_boxGradient_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25" y2="25">
                        <stop offset="0%" stop-color="#f6f6f6" />
                        <stop offset="100%" stop-color="#b3b3b3" />
                    </linearGradient>
                    <path id="__ccg_ext_checkbox_box_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        stroke="url(#__ccg_ext_boxGradient_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__)"
                        d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4">
                    </path>
                    <path id="__ccg_ext_checkbox_check_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        stroke="url(#__ccg_ext_boxGradient_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__)" d="M10 13l2 2 5-5">
                    </path>
                </defs>
            </svg>
            <label class="__ccg_ext_checkbox_label_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                <input class="__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" type="checkbox" />
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 200 25" class="__ccg_ext_checkbox_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <use xlink:href="#__ccg_ext_checkbox_box_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        class="__ccg_ext_checkbox_box_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></use>
                    <use xlink:href="#__ccg_ext_checkbox_check_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        class="__ccg_ext_checkbox_check_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></use>
                </svg>
                <div class="__ccg_ext_checkbox_text_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">Add <i>not</i> to assertions</div>
            </label>
        </div>
    </div>
    <ul class="__ccg_ext_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" id="__ccg_ext_contextMenu_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></ul>
        `
    return contextMenu;
}

async function toggleContextMenu(state = true, event = null) {
    if (state && event) {

        var _isPartOfDialog = isPartOfDialog(event.target);
        var contextMenu = document.getElementById("__ccg_ext_contextMenu_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (_isPartOfDialog && (!contextMenu || contextMenu.getAttribute("data-ccg-ext-layer") != "dialog")) {
            if (contextMenu)
                contextMenu.remove();

            contextMenu = createContextMenu();

            _isPartOfDialog.appendChild(contextMenu);
            contextMenu.style.position = "fixed";
            contextMenu.setAttribute("data-ccg-ext-layer", "dialog");
            await delay(30);
            addContextMenuEvents();
        }
        else if (!contextMenu || !_isPartOfDialog) {
            var add = false;
            if (!contextMenu) {
                add = true;
            }
            if (contextMenu && contextMenu.getAttribute("data-ccg-ext-layer") == "dialog") {
                contextMenu.remove();
                add = true;
            }
            if (add) {
                contextMenu = createContextMenu();
                document.body.appendChild(contextMenu);
                contextMenu.setAttribute("data-ccg-ext-layer", "body");
                contextMenu.style.position = "absolute";
                await delay(30);
                addContextMenuEvents();
            }
        }


        var check = document.getElementsByClassName("__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")[0];
        check.checked = false;
        contextMenuActivatedElement = event.target;
        handleContextMenuSearch();
        await delay(10);
        contextMenu.style.top = "";
        contextMenu.style.left = "";
        var results = document.getElementById("__ccg_ext_contextMenu_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        results.scrollTop = 0;
        var transformOriginX = "left", transformOriginY = "top";
        var mouseY = event.clientY, mouseX = event.clientX;
        var top = (_isPartOfDialog ? 0 : document.documentElement.scrollTop) + mouseY;
        var left = (_isPartOfDialog ? 0 : document.documentElement.scrollLeft) + mouseX;
        var contextMenuWidth = contextMenu.offsetWidth + 10, contextMenuHeight = contextMenu.offsetHeight + 10;
        if ((mouseX + contextMenuWidth + 12) >= window.innerWidth) {
            left = left - contextMenuWidth;
            transformOriginX = "right";
        }

        if (mouseY + contextMenuHeight >= window.innerHeight) {
            if ((mouseY - contextMenuHeight) >= 0) {
                top = top - contextMenuHeight;
                transformOriginY = "bottom";
            } else {
                var bottom = contextMenuHeight - (window.innerHeight - mouseY);
                top = top - bottom;
            }
        }
        if (window.innerWidth < contextMenuWidth || document.body.clientHeight < contextMenuHeight) {
            document.body.style.overflow = "auto"
        }
        contextMenu.style.top = `${top}px`;
        contextMenu.style.left = `${left}px`;
        contextMenu.style.opacity = 1;
        contextMenu.style.transformOrigin = `${transformOriginY} ${transformOriginX}`;
        contextMenu.className = "__ccg_ext_contextMenu_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf_animate-show__";
        contextMenuToggle = true;
    } else {
        var contextMenu = document.getElementById("__ccg_ext_contextMenu_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (contextMenu) {
            document.getElementById("__ccg_ext_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__").value = "";
            contextMenu.style.opacity = 0;
            contextMenu.className = "";
            contextMenu.style.top = "-2000px";
            contextMenu.style.left = "";
            contextMenu.style.right = "";
            contextMenu.style.bottom = "";
            contextMenuToggle = false;
        }
    }

}

/**
 * Handles KeyUp Event. 
 * Is used for managing number of keys released.
 * @param {Event} event 
 */
function handleKeyUp(event) {
    try {
        var vKey = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        var index = keysPressed.indexOf(vKey);
        if (index > -1) {
            keysPressed.splice(index, 1);
        }
        // If Escape key is pressed
        if (vKey == 27) {
            _clear();
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleKeyUp] Error :: ", err)
    }
}
//When some key is released
async function handleKeyDown(event) {
    try {
        //Identifies the key
        var vKey = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

        if (keysPressed.indexOf(vKey) <= -1) {
            keysPressed.push(vKey);
        }
        if (vKey == 27) {
            if (data.toggleInspect[current_tab] && cy_selector_inspecting_element) {
                event.preventDefault();
            }
            else if (contextMenuOptionsDialogToggle) {
                contextMenuOptionsDialogToggle = false;
                event.preventDefault();
            }
            else if (contextMenuToggle) {
                event.preventDefault();
                contextMenuToggle = false;
            }
        }
        var id = (event.target.id || "").trim();
        var className = (event.target.className || "").trim();
        var parentId = "", parentclassName = "";
        try {
            parentId = (event.target.parentElement.id || "").trim();
            parentclassName = (event.target.parentElement.className || "").trim();
        } catch (err) { }
        if (!((id && id.indexOf("__ccg_ext") != -1 && id.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (className && className.indexOf("__ccg_ext") != -1 && className.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentId && parentId.indexOf("__ccg_ext") != -1 && parentId.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1) || (parentclassName && parentclassName.indexOf("__ccg_ext") != -1 && parentclassName.indexOf("lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf") != -1))) {
            if (!contextMenuToggle) {
                toggleContextMenu(false);
            }
            if ((keysPressed.length == 1 && (vKey == ENTER_CODE || vKey == TAB_CODE)) && data.state == "start" && data.activeTab == current_tab) {
                var selector = null;
                var element = event.target;
                selector = getElementCySelector(element);
                if (selector) {
                    var code = "";
                    key_pressed_selector_element = { selector: selector.selector, element: selector.element };
                    isKeyPressed = -1;
                    handleOnChangeEvent(event);
                    isKeyPressed = 0;
                    if (vKey == 13) {
                        var role = dom_accessibility_api.getRole(element);
                        if (role == "textbox" || role == "searchbox" || checkIfItsTypable(element)) {
                            isEnterKeyPressed = true;
                            await addToCode(selector.selector + `.type('{enter}')`, selector.selector, selector.element);
                        }
                    }
                    else if (vKey == 9) {
                        code = selector.selector + `.trigger("keydown",{keyCode: ${vKey}, which: ${vKey}})`;
                        await addToCode(code, selector.selector, selector.element);
                    }
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleKeyDown] Error :: ", err)
    }
}

function handleContextMenuSearchClear(event) {
    var contextMenuSearch = document.getElementById("__ccg_ext_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var contextMenuIcon = document.getElementById("__ccg_ext_search_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    if (contextMenuIcon.getAttribute("data-ccg-ext-clear-input") == "true")
        contextMenuSearch.value = "";
    handleContextMenuSearch(event);
}

function removeDuplicatesInOptionsMenu(dialog, option) {
    var id = "__ccg_ext_dialog_form_control_input_" + option.name + "_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
    var field = document.getElementById(id);
    if (field) {
        if (option.type == "text")
            field.parentElement.remove();
        else
            field.parentElement.parentElement.remove();
    }
    var roots = dialog.querySelectorAll(".__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    addMultiSelectDropDown.forEach((v2, ind2) => {
        if (v2.options.name == option.name) {
            addMultiSelectDropDown.splice(ind2, 1);
            roots[v2.index].remove();
        }
    });
}

function createOptions(options, createNew = true) {
    function appendElementToDialogWithHTML(parent, html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        for (var i = 0; i < temp.children.length; i++) {
            parent.appendChild(temp.children[i]);
        }
    }
    var dialog = document.getElementById("__ccg_ext_dialog_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    if (createNew || !dialog) {
        if (dialog)
            dialog.remove();
        dialog = document.createElement("dialog");
        dialog.id = "__ccg_ext_dialog_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
        addMultiSelectDropDown = [];
        var dialog_content = document.createElement("div");
        dialog_content.id = "__ccg_ext_dialog_content_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
        dialog_content.style.padding = "8px";
        dialog.appendChild(dialog_content);
    }
    var dialog_content = dialog.querySelector("#__ccg_ext_dialog_content_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    for (var i = 0; i < options.length; i++) {

        var op = { ...options[i] };
        removeDuplicatesInOptionsMenu(dialog, op);
        var defaultValue = 'default' in op ? (typeof op["default"] == "function" ? op["default"](contextMenuActivatedElement) : op["default"]) : ""
        if (op["type"] == "text" || op["type"] == "regex") {
            var html = `
                <div class="__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <label
                        for="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">${op["name"].toUpperCase()} ${op["type"] == "regex" ? "<span>(Regex)</span>" : ""}` + (op["optional"] ? `<span>(Optional)</span>` : "") + `</label>
                    `
            if (op["optionalRegex"]) {
                html += `<div class="__ccg_ext_icon_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <input  type="text" id="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" value="${defaultValue}">
                    <span data-ccg-ext-regex-activated="false" onclick="let toggle = this.getAttribute('data-ccg-ext-regex-activated');this.setAttribute('data-ccg-ext-regex-activated',toggle=='true'?'false':'true')">.*</span>
                    </div>`;
            } else
                html += `
                <input  type="text" id="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" value="${defaultValue}">
                `
            html += `</div>`;

            appendElementToDialogWithHTML(dialog_content, html);
        }
        else if (op["type"] == "number") {
            var html = `
                <div class="__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <label for="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">${op["name"].toUpperCase()} ` + (op["optional"] ? `<span>(Optional)</span>` : "") + `</label>
                    <div class="__ccg_ext_dialog_form_control_input_number_wrapper_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                        <button data-ccg-ext-value="-1"
                            class="__ccg_ext_dialog_form_control_input_number_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_dialog_form_control_input_number_button_decrease_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">-</button>
                        <input type="number" data-ccg-ext-number-input="true" id="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" value="${defaultValue == "" ? 1 : defaultValue}" />
                        <button data-ccg-ext-value="1"
                            class="__ccg_ext_dialog_form_control_input_number_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_dialog_form_control_input_number_button_increase_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">+</button>
                    </div>
                </div>
                `;
            appendElementToDialogWithHTML(dialog_content, html);
        }
        else if (op["type"].indexOf("select") != -1) {

            var html = `
                <div class="__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <label>${op["name"].toUpperCase()} ` + (op["optional"] ? `<span>(Optional)</span>` : "") + `</label>
                </div>
                `;
            var l = document.getElementsByClassName("__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__").length;
            addMultiSelectDropDown.push({ index: i + l, options: op });
            appendElementToDialogWithHTML(dialog_content, html);
        }
        else {
            var html = `
            <div class="__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <label for="__ccg_ext_dialog_form_control_input_${op["name"]}_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">${op["name"].toUpperCase()} ` + (op["optional"] ? `<span></span>` : "") + `</label>
                    <div class="__ccg_ext_dialog_form_control_input_number_wrapper_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <p>This feature is not supported</p> 
                    </div>
            </div>
            `
            appendElementToDialogWithHTML(dialog_content, html);
        }

    }
    if (createNew) {
        var html =
            `
        <menu style="padding: 0px;margin:0px" class="__ccg_ext_dialog_menu_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
            <button
                class="__ccg_ext_dialog_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_dialog_button_warn_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                value="false">Cancel</button>
            <button class="__ccg_ext_dialog_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" value="true">Confirm</button>
        </menu>
    `
        appendElementToDialogWithHTML(dialog, html);
    }
    return dialog;
}

function handleContextMenuOptionsConfirmation(e) {
    function getElementValue(element) {
        var value = element.value;
        if (element.getAttribute("data-ccg-ext-number-input") == "true") {
            value = parseInt(value);
        }
        else if (typeof value == "string") {
            if (value) {
                if (value.indexOf("\n") != -1 || value.indexOf("\"") != -1 || value.indexOf("'") != -1) {
                    value = `\`${value}\``;
                } else {
                    value = `"${value}"`;
                }
            }
            value = value.replaceAll("\n", "\\n");
        }
        return value;
    }

    function getValueFromOption(option, parentOption) {
        var id = "__ccg_ext_dialog_form_control_input_" + option.name + "_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
        var ele = document.getElementById(id);
        var value = null;
        if (ele) {
            if (option["type"] == "regex" || (option["type"] == "text" && option["optionalRegex"] && ele.nextElementSibling && ele.nextElementSibling.getAttribute("data-ccg-ext-regex-activated") == "true")) {
                try {
                    value = ele.value;
                    var regParts = value.match(/^\/(.*?)\/([gim]*)$/);
                    if (regParts) {
                        // the parsed pattern had delimiters and modifiers. handle them. 
                        return new RegExp(regParts[1], regParts[2]);
                    } else {
                        // we got pattern string without delimiters
                        return new RegExp(value);
                    }
                } catch (err) {
                    return null;
                }
            } else {
                value = getElementValue(ele);
            }
            if (value && value != "" && value != '""') {
                return value;
            }
        } else if (option["type"].indexOf("select") != -1) {
            var dropDown = addMultiSelectDropDown.filter(v => v.options.name == option["name"]);
            if (dropDown.length > 0) {
                dropDown = dropDown[0].ccgDropDown;
                var selected = dropDown.selected;
                if (selected.length > 0) {
                    var values = "";
                    selected.forEach((v, ind) => { values += `"${v}"`; values += ind < (selected.length - 1) ? "," : "" });
                    if (!(parentOption && "customCodeCreator" in parentOption)) {
                        if (selected.length > 1)
                            value = "[" + values + "]";
                        else
                            value = values;
                    }
                    if (dropDown.newOption) {
                        var newOptions = dropDown.newOption;
                        if (!Array.isArray(newOptions))
                            newOptions = [newOptions];
                        for (var i = 0; i < newOptions.length; i++) {
                            var v = getValueFromOption(newOptions[i]);
                            if (!(parentOption && "customCodeCreator" in parentOption)) {
                                if (v != "" && v != '""')
                                    value += "," + v;
                            } else {
                                if (Array.isArray(v))
                                    v.forEach((i) => selected.push(i));
                                else
                                    selected.push(v);
                            }
                        }
                    }
                    if (parentOption && "customCodeCreator" in parentOption)
                        return selected;
                }
            }
        }
        return value;
    }
    var selector = getElementCySelector(contextMenuActivatedElement);
    if (e.target) {
        var dialog = isPartOfDialog(e.target);
        if (dialog) {
            contextMenuOptionsDialogToggle = false;
            if (e.target.getAttribute("value") == "true" && selector) {
                var category = dialog.getAttribute("data-ccg-ext-dialog-category");
                var label = dialog.getAttribute("data-ccg-ext-dialog-label");
                var check = document.getElementsByClassName("__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")[0];
                var cMOptions = check.checked ? notContextMenuOptions : contextMenuOptions;
                var currentOption = {};
                for (var i = 0; i < cMOptions[category].values.length; i++) {
                    var o = cMOptions[category].values[i];
                    if (o.label == label) {
                        currentOption = o;
                        break;
                    }
                }
                if (currentOption) {
                    var action = currentOption.command.trim() != "" ? currentOption.command.trim() + `('${currentOption.label}',` : currentOption.label + "(";
                    var addcode = false;
                    var callCustomCodeCreator = [];
                    for (var i = 0; i < currentOption.params.length; i++) {
                        var option = currentOption.params[i];
                        var value = getValueFromOption(option, currentOption);
                        if (i > 0 && addcode && value)
                            action += ",";
                        if (value) {
                            if (!("customCodeCreator" in currentOption)) {
                                action += value;
                                addcode = true;
                            }
                            else {
                                callCustomCodeCreator = [...callCustomCodeCreator, ...value]
                            }
                        }
                    }
                    action += ")";
                    if (addcode) {
                        addToCode(selector.selector + "." + action, selector.selector, selector.element);
                        notifier.addNotification("Success: Added Code!");
                    }
                    else if (callCustomCodeCreator.length > 0) {
                        var code = currentOption["customCodeCreator"](contextMenuActivatedElement, callCustomCodeCreator);
                        if (code) {
                            addToCode(code.code, code.selector.selector, code.selector.element);
                            notifier.addNotification("Success: Added Code!");
                        } else {
                            notifier.addNotification("Error: Not able to add the assertions. Please try again.", type = "error", 5000);
                        }
                    }
                }
            }
            dialog.close(false);
            setTimeout(() => {
                dialog.remove();
            }, 2000);
        }
    }
}
function handleContextMenuOptionsNumberInput(e) {
    var ele = e.target;
    var p = ele.parentElement;
    var i = p.getElementsByTagName("input");
    if (ele.getAttribute("data-ccg-ext-value") && i.length > 0) {
        var v = parseInt(ele.getAttribute("data-ccg-ext-value"));
        i[0].value = parseInt(i[0].value) + v;
        if (parseInt(i[0].value) < 0) {
            i[0].value = "0";
        }
    }
}

function addEventListenersToDialogFormFields(dialog) {
    var buttons = dialog.getElementsByClassName("__ccg_ext_dialog_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    for (var b = 0; b < buttons.length; b++) {
        buttons[b].removeEventListener("click", handleContextMenuOptionsConfirmation);
        buttons[b].addEventListener("click", handleContextMenuOptionsConfirmation);
    }
    var buttons = dialog.getElementsByClassName("__ccg_ext_dialog_form_control_input_number_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    for (var b = 0; b < buttons.length; b++) {
        buttons[b].removeEventListener("click", handleContextMenuOptionsNumberInput);
        buttons[b].addEventListener("click", handleContextMenuOptionsNumberInput);
    }
    var roots = dialog.querySelectorAll(".__ccg_ext_dialog_form_control_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    addMultiSelectDropDown.forEach((v, ind) => {
        try {
            var op = v.options;
            var values = [];
            if (!("ccgDropDown" in v)) {
                if ("values" in op)
                    values = op["values"](contextMenuActivatedElement);
                else
                    values = generateValuesForDropDownElement(contextMenuActivatedElement);
                c = new CCGExtMultiSelectDropDown(roots[v.index], values, (op["canSupportMultiple"] && contextMenuActivatedElement.getAttribute("multiple")) ? values.length : 1, 500, true, op["default"]);
                if (op["addNewField"]) {
                    c.addNewField = op["addNewField"];
                    c.addListener((context, value) => {
                        if (Array.isArray(value))
                            value = value[0];
                        var dialog = document.getElementById("__ccg_ext_dialog_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
                        if (dialog) {
                            if (context.selected.length == 0) {
                                if (context.newOption) {
                                    for (var i = 0; i < context.newOption.length; i++) {
                                        var op = context.newOption[i];
                                        removeDuplicatesInOptionsMenu(dialog, op);
                                    }
                                }
                            } else {
                                var newOption = context.addNewField(value, contextMenuActivatedElement);
                                context.newOption = newOption;
                                if (dialog) {
                                    createOptions(newOption, false);
                                    addEventListenersToDialogFormFields(dialog);
                                }
                            }
                        }
                    })
                }
                v.ccgDropDown = c;
                addMultiSelectDropDown[ind] = v;
            }
        } catch (err) {
            if (debug)
                console.log("[ERROR] [contentScript.js] [addEventListenersToDialogFormFields] Error occurred while adding drop down :: ", err);
        }

    })
}
function handlecontextMenuClick(event) {
    event.preventDefault();
    var element = event.target;
    if (element.className != "__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") {
        element = element.parentElement;
    }
    if (element && element.className == "__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") {
        var text = element.innerText.trim();
        var category = element.getAttribute("data-ccg-ext-contextMenuType");
        var selector = getElementCySelector(contextMenuActivatedElement);
        if (selector) {
            var check = document.getElementsByClassName("__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")[0];
            var cMOptions = check.checked ? notContextMenuOptions : contextMenuOptions;
            var option = {};
            for (var i = 0; i < cMOptions[category].values.length; i++) {
                var o = cMOptions[category].values[i];
                if (o.label == text) {
                    option = o;
                    break;
                }
            }
            if ("params" in option && option.params.length > 0) {
                var dialog = createOptions(option.params);
                dialog.setAttribute("data-ccg-ext-dialog-category", category);
                dialog.setAttribute("data-ccg-ext-dialog-label", text);
                document.body.appendChild(dialog);
                addEventListenersToDialogFormFields(dialog);
                dialog.showModal();
                contextMenuOptionsDialogToggle = true;
            } else {
                if ("customCodeCreator" in option) {
                    var code = option["customCodeCreator"](contextMenuActivatedElement, []);
                    if (code) {
                        addToCode(code.code, code.selector.selector, code.selector.element);
                        notifier.addNotification("Success: Added Code!");
                    } else {
                        notifier.addNotification("Error: Not able to add the assertions. Please try again.", type = "error", 5000);
                    }
                }
                else if (option.command == "") {
                    addToCode(selector.selector + "." + text + "()", selector.selector, selector.element);
                    notifier.addNotification("Success: Added Code!");
                } else {
                    addToCode(selector.selector + "." + option.command + "('" + text + "')", selector.selector, selector.element);
                    notifier.addNotification("Success: Added Code!");
                }
            }
        }
    }
}

function handleContextMenuSearch(event) {
    var contextMenuSearch = document.getElementById("__ccg_ext_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var contextMenuIcon = document.getElementById("__ccg_ext_search_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var contextMenuSearchResults = document.getElementById("__ccg_ext_contextMenu_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
    var value = (contextMenuSearch.value || "").toLowerCase().trim();
    var res = [];
    var resultHTML = "";
    if (value == "") {
        contextMenuIcon.innerHTML = "&#9906;";
        contextMenuIcon.style.transform = "rotate(-45deg)"
        contextMenuIcon.style.fontSize = "26px";
        contextMenuIcon.setAttribute("data-ccg-ext-clear-input", "false");
    } else {
        contextMenuIcon.innerHTML = "&#10060;";
        contextMenuIcon.style.transform = "rotate(0deg)";
        contextMenuIcon.style.fontSize = "14px";
        contextMenuIcon.setAttribute("data-ccg-ext-clear-input", "true");
    }
    var check = document.getElementsByClassName("__ccg_ext_checkbox_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")[0];
    var cMOptions = check.checked ? notContextMenuOptions : contextMenuOptions;
    for (var c in cMOptions) {
        var cat = cMOptions[c];
        var catAdded = false;
        cat.values.forEach((item) => {
            if (item.label.toLowerCase().indexOf(value) != -1) {
                if (!catAdded)
                    res.push({ name: cat.label, type: "title" })
                if ((Object.keys(item).indexOf("enabler") == -1 || item.enabler(contextMenuActivatedElement)))
                    res.push({ name: item.label, type: "value", category: c })
                else {
                    res.push({ name: item.label, type: "value-disabled", category: c })
                }
                catAdded = true;

            }
        })
    }

    if (res.length == 0) {
        resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>No Results Found</p></li>`
    } else
        for (var i = 0; i < res.length; i++) {
            if (res[i].type == "title") {
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>${res[i].name}</p></li>`
            } else if (res[i].type == "value-disabled") {
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_disabled_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" data-ccg-ext-contextMenuType="${res[i].category}"><p>${res[i].name}</p></li>`
            }
            else
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" data-ccg-ext-contextMenuType="${res[i].category}"><p>${res[i].name}</p></li>`
            if (i < res.length - 1)
                resultHTML += `<li class="__ccg_ext_search_results_row_divider_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></li>`
        }

    contextMenuSearchResults.innerHTML = resultHTML;
}

/**
 * Adds event listeners to iframe
 * @param {HTMLElement} inode 
 * @returns 
 */
function addEventListenersToIframe(inode) {
    try {
        if (!inode || inode.tagName != "IFRAME")
            return;
        var idoc = inode.contentDocument;
        if (idoc) {
            idoc.addEventListener("mouseover", handleMouseOver, true);
            idoc.addEventListener("click", handleClick, true);
            idoc.addEventListener("change", handleOnChangeEvent, true);
            idoc.addEventListener("focus", handleFocus, true);
            idoc.addEventListener("contextmenu", handleContextMenu, true);
            inode.contentWindow.window.addEventListener("keyup", handleKeyUp, true);
            inode.contentWindow.window.addEventListener("keydown", handleKeyDown, true);
            inode.contentWindow.window.ccg_ext_addedContentScript = true;
            var id = makeid(16);
            try {
                while (document.querySelectorAll(`iframe[data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5='${id}']`).length != 0)
                    id = makeid(16);

            } catch (err) { }
            inode.setAttribute("data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5", id);
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [addEventListenersToIframe] Error :: ", err)
    }
}

// Is triggered when new element is added/removed to DOM
var mutationObserver = new MutationObserver(function (e) {
    try {
        if ((data.state == "start" || data.toggleInspect[current_tab]) && data.activeTab == current_tab) {
            for (var i = 0; i < e.length; i++) {
                // Get the added nodes
                var addedNodes = e[i].addedNodes;
                if (addedNodes.length > 0) {
                    for (var j = 0; j < addedNodes.length; j++) {
                        var node = addedNodes[j];
                        if (node.tagName == "IFRAME") {
                            var iframes = document.getElementsByTagName("iframe");
                            for (var i = 0; i < iframes.length; i++) {
                                var inode = iframes[i];
                                if (inode == node) {
                                    var idoc = node.contentDocument;
                                    if (idoc) {
                                        var inode_src = inode.getAttribute("src");
                                        if (inode_src && inode_src.trim()) {
                                            inode.addEventListener("load", function (e) {
                                                addEventListenersToIframe(inode);
                                            });
                                        } else {
                                            addEventListenersToIframe(inode)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [mutationObserver] Error :: ", err)
    }
});

// Add Event listeners to the current window and document
function addEventListeners() {
    try {
        // If the current window is not an iframe which can be accessible from it's parent
        // Then don't add event listeners to those windows/iframes
        if (!window.ccg_ext_addedContentScript) {
            wakeUpTimer = setInterval(function () {
                sendMessageToBackground({}, "ping", "");
            }, waitTimeToPingServiceWorker);
            document.addEventListener("mouseover", handleMouseOver, true);
            document.addEventListener("click", handleClick, true);
            document.addEventListener("change", handleOnChangeEvent, true);
            window.addEventListener("keyup", handleKeyUp, true);
            window.addEventListener("keydown", handleKeyDown, true);
            document.addEventListener("focus", handleFocus, true);
            document.addEventListener("contextmenu", handleContextMenu, true);
        }
        // Add event listeners to the iframes that can be accessible/ are from same origin
        var iframes = document.getElementsByTagName("iframe");
        for (var i = 0; i < iframes.length; i++) {
            var node = iframes[i];
            if (node.tagName == "IFRAME") {
                addEventListenersToIframe(node);
            }
        }
        mutationObserver.observe(document.body, { childList: true });
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [addEventListeners] Error :: ", err)
    }
}

function removeEventListeners() {
    try {
        if (!window.ccg_ext_addedContentScript) {
            clearInterval(wakeUpTimer);
            document.removeEventListener("mouseover", handleMouseOver, true);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("change", handleOnChangeEvent, true);
            window.removeEventListener("keyup", handleKeyUp, true);
            window.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("focus", handleFocus, true);
            document.removeEventListener("contextmenu", handleContextMenu, true);

        }
        var iframes = document.getElementsByTagName("iframe");
        for (var i = 0; i < iframes.length; i++) {
            var node = iframes[i];
            var doc = node.contentDocument;
            if (node.tagName == "IFRAME" && doc) {
                doc.removeEventListener("mouseover", handleMouseOver, true);
                doc.removeEventListener("click", handleClick, true);
                doc.removeEventListener("change", handleOnChangeEvent, true);
                doc.removeEventListener("focus", handleFocus, true);
                doc.removeEventListener("contextmenu", handleContextMenu, true);
                node.contentWindow.window.removeEventListener("keyup", handleKeyUp, true);
                node.contentWindow.window.removeEventListener("keydown", handleKeyDown, true);
            }
        }
        mutationObserver.disconnect();
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [removeEventListeners] Error :: ", err)
    }
}

/**
 * Perform action based on request received from either of background/popup
 * @param {JSON} request 
 * @returns 
 */
async function performAction(request) {
    try {
        if (debug)
            console.info("[MessageEventListener] [content_script.js] [", window.location.href, "] Received Request :: ", request);
        if ("currentTab" in request && (current_tab == -1 || !current_tab)) {
            current_tab = request.currentTab;
        }
        if (request.from == "popup") {
            if (request.type == "settings") {
                for (var k in request) {
                    if (k in settings) {
                        settings[k] = request[k];
                    }
                }
            } else {
                for (var k in request) {
                    if (k in data) {
                        data[k] = request[k];
                    }
                }
                if (request.type == "init") {
                    _clear();
                    if (data.state == "start" && data.activeTab == current_tab) {
                        removeEventListeners();
                        addEventListeners();

                    } else {
                        removeEventListeners();
                        clearInterval(wakeUpTimer);
                        toggleContextMenu(false)
                    }
                }
                else if (request.type == "removeFocus") {
                    // Remove focus from the currently active element as it back fires the onchange event
                    var ae = document.activeElement;
                    if (ae) {
                        ae.blur();
                    }
                }
                else if (request.type == "toggleInspect") {
                    if (data.toggleInspect[current_tab]) {
                        addEventListeners();
                    }
                    else {
                        removeEventListeners();
                        _clear();
                    }
                }
            }
        } else if (request.from == "background") {
            if (request.type == "update") {
                for (var k in request) {
                    if (k in data) {
                        data[k] = request[k];
                    }
                }
            }
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [performAction] Error :: ", err)
    }
    return { "received": true }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        performAction(request).then((response) => sendResponse(response));

        return true;
    }
);

function handleInit(response) {
    try {
        if (debug)
            console.info("[MessageEventListener Response] [content_script.js] [INIT] [", window.location.href, "] Received Response :: ", response);
        current_tab = response.current_tab;
        if (response.data) {
            for (var k in response.data) {
                if (k in data) {
                    data[k] = response.data[k];
                }
            }
        }
        if (response.settings) {
            for (var k in response.settings) {
                if (k in settings) {
                    settings[k] = response.settings[k];
                }
            }
        }
        if (isIframeParentAccessible() && isIframe()) {
            window.ccg_ext_addedContentScript = true;
        }
        var iframes = document.getElementsByTagName("iframe");
        for (var i = 0; i < iframes.length; i++) {
            var node = iframes[i];
            if (node.contentDocument) {
                node.contentWindow.window.ccg_ext_addedContentScript = true;
                var id = makeid(16);
                try {
                    while (document.querySelectorAll(`iframe[data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5='${id}']`).length != 0)
                        id = makeid(16);

                } catch (err) { }
                node.setAttribute("data-ccg-extension-iframeID-EQdHKEmLpm5c7HE5", id);
            }
        }
        if (data.state == "start" && data.activeTab == current_tab) {
            addEventListeners();
            _clear();

        } else {
            removeEventListeners();
        }

        if (data.toggleInspect[current_tab]) {
            addEventListeners();
        }
    } catch (err) {
        if (debug)
            console.log("[content_script.js] [handleInit] Error :: ", err)
    }

}
sendMessageToBackground({}, "content_script", "init", handleInit);
