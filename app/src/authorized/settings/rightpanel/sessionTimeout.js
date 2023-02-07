define([
    "react",
    "app",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, RightTop) {
    "use strict";
    return React.createClass({
        getInitialState: function () {
            return {
                sessionExpiration: app.user.get("sessionExpiration"),
                emfValidator: {},
                emNotValidator: {},
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
                        sessionExpiration: event.target.value,
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
                    $("#settings-spinner")
                        .removeClass("d-none")
                        .addClass("d-block");
                    app.user.set({
                        sessionExpiration: this.state.sessionExpiration,
                    });
                    app.userObjects.updateObjects(
                        "userProfile",
                        "",
                        function (response) {
                            if (response === "success") {
                            } else if (response === "failed") {
                            } else if (response === "nothing") {
                            }
                        }
                    );
                    $("#settings-spinner")
                        .removeClass("d-block")
                        .addClass("d-none");

                    break;
            }
        },
        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle session-timeout">
                        <div className="panel panel-default">
                            <div className="middle-top">
                                <ul>
                                    <li role="presentation">
                                        <h2>Session Timeout</h2>
                                    </li>
                                </ul>
                            </div>
                            <div className="middle-content">
                                <div className="form-section">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <select
                                                    className="form-select"
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "sessTime"
                                                    )}
                                                    value={
                                                        this.state
                                                            .sessionExpiration
                                                    }
                                                >
                                                    <option value="0" disabled>
                                                        Select Session Time Out
                                                    </option>
                                                    <option value="-1">
                                                        Disable Timeout
                                                    </option>
                                                    <option value="600">
                                                        10 Minutes
                                                    </option>
                                                    <option value="1800">
                                                        30 Minutes
                                                    </option>
                                                    <option value="3600">
                                                        1 Hour
                                                    </option>
                                                    <option value="10800">
                                                        3 Hours
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-section-bottom">
                                    <div className="btn-row">
                                        <button
                                            type="button"
                                            className="btn-blue fixed-width-btn"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "safeAccSett"
                                            )}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-right layout">
                        <RightTop />
                        <div className="setting-right-data">
                            <div className="panel-heading">
                                <h2 className="panel-title personal-info-title">
                                    Help
                                </h2>
                            </div>

                            <div className="panel-body">
                                <h3>Display Name</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, graece ridens
                                    insolens ne has. Per et vide equidem, sed
                                    tacimates patrioque suscipiantur no. No sea
                                    delectus percipit vituperata. Ad vim fierent
                                    vulputate honestatis. At utamur malorum
                                    incorrupte vel, pri recteque iudicabit cu.
                                    Id nonumy veritus nominati eos, ut mea
                                    oratio impetus expetenda. Possit menandri
                                    persequeris no has, cibo deleniti euripidis
                                    usu ei. Vel ea elit mentitum tacimates, ut
                                    omnis scribentur vis. Pri id dico consetetur
                                    repudiandae, vix no cibo quando offendit. At
                                    nam nibh deserunt, his at facer tantas,
                                    dicit quando mandamus his eu. Eros ocurreret
                                    has id, altera verterem molestiae ad eum. Ea
                                    saepe discere delicatissimi sea, ius ne
                                    dolor timeam epicuri, ne sea quod civibus
                                    convenire.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
