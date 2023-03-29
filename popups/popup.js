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

var current_tab;
var bg;
var editorInit = false;
// Editor
ace.require("ace/ext/language_tools");
ace.require("ace/keyboard/vscode");
// var UndoManager = ace.require("ace/undomanager").UndoManager;
// var undoManager = new UndoManager();
// editor.getSession().setUndoManager(undoManager);

// Adding editor to a DOM element
var editor = ace.edit("code-editor");
editor.getSession().setUseWorker(false);
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    autoScrollEditorIntoView: true,
    enableEmmet: true,
    useElasticTabstops: true,
});
editor.setShowPrintMargin(false);

editor.session.setValue(codeEditorInitialContent.join("\n"), -1)
editor.session.on("change", function () {
    if (editorInit)
        editorUpdated();
});
// editor.commands.addCommands([
//     {
//         name: 'undo',
//         bindKey: 'Ctrl-Z',
//         exec: function (editor) {
//             console.log("Preseed ")
//             var content = editor.session.getValue().split("\n");
//             console.log("LL :: ", content.length)
//             if (content.length >= 6)
//                 editor.session.getUndoManager().undo();
//         }
//     },
//     {
//         name: 'redo',
//         bindKey: 'Ctrl-Y',
//         exec: function (editor) {
//             editor.session.getUndoManager().redo();
//         }
//     }
// ]);
editor.commands.on("exec", function (e) {
    var rowCol = editor.selection.getCursor();
    var content = editor.session.getValue().split("\n");
    var readOnlyLines = [0, 1, 2, 3, 4, content.length - 1, content.length - 2];
    if (content.length > 5 && content[4] == `  const getIframeBody = (iframe_selector: any) => {`) {
        readOnlyLines = readOnlyLines.concat([5, 6, 7, 8, 9, 10, 11, 12]);
    }

    if (readOnlyLines.indexOf(rowCol.row) != -1) {
        e.preventDefault();
        e.stopPropagation();
    }
})
var intro = introJs();

function sendMessage(tabId, request, from = "popup", type = "init", callback = (response) => {
    if (chrome.runtime.lastError) {
        if (debug)
            console.log("[popup.js] [sendMessage] chrome.runtime.lastError for Request :: ", request, " From::", from, "Type::", type);
    }
}) {
    try {
        chrome.tabs.sendMessage(tabId, { from: from, type: type, currentTab: tabId, ...request }, callback);
    } catch (err) {
        if (debug)
            console.log("[popup.js] [sendMessage] Not able to send mesage to Tab")
    }
}

function sendMessageToBackground(request, from = "popup", type = "init", callback = (response) => {
    if (chrome.runtime.lastError) {
        if (debug)
            console.log("[popup.js] [sendMessageToBackground] chrome.runtime.lastError for Request :: ", request, " From::", from, "Type::", type);
    }
}) {
    try {
        chrome.runtime.sendMessage({ from: from, type: type, ...request }, callback);
    } catch (err) {
        if (debug)
            console.log("[popup.js] [sendMessageToBackground] Not able to send message to background")
    }

}

function start_recording() {
    var start_btn = document.getElementById("start");
    var stop_btn = document.getElementById("stop");
    var pause_btn = document.getElementById("pause");
    stop_btn.style.display = "inline-block";
    pause_btn.style.display = "inline-block";
    start_btn.style.display = "none";
    pause_btn.setAttribute("title", "Pause");
    chrome.tabs.query({ active: true, currentWindow: true }, function (d) {
        var url = d[0].url;
        data.activeTab = d[0].id;
        data.url = url;
        data.state = "start";
        data.toggleInspect[current_tab] = false;
        document.getElementById("inspect").classList = "";
        sendMessage(data.activeTab, data);
        chrome.storage.session.set(data);
    });
}

function stop_recording() {
    var start_btn = document.getElementById("start");
    var stop_btn = document.getElementById("stop");
    var pause_btn = document.getElementById("pause");
    start_btn.style.display = "inline-block";
    start_btn.setAttribute("title", "Start Recording");
    start_btn.classList = "fa fa-play action-btn";
    pause_btn.style.display = "none";
    stop_btn.style.display = "none";
    data.url = "";
    data.state = "stop";
    data.toggleInspect[current_tab] = false;
    sendMessage(data.activeTab, data);
    chrome.storage.session.set(data);
}

