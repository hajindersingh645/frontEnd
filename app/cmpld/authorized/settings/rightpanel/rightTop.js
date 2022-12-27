define(["react", "app"], function (React, app) {
    "use strict";

    return React.createClass({
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
                            React.createElement("span", null)
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "back-to-inbox-link" },
                        React.createElement(
                            "a",
                            null,
                            "Back to inbox"
                        )
                    )
                )
            );
        }
    });
});