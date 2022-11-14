define(["react", "app"], function (React, app) {
    return React.createClass({
        componentWillUnmount: function () {},
        componentDidMount: function () {
            app.userObjects.on(
                "change",
                function () {
                    this.forceUpdate();
                }.bind(this)
            );
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
            return (
                <div
                    className="modal fade"
                    id="userObjSync"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header p-4">
                                <h4 className="modal-title" id="userSyncTitle">
                                    Fetching User Data
                                </h4>
                            </div>
                            <div className="modal-body p-4">
                                <div className="form-group">
                                    <div
                                        className="bs-example text-center"
                                        data-example-id="progress-bar-with-label"
                                    >
                                        <iframe
                                            src="/loaders/loading.html"
                                            className="loadingAnimationIframe"
                                        ></iframe>
                                        <div>
                                            {app.userObjects.get(
                                                "modalpercentage"
                                            )}
                                            %
                                        </div>
                                        {app.userObjects.get("modalText")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
