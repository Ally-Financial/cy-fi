class Notifier {
    constructor() {
        this.notificationContainer = document.getElementById("__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__");
        if (!this.notificationContainer) {
            this.notificationContainer = document.createElement("ul");
            this.notificationContainer.id = "__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__";
            let style = document.createElement("style");
            var head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(style);

            let css = `
            #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                position: fixed;
                top: 10px;
                right: 12px;
                cursor: default;
            }
            
            #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ :where(.__ccg_ext_notifier_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__, .__ccg_ext_notifier_column_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__) {
                display: flex;
                align-items: center;
            }
            
            #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ .__ccg_ext_notifier_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                width: 400px;
                position: relative;
                overflow: hidden;
                list-style: none;
                border-radius: 4px;
                padding: 12px 17px;
                margin-bottom: 10px;
                background: #fff;
                justify-content: space-between;
                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                animation: __ccg_ext_notifier_show_toast_animation_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ 0.3s ease forwards;
            }
            
            @keyframes __ccg_ext_notifier_show_toast_animation_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                0% {
                    transform: translateX(110%);
                }
                40% {
                    transform: translateX(-3%);
                }
                100% {
                    transform: translateX(0%);
                }
            }
            
            #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ .__ccg_ext_notifier_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__.__ccg_ext_notifier_hide_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                animation: __ccg_ext_notifier_hide_toast_animation_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ 0.5s ease forwards;
            }
            
            @keyframes __ccg_ext_notifier_hide_toast_animation_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
            100% {
                    transform: translateX(120%);
                }
            }

            @media screen and (max-width: 530px) {
                #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                    width: 80%;
                }
                
                #__ccg_ext_notifier_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ .__ccg_ext_notifier_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__ {
                    width: 100%;
                    font-size: 1rem;
                    margin-left: 20px;
                }
            }
            `;
            document.body.appendChild(this.notificationContainer);
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
        }
        this.successMessageBackgroundColor = "#0abf30";
        this.errorMessageBackgroundColor = "#f24d4c";
        this.__removeToast = this.__removeToast.bind(this);
    }

    __removeToast = (toast) => {
        toast.classList.add("__ccg_ext_notifier_hide_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__")
        if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
        setTimeout(() => toast.remove(), 500) // Removing the toast after 500ms
    }

    // add notification either success or error
    addNotification(msg, type = "success", timeout = 1500) {
        const toast = document.createElement("li"); // Creating a new 'li' element for the toast
        toast.className = `__ccg_ext_notifier_toast_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__` // Setting the classes for the toast
        if (type == "success") {
            toast.style.backgroundColor = this.successMessageBackgroundColor;
            toast.style.color = "#ffffff";
        }
        else if (type == "error") {
            toast.style.backgroundColor = this.errorMessageBackgroundColor;
            toast.style.color = "#ffffff";
        }
        // Setting the inner HTML for the toast
        toast.innerHTML = `<div class="__ccg_ext_notifier_column_lJuYi6XDoLmjtEdQCmEM764fLvwZSkQf__">
                                <span>${msg}</span>
                            </div>
                            <span style="cursor:pointer;font-family:cursive, monospace; font-size:16px; color: ${['success', 'error'].indexOf(type) != -1 ? '#ffffff' : 'black'}">X</span>
                            `
        toast.getElementsByTagName("span")[1].addEventListener("click", (e) => this.__removeToast(toast));
        this.notificationContainer.appendChild(toast); // Append the toast to the notification ul
        // Setting a timeout to remove the toast after the specified duration
        toast.timeoutId = setTimeout(() => this.__removeToast(toast), timeout);
    }
}