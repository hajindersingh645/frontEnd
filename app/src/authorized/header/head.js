define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        render: function () {
            return (
                <div>
                    <div className="position-fixed  end-0 toast-index show">
                        <div
                            className="toast align-items-center text-white bg-primary border-0"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                            autohide="true"
                            data-bs-delay="1500"
                        >
                            <div className="d-flex">
                                <div className="toast-body">
                                    {" "}
                                    <span className="toast-icon"></span>
                                    <div>Email Copy </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <header>
                        <div className="logo-2">
                            <a href="#">
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
                                        Sepide Moqadasi{" "}
                                        <span className="arrow"></span>
                                        <br />
                                        <span className="user-email">
                                            Sepide_moqadasi@y..
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
                                            >
                                                Copy my email address
                                            </button>
                                        </li>
                                        <li>
                                            <a href="#" className="logout-icon">
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
