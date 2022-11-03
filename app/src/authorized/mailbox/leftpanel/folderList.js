define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                mainFolders: app.globalF.getMainFolderList(),
                customFolders: app.globalF.getCustomFolderList(),
                moveFolderMain: [],
                moveFolderCust: [],
                unopened: app.user.get("unopenedEmails"),
            };
        },
        componentDidMount: function () {
            var thisComp = this;

            thisComp.props.changeFodlerId(
                app.user.get("systemFolders")["inboxFolderId"]
            );

            thisComp.notifyMe();

            app.user.on("change:unopenedEmails", function () {
                thisComp.updateUnopened();
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:unopenedEmails");
            app.user.off("change:currentMessageView", function () {});
        },

        updateUnopened: function () {
            var thisComp = this;
            this.setState({
                unopened: app.user.get("unopenedEmails"),
            });
        },

        removeClassesActive: function () {
            $("#folderul > li").removeClass("active");
            $("#folderulcustom > li").removeClass("active");
        },

        handleChange: function (i, event) {
            switch (i) {
                case "switchFolder":
                    var thisComp = this;

                    app.user.on(
                        "change:currentMessageView",
                        function () {},
                        this
                    );

                    if (
                        thisComp.props.activePage != $(event.target).attr("id")
                    ) {
                        $("#sdasdasd").addClass("hidden");
                        clearTimeout(app.user.get("emailOpenTimeOut"));

                        app.mixins.canNavigate(function (decision) {
                            if (decision) {
                                // $("#mMiddlePanelTop").removeClass(
                                //     " hidden-xs hidden-sm hidden-md"
                                // );
                                $("#appRightSide").css("display", "none");
                                var folder =
                                    app.user.get("folders")[
                                        $(event.target).attr("id")
                                    ]["name"];

                                thisComp.removeClassesActive();

                                Backbone.history.navigate(
                                    "/mail/" + app.transform.from64str(folder),
                                    {
                                        trigger: true,
                                    }
                                );

                                app.user.set({
                                    currentFolder:
                                        app.transform.from64str(folder),
                                });

                                app.user.set({ resetSelectedItems: true });

                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                thisComp.props.changeFodlerId(
                                    $(event.target).attr("id")
                                );

                                $("#" + $(event.target).attr("id"))
                                    .parents("li")
                                    .addClass("active");

                                $("#mMiddlePanel").scrollTop(0);

                                app.layout.display("viewBox");
                            }
                        });
                    } else {
                        thisComp.removeClassesActive();
                        app.user.set({ resetSelectedItems: true });

                        app.globalF.resetCurrentMessage();
                        app.globalF.resetDraftMessage();
                        Backbone.history.navigate(
                            "/mail/" + app.user.get("currentFolder"),
                            {
                                trigger: true,
                            }
                        );
                        $("#emailListTable tr").removeClass("selected");
                        $("#sdasdasd").addClass("hidden");
                        $("#mMiddlePanelTop").removeClass(
                            " hidden-xs hidden-sm hidden-md"
                        );
                        $("#mRightPanel").addClass(
                            "hidden-xs hidden-sm hidden-md"
                        );
                    }

                    break;
            }
        },
        notifyMe: function () {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                // alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                console.log();
            }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                    }
                });
            }
        },

        handleClick: function (i) {
            switch (i) {
                case "composeEmail":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            $("#emailListTable")
                                .find("tr")
                                .removeClass("selected");
                            $("#mMiddlePanelTop").addClass(
                                " hidden-xs hidden-sm hidden-md"
                            );
                            $("#mRightPanel").removeClass(
                                "hidden-xs hidden-sm hidden-md"
                            );
                            Backbone.history.navigate("/mail/Compose", {
                                trigger: true,
                            });
                        }
                    });

                    break;

                case "addFolder":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            Backbone.history.navigate("/settings/Folders", {
                                trigger: true,
                            });
                        }
                    });

                    break;

                case "login":
                    console.log(createUserFormValidator);
                    break;
            }
        },
        boxSize: function () {
            return (
                <div>
                    <div className="used_one">
                        {accounting.toFixed(
                            app.user.get("mailboxSize") / 1024 / 1024 / 1024,
                            2
                        )}{" "}
                        GB
                    </div>{" "}
                    <span>
                        &nbsp;/&nbsp;
                        <strong>
                            {app.user.get("userPlan")["planData"]["bSize"] /
                                1000}{" "}
                            GB
                        </strong>
                    </span>
                </div>
            );
        },

        systemFolderIcon: function (_type) {
            if (_type === "Inbox") {
                return <span className="menu-icon inbox"></span>;
            } else if (_type === "Sent") {
                return <span className="menu-icon send"></span>;
            } else if (_type === "Draft") {
                return <span className="menu-icon draft"></span>;
            } else if (_type === "Spam") {
                return <span className="menu-icon spam"></span>;
            } else if (_type === "Trash") {
                return <span className="menu-icon trash"></span>;
            } else {
                return <span className="menu-icon inbox"></span>;
            }
        },

        unopenedBadge: function (
            unOpenedIndex,
            mainFoldersIndex,
            sentFolderId,
            trashFolderId
        ) {
            if (
                unOpenedIndex == 0 ||
                mainFoldersIndex == sentFolderId ||
                mainFoldersIndex == trashFolderId
            ) {
                return null;
            } else {
                return <span className="number-badge">{unOpenedIndex}</span>;
            }
        },

        render: function () {
            var st1 = {
                height: "10px",
                marginLeft: "4px",
                marginBottom: "2px",
            };
            var st2 = { marginTop: "3px" };
            var st3 = {
                width:
                    (accounting.toFixed(
                        app.user.get("mailboxSize") / 1024 / 1024,
                        2
                    ) *
                        100) /
                        app.user.get("userPlan")["planData"]["bSize"] +
                    "%",
            };

            return (
                <div>
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
                                <button
                                    onClick={this.handleClick.bind(
                                        this,
                                        "composeEmail"
                                    )}
                                >
                                    New message
                                </button>
                            </div>
                            <div className="main-menu">
                                <ul id="folderul">
                                    {Object.keys(this.state.mainFolders).map(
                                        function (folderData, i) {
                                            return (
                                                <li
                                                    key={
                                                        "liM_" +
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["index"]
                                                    }
                                                    className={`${
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["role"] == "Inbox"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <a
                                                        key={"aM_" + i}
                                                        id={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"]
                                                        }
                                                        onClick={this.handleChange.bind(
                                                            this,
                                                            "switchFolder"
                                                        )}
                                                        data-name={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }
                                                    >
                                                        {this.systemFolderIcon(
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        )}
                                                        {
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }{" "}
                                                        {this.unopenedBadge(
                                                            this.state.unopened[
                                                                this.state
                                                                    .mainFolders[
                                                                    folderData
                                                                ]["index"]
                                                            ],
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["sentFolderId"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["trashFolderId"]
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        },
                                        this
                                    )}
                                </ul>
                            </div>
                            <div className="folder-menu">
                                <div className="add-folder">
                                    <button
                                        onClick={this.handleClick.bind(
                                            this,
                                            "addFolder"
                                        )}
                                    ></button>
                                </div>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                {" "}
                                                Folders{" "}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <ul id="folderulcustom">
                                                    {this.state.customFolders.map(
                                                        function (
                                                            folderData,
                                                            i
                                                        ) {
                                                            <li
                                                                key={
                                                                    "li_" +
                                                                    folderData[
                                                                        "index"
                                                                    ]
                                                                }
                                                                className={
                                                                    " " +
                                                                    (folderData[
                                                                        "role"
                                                                    ] == "Inbox"
                                                                        ? "active"
                                                                        : this
                                                                              .state
                                                                              .unopened[
                                                                              folderData[
                                                                                  "index"
                                                                              ]
                                                                          ] == 0
                                                                        ? ""
                                                                        : "active")
                                                                }
                                                            >
                                                                <a
                                                                    key={
                                                                        "a_" + i
                                                                    }
                                                                    id={
                                                                        folderData[
                                                                            "index"
                                                                        ]
                                                                    }
                                                                    onClick={this.handleChange.bind(
                                                                        this,
                                                                        "switchFolder"
                                                                    )}
                                                                >
                                                                    {folderData[
                                                                        "name"
                                                                    ] +
                                                                        " " +
                                                                        (this
                                                                            .state
                                                                            .unopened[
                                                                            folderData[
                                                                                "index"
                                                                            ]
                                                                        ] == 0
                                                                            ? ""
                                                                            : '<span className="number-badge">' +
                                                                              this
                                                                                  .state
                                                                                  .unopened[
                                                                                  folderData[
                                                                                      "index"
                                                                                  ]
                                                                              ] +
                                                                              "</span>")}
                                                                </a>
                                                            </li>;
                                                        },
                                                        this
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="left-bottom">
                            <div className="left-cta">
                                <div className="call-to-action">
                                    <div className="cta-title">
                                        Let's explore the full
                                        <br />
                                        version of your mailbox
                                    </div>
                                    <div className="white-btn">
                                        <a href="#">Discover Pro</a>
                                    </div>
                                </div>
                            </div>
                            <div className="storage">
                                <div className="storage-count">
                                    {this.boxSize()}
                                </div>
                                <div className="storage-bar">
                                    <span style={st3}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="offcanvas offcanvas-start"
                        tabIndex="-1"
                        id="offcanvasLeft"
                        aria-label="offcanvasLeftLabel"
                    >
                        <div className="offcanvas-header">
                            <div className="logo">
                                <a href="#">
                                    <img
                                        src="images/logo.svg"
                                        alt=""
                                        className="light-theme-logo"
                                    />
                                </a>
                            </div>
                            <button
                                type="button"
                                className="btn-close text-reset"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="main-menu">
                                <ul id="folderul">
                                    {Object.keys(this.state.mainFolders).map(
                                        function (folderData, i) {
                                            return (
                                                <li
                                                    key={
                                                        "liM_" +
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["index"]
                                                    }
                                                    className={`${
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["role"] == "Inbox"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <a
                                                        key={"aM_" + i}
                                                        id={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"]
                                                        }
                                                        onClick={this.handleChange.bind(
                                                            this,
                                                            "switchFolder"
                                                        )}
                                                        data-name={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }
                                                        data-bs-dismiss="offcanvas"
                                                        aria-label="Close"
                                                    >
                                                        {this.systemFolderIcon(
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        )}
                                                        {
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }{" "}
                                                        {this.unopenedBadge(
                                                            this.state.unopened[
                                                                this.state
                                                                    .mainFolders[
                                                                    folderData
                                                                ]["index"]
                                                            ],
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["sentFolderId"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["trashFolderId"]
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        },
                                        this
                                    )}
                                </ul>
                            </div>
                            <div className="folder-menu">
                                <div className="add-folder">
                                    <button
                                        onClick={this.handleClick.bind(
                                            this,
                                            "addFolder"
                                        )}
                                    ></button>
                                </div>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                {" "}
                                                Folders{" "}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <ul id="folderulcustom">
                                                    {this.state.customFolders.map(
                                                        function (
                                                            folderData,
                                                            i
                                                        ) {
                                                            <li
                                                                key={
                                                                    "li_" +
                                                                    folderData[
                                                                        "index"
                                                                    ]
                                                                }
                                                                className={
                                                                    " " +
                                                                    (folderData[
                                                                        "role"
                                                                    ] == "Inbox"
                                                                        ? "active"
                                                                        : this
                                                                              .state
                                                                              .unopened[
                                                                              folderData[
                                                                                  "index"
                                                                              ]
                                                                          ] == 0
                                                                        ? ""
                                                                        : "active")
                                                                }
                                                            >
                                                                <a
                                                                    key={
                                                                        "a_" + i
                                                                    }
                                                                    id={
                                                                        folderData[
                                                                            "index"
                                                                        ]
                                                                    }
                                                                    onClick={this.handleChange.bind(
                                                                        this,
                                                                        "switchFolder"
                                                                    )}
                                                                    data-bs-dismiss="offcanvas"
                                                                    aria-label="Close"
                                                                >
                                                                    {folderData[
                                                                        "name"
                                                                    ] +
                                                                        " " +
                                                                        (this
                                                                            .state
                                                                            .unopened[
                                                                            folderData[
                                                                                "index"
                                                                            ]
                                                                        ] == 0
                                                                            ? ""
                                                                            : '<span className="number-badge">' +
                                                                              this
                                                                                  .state
                                                                                  .unopened[
                                                                                  folderData[
                                                                                      "index"
                                                                                  ]
                                                                              ] +
                                                                              "</span>")}
                                                                </a>
                                                            </li>;
                                                        },
                                                        this
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="storage">
                                <div className="storage-count">
                                    {this.boxSize()}
                                </div>
                                <div className="storage-bar">
                                    <span style={st3}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
