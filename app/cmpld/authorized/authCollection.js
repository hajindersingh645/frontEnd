define(["react", "app", "xss", "cmpld/authorized/mailbox/mailboxCollection", "cmpld/authorized/settings/settingsCollection", "cmpld/authorized/updates/updateVersion1", "cmpld/modals/secondPass", "cmpld/modals/syncUserObj", "cmpld/modals/logOutForce", "cmpld/modals/infoPop", "cmpld/modals/askForPass", "cmpld/modals/dialogPop", "cmpld/modals/dontInterrupt"], function (React, app, xss, MailboxCollection, SettingsCollection, UpdateCollection, SecondPass, SyncUserObj, LogOutForce, InfoPop, AskForPass, DialogPop, DontInterrupt) {
    return React.createClass({
        getInitialState: function () {
            return {
                dfd: "",
                foderId: ""
            };
        },
        componentDidMount: function () {
            var thisMod = this;

            if (!app.user.get("userLogedIn")) {
                app.auth.logout();
            } else {
                $('link[rel=stylesheet][href="/css/style_frontend.css"]').remove();
                $("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", "/css/style_backend.css"));
                $("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", "/css/style_backend_over.css"));

                if (app.sessionData.get("sessionReady")) {
                    thisMod.setState({ dfd: "solved" });
                } else {
                    $("#userObjSync").addClass("show d-block");
                    $("#overlay").removeClass("d-none").addClass("d-block");
                    $("#userObjSync").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: true
                    });

                    app.userObjects.startSession(function () {
                        $("#userObjSync").removeClass("show d-block");
                        $("#overlay").removeClass("d-block").addClass("d-none");
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
                    app.user.startTimer();
                    break;
            }
        },
        changeFodlerId: function (foderId) {
            this.setState({
                folder: foderId
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
                    body = React.createElement(MailboxCollection, {
                        pp: this.props.folder,
                        activePage: this.state.folder,
                        changeFodlerId: this.changeFodlerId,
                        folderId: this.state.folder,
                        updateValue: this.updateValue
                    });
                } else if (page == "settings" && app.user.get("profileVersion") > 1) {
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: this.props.activePage
                    });
                } else if (page == "settings" && app.user.get("profileVersion") == 1 && this.props.activePage == "updateVersion1") {
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: "updateVersion1"
                    });
                } else if (app.user.get("profileVersion") == 1) {
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true
                    });
                }
            }

            return React.createElement(
                "div",
                {
                    className: "mailBody",
                    onClick: this.handleClick.bind(this, "resetTimer"),
                    onTouchEnd: this.handleClick.bind(this, "resetTimer"),
                    onKeyUp: this.handleClick.bind(this, "resetTimer")
                },
                body,
                React.createElement("div", { id: "overlay", className: "d-none" }),
                React.createElement(SyncUserObj, null)
            );
        }
    });
});