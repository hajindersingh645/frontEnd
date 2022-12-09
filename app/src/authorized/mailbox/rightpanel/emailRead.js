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
                emailLoading: app.user.get("isDecryptingEmail"),
                //emailHasPin
            };
        },
        componentWillUnmount: function () {
            this.setState({
                hideEmailRead: true,
                emailLoading: false,
                decryptedEmail: false,
            });
            app.user.off("change:currentMessageView");
            app.globalF.resetCurrentMessage();
            clearTimeout(app.user.get("emailOpenTimeOut"));
            // $('[data-toggle="popover-hover"]').popover("hide");
        },
        componentDidMount: function () {
            var thisComp = this;
            // $("#sdasdasd").addClass("hidden"); - [NEW VERSION AVAILABLE BUTTON]
            app.user.on(
                "change:currentMessageView",
                function () {
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
                        emailLoading: app.user.get("isDecryptingEmail"),
                    });

                    this.renderEmail();
                },
                this
            );
        },
        getTagsList: function () {
            var labels = [];

            var thisComp = this;
            $.each(app.user.get("tags"), function (index, labelData) {
                labels.push(
                    <li key={index}>
                        <a
                            id={index + "3"}
                            onClick={thisComp.handleChange.bind(
                                thisComp,
                                "assignLabel"
                            )}
                            value={index}
                        >
                            {app.transform.from64str(index)}
                        </a>
                    </li>
                );
            });
            return labels;
        },
        verifySignature: function () {
            var thisComp = this;
            var from = app.transform.from64str(
                app.user.get("currentMessageView")["meta"]["from"]
            );
            var fromEmail = app.globalF.getEmailsFromString(from);

            var post = {
                mails: JSON.stringify([app.transform.SHA512(fromEmail)]),
            };

            var options = [];

            var trusted = app.user.get("trustedSenders");

            if (
                trusted.indexOf(
                    app.transform.SHA256(
                        app.globalF.parseEmail(fromEmail)["email"]
                    )
                ) !== -1
            ) {
                thisComp.setState({
                    signatureHeader: [],
                });
            } else {
                app.serverCall.ajaxRequest(
                    "retrievePublicKeys",
                    post,
                    function (result) {
                        if (result["response"] == "success") {
                            if (Object.keys(result["data"]).length > 0) {
                                var senderPK =
                                    result["data"][
                                        app.transform.SHA512(fromEmail)
                                    ]["mailKey"];
                                var emailVersion =
                                    app.user.get("currentMessageView")[
                                        "version"
                                    ];

                                if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) === true
                                ) {
                                    options.push(
                                        <div
                                            key="sig1"
                                            className="alert alert-success pgpsignature-success"
                                        >
                                            <i className="fa-fw fa fa-check"></i>{" "}
                                            <strong>Signature verified</strong>{" "}
                                            To learn more about{" "}
                                            <strong>
                                                <a
                                                    href="https://blog.cyberfear.com/signatures"
                                                    target="_blank"
                                                >
                                                    signatures
                                                </a>
                                            </strong>
                                            . Link will be open in new tab
                                        </div>
                                    );
                                    thisComp.setState({
                                        signatureHeader: options,
                                    });
                                } else if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) === false
                                ) {
                                    options.push(
                                        <div
                                            key="sig1"
                                            className="alert alert-danger pgpsignature-danger"
                                        >
                                            <i className="fa-fw fa fa-times"></i>{" "}
                                            <strong>Signature mismatch</strong>{" "}
                                            To learn more about{" "}
                                            <strong>
                                                <a
                                                    href="https://blog.cyberfear.com/signatures"
                                                    target="_blank"
                                                >
                                                    signatures
                                                </a>
                                            </strong>
                                            . Link will be open in new tab
                                        </div>
                                    );
                                    thisComp.setState({
                                        signatureHeader: options,
                                    });
                                } else if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) == "old"
                                ) {
                                }
                            } else {
                                options.push(
                                    <div
                                        key="sig1"
                                        className="alert alert-warning pgpsignature-warning"
                                    >
                                        <i className="fa-fw fa fa-warning"></i>{" "}
                                        <strong>
                                            Signature can not be verified
                                        </strong>{" "}
                                        To learn more about{" "}
                                        <strong>
                                            <a
                                                href="https://blog.cyberfear.com/email-signatures"
                                                target="_blank"
                                            >
                                                signatures
                                            </a>
                                        </strong>
                                        . Link will be open in new tab
                                    </div>
                                );
                                thisComp.setState({
                                    signatureHeader: options,
                                });
                            }
                        }
                    }
                );
            }
        },
        renderEmail: function () {
            if (
                app.user.get("currentMessageView")["id"] !== undefined &&
                app.user.get("currentMessageView")["id"] !== ""
            ) {
                clearTimeout(app.user.get("emailOpenTimeOut"));

                var email = app.user.get("currentMessageView");

                var from2 = [];
                var from = app.transform.from64str(email["meta"]["from"]);

                var emailAddress = "";

                if (
                    app.globalF.parseEmail(from)["name"] !=
                    app.globalF.parseEmail(from)["email"]
                ) {
                    from2.push(
                        <span key="ab">
                            <b key="bc">
                                {app.globalF.parseEmail(from)["name"]}
                            </b>
                            {"<" + app.globalF.parseEmail(from)["email"] + ">"}
                        </span>
                    );
                } else {
                    from2.push(
                        <span key="ab">
                            {app.globalF.parseEmail(from)["email"]}
                        </span>
                    );
                }

                var fromExtra = "";

                if (email["meta"]["fromExtra"] != "") {
                    if (app.transform.check64str(email["meta"]["fromExtra"])) {
                        fromExtra = filterXSS(
                            app.transform.from64str(email["meta"]["fromExtra"])
                        );
                    } else {
                        fromExtra = filterXSS(email["meta"]["fromExtra"]);
                    }
                }

                var to = [];
                var cc = [];
                var bcc = [];

                var emailsTo = email["meta"]["to"];
                var emailsCC =
                    email["meta"]["toCC"] != undefined
                        ? email["meta"]["toCC"]
                        : [];
                var emailsBCC =
                    email["meta"]["toBCC"] != undefined
                        ? email["meta"]["toBCC"]
                        : [];

                emailAddress = app.globalF.exctractOwnEmail(emailsTo);

                if (emailAddress === false) {
                    emailAddress = app.globalF.exctractOwnEmail(emailsCC);
                }

                var pins = "";
                var pin = [];

                if (
                    email["meta"]["version"] == 2 &&
                    email["meta"]["pin"] != ""
                ) {
                    pin.push(
                        <span className="pinHeader email-head" key="pin2">
                            PIN:{" "}
                            <span
                                className="label label-success"
                                key="pinLabel2"
                            >
                                {app.transform.from64str(email["meta"]["pin"])}
                            </span>
                        </span>
                    );
                } else if (
                    email["meta"]["pin"] != undefined &&
                    email["meta"]["pin"] != ""
                ) {
                    pins = JSON.parse(email["meta"]["pin"]);
                }

                $.each(emailsTo, function (index, folderData) {
                    folderData = app.transform.from64str(folderData);

                    if (emailsTo.length <= 3) {
                        if (
                            pins[app.globalF.parseEmail(folderData)["email"]] !=
                            undefined
                        ) {
                            var lock = <i className="fa fa-lock"></i>;
                            var title =
                                '<i class="fa fa-lock"></i> ' +
                                app.transform.from64str(
                                    pins[
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    ]["pin"]
                                );
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }
                    } else {
                        if (
                            pins[app.globalF.parseEmail(folderData)["email"]] !=
                            undefined
                        ) {
                            var lock = <i className="fa fa-lock"></i>;
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"] +
                                "<br/>" +
                                '<i class="fa fa-lock"></i> ' +
                                app.transform.from64str(
                                    pins[
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    ]["pin"]
                                );
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }
                    }

                    if (
                        app.globalF.parseEmail(folderData)["name"] !=
                        app.globalF.parseEmail(folderData)["email"]
                    ) {
                        to.push(
                            <span
                                key={index}
                                className="" // badge light email-head
                                data-placement="bottom"
                                data-toggle="popover-hover"
                                title=""
                                data-content={title}
                            >
                                {lock}{" "}
                                <b key={index + "b"}>
                                    {app.globalF.parseEmail(folderData)["name"]}
                                </b>
                                {emailsTo.length <= 3
                                    ? " <" +
                                      app.globalF.parseEmail(folderData)[
                                          "email"
                                      ] +
                                      ">"
                                    : ""}
                            </span>
                        );
                    } else {
                        to.push(
                            <span
                                key={index}
                                className="" // badge light email-head
                                data-placement="bottom"
                                data-toggle="popover-hover"
                                title=""
                                data-content={title}
                            >
                                {lock}{" "}
                                {app.globalF.parseEmail(folderData)["email"]}
                            </span>
                        );
                    }
                });

                if (emailsCC.length > 0) {
                    $.each(emailsCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 1) {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }

                        if (
                            app.globalF.parseEmail(folderData)["name"] !=
                            app.globalF.parseEmail(folderData)["email"]
                        ) {
                            cc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    <b key={index + "b"}>
                                        {
                                            app.globalF.parseEmail(folderData)[
                                                "name"
                                            ]
                                        }
                                    </b>
                                    {emailsCC.length <= 1
                                        ? " <" +
                                          app.globalF.parseEmail(folderData)[
                                              "email"
                                          ] +
                                          ">"
                                        : ""}
                                </span>
                            );
                        } else {
                            cc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    {
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    }
                                </span>
                            );
                        }
                    });
                }

                if (emailsBCC.length > 0) {
                    $.each(emailsBCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 3) {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }

                        if (
                            app.globalF.parseEmail(folderData)["name"] !=
                            app.globalF.parseEmail(folderData)["email"]
                        ) {
                            bcc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    <b key={index + "b"}>
                                        {
                                            app.globalF.parseEmail(folderData)[
                                                "name"
                                            ]
                                        }
                                    </b>
                                    {emailsCC.length <= 3
                                        ? " <" +
                                          app.globalF.parseEmail(folderData)[
                                              "email"
                                          ] +
                                          ">"
                                        : ""}
                                </span>
                            );
                        } else {
                            bcc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    {
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    }
                                </span>
                            );
                        }
                    });
                }
                var message = app.user.get("emails")["messages"][email["id"]];
                if (message["st"] == 0) {
                    var setOpen = setTimeout(function () {
                        message["st"] = message["st"] == 0 ? 3 : message["st"];

                        app.userObjects.updateObjects(
                            "folderUpdate",
                            "",
                            function (result) {
                                app.globalF.syncUpdates();
                            }
                        );
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
                    timeSent: new Date(
                        parseInt(email["meta"]["timeSent"] + "000")
                    ).toLocaleString(),
                    type: "",
                    tag:
                        app.user.get("emails")["messages"][email["id"]]["tg"]
                            .length > 0
                            ? app.transform.from64str(
                                  app.user.get("emails")["messages"][
                                      email["id"]
                                  ]["tg"][0]["name"]
                              )
                            : "",
                    emailBody: app.transform.from64str(email["body"]["html"]),
                    emailBodyTXT: app.transform.from64str(
                        email["body"]["text"]
                    ),
                    attachment: email["attachment"],
                    rawHeadVisible:
                        email["originalBody"]["rawHeader"] == undefined
                            ? "hidden"
                            : "",
                    toggleHTMLtext: "html",
                    pgpEncrypted: email["pgpEncrypted"],
                    hideEmailRead: false,
                });

                // $('[data-toggle="popover-hover"]').popover({
                //     trigger: "hover",
                //     container: ".view-mail-header",
                //     html: true,
                // });

                if (message["tp"] == 2) {
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none",
                    });
                } else {
                    this.renderStrictBody();
                }
                this.setState({
                    hideEmailRead: false,
                });
                this.verifySignature();
            } else {
                this.setState({
                    hideEmailRead: true,
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

                        files.push(
                            <span className="clearfix" key={"a" + index}>
                                <br />
                                <span className="attchments" key={"as" + index}>
                                    {attData["fileName"]}
                                </span>
                                <button
                                    key={"ab" + index}
                                    id={index}
                                    className="btn btn-sm btn-primary pull-right"
                                    onClick={thisComp.handleClick.bind(
                                        thisComp,
                                        "downloadFileDecrypted"
                                    )}
                                >
                                    Download
                                </button>
                            </span>
                        );
                    });
                } else {
                    var size = 0;
                    $.each(this.state.attachment, function (index, attData) {
                        size += parseInt(
                            app.transform.from64str(attData["size"])
                        );

                        if (attData["isPgp"]) {
                            files.push(
                                <span className="clearfix" key={"a" + index}>
                                    <br />
                                    <span
                                        className="attchments"
                                        key={"as" + index}
                                    >
                                        {app.transform.from64str(
                                            attData["name"]
                                        )}
                                    </span>

                                    <div
                                        className="btn-group pull-right"
                                        key={"abc" + index}
                                    >
                                        <button
                                            type="button"
                                            id={index}
                                            className="btn btn-primary"
                                            key={"abcd" + index}
                                            onClick={thisComp.handleClick.bind(
                                                thisComp,
                                                "downloadFile"
                                            )}
                                        >
                                            Download
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <span className="caret"></span>
                                            <span className="sr-only">
                                                Toggle Dropdown
                                            </span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFilePGP"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Decrypt & Display
                                                </a>
                                            </li>
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFilePGP"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Decrypt & Download
                                                </a>
                                            </li>
                                            <li
                                                role="separator"
                                                className="divider"
                                            ></li>
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFile"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Download
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </span>
                            );
                        } else {
                            files.push(
                                <span className="clearfix" key={"a" + index}>
                                    <br />
                                    <span
                                        className="attchments"
                                        key={"as" + index}
                                    >
                                        {app.transform.from64str(
                                            attData["name"]
                                        )}
                                    </span>
                                    <button
                                        key={"ab" + index}
                                        id={index}
                                        className="btn btn-sm btn-primary pull-right"
                                        onClick={thisComp.handleClick.bind(
                                            thisComp,
                                            "downloadFile"
                                        )}
                                    >
                                        Download
                                    </button>
                                </span>
                            );
                        }
                    });
                }

                size =
                    size > 1000000
                        ? Math.round(size / 10000) / 100 + " Mb"
                        : Math.round(size / 10) / 100 + " Kb";

                attachments.push(
                    <div className="panel-footer" key="1">
                        <h5>
                            Attchments (
                            {Object.keys(this.state.attachment).length} file(s),{" "}
                            {size})
                        </h5>
                        <div className="alert alert-warning text-left" key="2">
                            Please use <b>EXTREME</b> caution when downloading
                            files. We strongly recommend scanning them for
                            viruses/malware after downloading.
                        </div>
                        <div className="inbox-download"></div>

                        {files}
                    </div>
                );
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

                    app.userObjects.updateObjects(
                        "folderUpdate",
                        "",
                        function (result) {
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                tag: "",
                            });
                        }
                    );

                    break;

                case "assignLabel":
                    var thisComp = this;
                    var emailId = app.user.get("currentMessageView")["id"];
                    var message = app.user.get("emails")["messages"][emailId];

                    message["tg"] = [];

                    message["tg"].push({ name: $(event.target).attr("value") });

                    var name = $(event.target).attr("value");
                    app.userObjects.updateObjects(
                        "folderUpdate",
                        "",
                        function (result) {
                            app.globalF.syncUpdates();

                            thisComp.setState({
                                tag: app.transform.from64str(name),
                            });
                        }
                    );

                    break;
            }
        },
        getSelected: function () {
            var selected = [];

            selected = Object.keys(app.user.get("selectedEmails"));

            if (selected.length == 0) {
                var item = $("#emailListTable tr.selected").attr("id");
                if (item != undefined) {
                    selected.push(item);
                }
            }
            return selected;
        },

        handleClick: function (i, event) {
            switch (i) {
                case "downloadFilePGP":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton
                        .parent()
                        .parent()
                        .parent()
                        .children()
                        .attr("id");

                    var thisComp = this;

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(
                            emailAttachments[fileBId]["fileName"] +
                                app.user.get("userId")
                        );
                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                        var version = 2;
                    }

                    var type = app.transform.from64str(
                        emailAttachments[fileBId]["type"]
                    );
                    var size = app.transform.from64str(
                        emailAttachments[fileBId]["size"]
                    );
                    var name = app.transform.from64str(
                        emailAttachments[fileBId]["name"]
                    );

                    fileButton
                        .parent()
                        .parent()
                        .parent()
                        .children(":first")
                        .html(
                            '<i class="fa fa-spin fa-refresh"></i> Downloading'
                        );

                    app.globalF.downloadFile(
                        fileName,
                        modKey,
                        version,
                        function (result) {
                            fileButton
                                .parent()
                                .parent()
                                .parent()
                                .children(":first")
                                .html("Download");
                            var decryptedFile64 = app.transform.fromAesBin(
                                key,
                                result
                            );
                            var decryptedFile =
                                app.transform.from64bin(decryptedFile64);

                            thisComp.readPGP(decryptedFile);
                        }
                    );

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

                    var content =
                        file["encoding"] === "base64"
                            ? app.transform.from64bin(file["contents"])
                            : file["contents"];

                    var arbuf = app.globalF.base64ToArrayBuffer(content);

                    var type = file["contentType"];
                    var size =
                        file["encoding"] === "base64"
                            ? app.transform.from64bin(file["contents"]).length
                            : file["contents"].length;
                    var name = file["fileName"];

                    app.globalF.createDownloadLink(arbuf, type, name);

                    break;

                case "downloadFile":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton.attr("id");

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(
                            emailAttachments[fileBId]["fileName"] +
                                app.user.get("userId")
                        );

                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                        var version = 2;
                    } else if (
                        email["version"] == undefined ||
                        email["version"] === 1
                    ) {
                        var fileName = app.transform.from64str(
                            emailAttachments[fileBId]["filename"]
                        );
                        var version = 1;
                        var modKey = "none";

                        var message =
                            app.user.get("emails")["messages"][
                                app.user.get("currentMessageView")["id"]
                            ];

                        var key = app.transform.from64bin(message["p"]);
                    }

                    var type = app.transform.from64str(
                        emailAttachments[fileBId]["type"]
                    );
                    var size = app.transform.from64str(
                        emailAttachments[fileBId]["size"]
                    );
                    var name = app.transform.from64str(
                        emailAttachments[fileBId]["name"]
                    );

                    fileButton.html(
                        '<i class="fa fa-spin fa-refresh"></i> Downloading'
                    );

                    var thisComp = this;

                    app.globalF.downloadFile(
                        fileName,
                        modKey,
                        version,
                        function (result) {
                            if (result === false) {
                                fileButton.html("Download");
                            } else {
                                fileButton.html("Download");

                                var decryptedFile64 = app.transform.fromAesBin(
                                    key,
                                    result
                                );
                                var decryptedFile =
                                    app.transform.from64bin(decryptedFile64);

                                var arbuf =
                                    app.globalF.base64ToArrayBuffer(
                                        decryptedFile
                                    );
                                app.globalF.createDownloadLink(
                                    arbuf,
                                    type,
                                    name
                                );
                            }
                        }
                    );

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
                        trigger: true,
                    });
                    break;

                case "reply":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyFull");
                    } else {
                        app.globalF.reply("replyStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "replyAll":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyAFull");
                    } else {
                        app.globalF.reply("replyAStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                    break;
                case "forward":
                    if (this.state.renderFull) {
                        app.globalF.reply("forwardFull");
                    } else {
                        app.globalF.reply("forwardStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                    break;

                case "renderImages":
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none",
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
                    var html =
                        "<pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["rawHeader"]
                            )
                        ) +
                        "<pre>";
                    html +=
                        "------ HTML ---------" +
                        "<br /><pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["body"]["html"]
                            )
                        ) +
                        "<pre><br />------END HTML ---------<br /><br />";
                    html +=
                        "------ TEXT ---------" +
                        "<br /><pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["body"]["text"]
                            )
                        ) +
                        "<pre><br />------ END TEXT ---------";
                    $(w.document.body).html(html);
                    break;

                case "togglePlainHTML":
                    if (this.state.toggleHTMLtext == "html") {
                        this.setState({
                            toggleHTMLtext: "text",
                        });

                        app.globalF.renderBodyNoImages(
                            "",
                            this.state.emailBodyTXT,
                            function (prerenderedBody) {
                                $("#virtualization").height(0);

                                setTimeout(function () {
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .html(prerenderedBody);

                                    $("#virtualization").height(
                                        $("#virtualization")
                                            .contents()
                                            .find("html")
                                            .height()
                                    );
                                }, 100);
                            }
                        );
                    } else if (this.state.toggleHTMLtext == "text") {
                        this.setState({
                            toggleHTMLtext: "html",
                        });

                        app.globalF.renderBodyNoImages(
                            this.state.emailBody,
                            "",
                            function (prerenderedBody) {
                                $("#virtualization").height(0);

                                setTimeout(function () {
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .html(prerenderedBody);

                                    $("#virtualization").height(
                                        $("#virtualization")
                                            .contents()
                                            .find("html")
                                            .height()
                                    );
                                }, 100);
                            }
                        );
                    }

                    break;
                case "printEmail":
                    var contentToPrint =
                        document.getElementById("mail-data-content").innerHTML;
                    var iFrame = document.getElementById("virtualization");
                    var a = window.open("", "", "height=500, width=500");
                    a.document.write("<html>");
                    a.document.write("<body >");
                    a.document.write(contentToPrint);
                    a.document.write(
                        iFrame.contentWindow.document.body.innerHTML
                    );
                    a.document.write("</body></html>");
                    a.print();
                    a.document.close();

                    break;
                case "moveToTrash":
                    var thisComp = this;
                    this.setState({
                        trashStatus: true,
                        isWorkingFlag: true,
                    });
                    var target = {};
                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target
                        .removeClass("fa-trash-o")
                        .addClass("fa-refresh fa-spin");

                    if (
                        this.props.folderId ==
                            app.user.get("systemFolders")["spamFolderId"] ||
                        this.props.folderId ==
                            app.user.get("systemFolders")["trashFolderId"] ||
                        this.props.folderId ==
                            app.user.get("systemFolders")["draftFolderId"]
                    ) {
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            //console.log(selected);
                            //delete email physically;
                            app.user.set({ currentMessageView: {} });

                            app.globalF.deleteEmailsFromFolder(
                                selected,
                                function (emails2Delete) {
                                    //console.log(emails2Delete);
                                    if (emails2Delete.length > 0) {
                                        app.userObjects.updateObjects(
                                            "deleteEmail",
                                            emails2Delete,
                                            function (result) {
                                                $("#selectAll>input").prop(
                                                    "checked",
                                                    false
                                                );
                                                $("#selectAllAlt > input").prop(
                                                    "checked",
                                                    false
                                                );
                                                app.user.set({
                                                    resetSelectedItems: true,
                                                });
                                                app.globalF.syncUpdates();
                                                app.layout.display("viewBox");

                                                target
                                                    .removeClass(
                                                        "fa-refresh fa-spin"
                                                    )
                                                    .addClass("fa-trash-o");

                                                thisComp.setState({
                                                    trashStatus: false,
                                                    isWorkingFlag: false,
                                                });
                                                $(
                                                    "#mail-extra-options"
                                                ).removeClass("active");
                                            }
                                        );
                                    }
                                }
                            );
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target
                                .removeClass("fa-refresh fa-spin")
                                .addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false,
                            });
                        }
                    } else {
                        var destFolderId =
                            app.user.get("systemFolders")["trashFolderId"];
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            app.user.set({ currentMessageView: {} });
                            app.globalF.move2Folder(
                                destFolderId,
                                selected,
                                function () {
                                    app.userObjects.updateObjects(
                                        "folderUpdate",
                                        "",
                                        function (result) {
                                            $("#selectAll>input").prop(
                                                "checked",
                                                false
                                            );
                                            $("#selectAllAlt > input").prop(
                                                "checked",
                                                false
                                            );
                                            app.user.set({
                                                resetSelectedItems: true,
                                            });
                                            app.globalF.syncUpdates();
                                            app.layout.display("viewBox");

                                            target
                                                .removeClass(
                                                    "fa-refresh fa-spin"
                                                )
                                                .addClass("fa-trash-o");

                                            thisComp.setState({
                                                trashStatus: false,
                                                isWorkingFlag: false,
                                            });
                                            $(
                                                "#mail-extra-options"
                                            ).removeClass("active");
                                        }
                                    );
                                }
                            );
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target
                                .removeClass("fa-refresh fa-spin")
                                .addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false,
                            });
                        }
                    }

                    app.user.set({
                        isDecryptingEmail: false,
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "moveToSpam":
                    // console.log('move to spam');

                    var thisComp = this;

                    thisComp.setState({
                        spamStatus: true,
                        isWorkingFlag: true,
                    });
                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.addClass("fa-spin");

                    var destFolderId =
                        app.user.get("systemFolders")["spamFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ currentMessageView: {} });
                        app.globalF.move2Folder(
                            destFolderId,
                            selected,
                            function () {
                                $.each(selected, function (index, emailId) {
                                    var email = app.transform.from64str(
                                        app.user.get("emails")["messages"][
                                            emailId
                                        ]["fr"]
                                    );
                                    app.globalF.createFilterRule(
                                        "",
                                        "sender",
                                        "strict",
                                        destFolderId,
                                        app.globalF.parseEmail(email)["email"],
                                        function () {}
                                    );
                                });

                                app.userObjects.updateObjects(
                                    "folderSettings",
                                    "",
                                    function (result) {
                                        if (
                                            result["response"] == "success" &&
                                            result["data"] == "saved"
                                        ) {
                                            $("#selectAll>input").prop(
                                                "checked",
                                                false
                                            );
                                            $("#selectAllAlt > input").prop(
                                                "checked",
                                                false
                                            );
                                            app.user.set({
                                                resetSelectedItems: true,
                                            });
                                            app.globalF.syncUpdates();
                                            app.layout.display("viewBox");

                                            target.removeClass("fa-spin");

                                            thisComp.setState({
                                                spamStatus: false,
                                                isWorkingFlag: false,
                                            });
                                            $(
                                                "#mail-extra-options"
                                            ).removeClass("active");
                                        }
                                    }
                                );
                            }
                        );
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin");

                        thisComp.setState({
                            spamStatus: false,
                            isWorkingFlag: false,
                        });
                    }

                    app.user.set({
                        isDecryptingEmail: false,
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;
            }
        },

        readPGP: function (PGPtext) {
            var thisComp = this;

            app.globalF
                .decryptPGPMessage(PGPtext, thisComp.state.emailAddress)
                .then(function (email64, decryptedText) {
                    thisComp.setState({
                        emailBody: decryptedText["html"],
                        emailBodyTXT: decryptedText["text"],
                        attachment: decryptedText["attachments"],
                        decryptedEmail: app.transform.from64str(email64),
                        pgpEncrypted: false,
                    });

                    thisComp.renderStrictBody();
                });
        },

        showDMARC: function () {
            var options = [];

            options.push(
                <div className="dmark-header">
                    <span className="label label-default">DMARC:</span>{" "}
                    <span className="txt-color-green">SPF</span>{" "}
                    <span className="txt-color-green">DKIM</span>{" "}
                    <span className="txt-color-red">PGP Signature</span>{" "}
                    <span className="txt-color-green">Encrypted</span>
                </div>
            );
        },
        componentDidUpdate: function () {
            // console.log(this.state.emailLoading);
        },
        renderFull: function () {
            app.globalF.renderBodyFull(
                this.state.emailBody,
                this.state.emailBodyTXT,
                function (prerenderedBody) {
                    $("#virtualization").height(0);
                    setTimeout(function () {
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .html(prerenderedBody);
                        $("#virtualization").height(
                            $("#virtualization")
                                .contents()
                                .find("html")
                                .height() + 50
                        );
                    }, 300);
                }
            );
            this.setState({
                renderFull: true,
            });
        },

        renderStrictBody: function () {
            var thisComp = this;
            app.globalF.renderBodyNoImages(
                this.state.emailBody,
                this.state.emailBodyTXT,
                function (prerenderedBody) {
                    $("#virtualization").height(0);

                    if (
                        thisComp.state.pgpEncrypted &&
                        !thisComp.state.decryptedEmail
                    ) {
                        prerenderedBody =
                            "<div style='white-space: pre-line;'>" +
                            prerenderedBody +
                            "</div>";
                    }

                    setTimeout(function () {
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .html(prerenderedBody);

                        $("#virtualization").height(
                            $("#virtualization")
                                .contents()
                                .find("html")
                                .height() + 50
                        );

                        var tt = app.mixins.touchMixins();

                        $("#virtualization")
                            .contents()
                            .bind("touchstart", function () {
                                {
                                    tt.handleTouchStart;
                                }
                            });
                        $("#virtualization")
                            .contents()
                            .bind("touchmove", function () {
                                {
                                    tt.handleTouchMove;
                                }
                            });
                        $("#virtualization")
                            .contents()
                            .bind("touchend", function () {
                                {
                                    tt.handleTouchEnd;
                                }
                            });
                    }, 300);
                }
            );
        },

        handleBackToEmailList: function () {
            $("#appRightSide").css("display", "none");
            $("#wrapper").removeClass("email-read-active");
        },

        render: function () {
            return (
                <div>
                    <div
                        className={
                            this.state.isWorkingFlag
                                ? "in-working popup d-block"
                                : "in-working popup d-none"
                        }
                    >
                        <div className="wrapper">
                            <div className="inner">
                                <div className="content">
                                    <div className="t-animation">
                                    <div className="loading-animation type-progress style-circle">
                                    <div className="progress-circle">
                                        <div className="circle-bg">
                                            <svg
                                                role="progressbar"
                                                width="140"
                                                height="140"
                                                viewBox="0 0 100 100"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                aria-valuenow="50"
                                            >
                                                <circle
                                                    cx="50%"
                                                    cy="50%"
                                                    r="42"
                                                    shapeRendering="geometricPrecision"
                                                    fill="none"
                                                    stroke="#E1E4EC"
                                                    strokeWidth="2"
                                                ></circle>
                                                <circle
                                                    id="the_circle_progress"
                                                    cx="50%"
                                                    cy="50%"
                                                    r="42"
                                                    shapeRendering="geometricPrecision"
                                                    fill="none"
                                                    strokeWidth="2"
                                                    strokeDashoffset={parseInt(
                                                        `264 * ${app.userObjects.get(
                                                            "modalpercentage"
                                                        )} / 100`
                                                    )}
                                                    strokeDasharray="264"
                                                    strokeLinecap=""
                                                    stroke="#2277f6"
                                                    dataAngel="50"
                                                ></circle>
                                            </svg>
                                        </div>
                                        <div className="circle-content">
                                            <svg
                                                width="32"
                                                height="33"
                                                viewBox="0 0 32 33"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M16.2745 0.64386C7.30038 0.64386 0.714844 5.06401 0.714844 5.06401C0.714844 13.7095 4.91569 20.6867 8.95191 25.3956C10.6883 24.0862 12.1842 22.7672 13.4672 21.4719C10.716 18.2537 7.88883 13.8246 6.98332 8.54008C9.18794 7.62106 12.4711 6.61458 16.2738 6.61458C20.0521 6.61458 23.3436 7.62556 25.563 8.54972C24.3861 15.4002 19.9814 20.8134 16.7009 24.0103C15.2931 25.4637 13.6615 26.9371 11.772 28.3887C14.3065 30.8409 16.2738 32.1644 16.2738 32.1644C16.2738 32.1644 31.8334 21.7021 31.8334 5.06337C31.8341 5.06402 25.2486 0.64386 16.2745 0.64386Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                    </div>
                                    <div className="t-text">
                                        <h2>Processing...</h2>
                                        <h6>
                                            Please wait while we set things up
                                            for you.
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-side" id="appRightSide">
                        <div className="email-conetent-wrp">
                            <div
                                className={`mail-data emailNo ${
                                    this.state.hideEmailRead
                                        ? "d-active"
                                        : "d-none"
                                }`}
                            >
                                <div>
                                    <h1>{`Please Select Email`}</h1>
                                    <p>
                                        <strong>
                                            <a
                                                href="https://blog.cyberfear.com/"
                                                target="_blank"
                                            >
                                                Our Blog: blog.cyberfear.com
                                            </a>
                                        </strong>
                                    </p>
                                    <p>
                                        Comments or question? <br /> Please
                                        contact us at{" "}
                                        <strong>cyberfear@cyberfear.com</strong>
                                    </p>
                                </div>
                                <div
                                    className={`d-decrypting-message ${
                                        app.user.get("isDecryptingEmail")
                                            ? "d-block"
                                            : "d-none"
                                    }`}
                                >
                                    <h3 style={{ textAlign: "center" }}>
                                        Decrypting...
                                    </h3>
                                </div>
                            </div>

                            <div
                                className={`email-content-top ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div className={`email-title-wrapper`}>
                                    <div>
                                        <h1 className="email-subject">
                                            {this.state.subject}
                                        </h1>
                                    </div>
                                    <div className="email-sent-date">
                                        {this.state.timeSent}
                                    </div>
                                </div>
                                <div className="email-additional-details">
                                    <div className="email-content-top-left">
                                        <div className="email-content-header-bottom-details">
                                            <div className="word color-1">
                                                {this.state.from !== ""
                                                    ? this.state.from[0]._store.props.children
                                                          .toString()
                                                          .charAt(0)
                                                    : ""}
                                            </div>
                                            <div className="sender-name">
                                                <div>{this.state.from} </div>
                                                <span>
                                                    {this.state.fromExtra}
                                                </span>
                                            </div>
                                            <div className="sender-detail-dropdown">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-secondary dropdown-toggle"
                                                        type="button"
                                                        id="sender-details"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        To me{" "}
                                                        <span className="arrow"></span>{" "}
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu"
                                                        aria-labelledby="sender-details"
                                                    >
                                                        <li>
                                                            <span>from:</span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .from
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                reply-to:
                                                            </span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .from
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>to:</span>
                                                            <div>
                                                                {this.state.to}
                                                            </div>
                                                        </li>
                                                        <li className="sent_date_time">
                                                            <span>date:</span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .timeSent
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                subject:
                                                            </span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .subject
                                                                }
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="email-content-top-right">
                                        <div
                                            className="mail-back"
                                            onClick={this.handleBackToEmailList.bind(
                                                this
                                            )}
                                        ></div>
                                        <div className="right-menus">
                                            <div className="button-group">
                                                <button
                                                    className="back"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "reply"
                                                    )}
                                                ></button>
                                                <button
                                                    className="next"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "forward"
                                                    )}
                                                ></button>
                                                <button className="star"></button>
                                                <button
                                                    className="delete"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "moveToTrash"
                                                    )}
                                                ></button>
                                            </div>
                                            <div className="content-list-menu">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-secondary dropdown-toggle"
                                                        type="button"
                                                        id="content-list"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    ></button>
                                                    <ul
                                                        className="dropdown-menu"
                                                        aria-labelledby="content-list"
                                                    >
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "reply"
                                                                )}
                                                            >
                                                                Reply
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "forward"
                                                                )}
                                                            >
                                                                Forward
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "printEmail"
                                                                )}
                                                            >
                                                                Print
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "moveToTrash"
                                                                )}
                                                            >
                                                                Delete this
                                                                message
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "moveToSpam"
                                                                )}
                                                            >
                                                                Report Spam
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    this,
                                                                    "showHeader"
                                                                )}
                                                            >
                                                                Show Raw Header
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`real-sender ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div>
                                    <span className="sender-icon">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.5067 9.61325L9.23998 1.93325C8.66665 0.899919 7.87332 0.333252 6.99998 0.333252C6.12665 0.333252 5.33332 0.899919 4.75998 1.93325L0.493318 9.61325C-0.0466816 10.5933 -0.106682 11.5333 0.326652 12.2733C0.759985 13.0133 1.61332 13.4199 2.73332 13.4199H11.2667C12.3867 13.4199 13.24 13.0133 13.6733 12.2733C14.1067 11.5333 14.0467 10.5866 13.5067 9.61325ZM6.49998 4.99992C6.49998 4.72658 6.72665 4.49992 6.99998 4.49992C7.27332 4.49992 7.49998 4.72658 7.49998 4.99992V8.33325C7.49998 8.60658 7.27332 8.83325 6.99998 8.83325C6.72665 8.83325 6.49998 8.60658 6.49998 8.33325V4.99992ZM7.47332 10.8066C7.43998 10.8333 7.40665 10.8599 7.37332 10.8866C7.33332 10.9133 7.29332 10.9333 7.25332 10.9466C7.21332 10.9666 7.17332 10.9799 7.12665 10.9866C7.08665 10.9933 7.03998 10.9999 6.99998 10.9999C6.95998 10.9999 6.91332 10.9933 6.86665 10.9866C6.82665 10.9799 6.78665 10.9666 6.74665 10.9466C6.70665 10.9333 6.66665 10.9133 6.62665 10.8866C6.59332 10.8599 6.55998 10.8333 6.52665 10.8066C6.40665 10.6799 6.33332 10.5066 6.33332 10.3333C6.33332 10.1599 6.40665 9.98659 6.52665 9.85992C6.55998 9.83325 6.59332 9.80658 6.62665 9.77992C6.66665 9.75325 6.70665 9.73325 6.74665 9.71992C6.78665 9.69992 6.82665 9.68659 6.86665 9.67992C6.95332 9.65992 7.04665 9.65992 7.12665 9.67992C7.17332 9.68659 7.21332 9.69992 7.25332 9.71992C7.29332 9.73325 7.33332 9.75325 7.37332 9.77992C7.40665 9.80658 7.43998 9.83325 7.47332 9.85992C7.59332 9.98659 7.66665 10.1599 7.66665 10.3333C7.66665 10.5066 7.59332 10.6799 7.47332 10.8066Z"
                                                fill="#2277F6"
                                            />
                                        </svg>
                                    </span>
                                    Mail from:{" "}
                                    <span className="sender-email">
                                        {this.state.from}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`image-disabled ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div className={this.state.renderButtonClass}>
                                    To protect you from tracking, images are
                                    disabled.{" "}
                                    <a
                                        className="btn btn-default btn-xs"
                                        href="javascript:void(0)"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "renderImages"
                                        )}
                                    >
                                        Render Images
                                    </a>
                                </div>
                            </div>
                            <div
                                id="mail-data-content"
                                className={`mail-data ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <iframe
                                    id="virtualization"
                                    scrolling="no"
                                    frameBorder="0"
                                    width="100%"
                                ></iframe>
                                {this.displayAttachments()}
                            </div>
                        </div>
                        <div
                            className={
                                "emailShow " +
                                (this.state.hideEmailRead ? "hidden" : "")
                            }
                        ></div>
                    </div>
                </div>
            );
        },
    });
});