function pause_recording() {
    var start_btn = document.getElementById("start");
    var stop_btn = document.getElementById("stop");
    var pause_btn = document.getElementById("pause");
    pause_btn.style.display = "none";
    start_btn.setAttribute("title", "Resume Recording");
    start_btn.classList = "fa fa-play start-pause action-btn";
    start_btn.style.display = "inline-block";
    stop_btn.style.display = "inline-block";
    data.state = "pause";
    sendMessage(data.activeTab, data);
    chrome.storage.session.set(data);
}

function refresh_recording() {
    document.getElementById("refresh").classList = "fa fa-refresh fa-spin action-btn";
    //TODO :: Refreshing
    setTimeout(() => {
        editor.session.getUndoManager().markClean();
        editor.session.setValue(codeEditorInitialContent.join("\n"), -1);
        data.code[data.activeTab] = [...codeEditorInitialContent];
        chrome.storage.session.set(data);
        sendMessage(current_tab, data, "popup", "code_update");
        document.getElementById("refresh").classList = "fa fa-refresh action-btn";

    }, 500);
}

var copy_btn_clicked = false;
async function copyToClipboard() {
    if (!copy_btn_clicked) {
        copy_btn_clicked = true;
        var btn = document.getElementById("copy_btn");
        btn.style.color = "rgba(0,0,0,0.5)";
        var content = editor.session.getValue().split("\n");
        content = content.splice(codeEditorInitialContent.length, content.length).join("\n");
        await navigator.clipboard.writeText(content);
        var m = document.getElementById("copied_message");
        m.style.display = "block";
        setTimeout(() => {
            m.style.display = "none";
            btn.style.color = "black";
            copy_btn_clicked = false;
        }, 1500);
    }
}

function start_or_stop_inspect() {
    if (data.toggleInspect[current_tab] === undefined)
        data.toggleInspect[current_tab] = true;
    else
        data.toggleInspect[current_tab] = !data.toggleInspect[current_tab];
    if (data.toggleInspect[current_tab]) {
        document.getElementById("inspect").classList = "active";
        data.state = (data.state == "start") ? "pause" : "stop";
        if (data.state != "stop") {
            var start_btn = document.getElementById("start");
            var stop_btn = document.getElementById("stop");
            var pause_btn = document.getElementById("pause");
            pause_btn.style.display = "none";
            start_btn.setAttribute("title", "Resume Recording");
            start_btn.classList = "fa fa-play start-pause action-btn";
            start_btn.style.display = "inline-block";
            stop_btn.style.display = "inline-block";
        }
    }
    else
        document.getElementById("inspect").classList = "";
    chrome.storage.session.set(data);
    sendMessage(current_tab, data, "popup", "toggleInspect");

    if (data.toggleInspect[current_tab]) {
        document.getElementById("inspect").classList = "active";

    }
    else
        document.getElementById("inspect").classList = "";
}

function editorUpdated() {
    if (current_tab == data.activeTab || data.activeTab == -1) {
        var cbtn = document.getElementById("copy_btn");
        var content = editor.session.getValue();
        if (content.trim() && content.trim() != codeEditorInitialContent.join("\n")) {
            cbtn.style.display = "block";
        }
        else
            cbtn.style.display = "none";
        if (content.trim())
            data.code[data.activeTab] = content.trim().split("\n");
        else
            data.code[data.activeTab] = [];
        chrome.storage.session.set(data);
        sendMessage(current_tab, data, "popup", "code_update");
    }
}

function reveal() {
    var start_btn = document.getElementById("start");
    var stop_btn = document.getElementById("stop");
    var pause_btn = document.getElementById("pause");

    if (data.state == "start") {
        start_btn.style.display = "none";
        stop_btn.style.display = "inline-block";
        pause_btn.style.display = "inline-block";
    } else if (data.state == "pause") {
        pause_btn.style.display = "none";
        start_btn.classList = "fa fa-play start-pause action-btn";
        start_btn.setAttribute("title", "Resume Recording");
        stop_btn.style.display = "inline-block";
    }
    else {
        start_btn.style.display = "inline-block";
        pause_btn.style.display = "none";
        stop_btn.style.display = "none";
    }

}

class Sortable {

