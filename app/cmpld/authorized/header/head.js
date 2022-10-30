define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                userEmail: ""
            };
        },
        handleCopyEmail: function () {
            const _this = this;
            if (!navigator.clipboard) {} else {
                const emailElement = document.getElementsByClassName("user-email")[0];
                navigator.clipboard.writeText(emailElement.innerHTML).then(function () {
                    $("#email-copy").removeClass("hide").addClass("show");
                    _this.hideCopyEmailNotification();
                });
            }
        },
        hideCopyEmailNotification: function () {
            setTimeout(function () {
                $("#email-copy").removeClass("show").addClass("hide");
            }, 1500);
        },
        handleClick: function (i) {
            switch (i) {
                case "logOut":
                    app.auth.logout();
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "position-fixed end-0 toast-index show" },
                    React.createElement(
                        "div",
                        {
                            className: "toast align-items-center text-white bg-primary border-0 fade hide",
                            role: "alert",
                            "aria-live": "assertive",
                            "aria-atomic": "true",
                            autohide: "true",
                            "data-bs-delay": "1500",
                            id: "email-copy"
                        },
                        React.createElement(
                            "div",
                            { className: "d-flex" },
                            React.createElement(
                                "div",
                                { className: "toast-body" },
                                React.createElement("span", { className: "toast-icon" }),
                                React.createElement(
                                    "div",
                                    { className: "d-inline-block" },
                                    "Email Copy"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "header",
                    null,
                    React.createElement(
                        "div",
                        { className: "logo-2" },
                        React.createElement(
                            "a",
                            { href: "#" },
                            React.createElement(
                                "div",
                                { className: "menu-icon on-left-side" },
                                React.createElement("button", {
                                    "data-bs-toggle": "offcanvas",
                                    "data-bs-target": "#offcanvasLeft",
                                    "aria-controls": "offcanvasLeft"
                                })
                            ),
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
                                    React.createElement(
                                        "div",
                                        { className: "user-avatar" },
                                        React.createElement(
                                            "label",
                                            { className: "user-letter" },
                                            app.user.get("email").charAt(0)
                                        )
                                    ),
                                    " ",
                                    app.user.get("displayName") !== "" ? app.user.get("displayName") : "Me",
                                    " ",
                                    React.createElement("span", { className: "arrow" }),
                                    React.createElement("br", null),
                                    React.createElement(
                                        "span",
                                        { className: "user-email" },
                                        app.user.get("email")
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
                                                id: "email-copy",
                                                onClick: this.handleCopyEmail.bind(this)
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
                                                onClick: this.handleClick.bind(this, "logOut"),
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
                )
            );
        }
    });
});