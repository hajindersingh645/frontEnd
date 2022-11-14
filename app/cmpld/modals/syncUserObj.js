define(["react", "app"], function (React, app) {
    return React.createClass({
        componentWillUnmount: function () {},
        componentDidMount: function () {
            app.userObjects.on("change", function () {
                this.forceUpdate();
            }.bind(this));
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {},

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return React.createElement(
                "div",
                {
                    className: "modal fade",
                    id: "userObjSync",
                    "data-bs-backdrop": "static",
                    "data-bs-keyboard": "false",
                    tabindex: "-1",
                    "aria-labelledby": "staticBackdropLabel",
                    "aria-hidden": "true"
                },
                React.createElement(
                    "div",
                    { className: "modal-dialog modal-dialog-centered" },
                    React.createElement(
                        "div",
                        { className: "modal-content" },
                        React.createElement(
                            "div",
                            { className: "modal-header p-4" },
                            React.createElement(
                                "h4",
                                { className: "modal-title", id: "userSyncTitle" },
                                "Fetching User Data"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "modal-body p-4" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "div",
                                    {
                                        className: "bs-example text-center",
                                        "data-example-id": "progress-bar-with-label"
                                    },
                                    React.createElement("iframe", {
                                        src: "/loaders/loading.html",
                                        className: "loadingAnimationIframe"
                                    }),
                                    React.createElement(
                                        "div",
                                        null,
                                        app.userObjects.get("modalpercentage"),
                                        "%"
                                    ),
                                    app.userObjects.get("modalText")
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});