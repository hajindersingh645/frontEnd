define(["react", "app"], function (React, app) {
    "use strict";
    return React.createClass({
        render: function () {
            return (
                <div className="setting-right-top">
                    <div className="top-data">
                        <div className="icon-notification">
                            <button>
                                <span></span>
                            </button>
                        </div>
                        <div className="back-to-inbox-link">
                            <a>Back to inbox</a>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
