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

// The data object which is stored in the session storage and contains information required to control the extension.
// activeTab : The tabId of the tab where the extension is enabled(play button is pressed)
// url : Url of the activeTab
// state : The state of the extension in the current tab or window. The values can be either of [start, stop, pause]
// code : Contains Code generated by the extension or edited in the extension code editor for each tab or window. 
//        Example : {239200808:["cy.visit(\"https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/\")","cy.findByRole(\"link\",{\"name\":\"Community\"}).click()"]}
// toggleInspect: A boolean representing whether the inspect is enabled or not for each tab or window. Example : {239200808:false,412319832:true}
var data = { activeTab: -1, url: "", state: "stop", code: {}, toggleInspect: {} };
// Settings object containing information about the extension settings -> selector_order, trim-whether to remove trailing white spaces of the string(label text, text, attribute value etc.) which is used to identify the element and useAllElements-whether to consider all the elements as actionable(click) elements.
var settings = { "selector_order": ["cy.findByRole", "cy.findByText", "cy.findByLabelText", "cy.findByPlaceholderText", "cy.findByTestId", "cy.get"], "trim": true, useAllElements: false };

var codeEditorInitialContent = [`// If you encounter any issues with the extension,`, `// try refreshing the web page or`, `// try by stopping and starting the recording.`, '// Shortcuts:', '// Each shortcut works only on a HTML element', '// 1) Assertions: HOLD ALT KEY + RIGHT CLICK', ''];

// List of settings to identify whether the given element is clickable or updatable
var clickableElementRoles = ["button", "link", "combobox", "checkbox", "searchbox", "textbox", "radio", "menuitem", "menuitemcheckbox", "menuitemradio", "switch", "dialog", "tab", "menu", "menubar", "toolbar", "navigation", "spinbutton"];
var changeableRoles = ["listbox", "combobox", "textbox", "searchbox", "spinbutton", "slider"];
var typableElementsRoles = ["textbox", "searchbox", "combobox"];
var clickableElements = ["iframe", "video", "audio"];
var changeableInputTypes = ["birthday", "time", "week", "month", "datetime-local", "file", "date"];
// Maximum number of parents to travel to find a suitable element for click action
var maxNumberOfParents = 3;