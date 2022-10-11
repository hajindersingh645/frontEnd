define(["react", "app", "dataTable", "dataTableBoot"], function (React, app) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            var dataSet = [];

            return {
                dataSet: dataSet,
                mainChecker: [],
                emailInFolder: 0,
                displayedFolder: "",
                messsageId: "",
                allChecked: false,
                emailList: [],
                showPreview: true,
                checkNewMails: false,
            };
        },
        componentWillReceiveProps: function (nextProps) {
            if (
                this.props.folderId != nextProps.folderId &&
                this.props.folderId != ""
            ) {
                this.updateEmails(nextProps.folderId, "");
            }
        },
        updateEmails: function (folderId, noRefresh) {
            var thisComp = this;
            var emails = app.user.get("emails")["folders"][folderId];

            var emailListCopy = app.user.get("folderCached");

            if (emailListCopy[folderId] === undefined) {
                emailListCopy[folderId] = {};
            }

            thisComp.setState({
                displayedFolder: app.transform.from64str(
                    app.user.get("folders")[folderId]["name"]
                ),
                emailInFolder: Object.keys(emails).length,
            });

            app.user.set({
                currentFolder: app.transform.from64str(
                    app.user.get("folders")[folderId]["name"]
                ),
            });

            if (app.user.get("folders")[folderId]["role"] != undefined) {
                var t = app.transform.from64str(
                    app.user.get("folders")[folderId]["role"]
                );
            } else {
                var t = "";
            }

            //console.log(t);

            var data = [];
            var d = new Date();
            var trusted = app.user.get("trustedSenders");
            var encrypted2 = "";

            $.each(emails, function (index, folderData) {
                if (emailListCopy[folderId][index] !== undefined) {
                    var unread =
                        folderData["st"] == 0
                            ? "unread"
                            : folderData["st"] == 1
                            ? "fa fa-mail-reply"
                            : folderData["st"] == 2
                            ? "fa fa-mail-forward"
                            : "";

                    var row = {
                        DT_RowId: index,
                        email: {
                            display:
                                '<div class="email no-padding ' +
                                unread +
                                '">' +
                                emailListCopy[folderId][index]["checkBpart"] +
                                emailListCopy[folderId][index]["dateAtPart"] +
                                emailListCopy[folderId][index]["fromPart"] +
                                '<div class="mail-toggle"><div class="mail-title">' +
                                emailListCopy[folderId][index]["sb"] +
                                "</div> <p>" +
                                emailListCopy[folderId][index]["bd"] +
                                "</p></div>" +
                                emailListCopy[folderId][index]["tagPart"] +
                                "</div>",

                            //"open":folderData['o']?1:0,
                            timestamp:
                                emailListCopy[folderId][index]["timestamp"],
                        },
                    };
                } else {
                    var time =
                        folderData["tr"] != undefined
                            ? folderData["tr"]
                            : folderData["tc"] != undefined
                            ? folderData["tc"]
                            : "";

                    if (
                        d.toDateString() ==
                        new Date(parseInt(time + "000")).toDateString()
                    ) {
                        var dispTime = new Date(
                            parseInt(time + "000")
                        ).toLocaleTimeString();
                    } else {
                        var dispTime = new Date(
                            parseInt(time + "000")
                        ).toLocaleDateString();
                    }
                    var fromEmail = [];
                    var fromTitle = [];
                    var recipient = [];
                    var recipientTitle = [];
                    var trust = "";
                    if (folderData["to"].length > 0) {
                        $.each(folderData["to"], function (indexTo, email) {
                            if (app.transform.check64str(email)) {
                                var str = app.transform.from64str(email);
                            } else {
                                var str = email;
                            }

                            recipient.push(app.globalF.parseEmail(str)["name"]);
                            recipientTitle.push(
                                app.globalF.parseEmail(str)["email"]
                            );
                        });
                    } else if (Object.keys(folderData["to"]).length > 0) {
                        $.each(folderData["to"], function (indexTo, email) {
                            try {
                                var str = app.transform.from64str(indexTo);

                                var name = "";
                                if (email === undefined) {
                                    name = str;
                                } else {
                                    if (email["name"] === undefined) {
                                        name = str;
                                    } else {
                                        if (email["name"] === "") {
                                            name = str;
                                        } else {
                                            name = app.transform.from64str(
                                                email["name"]
                                            );
                                        }
                                    }
                                }

                                recipient.push(name);
                                recipientTitle.push(str);
                            } catch (err) {
                                recipient.push("error");
                                recipientTitle.push("error");
                            }
                        });
                    }
                    if (t == "Sent" || t == "Draft") {
                        fromEmail = "";
                        fromTitle = "";

                        if (
                            folderData["cc"] != undefined &&
                            Object.keys(folderData["cc"]).length > 0
                        ) {
                            $.each(folderData["cc"], function (indexCC, email) {
                                try {
                                    var str = app.transform.from64str(indexCC);
                                    var name = "";
                                    if (email === undefined) {
                                        name = str;
                                    } else {
                                        if (email["name"] === undefined) {
                                            name = str;
                                        } else {
                                            if (email["name"] === "") {
                                                name = str;
                                            } else {
                                                name = app.transform.from64str(
                                                    email["name"]
                                                );
                                            }
                                        }
                                    }
                                    recipient.push(name);
                                    recipientTitle.push(str);
                                } catch (err) {
                                    recipient.push("error");
                                    recipientTitle.push("error");
                                }
                            });
                        }

                        if (
                            folderData["bcc"] != undefined &&
                            Object.keys(folderData["bcc"]).length > 0
                        ) {
                            $.each(
                                folderData["bcc"],
                                function (indexBCC, email) {
                                    try {
                                        var str =
                                            app.transform.from64str(indexBCC);
                                        var name = "";
                                        if (email === undefined) {
                                            name = str;
                                        } else {
                                            if (email["name"] === undefined) {
                                                name = str;
                                            } else {
                                                if (email["name"] === "") {
                                                    name = str;
                                                } else {
                                                    name =
                                                        app.transform.from64str(
                                                            email["name"]
                                                        );
                                                }
                                            }
                                        }
                                        recipient.push(name);
                                        recipientTitle.push(str);
                                    } catch (err) {
                                        recipient.push("error");
                                        recipientTitle.push("error");
                                    }
                                }
                            );
                        }

                        recipient = recipient.join(", ");
                        recipientTitle = recipientTitle.join(", ");

                        fromEmail = recipient;
                        fromTitle = recipientTitle;
                    } else {
                        var str = app.transform.from64str(folderData["fr"]);

                        fromEmail = app.globalF.parseEmail(str, true)["name"];
                        fromTitle = app.globalF.parseEmail(str, true)["email"];

                        if (
                            trusted.indexOf(
                                app.transform.SHA256(
                                    app.globalF.parseEmail(str)["email"]
                                )
                            ) !== -1
                        ) {
                            trust =
                                "<img src='/img/logo/logo.png' style='height:25px'/>";
                        } else {
                            trust = "";
                        }
                        recipient = recipient.join(", ");
                        recipientTitle = recipientTitle.join(", ");
                    }

                    if (folderData["tg"].length > 0) {
                        var tag = folderData["tg"][0]["name"];
                    } else {
                        var tag = "";
                    }

                    if (parseInt(folderData["en"]) == 1) {
                        encrypted2 = "<i class='fa fa-lock fa-lg'></i>";
                    } else if (parseInt(folderData["en"]) == 0) {
                        encrypted2 = "<i class='fa fa-unlock fa-lg'></i>";
                    } else if (parseInt(folderData["en"]) == 3) {
                        encrypted2 = "";
                    }

                    tag = app.globalF.stripHTML(app.transform.from64str(tag));
                    var unread =
                        folderData["st"] == 0
                            ? "unread"
                            : folderData["st"] == 1
                            ? "fa fa-mail-reply"
                            : folderData["st"] == 2
                            ? "fa fa-mail-forward"
                            : "";

                    var attch =
                        folderData["at"] == "1"
                            ? '<span class="fa fa-paperclip fa-lg"></span>'
                            : "";

                    if (fromEmail == "") {
                        fromEmail = fromTitle;
                    }

                    // var checkBpart = '<label><input class="emailchk hidden-xs" type="checkbox" /></label>';
                    var checkBpart =
                        '<div class="select-checkbox"><label class="container-checkbox"><input type="checkbox" name="inbox-email"> <span class="checkmark"></span></label></div>';

                    // var fromPart =
                    //     '<span class="from no-padding col-xs-8 col-md-3 ellipsisText margin-right-10" data-placement="bottom" data-toggle="popover-hover" title="" data-content="' +
                    //     fromTitle +
                    //     '">' +
                    //     trust +
                    //     " " +
                    //     fromEmail +
                    //     "</span>";

                    var fromPart =
                        '<div class="inbox-list-top" data-content="' +
                        fromTitle +
                        '">' +
                        trust +
                        " " +
                        fromEmail +
                        '<span class="unread-bullet"></span> </div>';

                    // var dateAtPart =
                    //     '<span class="no-padding date col-xs-3 col-sm-2">' +
                    //     attch +
                    //     "&nbsp;" +
                    //     encrypted2 +
                    //     " " +
                    //     dispTime +
                    //     '<span class="label label-primary f-s-10"></span><span class="label label-primary f-s-10"></span></span>';

                    var dateAtPart =
                        '<div class="date-time">' +
                        attch +
                        "&nbsp;" +
                        encrypted2 +
                        " " +
                        dispTime +
                        "</div>";

                    var tagPart =
                        '<div class="mailListLabel pull-right text-right col-xs-2"><div class="ellipsisText visible-xs"><span class="label label-success">' +
                        tag +
                        '</span></div><div class="ellipsisText hidden-xs col-xs-12 pull-right"><span class="label label-success">' +
                        tag +
                        "</span></div></div>";

                    emailListCopy[folderId][index] = {
                        DT_RowId: index,
                        unread: unread,
                        checkBpart: checkBpart,
                        dateAtPart: dateAtPart,
                        fromPart: fromPart,
                        sb: app.transform.escapeTags(
                            app.transform.from64str(folderData["sb"])
                        ),
                        bd: app.transform.escapeTags(
                            app.transform.from64str(folderData["bd"])
                        ),
                        tagPart: tagPart,
                        timestamp: time,
                    };

                    var row = {
                        DT_RowId: index,
                        email: {
                            display:
                                '<div class="email no-padding ' +
                                emailListCopy[folderId][index]["unread"] +
                                '">' +
                                emailListCopy[folderId][index]["checkBpart"] +
                                emailListCopy[folderId][index]["dateAtPart"] +
                                emailListCopy[folderId][index]["fromPart"] +
                                '<div class="mail-toggle"><div class="mail-title">' +
                                emailListCopy[folderId][index]["sb"] +
                                "</div> <p>" +
                                emailListCopy[folderId][index]["bd"] +
                                "</p></div>" +
                                emailListCopy[folderId][index]["tagPart"] +
                                "</div>",

                            timestamp:
                                emailListCopy[folderId][index]["timestamp"],
                        },
                    };
                }

                data.push(row);
            });

            app.user.set({ folderCached: emailListCopy });

            var emTab = $("#emailListTable").DataTable();
            emTab.clear();
            if (noRefresh == "") {
                emTab.draw();
                thisComp.setState(
                    {
                        messsageId: "",
                        allChecked: false,
                    },
                    function () {
                        $("#selectAll>input").prop("checked", false);
                    }
                );
            }

            emTab.rows.add(data);
            emTab.draw(false);

            // this.attachTooltip();

            $("#emailListTable td").click(function () {
                var selectedEmails = app.user.get("selectedEmails");
                if ($(this).find(".emailchk").prop("checked")) {
                    selectedEmails[$(this).parents("tr").attr("id")] = true;
                } else {
                    delete selectedEmails[$(this).parents("tr").attr("id")];
                }
            });
        },
        handleShowPreview: function () {
            var thisComp = this;
            if (thisComp.state.showPreview) {
                $(document).find(".mail-toggle").addClass("d-none");
            } else {
                $(document).find(".mail-toggle").removeClass("d-none");
            }
            thisComp.setState({
                showPreview: !thisComp.state.showPreview,
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:checkNewEmails");
        },
        componentDidMount: function () {
            var dtSet = this.state.dataSet;
            var thisComp = this;

            app.user.on("change:checkNewEmails", function () {
                thisComp.setState({
                    checkNewMails: app.user.get("checkNewEmails"),
                });
            });

            $("#emailListTable").dataTable({
                dom: '<"#checkAll"><"#emailListNavigation"pi>rt<"pull-right"p><"pull-right"i>',
                data: dtSet,
                columns: [
                    {
                        data: {
                            _: "email.display",
                            sort: "email.timestamp",
                            filter: "email.display",
                        },
                    },
                ],

                columnDefs: [
                    {
                        sClass: "col-xs-12 border-right text-align-left no-padding padding-vertical-10",
                        targets: 0,
                    },
                    { orderDataType: "data-sort", targets: 0 },
                ],
                sPaginationType: "simple",
                order: [[0, "desc"]],
                iDisplayLength: app.user.get("mailPerPage"),
                language: {
                    emptyTable: "Empty",
                    info: "_START_ - _END_ of _TOTAL_",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                    },
                },
                fnDrawCallback: function (
                    nRow,
                    aData,
                    iDisplayIndex,
                    iDisplayIndexFull
                ) {
                    $("#emailListTable thead").remove();
                },
                fnRowCallback: function (
                    nRow,
                    aData,
                    iDisplayIndex,
                    iDisplayIndexFull
                ) {
                    if (
                        $(nRow).attr("id") ==
                        app.user.get("currentMessageView")["id"]
                    ) {
                        $(nRow).addClass("selected");
                    }

                    if (
                        app.user.get("selectedEmails")[$(nRow).attr("id")] !==
                        undefined
                    ) {
                        $(nRow).find(".emailchk").prop("checked", true);
                    }
                    //$(nRow).attr('id', aData[0]);

                    return nRow;
                },
            });

            app.globalF.getInboxFolderId(function (inbox) {
                thisComp.updateEmails(inbox, "");
            });
            app.user.on(
                "change:resetSelectedItems",
                function () {
                    if (app.user.get("resetSelectedItems")) {
                        app.user.set({ selectedEmails: {} });
                        app.user.set({ resetSelectedItems: false });
                    }
                },
                thisComp
            );
            app.user.on(
                "change:emailListRefresh",
                function () {
                    // $("#sdasdasd").addClass("hidden"); - find this in original inbox page
                    thisComp.updateEmails(thisComp.props.folderId, "noRefresh");
                },
                thisComp
            );
        },
        handleClick: function (i, event) {
            switch (i) {
                case "wholeFolder":
                    //  console.log('wholeFolder')
                    break;

                case "thisPage":
                    //  console.log('thisPage')
                    break;

                case "readEmail":
                    var thisComp = this;

                    var folder =
                        app.user.get("folders")[this.props.folderId]["name"];

                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            // console.log($(event.target).is("li"));
                            // var id = $(event.target).parents("li").attr("id");
                            var id = $(event.target).parents("tr").attr("id");
                            if (!$(event.target).is("input")) {
                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                Backbone.history.navigate(
                                    "/mail/" + app.transform.from64str(folder),
                                    {
                                        trigger: true,
                                    }
                                );

                                if (
                                    id != undefined &&
                                    $(event.target).attr("type") !=
                                        "checkbox" &&
                                    $(event.target).prop("tagName") != "LABEL"
                                ) {
                                    // $("#sdasdasd").removeClass("hidden"); - [NEW VERSION AVAILABLE BUTTON]
                                    // TODO: check if following is needed, otherwise remove it
                                    // $("#mMiddlePanelTop").addClass(
                                    //     " hidden-xs hidden-sm hidden-md"
                                    // );
                                    // $("#mRightPanel").removeClass(
                                    //     " hidden-xs hidden-sm hidden-md"
                                    // );
                                    var table =
                                        $("#emailListTable").DataTable();
                                    table
                                        .$("tr.selected")
                                        .removeClass("selected");

                                    $(event.target)
                                        .parents("tr")
                                        .toggleClass("selected");

                                    $("#appRightSide").css("display", "block");

                                    thisComp.setState({
                                        messsageId: id,
                                    });

                                    app.globalF.renderEmail(id);

                                    app.mixins.hidePopHover();
                                }
                            }
                        } else {
                        }
                    });

                    break;
            }
        },
        handleRefreshButton: function (event) {
            app.mailMan.startShift();

            const _event = event;
            _event.target.children[0].classList.add("spin-animation");
            this.removeRefreshClass(_event.target.children[0]);
        },
        handleSearchChange: function (event) {
            $("#emailListTable")
                .DataTable()
                .column(0)
                .search(event.target.value, 0, 1)
                .draw();
        },
        removeRefreshClass: function (_element) {
            setTimeout(function () {
                _element.classList.remove("spin-animation");
            }, 500);
        },
        render: function () {
            return (
                <div className="middle-section" id="appMiddleSection">
                    <div className="middle-top">
                        <div className="desktop-search">
                            <input
                                type="search"
                                placeholder="Search..."
                                onChange={this.handleSearchChange.bind(this)}
                            />
                        </div>
                        <div className="info-row">
                            <div className="all-check">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        // onClick="toggle(this)"
                                    />
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
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="mail-sort"
                                    >
                                        <li>
                                            <label className="container-checkbox">
                                                <input
                                                    type="checkbox"
                                                    // onClick="toggle(this)"
                                                />
                                                <span className="checkmark"></span>{" "}
                                                <div>Select all</div>
                                            </label>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="star-yellow"></span>{" "}
                                                <div>Show all starred</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="star-gray"></span>{" "}
                                                <div>Show unstarred</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="eye"></span>{" "}
                                                <div>Show all read</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="eye-close"></span>{" "}
                                                <div>Show all unread</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={this.handleShowPreview.bind(
                                                    this
                                                )}
                                            >
                                                {" "}
                                                {this.state.showPreview ? (
                                                    <span className="eye"></span>
                                                ) : (
                                                    <span className="eye-close"></span>
                                                )}{" "}
                                                <div>
                                                    {this.state.showPreview
                                                        ? "Hide email preview"
                                                        : "Show email preview"}
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="info-row-right">
                                <div className="referesh-btn">
                                    <button
                                        id="referesh-btn"
                                        className="icon-btn"
                                        onClick={this.handleRefreshButton.bind(
                                            this
                                        )}
                                    >
                                        <i></i>
                                    </button>
                                </div>
                                <div className="arrow-btn ellipsis-dropdown">
                                    <div className="dropdown dropstart">
                                        <button
                                            className="btn btn-secondary dropdown-toggle"
                                            type="button"
                                            id="mail-extra-options"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        ></button>
                                        <ul
                                            className="dropdown-menu"
                                            id="mail-extra-options"
                                        >
                                            <li>
                                                <button>
                                                    <div>Move To</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button>
                                                    <div>Delete</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button>
                                                    <div>Spam</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button>
                                                    <div>Mark as Read</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button>
                                                    <div>Mark as Unead</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button>
                                                    <div>Block Sender</div>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="middle-content">
                        <div className="inbox-list">
                            <table
                                className="table table-hover table-inbox row-border clickable"
                                id="emailListTable"
                                onClick={this.handleClick.bind(
                                    this,
                                    "readEmail"
                                )}
                            ></table>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
