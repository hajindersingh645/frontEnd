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
                        trigger: true,
                    });
                    break;
            }
        },
        render: function () {
            return (
                <div className="setting-right-top">
                    <div className="top-data">
                        <div className="icon-notification">
                            <button>
                                <span>12</span>
                            </button>
                        </div>
                        <div className="back-to-inbox-link">
                            <a
                                onClick={this.handleClick.bind(
                                    this,
                                    "back-to-inbox"
                                )}
                            >
                                Back to inbox
                            </a>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
