define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        handleCopyEmail: function () {
            const _this = this;
            if (!navigator.clipboard) {
            } else {
                const emailElement =
                    document.getElementsByClassName("user-email")[0];
                navigator.clipboard
                    .writeText(emailElement.innerHTML)
                    .then(function () {
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
        handleClick: function (i) {
            switch (i) {
                case "logOut":
                    app.auth.logout();
                    break;
            }
        },
        componentDidMount: function () {
            // console.log(app.user.get("showDisplayName"));
            // console.log(app.user.get("displayName"));
        },
        render: function () {
            return (
                <div
                    className="offcanvas offcanvas-end"
                    tabIndex="-1"
                    id="offcanvasRight"
                    aria-label="offcanvasRightLabel"
                >
                    <div className="offcanvas-header">
                        <div className="user-name-side-menu">
                            {" "}
                            <img src="images/user.jpg" alt="" />{" "}
                            {app.user.get("displayName")}
                            <br />
                            <span className="user-email">
                                {app.user.get("email")}
                            </span>{" "}
                        </div>
                        <div className="user-side-menu">
                            <ul>
                                <li>
                                    <button
                                        className="copy-icon"
                                        id="email-copy-2"
                                        onClick={this.handleCopyEmail.bind(
                                            this
                                        )}
                                    >
                                        Copy my email address
                                    </button>
                                </li>
                                <li>
                                    <a
                                        onClick={this.handleClick.bind(
                                            this,
                                            "logOut"
                                        )}
                                        className="logout-icon"
                                    >
                                        Log out
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body"></div>
                </div>
            );
        },
    });
});
