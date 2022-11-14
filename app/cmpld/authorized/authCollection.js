define(["react", "app", "xss", "cmpld/authorized/mailbox/mailboxCollection", "cmpld/authorized/settings/settingsCollection", "cmpld/authorized/updates/updateVersion1", "cmpld/modals/secondPass", "cmpld/modals/syncUserObj", "cmpld/modals/logOutForce", "cmpld/modals/infoPop", "cmpld/modals/askForPass", "cmpld/modals/dialogPop", "cmpld/modals/dontInterrupt"], function (React, app, xss, MailboxCollection, SettingsCollection, UpdateCollection, SecondPass, SyncUserObj, LogOutForce, InfoPop, AskForPass, DialogPop, DontInterrupt) {
    return React.createClass({
        getInitialState: function () {
            return {
                dfd: "",
                foderId: ""
            };
        },
        componentDidMount: function () {
            var thisMod = this;

            if (!app.user.get("userLogedIn")) {
                app.auth.logout();
            } else {
                $('link[rel=stylesheet][href="/css/style_frontend.css"]').remove();
                $("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", "/css/style_backend.css"));
                $("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", "/css/style_backend_over.css"));

                if (app.sessionData.get("sessionReady")) {
                    thisMod.setState({ dfd: "solved" });
                } else {
                    $("#userObjSync").addClass("show d-block");
                    $("#overlay, #loading-skeleton").removeClass("d-none").addClass("d-block");
                    $("#userObjSync").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: true
                    });

                    app.userObjects.startSession(function () {
                        $("#userObjSync").removeClass("show d-block");
                        $("#overlay, #loading-skeleton").removeClass("d-block").addClass("d-none");
                        $("#userObjSync").modal("hide");
                        app.sessionData.set({ sessionReady: true });
                        thisMod.setState({ dfd: "solved" });
                    });
                }
            }
        },
        handleClick: function (i) {
            switch (i) {
                case "resetTimer":
                    // app.user.startTimer();
                    break;
            }
        },
        changeFodlerId: function (foderId) {
            this.setState({
                folder: foderId
            });
        },
        componentWillUnmount: function () {},

        updateValue: function (modifiedValue) {
            this.setState(modifiedValue);
        },

        render: function () {
            var body = "";
            var page = this.props.page;

            if (this.state.dfd == "solved") {
                if (page == "mailBox" && app.user.get("profileVersion") > 1) {
                    body = React.createElement(MailboxCollection, {
                        pp: this.props.folder,
                        activePage: this.state.folder,
                        changeFodlerId: this.changeFodlerId,
                        folderId: this.state.folder,
                        updateValue: this.updateValue
                    });
                } else if (page == "settings" && app.user.get("profileVersion") > 1) {
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: this.props.activePage
                    });
                } else if (page == "settings" && app.user.get("profileVersion") == 1 && this.props.activePage == "updateVersion1") {
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: "updateVersion1"
                    });
                } else if (app.user.get("profileVersion") == 1) {
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true
                    });
                }
            }

            return React.createElement(
                "div",
                { className: "mailBody" },
                body,
                React.createElement("div", { id: "overlay", className: "d-none" }),
                React.createElement(
                    "div",
                    {
                        id: "loading-skeleton",
                        className: "loading-skeleton d-none"
                    },
                    React.createElement(
                        "header",
                        null,
                        React.createElement(
                            "div",
                            { className: "logo-2" },
                            React.createElement(
                                "a",
                                { href: "#" },
                                React.createElement("img", {
                                    src: "images/logo.svg",
                                    alt: "",
                                    className: "light-theme"
                                }),
                                " ",
                                React.createElement("img", {
                                    src: "images/logo-white.svg",
                                    alt: "",
                                    className: "dark-theme"
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "right-top-data" },
                            React.createElement(
                                "div",
                                { className: "icon-notification" },
                                React.createElement(
                                    "button",
                                    null,
                                    React.createElement("span", null)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "user-dropdown" },
                                React.createElement(
                                    "div",
                                    { className: "dropdown" },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "user-dropdown",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false"
                                        },
                                        " ",
                                        React.createElement("img", {
                                            src: "images/user.jpg",
                                            alt: ""
                                        }),
                                        " ",
                                        "Sepide Moqadasi",
                                        " ",
                                        React.createElement("span", { className: "arrow" }),
                                        React.createElement("br", null),
                                        React.createElement(
                                            "span",
                                            { className: "user-email" },
                                            "Sepide_moqadasi@y.."
                                        ),
                                        " "
                                    ),
                                    React.createElement(
                                        "ul",
                                        {
                                            className: "dropdown-menu",
                                            "aria-labelledby": "user-dropdown"
                                        },
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    className: "copy-icon",
                                                    id: "email-copy"
                                                },
                                                "Copy my email address"
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "a",
                                                {
                                                    href: "#",
                                                    className: "logout-icon"
                                                },
                                                "Log out"
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "menu-icon" },
                                React.createElement("button", {
                                    "data-bs-toggle": "offcanvas",
                                    "data-bs-target": "#offcanvasRight",
                                    "aria-controls": "offcanvasRight"
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mobile-search" },
                        React.createElement("input", { type: "search", placeholder: "Search..." })
                    ),
                    React.createElement(
                        "div",
                        { className: "left-side" },
                        React.createElement(
                            "div",
                            { className: "left-container" },
                            React.createElement(
                                "div",
                                { className: "logo" },
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("img", {
                                        src: "images/logo.svg",
                                        alt: "",
                                        className: "light-theme-logo"
                                    }),
                                    " ",
                                    React.createElement("img", {
                                        src: "images/logo-white.svg",
                                        alt: "",
                                        className: "dark-theme-logo"
                                    })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "new-message-btn" },
                                React.createElement(
                                    "button",
                                    null,
                                    "New message"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "main-menu" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        React.createElement("div", { className: "skeleton __folder" })
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        React.createElement("div", { className: "skeleton __folder" })
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        React.createElement("div", { className: "skeleton __folder" })
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        React.createElement("div", { className: "skeleton __folder" })
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-section" },
                        React.createElement(
                            "div",
                            { className: "middle-top" },
                            React.createElement(
                                "div",
                                { className: "desktop-search" },
                                React.createElement("input", {
                                    type: "search",
                                    placeholder: "Search..."
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "info-row" },
                                React.createElement(
                                    "div",
                                    { className: "all-check" },
                                    React.createElement(
                                        "label",
                                        { className: "container-checkbox" },
                                        React.createElement("input", { type: "checkbox" }),
                                        React.createElement("span", { className: "checkmark" }),
                                        " "
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "arrow-btn" },
                                    React.createElement(
                                        "div",
                                        { className: "dropdown" },
                                        React.createElement("button", {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "mail-sort",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false"
                                        })
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "info-row-right" },
                                    React.createElement(
                                        "div",
                                        { className: "referesh-btn" },
                                        React.createElement(
                                            "button",
                                            {
                                                id: "referesh-btn",
                                                className: "icon-btn"
                                            },
                                            " ",
                                            React.createElement("i", null),
                                            " "
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ellipsis-dropdown" },
                                        React.createElement("button", null)
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "middle-content" },
                            React.createElement(
                                "div",
                                { className: "inbox-list" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __box" })
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __box" })
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "right-side" },
                        React.createElement(
                            "div",
                            { className: "email-conetent-wrp" },
                            React.createElement(
                                "div",
                                { className: "email-content-top" },
                                React.createElement(
                                    "div",
                                    { className: "email-content-top-left" },
                                    React.createElement(
                                        "div",
                                        { className: "word color-1" },
                                        "W"
                                    ),
                                    React.createElement("div", { className: "sender-name skeleton __sender" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "mail-data" },
                                React.createElement("div", { className: "skeleton __mail_content" }),
                                React.createElement("div", { className: "skeleton __mail_content" }),
                                React.createElement("div", { className: "skeleton __mail_content" }),
                                React.createElement("div", { className: "skeleton __mail_content" })
                            )
                        )
                    )
                ),
                React.createElement(SyncUserObj, null)
            );
        }
    });
});