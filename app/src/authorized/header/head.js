define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                userEmail: "",
            };
        },
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
        render: function () {
            return (
                <div>
                    <div className="position-fixed end-0 toast-index show">
                        <div
                            className="toast align-items-center text-white bg-primary border-0 fade hide"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                            autohide="true"
                            data-bs-delay="1500"
                            id="email-copy"
                        >
                            <div className="d-flex">
                                <div className="toast-body">
                                    <span className="toast-icon"></span>
                                    <div className="d-inline-block">
                                        Email Copy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <header>
                        <div className="logo-2">
                            <a href="#">
                                <div className="menu-icon on-left-side">
                                    <button
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasLeft"
                                        aria-controls="offcanvasLeft"
                                    ></button>
                                </div>
                                <img
                                    src="images/logo.svg"
                                    alt=""
                                    className="light-theme"
                                />{" "}
                                <img
                                    src="images/logo-white.svg"
                                    alt=""
                                    className="dark-theme"
                                />
                            </a>
                        </div>
                        <div className="right-top-data">
                            <div className="icon-notification">
                                <button>
                                    <span></span>
                                </button>
                            </div>
                            <div className="user-dropdown">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="user-dropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {" "}
                                        <img
                                            src="images/user.jpg"
                                            alt=""
                                        />{" "}
                                        {"Me"} <span className="arrow"></span>
                                        <br />
                                        <span className="user-email">
                                            {app.user.get("email")}
                                        </span>{" "}
                                    </button>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="user-dropdown"
                                    >
                                        <li>
                                            <button
                                                className="copy-icon"
                                                id="email-copy"
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
                            </div>
                            <div className="menu-icon">
                                <button
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasRight"
                                    aria-controls="offcanvasRight"
                                ></button>
                            </div>
                        </div>
                    </header>
                    <div className="mobile-search">
                        <input type="search" placeholder="Search..." />
                    </div>
                </div>
            );
        },
    });
});
