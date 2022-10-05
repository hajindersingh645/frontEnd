define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
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
                            "Sepide_moqadasi@yahoo.co.in"
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
                                        id: "email-copy-2",
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
                React.createElement("div", { className: "offcanvas-body" })
            );
        }
    });
});