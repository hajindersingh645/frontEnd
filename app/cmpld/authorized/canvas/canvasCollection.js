define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        render: function () {
            return React.createElement(
                "div",
                {
                    className: "offcanvas offcanvas-end",
                    tabIndex: "-1",
                    id: "offcanvasRight",
                    "aria-label": "offcanvasRightLabel"
                },
                React.createElement(
                    "div",
                    { className: "offcanvas-header" },
                    React.createElement(
                        "div",
                        { className: "user-name-side-menu" },
                        " ",
                        React.createElement("img", { src: "images/user.jpg", alt: "" }),
                        " Sepide Moqadasi",
                        React.createElement("br", null),
                        React.createElement(
                            "span",
                            { className: "user-email" },
                            "Sepide_moqadasi@y.."
                        ),
                        " "
                    ),
                    React.createElement(
                        "div",
                        { className: "user-side-menu" },
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "button",
                                    {
                                        className: "copy-icon",
                                        id: "email-copy-2"
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
                        { className: "main-menu" },
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                { className: "active" },
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("span", { className: "menu-icon inbox" }),
                                    " ",
                                    "Inbox",
                                    " ",
                                    React.createElement(
                                        "span",
                                        { className: "number-badge" },
                                        "235"
                                    )
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("span", { className: "menu-icon send" }),
                                    " ",
                                    "Send"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("span", { className: "menu-icon draft" }),
                                    " ",
                                    "Draft"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("span", { className: "menu-icon spam" }),
                                    " ",
                                    "Spam"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("span", { className: "menu-icon trash" }),
                                    " ",
                                    "Trash"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "folder-menu" },
                        React.createElement(
                            "div",
                            { className: "add-folder" },
                            React.createElement("button", null)
                        ),
                        React.createElement(
                            "div",
                            { className: "accordion", id: "folders" },
                            React.createElement(
                                "div",
                                { className: "accordion-item" },
                                React.createElement(
                                    "h2",
                                    {
                                        className: "accordion-header",
                                        id: "headingtwo"
                                    },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "accordion-button",
                                            type: "button",
                                            "data-bs-toggle": "collapse",
                                            "data-bs-target": "#collapseTwo",
                                            "aria-expanded": "true",
                                            "aria-controls": "collapseTwo"
                                        },
                                        " ",
                                        "Folders",
                                        " "
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        id: "collapseTwo",
                                        className: "accordion-collapse collapse show",
                                        "aria-labelledby": "headingTwo",
                                        "data-bs-parent": "#folders"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-body" },
                                        React.createElement(
                                            "ul",
                                            null,
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "a",
                                                    { href: "#" },
                                                    "Dribbble",
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { className: "number-badge" },
                                                        "51"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "a",
                                                    { href: "#" },
                                                    "Google Ads",
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { className: "number-badge" },
                                                        "1241"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "side-menu-cta" },
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
                        { className: "side-menu" },
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    "Menu item 1"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    "Menu item 2"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    "Menu item 3"
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
                            "0.02 GB ",
                            React.createElement(
                                "span",
                                null,
                                "/ 0.05 GB"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "storage-bar" },
                            React.createElement("span", null)
                        )
                    )
                )
            );
        }
    });
});