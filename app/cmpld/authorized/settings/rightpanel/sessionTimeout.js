define(["react", "app", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, RightTop) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                sessionExpiration: app.user.get("sessionExpiration"),
                emfValidator: {},
                emNotValidator: {}
            };
        },
        /**
         *
         */
        componentDidMount: function () {},
        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleChange: function (i, event) {
            switch (i) {
                case "sessTime":
                    this.setState({
                        sessionExpiration: event.target.value
                    });
                    break;
            }
        },
        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleClick: function (i, event) {
            switch (i) {
                case "safeAccSett":
                    $("#settings-spinner").removeClass("d-none").addClass("d-block");
                    app.user.set({
                        sessionExpiration: this.state.sessionExpiration
                    });
                    app.userObjects.updateObjects("userProfile", "", function (response) {
                        if (response === "success") {} else if (response === "failed") {} else if (response === "nothing") {}
                    });
                    $("#settings-spinner").removeClass("d-block").addClass("d-none");

                    break;
            }
        },
        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle session-timeout" },
                    React.createElement(
                        "div",
                        { className: "panel panel-default" },
                        React.createElement(
                            "div",
                            { className: "middle-top" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    { role: "presentation" },
                                    React.createElement(
                                        "h2",
                                        null,
                                        "Session Timeout"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "middle-content" },
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "div",
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "col-12" },
                                        React.createElement(
                                            "div",
                                            { className: "form-group" },
                                            React.createElement(
                                                "select",
                                                {
                                                    className: "form-select",
                                                    onChange: this.handleChange.bind(this, "sessTime"),
                                                    value: this.state.sessionExpiration
                                                },
                                                React.createElement(
                                                    "option",
                                                    { value: "0", disabled: true },
                                                    "Select Session Time Out"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "-1" },
                                                    "Disable Timeout"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "600" },
                                                    "10 Minutes"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "1800" },
                                                    "30 Minutes"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "3600" },
                                                    "1 Hour"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "10800" },
                                                    "3 Hours"
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section-bottom" },
                                React.createElement(
                                    "div",
                                    { className: "btn-row" },
                                    React.createElement(
                                        "button",
                                        {
                                            type: "button",
                                            className: "btn-blue fixed-width-btn",
                                            onClick: this.handleClick.bind(this, "safeAccSett")
                                        },
                                        "Save"
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right layout" },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            { className: "panel-heading" },
                            React.createElement(
                                "h2",
                                { className: "panel-title personal-info-title" },
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Display Name"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda. Possit menandri persequeris no has, cibo deleniti euripidis usu ei. Vel ea elit mentitum tacimates, ut omnis scribentur vis. Pri id dico consetetur repudiandae, vix no cibo quando offendit. At nam nibh deserunt, his at facer tantas, dicit quando mandamus his eu. Eros ocurreret has id, altera verterem molestiae ad eum. Ea saepe discere delicatissimi sea, ius ne dolor timeam epicuri, ne sea quod civibus convenire."
                            )
                        )
                    )
                )
            );
        }
    });
});