    constructor(list, options) {
        this.list = (typeof list === 'string')
            ? document.querySelector(list)
            : list

        this.items = Array.from(this.list.children)
        this.animation = false

        this.options = Object.assign({
            animationSpeed: 200,
            animationEasing: 'ease-out',
        }, options || {})

        this.dragStart = this.dragStart.bind(this)
        this.dragMove = this.dragMove.bind(this)
        this.dragEnd = this.dragEnd.bind(this)

        this.list.addEventListener('touchstart', this.dragStart, { passive: false })
        this.list.addEventListener('mousedown', this.dragStart, false)
    }

    dragStart(e) {
        if (this.animation) return
        if (e.type === 'mousedown' && e.which !== 1) return
        if (e.type === 'touchstart' && e.touches.length > 1) return

        this.handle = null

        let el = e.target;
        while (el) {
            if (el.hasAttribute('sortable-handle')) this.handle = el
            if (el.hasAttribute('sortable-item')) this.item = el
            if (el.hasAttribute('sortable-list')) break;
            el = el.parentElement;
        }

        if (!this.handle) return

        this.list.style.position = 'relative'
        this.list.style.height = this.list.offsetHeight + 'px'

        this.item.classList.add('is-dragging')

        this.itemHeight = this.items[1].offsetTop
        this.listHeight = this.list.offsetHeight
        this.startTouchY = this.getDragY(e)
        this.startTop = this.item.offsetTop

        const offsetsTop = this.items.map(item => item.offsetTop)

        this.items.forEach((item, index) => {
            item.style.position = 'absolute'
            item.style.top = 0
            item.style.left = 0
            item.style.width = '100%'
            item.style.transform = `translateY(${offsetsTop[index]}px)`
            item.style.zIndex = (item == this.item) ? 2 : 1
        })

        setTimeout(() => {
            this.items.forEach(item => {
                if (this.item == item) return
                item.style.transition = `transform ${this.options.animationSpeed}ms ${this.options.animationEasing}`
            })
        })

        this.positions = this.items.map((item, index) => index)
        this.position = Math.round((this.startTop / this.listHeight) * this.items.length)

        this.touch = e.type == 'touchstart'
        window.addEventListener((this.touch ? 'touchmove' : 'mousemove'), this.dragMove, { passive: false })
        window.addEventListener((this.touch ? 'touchend' : 'mouseup'), this.dragEnd, false)
    }

    dragMove(e) {
        if (this.animation) return

        const top = this.startTop + this.getDragY(e) - this.startTouchY
        const newPosition = Math.round((top / this.listHeight) * this.items.length)

        this.item.style.transform = `translateY(${top}px)`

        this.positions.forEach(index => {
            if (index == this.position || index != newPosition) return
            this.swapElements(this.positions, this.position, index)
            this.position = index
        })

        this.items.forEach((item, index) => {
            if (item == this.item) return
            item.style.transform = `translateY(${this.positions.indexOf(index) * this.itemHeight}px)`
        })

        e.preventDefault()
    }

    dragEnd(e) {
        this.animation = true
        this.item.style.transition = `all ${this.options.animationSpeed}ms ${this.options.animationEasing}`
        this.item.style.transform = `translateY(${this.position * this.itemHeight}px)`

        this.item.classList.remove('is-dragging')

        setTimeout(() => {
            this.list.style.position = ''
            this.list.style.height = ''

            this.items.forEach(item => {
                item.style.top = ''
                item.style.left = ''
                item.style.right = ''
                item.style.position = ''
                item.style.transform = ''
                item.style.transition = ''
                item.style.width = ''
                item.style.zIndex = ''
            })

            this.positions.map(i => this.list.appendChild(this.items[i]))
            this.items = Array.from(this.list.children)

            this.animation = false
        }, this.options.animationSpeed)

        window.removeEventListener((this.touch ? 'touchmove' : 'mousemove'), this.dragMove, { passive: false })
        window.removeEventListener((this.touch ? 'touchend' : 'mouseup'), this.dragEnd, false);
        var temp_settings = [];
        try {
            for (var i = 0; i < this.positions.length; i++) {
                temp_settings.push(this.items[this.positions[i]].getElementsByClassName("list__item-title")[0].innerText.trim());
            }
            if (JSON.stringify(temp_settings) !== JSON.stringify(settings.selector_order)) {
                sendSettingsUpdateMessage({ "selector_order": temp_settings });
            }
        } catch (err) {
            if (debug)
                console.log("Error occured while updating settings at popup :: ", err);
        }
    }

    swapElements(array, a, b) {
        const temp = array[a]
        array[a] = array[b]
        array[b] = temp
    }

