define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "position-fixed  end-0 toast-index show" },
                    React.createElement(
                        "div",
                        {
                            className: "toast align-items-center text-white bg-primary border-0",
                            role: "alert",
                            "aria-live": "assertive",
                            "aria-atomic": "true",
                            autohide: "true",
                            "data-bs-delay": "1500"
                        },
                        React.createElement(
                            "div",
                            { className: "d-flex" },
                            React.createElement(
                                "div",
                                { className: "toast-body" },
                                " ",
                                React.createElement("span", { className: "toast-icon" }),
                                React.createElement(
                                    "div",
                                    null,
                                    "Email Copy "
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
                                            { href: "#", className: "logout-icon" },
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