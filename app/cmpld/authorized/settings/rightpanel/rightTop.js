define(["react", "app"], function (React, app) {
    "use strict";

    return React.createClass({
        handleClick: function (action, event) {
            switch (action) {
                case "back-to-inbox":
                    app.user.set({ isComposingEmail: false });
                    app.user.set({ isDraftOpened: false });
                    app.user.set({ isDecryptingEmail: false });
                    Backbone.history.navigate("/mail/Inbox", {
                        trigger: true
                    });
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "setting-right-top" },
                React.createElement(
                    "div",
                    { className: "top-data" },
                    React.createElement(
                        "div",
                        { className: "icon-notification" },
                        React.createElement(
                            "button",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "12"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "back-to-inbox-link" },
                        React.createElement(
                            "a",
                            {
                                onClick: this.handleClick.bind(this, "back-to-inbox")
                            },
                            "Back to inbox"
                        )
                    )
                )
            );
        }
    });
});