    getDragY(e) {
        return e.touches ? (e.touches[0] || e.changedTouches[0]).pageY : e.pageY
    }

}



function sendSettingsUpdateMessage(newSettings) {
    for (var k in newSettings) {
        if (k in settings) {
            settings[k] = newSettings[k];
        }
    }
    chrome.storage.local.set(settings);
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            try {
                sendMessage(tabs[i].id, settings, "popup", "settings");
            } catch (err) {
                if (debug)
                    console.log("Not able to send settings update to tab :: ", tabs[i], "\nError::", err);
            }
        }
    });
}
function otherSettingsChanged(e) {
    var target = e.target;
    if (target.id && target.id == "use-trim") {
        settings.trim = target.checked;
    }
    else if (target.id && target.id == "all-elements") {
        settings.useAllElements = target.checked;
    }
    chrome.storage.local.set(settings);
    sendSettingsUpdateMessage(settings);
}

function updateEditor() {
    var content = data.code[current_tab];
    if (content) {
        content = content.join("\n");
        editor.session.setValue(content, -1);
        if (content.trim() != codeEditorInitialContent.join("\n"))
            document.getElementById("copy_btn").style.display = "block";
    }
}

function toggleSettings() {
    var v = document.getElementById("settings-section");
    var b = document.getElementById("toggle-settings");
    if (b.getAttribute("data-toggle") == "true") {
        b.setAttribute("data-toggle", "false");
        v.style.overflow = "hidden";
        v.classList = "animate-section";
        b.classList = "fa fa-cog open-close";
    }
    else {
        var litems = document.getElementsByClassName("list__item-title");
        for (var i = 0; i < litems.length; i++) {
            litems[i].innerText = settings["selector_order"][i];
        }
        setTimeout(() => { b.classList = "fa fa-times open-close open"; }, 250);
        setTimeout(() => {
            if (b.getAttribute("data-toggle") == "true")
                v.style.overflow = "auto";
        }, 1000);

        v.classList = "animate-section open";
        b.setAttribute("data-toggle", "true");
    }
}

