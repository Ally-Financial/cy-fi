class CCGExtMultiSelectDropDown {

    constructor(root, values, maxLength, timeoutForRootToRender = 0, closeOnLimitReach = false, defaultOption = null, width = null, height = null) {
        if (!(root instanceof HTMLElement && Array.isArray(values) && typeof maxLength == "number")) {
            console.error("[ERROR] Cannot create select dropdown with inaccurate parameters. Please pass a root(HTMLElement), list of values and the length of the selectable values")
            return;
        }
        if (maxLength <= 0 || (maxLength > values.length && values.length > 0)) {
            console.error("[ERROR] maxLength should be >0 and <" + values.length, "But Given ", maxLength);
            return;
        }
        if (defaultOption && values.indexOf(defaultOption) == -1) {
            console.error("[ERROR] Default Option should one of the given values :: ", values, ". But given :: ", defaultOption);
            return;
        }
        this.values = values;
        this.root = root;
        this.maxLength = maxLength;
        this.defaultOption = defaultOption;
        this.originalDefaultOption = defaultOption;
        this.width = width;
        this.height = height;
        this.closeOnLimitReach = closeOnLimitReach;
        this.selected = this.defaultOption ? [this.defaultOption] : [];
        this.updateDimensions = this.updateDimensions.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.updateDropDown = this.updateDropDown.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleValueClose = this.handleValueClose.bind(this);
        this.createValueElement = this.createValueElement.bind(this);
        var d = this.root.querySelector(".__ccg_ext_dialog_form_control_select_box_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (!d) {
            this.dropDown = this.buildDropDown();
            setTimeout(() => {
                this.updateDimensions();
            }, timeoutForRootToRender);
            root.appendChild(this.dropDown);
        } else {
            this.dropDown = d;
            this.toggleDropdown();
        }
        if (defaultOption)
            this.createValueElement(this.defaultOption);
        this.updateDropDown();
    }

    updateDimensions() {
        var rects = this.root.getBoundingClientRect();
        var drop = this.dropDown.querySelector(".__ccg_ext_dialog_form_control_dropdown_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        drop.style.width = this.width ? this.width : `${this.root.clientWidth - 20}px`;
        drop.style.maxWidth = this.width ? this.width : `${this.root.clientWidth - 20}px`;
        drop.style.top = rects.top + this.root.clientHeight - 12 + "px";
    }

    buildDropDown() {
        var container = document.createElement("div");
        container.className = "__ccg_ext_dialog_form_control_select_box_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
        container.innerHTML = `
            <div data-ccg-ext-select-values="true"
                        class="__ccg_ext_dialog_form_control_select_box_content_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
            </div>
            <div class="__ccg_ext_dialog_form_control_dropdown_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                <div class="__ccg_ext_dialog_form_control_search_field_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                    <input type="text"
                        class="__ccg_ext_dialog_form_control_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        placeholder="Search" spellcheck="false">
                    <div class="__ccg_ext_dialog_form_control_search_icon_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"
                        data-ccg-ext-clear-input="false">&#9906;</div>
                </div>
                <ul style="max-height:126px !important;" class="__ccg_ext_search_results_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></ul>
                <button data-ccg-ext-select-dropdown-cancel-button="true" style="float:right;margin-top:6px"
                class="__ccg_ext_dialog_button_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_dialog_button_warn_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">Close</button>
            </div>
        `;
        container.querySelector("[data-ccg-ext-select-dropdown-cancel-button]").addEventListener("click", this.toggleDropdown);
        container.querySelector("[data-ccg-ext-select-values]").addEventListener("click", this.toggleDropdown);
        container.querySelector("input.__ccg_ext_dialog_form_control_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__").addEventListener("keyup", this.updateDropDown);
        container.querySelector("ul").addEventListener("click", this.handleClick);
        container.querySelector("[data-ccg-ext-clear-input]").addEventListener("click", this.clearSearch);
        return container;
    }

    toggleDropdown(event) {
        if (event) {
            if (event.target.className == "__ccg_ext_dialog_form_control_select_box_content_value_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__" || event.target.parentElement.className == "__ccg_ext_dialog_form_control_select_box_content_value_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") {
                return;
            }
        }
        var ele = this.dropDown.querySelector(".__ccg_ext_dialog_form_control_dropdown_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (ele.style.display == "none" || ele.style.display == "") {
            this.updateDimensions();
            this.dropDown.querySelector("[data-ccg-ext-select-values]").classList.add("__ccg_ext_dialog_form_control_select_box_content_active_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
            ele.style.display = "block";
        } else {
            this.dropDown.querySelector("[data-ccg-ext-select-values]").classList.remove("__ccg_ext_dialog_form_control_select_box_content_active_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
            ele.style.display = "none";
        }
    }
    updateDropDown(event) {
        var res = [];
        var value = (event ? (event.target.value || "") : "").trim().toLowerCase();
        var resultHTML = "";
        var searchIcon = this.dropDown.querySelector("[data-ccg-ext-clear-input]");
        if (value == "") {
            searchIcon.innerHTML = "&#9906;";
            searchIcon.style.transform = "rotate(-45deg)"
            searchIcon.style.fontSize = "26px";
            searchIcon.setAttribute("data-ccg-ext-clear-input", "false");
        } else {
            searchIcon.innerHTML = "&#10060;";
            searchIcon.style.transform = "rotate(0deg)";
            searchIcon.style.fontSize = "14px";
            searchIcon.setAttribute("data-ccg-ext-clear-input", "true");
        }
        if (this.selected.length != this.maxLength || this.defaultOption) {
            for (var i = 0; i < this.values.length; i++) {
                var v = this.values[i];
                if (v.toLowerCase().indexOf(value) != -1 && this.selected.indexOf(v) == -1)
                    res.push(this.values[i]);
            }
        }

        if (res.length == 0) {
            if (this.values.length == 0)
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>No options are found.</p></li>`
            else if (this.selected.length == this.maxLength && !this.defaultOption)
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>You have selected maximum number of values</p></li>`
            else if (this.selected.length == this.values.length)
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>You have selected all the values</p></li>`
            else
                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ __ccg_ext_search_results_row_title_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>No Results Found</p></li>`
        } else
            for (var i = 0; i < res.length; i++) {

                resultHTML += `<li class="__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"><p>${res[i]}</p></li>`
                if (i < res.length - 1)
                    resultHTML += `<li class="__ccg_ext_search_results_row_divider_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__"></li>`
            }

        this.dropDown.querySelector("ul").innerHTML = resultHTML;
    }

    createValueElement(value) {
        var cont = this.dropDown.querySelector("[data-ccg-ext-select-values]");
        var valueElement = document.createElement("div");
        valueElement.innerText = value;
        valueElement.setAttribute("data-ccg-ext-selected-value", value);
        valueElement.className = "__ccg_ext_dialog_form_control_select_box_content_value_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
        var valueCloseBtn = document.createElement("span");
        valueCloseBtn.innerHTML = "&#10060;";
        valueCloseBtn.addEventListener("click", this.handleValueClose, true);
        valueElement.appendChild(valueCloseBtn);
        cont.appendChild(valueElement);
    }

    handleClick(event) {
        var element = event.target;
        if (element.className != "__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") {
            element = element.parentElement;
        }
        if (element && element.className == "__ccg_ext_search_results_row_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") {

            if (this.defaultOption) {
                this.selected.splice(this.selected.indexOf(this.defaultOption), 1);
                var valueEle = this.dropDown.querySelector("[data-ccg-ext-selected-value='" + this.defaultOption + "']")
                if (valueEle)
                    valueEle.remove();
                this.defaultOption = null;
            }
            if (!(this.maxLength == this.selected.length)) {
                this.selected.push(event.target.innerText);
                this.createValueElement(event.target.innerText);
            }
            if (this.maxLength == this.selected.length && this.closeOnLimitReach) {
                this.toggleDropdown();
            }
            this.updateDropDown({ target: this.dropDown.querySelector("input.__ccg_ext_dialog_form_control_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") });
            this.updateDimensions();
            if (this.callback)
                this.callback(this, this.selected);
        }
    }

    clearSearch(event) {
        var v = this.dropDown.querySelector("[data-ccg-ext-clear-input]").getAttribute("data-ccg-ext-clear-input")
        var s = this.dropDown.querySelector("input.__ccg_ext_dialog_form_control_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (v == "true") {
            s.value = "";
        }
        s.dispatchEvent(new Event("keyup"));
    }

    handleValueClose(event) {
        if (event && event.target) {
            var v = event.target.parentElement.getAttribute("data-ccg-ext-selected-value");
            this.selected.splice(this.selected.indexOf(v), 1);
            event.target.parentElement.remove();
            if (this.selected.length == 0 && this.originalDefaultOption) {
                this.defaultOption = this.originalDefaultOption;
                this.createValueElement(this.originalDefaultOption);
                this.selected.push(this.originalDefaultOption);
            }
            this.updateDropDown({ target: this.dropDown.querySelector("input.__ccg_ext_dialog_form_control_search_input_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__") });
            this.updateDimensions();
            if (this.callback)
                this.callback(this, this.selected);
        }
    }

    addListener(callback = (context, values) => { }) {
        this.callback = callback;
    }

}