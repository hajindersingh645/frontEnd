define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                mainFolders: app.globalF.getMainFolderList(),
                customFolders: app.globalF.getCustomFolderList(),
                moveFolderMain: [],
                moveFolderCust: [],
                unopened: app.user.get("unopenedEmails")
            };
        },
        componentDidMount: function () {
            var thisComp = this;

            thisComp.props.changeFodlerId(app.user.get("systemFolders")["inboxFolderId"]);

            thisComp.notifyMe();

            app.user.on("change:unopenedEmails", function () {
                thisComp.updateUnopened();
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:unopenedEmails");
            app.user.off("change:currentMessageView", function () {});
        },

        updateUnopened: function () {
            var thisComp = this;
            this.setState({
                unopened: app.user.get("unopenedEmails")
            });
        },

        removeClassesActive: function () {
            $("#folderul > li").removeClass("active");
            $("#folderulcustom > li").removeClass("active");
        },

        handleChange: function (i, event) {
            switch (i) {
                case "switchFolder":
                    var thisComp = this;

                    app.user.on("change:currentMessageView", function () {}, this);

                    if (thisComp.props.activePage != $(event.target).attr("id")) {
                        $("#sdasdasd").addClass("hidden");
                        clearTimeout(app.user.get("emailOpenTimeOut"));

                        app.mixins.canNavigate(function (decision) {
                            if (decision) {
                                // $("#mMiddlePanelTop").removeClass(
                                //     " hidden-xs hidden-sm hidden-md"
                                // );
                                $("#appRightSide").css("display", "none");
                                var folder = app.user.get("folders")[$(event.target).attr("id")]["name"];

                                thisComp.removeClassesActive();

                                Backbone.history.navigate("/mail/" + app.transform.from64str(folder), {
                                    trigger: true
                                });

                                app.user.set({
                                    currentFolder: app.transform.from64str(folder)
                                });

                                app.user.set({ resetSelectedItems: true });
                                app.user.set({ isDecryptingEmail: false });

                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                thisComp.props.changeFodlerId($(event.target).attr("id"));

                                $("#" + $(event.target).attr("id")).parents("li").addClass("active");

                                $("#mMiddlePanel").scrollTop(0);

                                app.layout.display("viewBox");
                            }
                        });
                    } else {
                        thisComp.removeClassesActive();
                        app.user.set({ resetSelectedItems: true });
                        app.user.set({ isDecryptingEmail: false });
                        app.globalF.resetCurrentMessage();
                        app.globalF.resetDraftMessage();
                        Backbone.history.navigate("/mail/" + app.user.get("currentFolder"), {
                            trigger: true
                        });
                        $("#emailListTable tr").removeClass("selected");
                        $("#sdasdasd").addClass("hidden");
                        $("#mMiddlePanelTop").removeClass(" hidden-xs hidden-sm hidden-md");
                        $("#mRightPanel").addClass("hidden-xs hidden-sm hidden-md");
                    }

                    break;
            }
        },
        notifyMe: function () {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {}
            // alert("This browser does not support desktop notification");


            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                    // If it's okay let's create a notification
                    console.log();
                }

                // Otherwise, we need to ask the user for permission
                else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then(function (permission) {
                            // If the user accepts, let's create a notification
                            if (permission === "granted") {}
                        });
                    }
        },

        handleClick: function (i) {
            switch (i) {
                case "composeEmail":
                    app.user.set({ isComposingEmail: true });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                    break;

                case "addFolder":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            Backbone.history.navigate("/settings/Folders", {
                                trigger: true
                            });
                        }
                    });

                    break;

                case "login":
                    console.log(createUserFormValidator);
                    break;
            }
        },
        boxSize: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "used_one" },
                    accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024 / 1024, 2),
                    " ",
                    "GB"
                ),
                " ",
                React.createElement(
                    "span",
                    null,
                    "\xA0/\xA0",
                    React.createElement(
                        "strong",
                        null,
                        app.user.get("userPlan")["planData"]["bSize"] / 1000,
                        " ",
                        "GB"
                    )
                )
            );
        },

        systemFolderIcon: function (_type) {
            if (_type === "Inbox") {
                return React.createElement("span", { className: "menu-icon inbox" });
            } else if (_type === "Sent") {
                return React.createElement("span", { className: "menu-icon send" });
            } else if (_type === "Draft") {
                return React.createElement("span", { className: "menu-icon draft" });
            } else if (_type === "Spam") {
                return React.createElement("span", { className: "menu-icon spam" });
            } else if (_type === "Trash") {
                return React.createElement("span", { className: "menu-icon trash" });
            } else {
                return React.createElement("span", { className: "menu-icon inbox" });
            }
        },

        unopenedBadge: function (unOpenedIndex, mainFoldersIndex, sentFolderId, trashFolderId) {
            if (unOpenedIndex == 0 || mainFoldersIndex == sentFolderId || mainFoldersIndex == trashFolderId) {
                return null;
            } else {
                return React.createElement(
                    "span",
                    { className: "number-badge" },
                    unOpenedIndex
                );
            }
        },

        render: function () {
            var st1 = {
                height: "10px",
                marginLeft: "4px",
                marginBottom: "2px"
            };
            var st2 = { marginTop: "3px" };
            var st3 = {
                width: accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024, 2) * 100 / app.user.get("userPlan")["planData"]["bSize"] + "%"
            };

            return React.createElement(
                "div",
                null,
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
                                {
                                    onClick: this.handleClick.bind(this, "composeEmail")
                                },
                                "New message"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "main-menu" },
                            React.createElement(
                                "ul",
                                { id: "folderul" },
                                Object.keys(this.state.mainFolders).map(function (folderData, i) {
                                    return React.createElement(
                                        "li",
                                        {
                                            key: "liM_" + this.state.mainFolders[folderData]["index"],
                                            className: `${ this.state.mainFolders[folderData]["role"] == "Inbox" ? "active" : "" }`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                key: "aM_" + i,
                                                id: this.state.mainFolders[folderData]["index"],
                                                onClick: this.handleChange.bind(this, "switchFolder"),
                                                "data-name": this.state.mainFolders[folderData]["name"]
                                            },
                                            this.systemFolderIcon(this.state.mainFolders[folderData]["name"]),
                                            this.state.mainFolders[folderData]["name"],
                                            " ",
                                            this.unopenedBadge(this.state.unopened[this.state.mainFolders[folderData]["index"]], this.state.mainFolders[folderData]["index"], app.user.get("systemFolders")["sentFolderId"], app.user.get("systemFolders")["trashFolderId"])
                                        )
                                    );
                                }, this)
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "folder-menu" },
                            React.createElement(
                                "div",
                                { className: "add-folder" },
                                React.createElement("button", {
                                    onClick: this.handleClick.bind(this, "addFolder")
                                })
                            ),
                            React.createElement(
                                "div",
                                {
                                    className: "accordion",
                                    id: "accordionExample"
                                },
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingOne"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapseOne",
                                                "aria-expanded": "true",
                                                "aria-controls": "collapseOne"
                                            },
                                            " ",
                                            "Folders",
                                            " "
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapseOne",
                                            className: "accordion-collapse collapse show",
                                            "aria-labelledby": "headingOne",
                                            "data-bs-parent": "#accordionExample"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "ul",
                                                { id: "folderulcustom" },
                                                this.state.customFolders.map(function (folderData, i) {
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            key: "li_" + folderData["index"],
                                                            className: " " + (folderData["role"] == "Inbox" ? "active" : this.state.unopened[folderData["index"]] == 0 ? "" : "active")
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                key: "a_" + i,
                                                                id: folderData["index"],
                                                                onClick: this.handleChange.bind(this, "switchFolder")
                                                            },
                                                            folderData["name"] + " " + (this.state.unopened[folderData["index"]] == 0 ? "" : '<span className="number-badge">' + this.state.unopened[folderData["index"]] + "</span>")
                                                        )
                                                    );
                                                }, this)
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "left-bottom" },
                        React.createElement(
                            "div",
                            { className: "left-cta" },
                            React.createElement(
                                "div",
                                { className: "call-to-action" },
                                React.createElement(
                                    "div",
                                    { className: "cta-title" },
                                    "Let's explore the full",
                                    React.createElement("br", null),
                                    "version of your mailbox"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "white-btn" },
                                    React.createElement(
                                        "a",
                                        { href: "#" },
                                        "Discover Pro"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "storage" },
                            React.createElement(
                                "div",
                                { className: "storage-count" },
                                this.boxSize()
                            ),
                            React.createElement(
                                "div",
                                { className: "storage-bar" },
                                React.createElement("span", { style: st3 })
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: "offcanvas offcanvas-start",
                        tabIndex: "-1",
                        id: "offcanvasLeft",
                        "aria-label": "offcanvasLeftLabel"
                    },
                    React.createElement(
                        "div",
                        { className: "offcanvas-header" },
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
                                })
                            )
                        ),
                        React.createElement("button", {
                            type: "button",
                            className: "btn-close text-reset",
                            "data-bs-dismiss": "offcanvas",
                            "aria-label": "Close"
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "offcanvas-body" },
                        React.createElement(
                            "div",
                            { className: "new-message-btn" },
                            React.createElement(
                                "button",
                                {
                                    onClick: this.handleClick.bind(this, "composeEmail")
                                },
                                "New message"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "main-menu" },
                            React.createElement(
                                "ul",
                                { id: "folderul" },
                                Object.keys(this.state.mainFolders).map(function (folderData, i) {
                                    return React.createElement(
                                        "li",
                                        {
                                            key: "liM_" + this.state.mainFolders[folderData]["index"],
                                            className: `${ this.state.mainFolders[folderData]["role"] == "Inbox" ? "active" : "" }`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                key: "aM_" + i,
                                                id: this.state.mainFolders[folderData]["index"],
                                                onClick: this.handleChange.bind(this, "switchFolder"),
                                                "data-name": this.state.mainFolders[folderData]["name"],
                                                "data-bs-dismiss": "offcanvas",
                                                "aria-label": "Close"
                                            },
                                            this.systemFolderIcon(this.state.mainFolders[folderData]["name"]),
                                            this.state.mainFolders[folderData]["name"],
                                            " ",
                                            this.unopenedBadge(this.state.unopened[this.state.mainFolders[folderData]["index"]], this.state.mainFolders[folderData]["index"], app.user.get("systemFolders")["sentFolderId"], app.user.get("systemFolders")["trashFolderId"])
                                        )
                                    );
                                }, this)
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "folder-menu" },
                            React.createElement(
                                "div",
                                { className: "add-folder" },
                                React.createElement("button", {
                                    onClick: this.handleClick.bind(this, "addFolder")
                                })
                            ),
                            React.createElement(
                                "div",
                                {
                                    className: "accordion",
                                    id: "accordionExample"
                                },
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingOne"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapseOne",
                                                "aria-expanded": "true",
                                                "aria-controls": "collapseOne"
                                            },
                                            " ",
                                            "Folders",
                                            " "
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapseOne",
                                            className: "accordion-collapse collapse show",
                                            "aria-labelledby": "headingOne",
                                            "data-bs-parent": "#accordionExample"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "ul",
                                                { id: "folderulcustom" },
                                                this.state.customFolders.map(function (folderData, i) {
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            key: "li_" + folderData["index"],
                                                            className: " " + (folderData["role"] == "Inbox" ? "active" : this.state.unopened[folderData["index"]] == 0 ? "" : "active")
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                key: "a_" + i,
                                                                id: folderData["index"],
                                                                onClick: this.handleChange.bind(this, "switchFolder"),
                                                                "data-bs-dismiss": "offcanvas",
                                                                "aria-label": "Close"
                                                            },
                                                            folderData["name"] + " " + (this.state.unopened[folderData["index"]] == 0 ? "" : '<span className="number-badge">' + this.state.unopened[folderData["index"]] + "</span>")
                                                        )
                                                    );
                                                }, this)
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "storage" },
                            React.createElement(
                                "div",
                                { className: "storage-count" },
                                this.boxSize()
                            ),
                            React.createElement(
                                "div",
                                { className: "storage-bar" },
                                React.createElement("span", { style: st3 })
                            )
                        )
                    )
                )
            );
        }
    });
});