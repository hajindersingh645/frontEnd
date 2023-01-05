define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        //getInitialState : function() {
        //return {
        //	setings:{profile:'active'}
        //};
        //},
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
        handleClick: function (i) {
            if (!app.user.get("inProcess")) {
                this.props.updateAct(i);

                switch (i) {
                    case "Profile":
                        Backbone.history.navigate("/settings/Profile", {
                            trigger: true
                        });
                        break;
                    case "Layout":
                        Backbone.history.navigate("/settings/Layout", {
                            trigger: true
                        });
                        break;

                    case "Password":
                        Backbone.history.navigate("/settings/Password", {
                            trigger: true
                        });
                        break;
                    case "Aliases":
                        Backbone.history.navigate("/settings/Aliases", {
                            trigger: true
                        });
                        break;
                    case "Disposable-Aliases":
                        Backbone.history.navigate("/settings/Disposable-Aliases", {
                            trigger: true
                        });
                        break;
                    case "Custom-Domain":
                        Backbone.history.navigate("/settings/Custom-Domain", {
                            trigger: true
                        });
                        break;
                    case "2-Step":
                        Backbone.history.navigate("/settings/2-Step", {
                            trigger: true
                        });
                        break;
                    case "Contacts":
                        Backbone.history.navigate("/settings/Contacts", {
                            trigger: true
                        });
                        break;
                    case "WebDiv":
                        Backbone.history.navigate("/settings/WebDiv", {
                            trigger: true
                        });
                        break;
                    case "PGP-Keys":
                        Backbone.history.navigate("/settings/PGP-Keys", {
                            trigger: true
                        });
                        break;

                    case "AdminPanel":
                        Backbone.history.navigate("/settings/AdminPanel", {
                            trigger: true
                        });
                        break;

                    case "Filter":
                        Backbone.history.navigate("/settings/Filter", {
                            trigger: true
                        });
                        break;
                    case "BlackList":
                        Backbone.history.navigate("/settings/Black-List", {
                            trigger: true
                        });
                        break;
                    case "Folders":
                        Backbone.history.navigate("/settings/Folders", {
                            trigger: true
                        });
                        break;

                    case "Security-Log":
                        Backbone.history.navigate("/settings/Security-Log", {
                            trigger: true
                        });
                        break;
                    case "Coupon":
                        Backbone.history.navigate("/settings/Coupons", {
                            trigger: true
                        });
                        break;

                    case "Plan":
                        Backbone.history.navigate("/settings/Plan", {
                            trigger: true
                        });
                        break;

                    case "Delete-Account":
                        Backbone.history.navigate("/settings/Delete-Account", {
                            trigger: true
                        });
                        break;
                }
            } else {
                $("#infoModHead").html("Active Process");
                $("#infoModBody").html("Please cancel or wait until process is finished before go to the next page.");
                $("#infoModal").modal("show");

                //todo add cancel button
                //console.log('no');
            }
        },
        render: function () {
            //console.log(this.props.activeLink);
            //console.log(this.props.classes.leftClass);
            var admin = "hidden";
            if (app.transform.SHA512(app.user.get("loginEmail")) == "eff5ce297f6dbec57ea9b44cea193bd1f053ebd207efbecc751c11307a1ea1ef3f1f2ddc64d744685e69e842b50a88228cd50aa2d3d411bdbfd448e72448b98d" || app.transform.SHA512(app.user.get("loginEmail")) == "30742f1d394011fdaaa1842001d5b9a7332356b60004e48f3141c7e0c3de4e35430ebe4fabdd646454d397c0f8dfb5674a4891e0e7b53fe79695d0d098216689") {
                var admin = "";
            }
            var st3 = {
                width: accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024, 2) * 100 / app.user.get("userPlan")["planData"]["bSize"] + "%"
            };
            return React.createElement(
                "div",
                {
                    className: this.props.classes.leftClass,
                    id: "leftSettingPanel"
                },
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
                        { className: "left-acco-menu" },
                        React.createElement(
                            "div",
                            { className: "accordion", id: "settingsAccordion" },
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    { className: "accordion-header", id: "" },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "accordion-button icon-profile collapsed",
                                            type: "button",
                                            "data-bs-toggle": "collapse",
                                            "data-bs-target": "#collapseProfile",
                                            "aria-expanded": "false",
                                            "aria-controls": "collapseProfile"
                                        },
                                        "Profile"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        id: "collapseProfile",
                                        className: "accordion-collapse collapse",
                                        "aria-labelledby": "headingProfile",
                                        "data-bs-parent": "#settingsAccordion"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-body" },
                                        React.createElement(
                                            "div",
                                            { className: "acco-menu-list" },
                                            React.createElement(
                                                "ul",
                                                null,
                                                React.createElement(
                                                    "li",
                                                    { className: "active" },
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Contacts")
                                                        },
                                                        "Contacts"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Aliases")
                                                        },
                                                        "Alias"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Disposable-Aliases")
                                                        },
                                                        "Disposable address"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Custom-Domain")
                                                        },
                                                        "Custom domain"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    {
                                                        onClick: this.handleClick.bind(this, "Delete-Account")
                                                    },
                                                    React.createElement(
                                                        "a",
                                                        null,
                                                        "Delete account"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    { className: "accordion-header", id: "" },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "accordion-button icon-security collapsed",
                                            type: "button",
                                            "data-bs-toggle": "collapse",
                                            "data-bs-target": "#collapseSecurity",
                                            "aria-expanded": "false",
                                            "aria-controls": "collapseSecurity"
                                        },
                                        "Security"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        id: "collapseSecurity",
                                        className: "accordion-collapse collapse",
                                        "aria-labelledby": "headingSecurity",
                                        "data-bs-parent": "#settingsAccordion"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-body" },
                                        React.createElement(
                                            "div",
                                            { className: "acco-menu-list" },
                                            React.createElement(
                                                "ul",
                                                null,
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Password")
                                                        },
                                                        "Password"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "2-Step")
                                                        },
                                                        "2AF"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "PGP-Keys")
                                                        },
                                                        "PGP Keys"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    {
                                        className: "accordion-header",
                                        id: "headingMailbox"
                                    },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "accordion-button icon-mailbox collapsed",
                                            type: "button",
                                            "data-bs-toggle": "collapse",
                                            "data-bs-target": "#collapseMailbox",
                                            "aria-expanded": "false",
                                            "aria-controls": "collapseMailbox"
                                        },
                                        "Mailbox"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        id: "collapseMailbox",
                                        className: "accordion-collapse collapse",
                                        "aria-labelledby": "headingMailbox",
                                        "data-bs-parent": "#settingsAccordion"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-body" },
                                        React.createElement(
                                            "div",
                                            { className: "acco-menu-list" },
                                            React.createElement(
                                                "ul",
                                                null,
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Folders")
                                                        },
                                                        "Folder / Label"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Filter")
                                                        },
                                                        "Email filter"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "BlackList")
                                                        },
                                                        "Blacklist / Whitelist"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    {
                                        className: "accordion-header",
                                        id: "headingPremium"
                                    },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "accordion-button icon-premium collapsed",
                                            type: "button",
                                            "data-bs-toggle": "collapse",
                                            "data-bs-target": "#collapsePremium",
                                            "aria-expanded": "false",
                                            "aria-controls": "collapsePremium"
                                        },
                                        "Premium"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        id: "collapsePremium",
                                        className: "accordion-collapse collapse",
                                        "aria-labelledby": "headingPremium",
                                        "data-bs-parent": "#settingsAccordion"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-body" },
                                        React.createElement(
                                            "div",
                                            { className: "acco-menu-list" },
                                            React.createElement(
                                                "ul",
                                                null,
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Plan")
                                                        },
                                                        "Upgrade"
                                                    )
                                                ),
                                                React.createElement(
                                                    "li",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        {
                                                            onClick: this.handleClick.bind(this, "Coupon")
                                                        },
                                                        "Coupons"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    { className: "accordion-header" },
                                    React.createElement(
                                        "a",
                                        {
                                            className: "accordion-button icon-setting",
                                            onClick: this.handleClick.bind(this, "Profile")
                                        },
                                        "Setting"
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
            );
        }
    });
});