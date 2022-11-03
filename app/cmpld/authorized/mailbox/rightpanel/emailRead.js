define(["react", "app"], function (React, app) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            return {
                from: "",
                fromExtra: "",
                to: "",
                cc: "",
                bcc: "",
                pin: "",
                subject: "",
                dmarc: "",
                header: "",
                timeSent: "",
                type: "",
                attachment: {},
                hideEmailRead: true,
                renderButtonClass: "",
                rawHeadVisible: "",
                toggleHTMLtext: "html",
                renderFull: false,
                pgpEncrypted: false,
                decryptedEmail: false,
                emailLoading: false
            };
        },
        componentWillUnmount: function () {
            this.setState({
                hideEmailRead: true,
                emailLoading: false,
                decryptedEmail: false
            });
            app.user.off("change:currentMessageView");
            app.globalF.resetCurrentMessage();
            clearTimeout(app.user.get("emailOpenTimeOut"));
            // $('[data-toggle="popover-hover"]').popover("hide");
        },
        componentDidMount: function () {
            var thisComp = this;
            // $("#sdasdasd").addClass("hidden"); - [NEW VERSION AVAILABLE BUTTON]
            app.user.on("change:currentMessageView", function () {
                thisComp.setState({
                    from: "",
                    fromExtra: "",
                    to: "",
                    cc: "",
                    bcc: "",
                    pin: "",
                    subject: "",
                    dmarc: "",
                    header: "",
                    timeSent: "",
                    type: "",
                    attachment: {},
                    hideEmailRead: true,
                    renderButtonClass: "",
                    rawHeadVisible: "",
                    toggleHTMLtext: "html",
                    renderFull: false,
                    pgpEncrypted: false,
                    decryptedEmail: false,
                    emailLoading: false
                });

                this.renderEmail();
            }, this);
        },
        getTagsList: function () {
            var labels = [];

            var thisComp = this;
            $.each(app.user.get("tags"), function (index, labelData) {
                labels.push(React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "a",
                        {
                            id: index + "3",
                            onClick: thisComp.handleChange.bind(thisComp, "assignLabel"),
                            value: index
                        },
                        app.transform.from64str(index)
                    )
                ));
            });
            return labels;
        },
        verifySignature: function () {
            var thisComp = this;
            var from = app.transform.from64str(app.user.get("currentMessageView")["meta"]["from"]);
            var fromEmail = app.globalF.getEmailsFromString(from);

            var post = {
                mails: JSON.stringify([app.transform.SHA512(fromEmail)])
            };

            var options = [];

            var trusted = app.user.get("trustedSenders");

            if (trusted.indexOf(app.transform.SHA256(app.globalF.parseEmail(fromEmail)["email"])) !== -1) {
                thisComp.setState({
                    signatureHeader: []
                });
            } else {
                app.serverCall.ajaxRequest("retrievePublicKeys", post, function (result) {
                    if (result["response"] == "success") {
                        if (Object.keys(result["data"]).length > 0) {
                            var senderPK = result["data"][app.transform.SHA512(fromEmail)]["mailKey"];
                            var emailVersion = app.user.get("currentMessageView")["version"];

                            if (app.globalF.verifySignature(senderPK, emailVersion) === true) {
                                options.push(React.createElement(
                                    "div",
                                    {
                                        key: "sig1",
                                        className: "alert alert-success pgpsignature-success"
                                    },
                                    React.createElement("i", { className: "fa-fw fa fa-check" }),
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        "Signature verified"
                                    ),
                                    " ",
                                    "To learn more about",
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        React.createElement(
                                            "a",
                                            {
                                                href: "https://blog.cyberfear.com/signatures",
                                                target: "_blank"
                                            },
                                            "signatures"
                                        )
                                    ),
                                    ". Link will be open in new tab"
                                ));
                                thisComp.setState({
                                    signatureHeader: options
                                });
                            } else if (app.globalF.verifySignature(senderPK, emailVersion) === false) {
                                options.push(React.createElement(
                                    "div",
                                    {
                                        key: "sig1",
                                        className: "alert alert-danger pgpsignature-danger"
                                    },
                                    React.createElement("i", { className: "fa-fw fa fa-times" }),
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        "Signature mismatch"
                                    ),
                                    " ",
                                    "To learn more about",
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        React.createElement(
                                            "a",
                                            {
                                                href: "https://blog.cyberfear.com/signatures",
                                                target: "_blank"
                                            },
                                            "signatures"
                                        )
                                    ),
                                    ". Link will be open in new tab"
                                ));
                                thisComp.setState({
                                    signatureHeader: options
                                });
                            } else if (app.globalF.verifySignature(senderPK, emailVersion) == "old") {}
                        } else {
                            options.push(React.createElement(
                                "div",
                                {
                                    key: "sig1",
                                    className: "alert alert-warning pgpsignature-warning"
                                },
                                React.createElement("i", { className: "fa-fw fa fa-warning" }),
                                " ",
                                React.createElement(
                                    "strong",
                                    null,
                                    "Signature can not be verified"
                                ),
                                " ",
                                "To learn more about",
                                " ",
                                React.createElement(
                                    "strong",
                                    null,
                                    React.createElement(
                                        "a",
                                        {
                                            href: "https://blog.cyberfear.com/email-signatures",
                                            target: "_blank"
                                        },
                                        "signatures"
                                    )
                                ),
                                ". Link will be open in new tab"
                            ));
                            thisComp.setState({
                                signatureHeader: options
                            });
                        }
                    }
                });
            }
        },
        renderEmail: function () {
            this.setState({
                emailLoading: true,
                hideEmailRead: true
            });
            if (app.user.get("currentMessageView")["id"] !== undefined && app.user.get("currentMessageView")["id"] != "") {
                clearTimeout(app.user.get("emailOpenTimeOut"));

                var email = app.user.get("currentMessageView");

                var thisComp = this;
                var from2 = [];
                var from = app.transform.from64str(email["meta"]["from"]);

                var emailAddress = "";

                if (app.globalF.parseEmail(from)["name"] != app.globalF.parseEmail(from)["email"]) {
                    from2.push(React.createElement(
                        "span",
                        { key: "ab" },
                        React.createElement(
                            "b",
                            { key: "bc" },
                            app.globalF.parseEmail(from)["name"]
                        ),
                        "<" + app.globalF.parseEmail(from)["email"] + ">"
                    ));
                } else {
                    from2.push(React.createElement(
                        "span",
                        { key: "ab" },
                        app.globalF.parseEmail(from)["email"]
                    ));
                }

                var fromExtra = "";

                if (email["meta"]["fromExtra"] != "") {
                    if (app.transform.check64str(email["meta"]["fromExtra"])) {
                        fromExtra = filterXSS(app.transform.from64str(email["meta"]["fromExtra"]));
                    } else {
                        fromExtra = filterXSS(email["meta"]["fromExtra"]);
                    }
                }

                var to = [];
                var cc = [];
                var bcc = [];

                var emailsTo = email["meta"]["to"];
                var emailsCC = email["meta"]["toCC"] != undefined ? email["meta"]["toCC"] : [];
                var emailsBCC = email["meta"]["toBCC"] != undefined ? email["meta"]["toBCC"] : [];

                emailAddress = app.globalF.exctractOwnEmail(emailsTo);

                if (emailAddress === false) {
                    emailAddress = app.globalF.exctractOwnEmail(emailsCC);
                }

                var pins = "";
                var pin = [];

                if (email["meta"]["version"] == 2 && email["meta"]["pin"] != "") {
                    pin.push(React.createElement(
                        "span",
                        { className: "pinHeader email-head", key: "pin2" },
                        "PIN:",
                        " ",
                        React.createElement(
                            "span",
                            {
                                className: "label label-success",
                                key: "pinLabel2"
                            },
                            app.transform.from64str(email["meta"]["pin"])
                        )
                    ));
                } else if (email["meta"]["pin"] != undefined && email["meta"]["pin"] != "") {
                    pins = JSON.parse(email["meta"]["pin"]);
                }

                $.each(emailsTo, function (index, folderData) {
                    folderData = app.transform.from64str(folderData);

                    if (emailsTo.length <= 3) {
                        if (pins[app.globalF.parseEmail(folderData)["email"]] != undefined) {
                            var lock = React.createElement("i", { className: "fa fa-lock" });
                            var title = '<i class="fa fa-lock"></i> ' + app.transform.from64str(pins[app.globalF.parseEmail(folderData)["email"]]["pin"]);
                        } else {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        }
                    } else {
                        if (pins[app.globalF.parseEmail(folderData)["email"]] != undefined) {
                            var lock = React.createElement("i", { className: "fa fa-lock" });
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"] + "<br/>" + '<i class="fa fa-lock"></i> ' + app.transform.from64str(pins[app.globalF.parseEmail(folderData)["email"]]["pin"]);
                        } else {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        }
                    }

                    if (app.globalF.parseEmail(folderData)["name"] != app.globalF.parseEmail(folderData)["email"]) {
                        to.push(React.createElement(
                            "span",
                            {
                                key: index,
                                className: "" // badge light email-head
                                , "data-placement": "bottom",
                                "data-toggle": "popover-hover",
                                title: "",
                                "data-content": title
                            },
                            lock,
                            " ",
                            React.createElement(
                                "b",
                                { key: index + "b" },
                                app.globalF.parseEmail(folderData)["name"]
                            ),
                            emailsTo.length <= 3 ? " <" + app.globalF.parseEmail(folderData)["email"] + ">" : ""
                        ));
                    } else {
                        to.push(React.createElement(
                            "span",
                            {
                                key: index,
                                className: "" // badge light email-head
                                , "data-placement": "bottom",
                                "data-toggle": "popover-hover",
                                title: "",
                                "data-content": title
                            },
                            lock,
                            " ",
                            app.globalF.parseEmail(folderData)["email"]
                        ));
                    }
                });

                if (emailsCC.length > 0) {
                    $.each(emailsCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 1) {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        }

                        if (app.globalF.parseEmail(folderData)["name"] != app.globalF.parseEmail(folderData)["email"]) {
                            cc.push(React.createElement(
                                "span",
                                {
                                    key: index,
                                    className: "" // badge light email-head
                                    , "data-placement": "bottom",
                                    "data-toggle": "popover-hover",
                                    title: "",
                                    "data-content": title
                                },
                                lock,
                                " ",
                                React.createElement(
                                    "b",
                                    { key: index + "b" },
                                    app.globalF.parseEmail(folderData)["name"]
                                ),
                                emailsCC.length <= 1 ? " <" + app.globalF.parseEmail(folderData)["email"] + ">" : ""
                            ));
                        } else {
                            cc.push(React.createElement(
                                "span",
                                {
                                    key: index,
                                    className: "" // badge light email-head
                                    , "data-placement": "bottom",
                                    "data-toggle": "popover-hover",
                                    title: "",
                                    "data-content": title
                                },
                                lock,
                                " ",
                                app.globalF.parseEmail(folderData)["email"]
                            ));
                        }
                    });
                }

                if (emailsBCC.length > 0) {
                    $.each(emailsBCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 3) {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title = '<i class="fa fa-envelope-o"></i> ' + app.globalF.parseEmail(folderData)["email"];
                        }

                        if (app.globalF.parseEmail(folderData)["name"] != app.globalF.parseEmail(folderData)["email"]) {
                            bcc.push(React.createElement(
                                "span",
                                {
                                    key: index,
                                    className: "" // badge light email-head
                                    , "data-placement": "bottom",
                                    "data-toggle": "popover-hover",
                                    title: "",
                                    "data-content": title
                                },
                                lock,
                                " ",
                                React.createElement(
                                    "b",
                                    { key: index + "b" },
                                    app.globalF.parseEmail(folderData)["name"]
                                ),
                                emailsCC.length <= 3 ? " <" + app.globalF.parseEmail(folderData)["email"] + ">" : ""
                            ));
                        } else {
                            bcc.push(React.createElement(
                                "span",
                                {
                                    key: index,
                                    className: "" // badge light email-head
                                    , "data-placement": "bottom",
                                    "data-toggle": "popover-hover",
                                    title: "",
                                    "data-content": title
                                },
                                lock,
                                " ",
                                app.globalF.parseEmail(folderData)["email"]
                            ));
                        }
                    });
                }
                var message = app.user.get("emails")["messages"][email["id"]];
                if (message["st"] == 0) {
                    var setOpen = setTimeout(function () {
                        message["st"] = message["st"] == 0 ? 3 : message["st"];

                        app.userObjects.updateObjects("folderUpdate", "", function (result) {
                            app.globalF.syncUpdates();
                        });
                    }, 500);
                } else {
                    var setOpen = {};
                }

                this.setState({
                    emailAddress: emailAddress,
                    fromExtra: fromExtra,
                    from: from2,
                    to: to,
                    cc: cc,
                    bcc: bcc,
                    pin: pin,
                    subject: app.transform.from64str(email["meta"]["subject"]),
                    dmarc: "",
                    header: "",
                    timeSent: new Date(parseInt(email["meta"]["timeSent"] + "000")).toLocaleString(),
                    type: "",
                    tag: app.user.get("emails")["messages"][email["id"]]["tg"].length > 0 ? app.transform.from64str(app.user.get("emails")["messages"][email["id"]]["tg"][0]["name"]) : "",
                    emailBody: app.transform.from64str(email["body"]["html"]),
                    emailBodyTXT: app.transform.from64str(email["body"]["text"]),
                    attachment: email["attachment"],
                    rawHeadVisible: email["originalBody"]["rawHeader"] == undefined ? "hidden" : "",
                    toggleHTMLtext: "html",
                    pgpEncrypted: email["pgpEncrypted"]
                });

                // $('[data-toggle="popover-hover"]').popover({
                //     trigger: "hover",
                //     container: ".view-mail-header",
                //     html: true,
                // });

                if (message["tp"] == 2) {
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none"
                    });
                } else {
                    this.renderStrictBody();
                }

                thisComp.setState({
                    hideEmailRead: false
                });
                thisComp.setState({
                    emailLoading: false
                });
                this.verifySignature();
            } else {
                this.setState({
                    emailLoading: false,
                    hideEmailRead: true
                });
            }

            app.layout.display("readEmail");

            // $('[data-toggle="popover-hover"]').on(
            //     "shown.bs.popover",
            //     function () {
            //         var $pop = $(this);
            //         setTimeout(function () {
            //             $pop.popover("hide");
            //         }, 5000);
            //     }
            // );
        },
        displayAttachments: function () {
            var attachments = [];
            var files = [];
            var thisComp = this;

            if (Object.keys(this.state.attachment).length > 0) {
                if (this.state.decryptedEmail) {
                    var size = 0;
                    $.each(this.state.attachment, function (index, attData) {
                        size += attData["contents"].length;

                        files.push(React.createElement(
                            "span",
                            { className: "clearfix", key: "a" + index },
                            React.createElement("br", null),
                            React.createElement(
                                "span",
                                { className: "attchments", key: "as" + index },
                                attData["fileName"]
                            ),
                            React.createElement(
                                "button",
                                {
                                    key: "ab" + index,
                                    id: index,
                                    className: "btn btn-sm btn-primary pull-right",
                                    onClick: thisComp.handleClick.bind(thisComp, "downloadFileDecrypted")
                                },
                                "Download"
                            )
                        ));
                    });
                } else {
                    var size = 0;
                    $.each(this.state.attachment, function (index, attData) {
                        size += parseInt(app.transform.from64str(attData["size"]));

                        if (attData["isPgp"]) {
                            files.push(React.createElement(
                                "span",
                                { className: "clearfix", key: "a" + index },
                                React.createElement("br", null),
                                React.createElement(
                                    "span",
                                    {
                                        className: "attchments",
                                        key: "as" + index
                                    },
                                    app.transform.from64str(attData["name"])
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        className: "btn-group pull-right",
                                        key: "abc" + index
                                    },
                                    React.createElement(
                                        "button",
                                        {
                                            type: "button",
                                            id: index,
                                            className: "btn btn-primary",
                                            key: "abcd" + index,
                                            onClick: thisComp.handleClick.bind(thisComp, "downloadFile")
                                        },
                                        "Download"
                                    ),
                                    React.createElement(
                                        "button",
                                        {
                                            type: "button",
                                            className: "btn btn-primary dropdown-toggle",
                                            "data-toggle": "dropdown",
                                            "aria-haspopup": "true",
                                            "aria-expanded": "false"
                                        },
                                        React.createElement("span", { className: "caret" }),
                                        React.createElement(
                                            "span",
                                            { className: "sr-only" },
                                            "Toggle Dropdown"
                                        )
                                    ),
                                    React.createElement(
                                        "ul",
                                        { className: "dropdown-menu" },
                                        React.createElement(
                                            "li",
                                            {
                                                onClick: thisComp.handleClick.bind(thisComp, "downloadFilePGP")
                                            },
                                            React.createElement(
                                                "a",
                                                { href: "javascript:void(0);" },
                                                "Decrypt & Display"
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            {
                                                onClick: thisComp.handleClick.bind(thisComp, "downloadFilePGP")
                                            },
                                            React.createElement(
                                                "a",
                                                { href: "javascript:void(0);" },
                                                "Decrypt & Download"
                                            )
                                        ),
                                        React.createElement("li", {
                                            role: "separator",
                                            className: "divider"
                                        }),
                                        React.createElement(
                                            "li",
                                            {
                                                onClick: thisComp.handleClick.bind(thisComp, "downloadFile")
                                            },
                                            React.createElement(
                                                "a",
                                                { href: "javascript:void(0);" },
                                                "Download"
                                            )
                                        )
                                    )
                                )
                            ));
                        } else {
                            files.push(React.createElement(
                                "span",
                                { className: "clearfix", key: "a" + index },
                                React.createElement("br", null),
                                React.createElement(
                                    "span",
                                    {
                                        className: "attchments",
                                        key: "as" + index
                                    },
                                    app.transform.from64str(attData["name"])
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        key: "ab" + index,
                                        id: index,
                                        className: "btn btn-sm btn-primary pull-right",
                                        onClick: thisComp.handleClick.bind(thisComp, "downloadFile")
                                    },
                                    "Download"
                                )
                            ));
                        }
                    });
                }

                size = size > 1000000 ? Math.round(size / 10000) / 100 + " Mb" : Math.round(size / 10) / 100 + " Kb";

                attachments.push(React.createElement(
                    "div",
                    { className: "panel-footer", key: "1" },
                    React.createElement(
                        "h5",
                        null,
                        "Attchments (",
                        Object.keys(this.state.attachment).length,
                        " file(s),",
                        " ",
                        size,
                        ")"
                    ),
                    React.createElement(
                        "div",
                        { className: "alert alert-warning text-left", key: "2" },
                        "Please use ",
                        React.createElement(
                            "b",
                            null,
                            "EXTREME"
                        ),
                        " caution when downloading files. We strongly recommend scanning them for viruses/malware after downloading."
                    ),
                    React.createElement("div", { className: "inbox-download" }),
                    files
                ));
            }

            return attachments;
        },

        handleChange: function (i, event) {
            switch (i) {
                case "removeTag":
                    var emailId = app.user.get("currentMessageView")["id"];
                    var message = app.user.get("emails")["messages"][emailId];
                    message["tg"] = [];
                    var thisComp = this;

                    app.userObjects.updateObjects("folderUpdate", "", function (result) {
                        app.globalF.syncUpdates();
                        thisComp.setState({
                            tag: ""
                        });
                    });

                    break;

                case "assignLabel":
                    var thisComp = this;
                    var emailId = app.user.get("currentMessageView")["id"];
                    var message = app.user.get("emails")["messages"][emailId];

                    message["tg"] = [];

                    message["tg"].push({ name: $(event.target).attr("value") });

                    var name = $(event.target).attr("value");
                    app.userObjects.updateObjects("folderUpdate", "", function (result) {
                        app.globalF.syncUpdates();

                        thisComp.setState({
                            tag: app.transform.from64str(name)
                        });
                    });

                    break;
            }
        },

        handleClick: function (i, event) {
            switch (i) {
                case "downloadFilePGP":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton.parent().parent().parent().children().attr("id");

                    var thisComp = this;

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(emailAttachments[fileBId]["fileName"] + app.user.get("userId"));
                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(emailAttachments[fileBId]["key"]);
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(emailAttachments[fileBId]["key"]);
                        var version = 2;
                    }

                    var type = app.transform.from64str(emailAttachments[fileBId]["type"]);
                    var size = app.transform.from64str(emailAttachments[fileBId]["size"]);
                    var name = app.transform.from64str(emailAttachments[fileBId]["name"]);

                    fileButton.parent().parent().parent().children(":first").html('<i class="fa fa-spin fa-refresh"></i> Downloading');

                    app.globalF.downloadFile(fileName, modKey, version, function (result) {
                        fileButton.parent().parent().parent().children(":first").html("Download");
                        var decryptedFile64 = app.transform.fromAesBin(key, result);
                        var decryptedFile = app.transform.from64bin(decryptedFile64);

                        thisComp.readPGP(decryptedFile);
                    });

                    break;

                case "detectDirection":
                    var arrow = $(".navArrow1");

                    app.layout.display("left");

                    break;

                case "downloadFileDecrypted":
                    var fileButton = $(event.target);
                    var emailAttachments = this.state.attachment;
                    var fileBId = fileButton.attr("id");
                    var file = emailAttachments[fileBId];

                    var content = file["encoding"] === "base64" ? app.transform.from64bin(file["contents"]) : file["contents"];

                    var arbuf = app.globalF.base64ToArrayBuffer(content);

                    var type = file["contentType"];
                    var size = file["encoding"] === "base64" ? app.transform.from64bin(file["contents"]).length : file["contents"].length;
                    var name = file["fileName"];

                    app.globalF.createDownloadLink(arbuf, type, name);

                    break;

                case "downloadFile":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton.attr("id");

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(emailAttachments[fileBId]["fileName"] + app.user.get("userId"));

                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(emailAttachments[fileBId]["key"]);
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(emailAttachments[fileBId]["key"]);
                        var version = 2;
                    } else if (email["version"] == undefined || email["version"] === 1) {
                        var fileName = app.transform.from64str(emailAttachments[fileBId]["filename"]);
                        var version = 1;
                        var modKey = "none";

                        var message = app.user.get("emails")["messages"][app.user.get("currentMessageView")["id"]];

                        var key = app.transform.from64bin(message["p"]);
                    }

                    var type = app.transform.from64str(emailAttachments[fileBId]["type"]);
                    var size = app.transform.from64str(emailAttachments[fileBId]["size"]);
                    var name = app.transform.from64str(emailAttachments[fileBId]["name"]);

                    fileButton.html('<i class="fa fa-spin fa-refresh"></i> Downloading');

                    var thisComp = this;

                    app.globalF.downloadFile(fileName, modKey, version, function (result) {
                        if (result === false) {
                            fileButton.html("Download");
                        } else {
                            fileButton.html("Download");

                            var decryptedFile64 = app.transform.fromAesBin(key, result);
                            var decryptedFile = app.transform.from64bin(decryptedFile64);

                            var arbuf = app.globalF.base64ToArrayBuffer(decryptedFile);
                            app.globalF.createDownloadLink(arbuf, type, name);
                        }
                    });

                    break;

                case "email":
                    $("#col1").toggleClass("hide");
                    $("#view-mail-wrapper").toggleClass("visible-lg");

                    break;
                case "emailBig":
                    $("#view-mail-wrapper").toggleClass("col-lg-6 auto");
                    $("#col1").toggleClass("hide");
                    $(".fa-chevron-left").toggleClass("fa-rotate-180");

                    break;

                case "addNewTag":
                    Backbone.history.navigate("/settings/Folders", {
                        trigger: true
                    });
                    break;

                case "reply":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyFull");
                    } else {
                        app.globalF.reply("replyStrict");
                    }

                    Backbone.history.navigate("/mail/Compose", {
                        trigger: true
                    });
                    break;

                case "replyAll":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyAFull");
                    } else {
                        app.globalF.reply("replyAStrict");
                    }

                    Backbone.history.navigate("/mail/Compose", {
                        trigger: true
                    });
                    break;
                case "forward":
                    if (this.state.renderFull) {
                        app.globalF.reply("forwardFull");
                    } else {
                        app.globalF.reply("forwardStrict");
                    }

                    Backbone.history.navigate("/mail/Compose", {
                        trigger: true
                    });
                    break;

                case "renderImages":
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none"
                    });

                    break;

                case "decryptPGP":
                    var thisComp = this;
                    if (this.state.emailBody.length == 0) {
                        thisComp.readPGP(this.state.emailBodyTXT);
                    } else {
                        thisComp.readPGP(this.state.emailBody);
                    }

                    break;

                case "showHeader":
                    var w = window.open();
                    var html = "<pre " + 'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' + app.transform.escapeTags(app.transform.from64str(app.user.get("currentMessageView")["originalBody"]["rawHeader"])) + "<pre>";
                    html += "------ HTML ---------" + "<br /><pre " + 'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' + app.transform.escapeTags(app.transform.from64str(app.user.get("currentMessageView")["originalBody"]["body"]["html"])) + "<pre><br />------END HTML ---------<br /><br />";
                    html += "------ TEXT ---------" + "<br /><pre " + 'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' + app.transform.escapeTags(app.transform.from64str(app.user.get("currentMessageView")["originalBody"]["body"]["text"])) + "<pre><br />------ END TEXT ---------";
                    $(w.document.body).html(html);
                    break;

                case "togglePlainHTML":
                    if (this.state.toggleHTMLtext == "html") {
                        this.setState({
                            toggleHTMLtext: "text"
                        });

                        app.globalF.renderBodyNoImages("", this.state.emailBodyTXT, function (prerenderedBody) {
                            $("#virtualization").height(0);

                            setTimeout(function () {
                                $("#virtualization").contents().find("html").html(prerenderedBody);

                                $("#virtualization").height($("#virtualization").contents().find("html").height());
                            }, 100);
                        });
                    } else if (this.state.toggleHTMLtext == "text") {
                        this.setState({
                            toggleHTMLtext: "html"
                        });

                        app.globalF.renderBodyNoImages(this.state.emailBody, "", function (prerenderedBody) {
                            $("#virtualization").height(0);

                            setTimeout(function () {
                                $("#virtualization").contents().find("html").html(prerenderedBody);

                                $("#virtualization").height($("#virtualization").contents().find("html").height());
                            }, 100);
                        });
                    }

                    break;
            }
        },

        readPGP: function (PGPtext) {
            var thisComp = this;

            app.globalF.decryptPGPMessage(PGPtext, thisComp.state.emailAddress).then(function (email64, decryptedText) {
                thisComp.setState({
                    emailBody: decryptedText["html"],
                    emailBodyTXT: decryptedText["text"],
                    attachment: decryptedText["attachments"],
                    decryptedEmail: app.transform.from64str(email64),
                    pgpEncrypted: false
                });

                thisComp.renderStrictBody();
            });
        },

        showDMARC: function () {
            var options = [];

            options.push(React.createElement(
                "div",
                { className: "dmark-header" },
                React.createElement(
                    "span",
                    { className: "label label-default" },
                    "DMARC:"
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "txt-color-green" },
                    "SPF"
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "txt-color-green" },
                    "DKIM"
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "txt-color-red" },
                    "PGP Signature"
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "txt-color-green" },
                    "Encrypted"
                )
            ));
        },
        componentDidUpdate: function () {},
        renderFull: function () {
            app.globalF.renderBodyFull(this.state.emailBody, this.state.emailBodyTXT, function (prerenderedBody) {
                $("#virtualization").height(0);
                setTimeout(function () {
                    $("#virtualization").contents().find("html").html(prerenderedBody);
                    $("#virtualization").height($("#virtualization").contents().find("html").height() + 50);
                }, 300);
            });
            this.setState({
                renderFull: true
            });
        },

        renderStrictBody: function () {
            var thisComp = this;
            app.globalF.renderBodyNoImages(this.state.emailBody, this.state.emailBodyTXT, function (prerenderedBody) {
                $("#virtualization").height(0);

                if (thisComp.state.pgpEncrypted && !thisComp.state.decryptedEmail) {
                    prerenderedBody = "<div style='white-space: pre-line;'>" + prerenderedBody + "</div>";
                }

                setTimeout(function () {
                    $("#virtualization").contents().find("html").html(prerenderedBody);

                    $("#virtualization").height($("#virtualization").contents().find("html").height() + 50);

                    var tt = app.mixins.touchMixins();

                    $("#virtualization").contents().bind("touchstart", function () {
                        {
                            tt.handleTouchStart;
                        }
                    });
                    $("#virtualization").contents().bind("touchmove", function () {
                        {
                            tt.handleTouchMove;
                        }
                    });
                    $("#virtualization").contents().bind("touchend", function () {
                        {
                            tt.handleTouchEnd;
                        }
                    });
                }, 300);
            });
        },

        handleBackToEmailList: function () {
            $("#appRightSide").css("display", "none");
        },

        render: function () {
            return React.createElement(
                "div",
                { className: "right-side", id: "appRightSide" },
                React.createElement(
                    "div",
                    { className: "email-conetent-wrp" },
                    React.createElement(
                        "div",
                        {
                            className: `mail-data emailNo ${ this.state.hideEmailRead && this.state.emailLoading === false ? "" : "d-none" }`
                        },
                        React.createElement(
                            "h1",
                            null,
                            `Please Select Email`
                        ),
                        React.createElement(
                            "p",
                            null,
                            React.createElement(
                                "strong",
                                null,
                                React.createElement(
                                    "a",
                                    {
                                        href: "https://blog.cyberfear.com/",
                                        target: "_blank"
                                    },
                                    "Our Blog: blog.cyberfear.com"
                                )
                            )
                        ),
                        React.createElement(
                            "p",
                            null,
                            "Comments or question? ",
                            React.createElement("br", null),
                            " Please contact us at ",
                            React.createElement(
                                "strong",
                                null,
                                "cyberfear@cyberfear.com"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        {
                            className: this.state.emailLoading && this.state.hideEmailRead ? "" : "d-none"
                        },
                        React.createElement(
                            "h3",
                            { style: { textAlign: "center" } },
                            "Decrypting..."
                        )
                    ),
                    React.createElement(
                        "div",
                        {
                            className: `email-content-top ${ this.state.hideEmailRead ? "d-none" : "" }`
                        },
                        React.createElement(
                            "div",
                            { className: "email-content-top-right" },
                            React.createElement("div", {
                                className: "mail-back",
                                onClick: this.handleBackToEmailList.bind(this)
                            }),
                            React.createElement(
                                "div",
                                { className: "right-menus" },
                                React.createElement(
                                    "div",
                                    { className: "button-group" },
                                    React.createElement("button", {
                                        className: "back",
                                        onClick: this.handleClick.bind(this, "reply")
                                    }),
                                    React.createElement("button", {
                                        className: "next",
                                        onClick: this.handleClick.bind(this, "forward")
                                    }),
                                    React.createElement("button", { className: "star" }),
                                    React.createElement("button", { className: "delete" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "content-list-menu" },
                                    React.createElement(
                                        "div",
                                        { className: "dropdown" },
                                        React.createElement("button", {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "content-list",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false"
                                        }),
                                        React.createElement(
                                            "ul",
                                            {
                                                className: "dropdown-menu",
                                                "aria-labelledby": "content-list"
                                            },
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleClick.bind(this, "reply")
                                                    },
                                                    "Reply"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleClick.bind(this, "forward")
                                                    },
                                                    "Forward"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "print"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "Delete this message"
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "Report Spam"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "email-content-top-left" },
                            React.createElement(
                                "div",
                                { className: "word color-1" },
                                "W"
                            ),
                            React.createElement(
                                "div",
                                { className: "sender-name" },
                                React.createElement(
                                    "div",
                                    null,
                                    this.state.from,
                                    " "
                                ),
                                React.createElement(
                                    "span",
                                    null,
                                    this.state.fromExtra
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "sender-detail-dropdown" },
                                React.createElement(
                                    "div",
                                    { className: "dropdown" },
                                    React.createElement(
                                        "button",
                                        {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "sender-details",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false"
                                        },
                                        "To me",
                                        " ",
                                        React.createElement("span", { className: "arrow" }),
                                        " "
                                    ),
                                    React.createElement(
                                        "ul",
                                        {
                                            className: "dropdown-menu",
                                            "aria-labelledby": "sender-details"
                                        },
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "span",
                                                null,
                                                "from:"
                                            ),
                                            React.createElement(
                                                "div",
                                                null,
                                                this.state.from
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "span",
                                                null,
                                                "reply-to:"
                                            ),
                                            React.createElement(
                                                "div",
                                                null,
                                                this.state.from
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "span",
                                                null,
                                                "to:"
                                            ),
                                            React.createElement(
                                                "div",
                                                null,
                                                this.state.to
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            { className: "sent_date_time" },
                                            React.createElement(
                                                "span",
                                                null,
                                                "date:"
                                            ),
                                            React.createElement(
                                                "div",
                                                null,
                                                this.state.timeSent
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "span",
                                                null,
                                                "subject:"
                                            ),
                                            React.createElement(
                                                "div",
                                                null,
                                                this.state.subject
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        {
                            className: `real-sender ${ this.state.hideEmailRead ? "d-none" : "" }`
                        },
                        React.createElement(
                            "div",
                            null,
                            "sender: ",
                            this.state.from
                        )
                    ),
                    React.createElement(
                        "div",
                        {
                            className: `image-disabled ${ this.state.hideEmailRead ? "d-none" : "" }`
                        },
                        React.createElement(
                            "div",
                            { className: this.state.renderButtonClass },
                            "To protect you from tracking, images are disabled.",
                            " ",
                            React.createElement(
                                "a",
                                {
                                    className: "btn btn-default btn-xs",
                                    href: "javascript:void(0)",
                                    onClick: this.handleClick.bind(this, "renderImages")
                                },
                                "Render Images"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        {
                            className: `mail-data ${ this.state.hideEmailRead ? "d-none" : "" }`
                        },
                        React.createElement(
                            "h1",
                            null,
                            this.state.subject
                        ),
                        React.createElement("iframe", {
                            id: "virtualization",
                            scrolling: "no",
                            frameBorder: "0",
                            width: "100%"
                        }),
                        this.displayAttachments()
                    )
                )
            );
        }
    });
});