define([
    "react",
    "app",
    "xss",
    "cmpld/authorized/mailbox/mailboxCollection",
    "cmpld/authorized/settings/settingsCollection",
    "cmpld/authorized/updates/updateVersion1",
    "cmpld/modals/secondPass",
    "cmpld/modals/syncUserObj",
    "cmpld/modals/logOutForce",
    "cmpld/modals/infoPop",
    "cmpld/modals/askForPass",
    "cmpld/modals/dialogPop",
    "cmpld/modals/dontInterrupt",
], function (
    React,
    app,
    xss,
    MailboxCollection,
    SettingsCollection,
    UpdateCollection,
    SecondPass,
    SyncUserObj,
    LogOutForce,
    InfoPop,
    AskForPass,
    DialogPop,
    DontInterrupt
) {
    return React.createClass({
        getInitialState: function () {
            return {
                dfd: "",
                foderId: "",
            };
        },
        componentDidMount: function () {
            var thisMod = this;

            if (!app.user.get("userLogedIn")) {
                app.auth.logout();
            } else {
                $("head").append(
                    $('<link rel="stylesheet" type="text/css" />').attr(
                        "href",
                        "/js/Plugins/quill/quill.snow.css"
                    )
                );
                $("head").append(
                    $('<link rel="stylesheet" type="text/css" />').attr(
                        "href",
                        "/css/select2/select2.css"
                    )
                );
                $(
                    'link[rel=stylesheet][href="/css/style_frontend.css"]'
                ).remove();
                $("head").append(
                    $('<link rel="stylesheet" type="text/css" />').attr(
                        "href",
                        "/css/style_backend.css"
                    )
                );
                $("head").append(
                    $('<link rel="stylesheet" type="text/css" />').attr(
                        "href",
                        "/css/style_backend_over.css"
                    )
                );

                if (app.sessionData.get("sessionReady")) {
                    thisMod.setState({ dfd: "solved" });
                } else {
                    $("#userObjSync").addClass("show d-block");
                    $("#overlay, #loading-skeleton")
                        .removeClass("d-none")
                        .addClass("d-block");
                    $("#userObjSync").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: true,
                    });

                    app.userObjects.startSession(function () {
                        $("#userObjSync").removeClass("show d-block");
                        $("#overlay, #loading-skeleton")
                            .removeClass("d-block")
                            .addClass("d-none");
                        $("#userObjSync").modal("hide");
                        app.sessionData.set({ sessionReady: true });
                        thisMod.setState({ dfd: "solved" });
                    });
                }
            }
        },
        handleClick: function (i) {
            switch (i) {
                case "resetTimer":
                    // app.user.startTimer();
                    break;
            }
        },
        changeFodlerId: function (foderId) {
            this.setState({
                folder: foderId,
            });
        },
        componentWillUnmount: function () {},

        updateValue: function (modifiedValue) {
            this.setState(modifiedValue);
        },

        render: function () {
            var body = "";
            var page = this.props.page;

            if (this.state.dfd == "solved") {
                if (page == "mailBox" && app.user.get("profileVersion") > 1) {
                    body = (
                        <MailboxCollection
                            pp={this.props.folder}
                            activePage={this.state.folder}
                            changeFodlerId={this.changeFodlerId}
                            folderId={this.state.folder}
                            updateValue={this.updateValue}
                        />
                    );
                } else if (
                    page == "settings" &&
                    app.user.get("profileVersion") > 1
                ) {
                    body = (
                        <SettingsCollection
                            rightPanel={this.props.rightPanel}
                            activePage={this.props.activePage}
                        />
                    );
                } else if (
                    page == "settings" &&
                    app.user.get("profileVersion") == 1 &&
                    this.props.activePage == "updateVersion1"
                ) {
                    body = (
                        <SettingsCollection
                            rightPanel={this.props.rightPanel}
                            activePage="updateVersion1"
                        />
                    );
                } else if (app.user.get("profileVersion") == 1) {
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true,
                    });
                }
            }

            return (
                <div className="mailBody">
                    {body}
                    <div id="overlay" className="d-none"></div>
                    <div
                        id="loading-skeleton"
                        className="loading-skeleton d-none"
                    >
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
                                                <a
                                                    href="#"
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
                        <div className="left-side">
                            <div className="left-container">
                                <div className="logo">
                                    <a href="#">
                                        <img
                                            src="images/logo.svg"
                                            alt=""
                                            className="light-theme-logo"
                                        />{" "}
                                        <img
                                            src="images/logo-white.svg"
                                            alt=""
                                            className="dark-theme-logo"
                                        />
                                    </a>
                                </div>
                                <div className="new-message-btn">
                                    <button>New message</button>
                                </div>
                                <div className="main-menu">
                                    <ul>
                                        <li>
                                            {" "}
                                            <div className="skeleton __folder"></div>
                                        </li>
                                        <li>
                                            {" "}
                                            <div className="skeleton __folder"></div>
                                        </li>
                                        <li>
                                            {" "}
                                            <div className="skeleton __folder"></div>
                                        </li>
                                        <li>
                                            {" "}
                                            <div className="skeleton __folder"></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="middle-section">
                            <div className="middle-top">
                                <div className="desktop-search">
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                    />
                                </div>
                                <div className="info-row">
                                    <div className="all-check">
                                        <label className="container-checkbox">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>{" "}
                                        </label>
                                    </div>
                                    <div className="arrow-btn">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-secondary dropdown-toggle"
                                                type="button"
                                                id="mail-sort"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                        </div>
                                    </div>
                                    <div className="info-row-right">
                                        <div className="referesh-btn">
                                            <button
                                                id="referesh-btn"
                                                className="icon-btn"
                                            >
                                                {" "}
                                                <i></i>{" "}
                                            </button>
                                        </div>
                                        <div className="ellipsis-dropdown">
                                            <button></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle-content">
                                <div className="inbox-list">
                                    <ul>
                                        <li>
                                            <div className="skeleton __box"></div>
                                        </li>
                                        <li>
                                            <div className="skeleton __box"></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="email-conetent-wrp">
                                <div className="email-content-top">
                                    <div className="email-content-top-left">
                                        <div className="word color-1">W</div>
                                        <div className="sender-name skeleton __sender"></div>
                                    </div>
                                </div>
                                <div className="mail-data">
                                    <div className="skeleton __mail_content"></div>
                                    <div className="skeleton __mail_content"></div>
                                    <div className="skeleton __mail_content"></div>
                                    <div className="skeleton __mail_content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SyncUserObj />
                </div>
            );
        },
    });
});