function handleIntro() {
    var b = document.getElementById("toggle-settings");
    if (b.getAttribute("data-toggle") == "true") {
        toggleSettings();
    }
    if (settings.intialLoad) {
        settings.intialLoad = false;
        chrome.storage.local.set(settings);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    intro.setOptions({
        steps: [
            {
                intro: "Welcome to Cypress Code Generator. Let's take a tour on how to use."
            },
            {
                intro: "<h2 style='margin-bottom: 1rem;'>Purpose</h2>Records a user session and generates cypress code for automation and testing purposes by using the cypress commands from <b>@cypress/testing-library</b>.<br/>Refer this <a href='https://testing-library.com/docs/'>link</a> for more information about cypress/testing-library."
            },
            {
                element: "#inspect",
                intro: `<div style="text-align: center;">
                            <h2 style="margin-bottom:1rem;">Toggle Inspect mode</h2>
                            <div style="display: flex;justify-content: center;">
                                <ul style="text-align: left;">
                                    <li>Click on Inspect Toggle Button.</li>
                                    <li>Hover your mouse on the web page to get Cypress selector code.</li>
                                    <li>Click on a HTML element to get it's cy selector</li>
                                    <li>Press <b>ESC</b> to continue inspecting.</li>
                                </ul>
                            </div>
                        </div>`
            },
            {
                element: "#start",
                intro: "Click the play button to <b>start</b> the recording.",
            },
            {
                element: "#pause",
                intro: "Click to <b>pause</b> the recording."
            },
            {
                element: "#stop",
                intro: "Click to <b>stop</b> the recording."
            },
            {
                element: "#instructions",
                intro: `<div style="text-align: center;">
                        <h2 style="margin-bottom:1rem;">Assertions</h2>
                        <div style="display: flex;justify-content: center;">
                            <ul style="text-align: left;">
                                <li><b>Condition: </b>Extension is in recording state(Play button is enabled).</li>
                                <li>Hold <b>ALT</b> + <b>Right Click</b> to get list of Assertions for an element</li>
                                <li>Press <b>ESC</b> to close the assertion window</li>
                            </ul>
                        </div>
                    </div>`
            },
            {
                element: "#refresh",
                intro: "Click to <b>refresh</b> the generated code."
            },
            {
                element: "#settings-section",
                intro: "Click to reveal settings window."
            },
            {
                element: "#element-selector-order",
                intro: "You can rearrange the cypress selectors order to use while finding the element selector."
            },
            {
                element: "#trim-setting",
                intro: "Toggle to use <b>trim</b> cypress option while finding elements. Refer this <a href='https://testing-library.com/docs/queries/about#queryoptions'>link</a> for more information."
            },
            {
                element: "#all-elements-setting",
                intro: "Toggle to consider all elements as clickable and changeable. This is more helpful when you have custom HTML elements."
            },
            {
                intro: "You are now ready to use the tool."
            }
        ],
        showBullets: true,
        disableInteraction: true,
        exitOnOverlayClick: false
    }
    );
    intro.onbeforechange(async (element) => {
        return new Promise((resolve) => {
            if (element) {
                var isSettingsPage = element.id == "element-selector-order" || element.id == "trim-setting" || element.id == "all-elements-setting";
                if (element.id == "stop" || element.id == "pause" || element.id == "start") {
                    var b = document.getElementById("toggle-settings");
                    if (b.getAttribute("data-toggle") == "true") {
                        toggleSettings();
                    }
                    if (data.state != "start" && element.id != "start")
                        start_recording();
                    else if (element.id == "start")
                        stop_recording();
                    setInterval(resolve, 500);
                }
                else if (isSettingsPage) {
                    var b = document.getElementById("toggle-settings");
                    if (b.getAttribute("data-toggle") != "true") {
                        toggleSettings();
                        setInterval(resolve, 1000);
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    if (!isSettingsPage) {
                        var b = document.getElementById("toggle-settings");
                        if (b.getAttribute("data-toggle") == "true") {
                            toggleSettings();
                            setInterval(resolve, 500);
                        }
                        else
                            resolve();
                    } else
                        resolve();
                }
            }
            else
                resolve();
        });
    });
    intro.oncomplete(handleIntro);
    intro.onexit(handleIntro);
    var sortable = new Sortable('.list')
    document.getElementById("start").addEventListener("click", start_recording);
    document.getElementById("stop").addEventListener("click", stop_recording);
    document.getElementById("pause").addEventListener("click", pause_recording);
    document.getElementById("refresh").addEventListener("click", refresh_recording);
    document.getElementById("copy_btn").addEventListener("click", copyToClipboard);
    document.getElementById("inspect").addEventListener("click", start_or_stop_inspect);
    document.getElementById("use-trim").addEventListener("change", otherSettingsChanged);
    document.getElementById("all-elements").addEventListener("change", otherSettingsChanged);
    document.getElementById("help").addEventListener("click", () => {
        if (data.state == "start") {
            stop_recording();
        }
        intro.start();
    });
    document.getElementById("toggle-settings").addEventListener("click", (e) => {
        toggleSettings();
    });
    var inspect = document.getElementById("inspect");
    chrome.storage.local.get(Object.keys(settings)).then((v) => {
        for (var k in v) {
            if (k in settings) {
                settings[k] = v[k];
            }
        }
        document.getElementById("use-trim").checked = settings.trim;
        document.getElementById("all-elements").checked = settings.useAllElements;
        document.getElementById("initial-loading").style.display = "none";
        if (settings.intialLoad) {
            if (data.state == "start") {
                stop_recording();
            }
            intro.start();
        }
    });
    chrome.storage.session.get(Object.keys(data)).then((v) => {
        if (Object.keys(v).length >= Object.keys(data).length) {
            data = v;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
            current_tab = tab[0].id;
            if (data.toggleInspect[current_tab]) {
                inspect.classList = "active";
            }
            if (v.activeTab == tab[0].id) {

                reveal();
            }
            try {
                updateEditor();
            } catch (err) {
                // TODO :: Inform user about the error
                if (debug)
                    console.log("Error ocured while initializing popup :: ", err);
            }
            editorInit = true;
            sendMessage(current_tab, {}, "popup", "removeFocus");
            document.getElementById("initial-loading").style.display = "none";
        });

    });
    sendMessageToBackground({}, "ping", "");
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (debug) {
            console.log("[MessageEventListener] [popup.js] Received Request :: ", request);
        }
        if (request.from != "ping") {
            for (var k in request) {
                if (k in data) {
                    data[k] = request[k];
                }
            }
            updateEditor();
        }
        return sendResponse({});
    }
);