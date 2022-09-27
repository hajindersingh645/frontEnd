define(["react"], function (React) {
    return React.createClass({
        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "reportBug":
                    //requestInvitiation()
                    console.log("ffff");

                    break;
                case "enterReportBug":
                    if (event.keyCode == 13) {
                        //requestInvitiation();
                    }
                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return (
                <div>
                    <h1>Contact us</h1>
                    <div className="form-section">
                        <form
                            className="registration-form smart-form"
                            id="report-form"
                            action="api/submitBug"
                            method="POST"
                            target="_blank"
                        >
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <input
                                            className="hidden"
                                            type="name"
                                            name="name"
                                            placeholder="name"
                                            id="hname"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Please provide email address we can use to contact you"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            name="comment"
                                            placeholder="Please explain problem (1000 max)"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <button
                                        className="btn-blue fixed-width"
                                        type="submit"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },
    });
});
