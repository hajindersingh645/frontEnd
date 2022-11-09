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

                moveFolderMain: [],
                moveFolderCust: [],
                checkNewMails: false,
                trashStatus: false,
                spamStatus: false,
                blackList: false,
                pastDue: false,
                balanceShort: false,
                hidden: true,
                isWorkingFlag: false
            };
        },
        componentWillReceiveProps: function (nextProps) {
            if (this.props.folderId != nextProps.folderId && this.props.folderId != "") {
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
                displayedFolder: app.transform.from64str(app.user.get("folders")[folderId]["name"]),
                emailInFolder: Object.keys(emails).length
            });

            app.user.set({
                currentFolder: app.transform.from64str(app.user.get("folders")[folderId]["name"])
            });

            if (app.user.get("folders")[folderId]["role"] != undefined) {
                var t = app.transform.from64str(app.user.get("folders")[folderId]["role"]);
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
                    var unread = folderData["st"] == 0 ? "unread" : folderData["st"] == 1 ? "fa fa-mail-reply" : folderData["st"] == 2 ? "fa fa-mail-forward" : "";
                    var showPreview = thisComp.state.showPreview ? "" : "d-none";
                    var row = {
                        DT_RowId: index,
                        email: {
                            display: '<div class="email no-padding ' + unread + '">' + emailListCopy[folderId][index]["checkBpart"] + emailListCopy[folderId][index]["dateAtPart"] + emailListCopy[folderId][index]["fromPart"] + '<div class="mail-toggle ' + showPreview + '"><div class="mail-title">' + emailListCopy[folderId][index]["sb"] + "</div> <p>" + emailListCopy[folderId][index]["bd"] + "</p></div>" + emailListCopy[folderId][index]["tagPart"] + "</div>",

                            //"open":folderData['o']?1:0,
                            timestamp: emailListCopy[folderId][index]["timestamp"]
                        }
                    };
                } else {
                    var time = folderData["tr"] != undefined ? folderData["tr"] : folderData["tc"] != undefined ? folderData["tc"] : "";

                    if (d.toDateString() == new Date(parseInt(time + "000")).toDateString()) {
                        var dispTime = new Date(parseInt(time + "000")).toLocaleTimeString();
                    } else {
                        var dispTime = new Date(parseInt(time + "000")).toLocaleDateString();
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
                            recipientTitle.push(app.globalF.parseEmail(str)["email"]);
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
                                            name = app.transform.from64str(email["name"]);
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

                        if (folderData["cc"] != undefined && Object.keys(folderData["cc"]).length > 0) {
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
                                                name = app.transform.from64str(email["name"]);
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

                        if (folderData["bcc"] != undefined && Object.keys(folderData["bcc"]).length > 0) {
                            $.each(folderData["bcc"], function (indexBCC, email) {
                                try {
                                    var str = app.transform.from64str(indexBCC);
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
                                                name = app.transform.from64str(email["name"]);
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

                        recipient = recipient.join(", ");
                        recipientTitle = recipientTitle.join(", ");

                        fromEmail = recipient;
                        fromTitle = recipientTitle;
                    } else {
                        var str = app.transform.from64str(folderData["fr"]);

                        fromEmail = app.globalF.parseEmail(str, true)["name"];
                        fromTitle = app.globalF.parseEmail(str, true)["email"];

                        if (trusted.indexOf(app.transform.SHA256(app.globalF.parseEmail(str)["email"])) !== -1) {
                            trust = "<img src='/img/logo/logo.png' style='height:25px'/>";
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
                    var unread = folderData["st"] == 0 ? "unread" : folderData["st"] == 1 ? "fa fa-mail-reply" : folderData["st"] == 2 ? "fa fa-mail-forward" : "";

                    var attch = folderData["at"] == "1" ? '<span class="fa fa-paperclip fa-lg"></span>' : "";

                    if (fromEmail == "") {
                        fromEmail = fromTitle;
                    }

                    // var checkBpart = '<label><input class="emailchk hidden-xs" type="checkbox" /></label>';
                    var checkBpart = '<div class="select-checkbox"><label class="container-checkbox"><input type="checkbox" name="inbox-email"> <span class="checkmark"></span></label></div>';

                    // var fromPart =
                    //     '<span class="from no-padding col-xs-8 col-md-3 ellipsisText margin-right-10" data-placement="bottom" data-toggle="popover-hover" title="" data-content="' +
                    //     fromTitle +
                    //     '">' +
                    //     trust +
                    //     " " +
                    //     fromEmail +
                    //     "</span>";

                    var fromPart = '<div class="inbox-list-top" data-content="' + fromTitle + '"><span class="inbox-list-top-content">' + trust + " " + fromEmail + '</span><span class="unread-bullet"></span> </div>';

                    // var dateAtPart =
                    //     '<span class="no-padding date col-xs-3 col-sm-2">' +
                    //     attch +
                    //     "&nbsp;" +
                    //     encrypted2 +
                    //     " " +
                    //     dispTime +
                    //     '<span class="label label-primary f-s-10"></span><span class="label label-primary f-s-10"></span></span>';

                    var dateAtPart = '<div class="date-time">' + attch + "&nbsp;" + encrypted2 + " " + dispTime + "</div>";

                    var tagPart = '<div class="mailListLabel pull-right text-right col-xs-2"><div class="ellipsisText visible-xs"><span class="label label-success">' + tag + '</span></div><div class="ellipsisText hidden-xs col-xs-12 pull-right"><span class="label label-success">' + tag + "</span></div></div>";

                    emailListCopy[folderId][index] = {
                        DT_RowId: index,
                        unread: unread,
                        checkBpart: checkBpart,
                        dateAtPart: dateAtPart,
                        fromPart: fromPart,
                        sb: app.transform.escapeTags(app.transform.from64str(folderData["sb"])),
                        bd: app.transform.escapeTags(app.transform.from64str(folderData["bd"])),
                        tagPart: tagPart,
                        timestamp: time
                    };
                    var showPreview = thisComp.state.showPreview ? "" : "d-none";
                    var row = {
                        DT_RowId: index,
                        email: {
                            display: '<div class="email no-padding ' + emailListCopy[folderId][index]["unread"] + '">' + emailListCopy[folderId][index]["checkBpart"] + emailListCopy[folderId][index]["dateAtPart"] + emailListCopy[folderId][index]["fromPart"] + '<div class="mail-toggle ' + showPreview + '"><div class="mail-title">' + emailListCopy[folderId][index]["sb"] + "</div> <p>" + emailListCopy[folderId][index]["bd"] + "</p></div>" + emailListCopy[folderId][index]["tagPart"] + "</div>",

                            timestamp: emailListCopy[folderId][index]["timestamp"]
                        }
                    };
                }

                data.push(row);
            });

            app.user.set({ folderCached: emailListCopy });

            var emTab = $("#emailListTable").DataTable();
            emTab.clear();
            if (noRefresh == "") {
                emTab.draw();
                thisComp.setState({
                    messsageId: "",
                    allChecked: false
                }, function () {
                    $("#selectAll>input").prop("checked", false);
                    $("#selectAllAlt > input").prop("checked", false);
                });
            }

            emTab.rows.add(data);
            emTab.draw(false);

            // this.attachTooltip();

            $("#emailListTable td").click(function () {
                var selectedEmails = app.user.get("selectedEmails");
                // ".emailchk"
                if ($(this).find('[name="inbox-email"]').prop("checked")) {
                    selectedEmails[$(this).parents("tr").attr("id")] = true;
                    $("#mail-extra-options").addClass("active");
                } else {
                    delete selectedEmails[$(this).parents("tr").attr("id")];
                    $("#mail-extra-options").removeClass("active");
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
                showPreview: !thisComp.state.showPreview
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:checkNewEmails");
        },
        componentDidMount: function () {
            this.getMainFolderList();
            this.getCustomFolderList();

            var dtSet = this.state.dataSet;
            var thisComp = this;

            app.user.on("change:checkNewEmails", function () {
                thisComp.setState({
                    checkNewMails: app.user.get("checkNewEmails")
                });
            });

            $("#emailListTable").dataTable({
                dom: '<"#checkAll"><"#emailListNavigation"pi>rt<"pull-right"p><"pull-right"i>',
                data: dtSet,
                columns: [{
                    data: {
                        _: "email.display",
                        sort: "email.timestamp",
                        filter: "email.display"
                    }
                }],

                columnDefs: [{
                    sClass: "col-xs-12 border-right text-align-left no-padding padding-vertical-10",
                    targets: 0
                }, { orderDataType: "data-sort", targets: 0 }],
                sPaginationType: "simple",
                order: [[0, "desc"]],
                iDisplayLength: app.user.get("mailPerPage"),
                language: {
                    emptyTable: "Empty",
                    info: "_START_ - _END_ of _TOTAL_",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    }
                },
                fnDrawCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $("#emailListTable thead").remove();
                },
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if ($(nRow).attr("id") == app.user.get("currentMessageView")["id"]) {
                        $(nRow).addClass("selected");
                    }

                    if (app.user.get("selectedEmails")[$(nRow).attr("id")] !== undefined) {
                        // ".emailchk"
                        $(nRow).find('[name="inbox-email"]').prop("checked", true);
                    }
                    //$(nRow).attr('id', aData[0]);

                    return nRow;
                }
            });

            app.globalF.getInboxFolderId(function (inbox) {
                thisComp.updateEmails(inbox, "");
            });
            app.user.on("change:resetSelectedItems", function () {
                if (app.user.get("resetSelectedItems")) {
                    app.user.set({ selectedEmails: {} });
                    app.user.set({ resetSelectedItems: false });
                }
            }, thisComp);
            app.user.on("change:emailListRefresh", function () {
                // $("#sdasdasd").addClass("hidden"); - find this in original inbox page
                thisComp.updateEmails(thisComp.props.folderId, "noRefresh");
            }, thisComp);
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
                    if ($(event.target).prop("tagName").toUpperCase() !== "INPUT" && $(event.target).prop("tagName").toUpperCase() !== "SPAN") {
                        var thisComp = this;

                        var folder = app.user.get("folders")[this.props.folderId]["name"];

                        app.mixins.canNavigate(function (decision) {
                            if (decision) {
                                var id = $(event.target).parents("tr").attr("id");
                                if ($(event.target).prop("tagName") !== "INPUT" || $(event.target).prop("tagName") !== "SPAN") {
                                    app.globalF.resetCurrentMessage();
                                    app.globalF.resetDraftMessage();

                                    Backbone.history.navigate("/mail/" + app.transform.from64str(folder), {
                                        trigger: true
                                    });
                                    if (id != undefined && ($(event.target).attr("type") !== "checkbox" || $(event.target).prop("tagName") !== "LABEL" || $(event.target).prop("tagName") !== "SPAN") || $(event.target).prop("tagName") !== "INPUT") {
                                        var table = $("#emailListTable").DataTable();
                                        table.$("tr.selected").removeClass("selected");

                                        $(event.target).parents("tr").toggleClass("selected");

                                        $("#appRightSide").css("display", "block");

                                        thisComp.setState({
                                            messsageId: id
                                        });

                                        app.globalF.renderEmail(id);
                                        app.user.set({
                                            isDecryptingEmail: true
                                        });

                                        app.mixins.hidePopHover();
                                    }
                                }
                            } else {}
                        });
                    } else {
                        var thisComp = this;
                        var table = $("#emailListTable").DataTable();
                        $(event.target).parents("tr").toggleClass("selected");
                        $("#appRightSide").css("display", "none");
                        thisComp.setState({
                            messsageId: ""
                        });
                    }
                    break;
            }
        },
        handleRefreshButton: function (event) {
            app.mailMan.startShift();

            const _event = event;
            _event.target.children[0].classList.add("spin-animation");
            this.removeRefreshClass(_event.target.children[0]);

            $("#selectAll>input").prop("checked", false);
            $("#selectAllAlt > input").prop("checked", false);
        },
        handleSearchChange: function (event) {
            $("#emailListTable").DataTable().column(0).search(event.target.value, 0, 1).draw();
        },
        removeRefreshClass: function (_element) {
            setTimeout(function () {
                _element.classList.remove("spin-animation");
            }, 500);
        },
        handleChange: function (i, event) {
            var thisComp = this;

            switch (i) {
                case "moveToFolder":
                    var destFolderId = $(event.target).attr("id");

                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });

                        app.user.set({ currentMessageView: {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                $("#selectAll>input").prop("checked", false);
                                $("#selectAllAlt > input").prop("checked", false);
                                app.user.set({
                                    resetSelectedItems: true
                                });
                                app.globalF.syncUpdates();
                                thisComp.setState({
                                    isWorkingFlag: false
                                });
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                    }

                    break;
                case "moveToTrash":
                    var thisComp = this;
                    this.setState({
                        trashStatus: true,
                        isWorkingFlag: true
                    });
                    var target = {};
                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.removeClass("fa-trash-o").addClass("fa-refresh fa-spin");

                    if (this.props.folderId == app.user.get("systemFolders")["spamFolderId"] || this.props.folderId == app.user.get("systemFolders")["trashFolderId"] || this.props.folderId == app.user.get("systemFolders")["draftFolderId"]) {
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            //console.log(selected);
                            //delete email physically;
                            app.user.set({ currentMessageView: {} });

                            app.globalF.deleteEmailsFromFolder(selected, function (emails2Delete) {
                                //console.log(emails2Delete);
                                if (emails2Delete.length > 0) {
                                    app.userObjects.updateObjects("deleteEmail", emails2Delete, function (result) {
                                        $("#selectAll>input").prop("checked", false);
                                        $("#selectAllAlt > input").prop("checked", false);
                                        app.user.set({
                                            resetSelectedItems: true
                                        });
                                        app.globalF.syncUpdates();
                                        app.layout.display("viewBox");

                                        target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");

                                        thisComp.setState({
                                            trashStatus: false,
                                            isWorkingFlag: false
                                        });
                                    });
                                }
                            });
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false
                            });
                        }
                    } else {
                        var destFolderId = app.user.get("systemFolders")["trashFolderId"];
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            app.user.set({ currentMessageView: {} });
                            app.globalF.move2Folder(destFolderId, selected, function () {
                                app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");

                                    thisComp.setState({
                                        trashStatus: false,
                                        isWorkingFlag: false
                                    });
                                });
                            });
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false
                            });
                        }
                    }

                    break;

                case "blackList":
                    var thisComp = this;

                    console.log("blacklisting");
                    thisComp.setState({
                        blackList: true,
                        isWorkingFlag: true
                    });

                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }
                    target.removeClass("fa-stop").addClass("fa-refresh fa-spin");

                    console.log(app.user.get("systemFolders"));
                    var destFolderId = app.user.get("systemFolders")["trashFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        var emailpromises = [];

                        app.user.set({ currentMessageView: {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                $.each(selected, function (index, emailId) {
                                    var emailMetaPromise = $.Deferred();

                                    var email = app.globalF.getEmailsFromString(app.transform.from64str(app.user.get("emails")["messages"][emailId]["fr"]).toLowerCase());
                                    console.log(email);

                                    var post = {
                                        ruleId: "",
                                        matchField: "emailM",
                                        text: email,
                                        destination: 0
                                    };

                                    app.serverCall.ajaxRequest("saveBlockedEmails", post, function (result) {
                                        if (result["response"] == "success") {
                                            emailMetaPromise.resolve();
                                        }
                                    });

                                    emailpromises.push(emailMetaPromise);
                                });

                                Promise.all(emailpromises).then(function () {
                                    app.notifications.systemMessage("saved");
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-spin fa-refresh").addClass("fa-stop");

                                    thisComp.setState({
                                        blackList: false,
                                        isWorkingFlag: false
                                    });
                                });
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin fa-refresh").addClass("fa-stop");

                        thisComp.setState({
                            blackList: false,
                            isWorkingFlag: false
                        });
                    }

                    break;

                case "moveToSpam":
                    // console.log('move to spam');

                    var thisComp = this;

                    thisComp.setState({
                        spamStatus: true,
                        isWorkingFlag: true
                    });
                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.addClass("fa-spin");

                    var destFolderId = app.user.get("systemFolders")["spamFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ currentMessageView: {} });
                        app.globalF.move2Folder(destFolderId, selected, function () {
                            $.each(selected, function (index, emailId) {
                                var email = app.transform.from64str(app.user.get("emails")["messages"][emailId]["fr"]);
                                app.globalF.createFilterRule("", "sender", "strict", destFolderId, app.globalF.parseEmail(email)["email"], function () {});
                            });

                            app.userObjects.updateObjects("folderSettings", "", function (result) {
                                if (result["response"] == "success" && result["data"] == "saved") {
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-spin");

                                    thisComp.setState({
                                        spamStatus: false,
                                        isWorkingFlag: false
                                    });
                                }
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin");

                        thisComp.setState({
                            spamStatus: false,
                            isWorkingFlag: false
                        });
                    }

                    break;

                case "markAsRead":
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });
                        var messages = app.user.get("emails")["messages"];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {
                            //folders[messages[emailId]['f']][emailId]['st']==0?folders[messages[emailId]['f']][emailId]['st']=3:folders[messages[emailId]['f']][emailId]['st'];
                            messages[emailId]["st"] == 0 ? messages[emailId]["st"] = 3 : messages[emailId]["st"];
                        });

                        app.userObjects.updateObjects("folderUpdate", "", function (result) {
                            $("#selectAll>input").prop("checked", false);
                            $("#selectAllAlt > input").prop("checked", false);
                            app.user.set({ resetSelectedItems: true });
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                isWorkingFlag: false
                            });
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        thisComp.setState({
                            isWorkingFlag: false
                        });
                    }

                    break;

                case "markAsUnread":
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });
                        var messages = app.user.get("emails")["messages"];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {
                            //folders[messages[emailId]['f']][emailId]['st']=0;
                            messages[emailId]["st"] = 0;
                        });

                        app.userObjects.updateObjects("folderUpdate", "", function (result) {
                            $("#selectAll>input").prop("checked", false);
                            $("#selectAllAlt > input").prop("checked", false);
                            app.user.set({ resetSelectedItems: true });
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                isWorkingFlag: false
                            });
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        thisComp.setState({
                            isWorkingFlag: false
                        });
                    }
                    break;
            }
        },
        getSelected: function () {
            var selected = [];

            selected = Object.keys(app.user.get("selectedEmails"));

            if (selected.length == 0) {
                var elem = {};
                var item = $("#emailListTable tr.selected").attr("id");
                if (item != undefined) {
                    selected.push(item);
                }
            }
            return selected;
        },
        getMainFolderList: function () {
            var mainFolderList = app.globalF.getMainFolderList();
            var thisComp = this;

            var options = [];
            $.each(mainFolderList, function (index, folderData) {
                if (["Inbox", "Spam", "Trash"].indexOf(folderData["role"]) > -1) {
                    options.push(React.createElement(
                        "li",
                        { key: folderData["index"] },
                        React.createElement(
                            "a",
                            {
                                id: folderData["index"],
                                onClick: thisComp.handleChange.bind(thisComp, "moveToFolder")
                            },
                            folderData["name"]
                        )
                    ));
                }
            });

            this.setState({
                moveFolderMain: options
            });
        },
        getCustomFolderList: function () {
            var folderList = app.globalF.getCustomFolderList();
            var thisComp = this;

            var options = [];
            $.each(folderList, function (index, folderData) {
                options.push(React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "a",
                        {
                            id: folderData["index"],
                            onClick: thisComp.handleChange.bind(thisComp, "moveToFolder")
                        },
                        folderData["name"]
                    )
                ));
            });
            this.setState({
                moveFolderCust: options
            });
        },
        handleSelectAll: function (event) {
            var thisComp = this;
            var selectedEmails = app.user.get("selectedEmails");
            if (event.target.checked) {
                thisComp.setState({
                    allChecked: true
                });
                $(".select-checkbox input").prop("checked", true);
                $(".select-checkbox").each(function (index) {
                    var messageId = $(this).closest("tr").attr("id");
                    selectedEmails[messageId] = true;
                });
                $("#mail-extra-options").addClass("active");
            } else {
                $("#mail-extra-options").removeClass("active");
                $(".select-checkbox input").prop("checked", false);
                thisComp.setState({
                    allChecked: false
                });
                app.user.set({ selectedEmails: {} });
            }
        },
        handleShowRead: function (event) {
            $("#emailListTable td > div").removeClass("d-none");
            $("#emailListTable td > div").each(function () {
                jElement = $(this);
                if (jElement.hasClass("unread")) {
                    jElement.addClass("d-none");
                }
            });
        },
        handleShowUnRead: function (event) {
            $("#emailListTable td > div").addClass("d-none");
            $("#emailListTable td > div").each(function () {
                jElement = $(this);
                if (jElement.hasClass("unread")) {
                    jElement.removeClass("d-none");
                }
            });
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    {
                        className: this.state.isWorkingFlag ? "in-working popup d-block" : "in-working popup d-none"
                    },
                    React.createElement(
                        "div",
                        { className: "wrapper" },
                        React.createElement(
                            "div",
                            { className: "inner" },
                            React.createElement(
                                "div",
                                { className: "content" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Working..."
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "middle-section", id: "appMiddleSection" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            { className: "desktop-search" },
                            React.createElement("input", {
                                type: "search",
                                placeholder: "Search...",
                                onChange: this.handleSearchChange.bind(this)
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "info-row", id: "checkAll" },
                            React.createElement(
                                "div",
                                { className: "all-check" },
                                React.createElement(
                                    "label",
                                    {
                                        className: "container-checkbox",
                                        id: "selectAll"
                                    },
                                    React.createElement("input", {
                                        type: "checkbox",
                                        onChange: this.handleSelectAll.bind(this),
                                        checked: this.state.allChecked
                                    }),
                                    React.createElement("span", { className: "checkmark" }),
                                    " "
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "arrow-btn" },
                                React.createElement(
                                    "div",
                                    { className: "dropdown" },
                                    React.createElement("button", {
                                        className: "btn btn-secondary dropdown-toggle",
                                        type: "button",
                                        id: "mail-sort",
                                        "data-bs-toggle": "dropdown",
                                        "aria-expanded": "false",
                                        "data-bs-auto-close": "outside"
                                    }),
                                    React.createElement(
                                        "ul",
                                        {
                                            className: "dropdown-menu",
                                            "aria-labelledby": "mail-sort"
                                        },
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "label",
                                                {
                                                    id: "selectAllAlt",
                                                    className: "container-checkbox"
                                                },
                                                React.createElement("input", {
                                                    type: "checkbox",
                                                    onChange: this.handleSelectAll.bind(this),
                                                    checked: this.state.allChecked
                                                }),
                                                React.createElement("span", { className: "checkmark" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Select all"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                null,
                                                " ",
                                                React.createElement("span", { className: "star-yellow" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all starred"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                null,
                                                " ",
                                                React.createElement("span", { className: "star-gray" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show unstarred"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowRead.bind(this)
                                                },
                                                " ",
                                                React.createElement("span", { className: "eye" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all read"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowUnRead.bind(this)
                                                },
                                                " ",
                                                React.createElement("span", { className: "eye-close" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all unread"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowPreview.bind(this)
                                                },
                                                " ",
                                                this.state.showPreview ? React.createElement("span", { className: "eye" }) : React.createElement("span", { className: "eye-close" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    this.state.showPreview ? "Hide email preview" : "Show email preview"
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "info-row-right" },
                                React.createElement(
                                    "div",
                                    { className: "referesh-btn" },
                                    React.createElement(
                                        "button",
                                        {
                                            id: "referesh-btn",
                                            className: "icon-btn",
                                            onClick: this.handleRefreshButton.bind(this)
                                        },
                                        React.createElement("i", null)
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "arrow-btn ellipsis-dropdown" },
                                    React.createElement(
                                        "div",
                                        { className: "dropdown dropstart" },
                                        React.createElement("button", {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "mail-extra-options",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false",
                                            "data-bs-auto-close": "outside"
                                        }),
                                        React.createElement(
                                            "ul",
                                            {
                                                className: "dropdown-menu",
                                                id: "mail-extra-options"
                                            },
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    React.createElement("span", { className: "icon-moveto" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Move To"
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "dd-inner" },
                                                    this.state.moveFolderMain,
                                                    React.createElement("li", { className: "divider" }),
                                                    this.state.moveFolderCust
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "moveToTrash"),
                                                        disabled: this.state.trashStatus
                                                    },
                                                    React.createElement("span", { className: "icon-trash" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Delete"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "moveToSpam"),
                                                        disabled: this.state.spamStatus
                                                    },
                                                    React.createElement("span", { className: "icon-spam" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Spam"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "markAsRead")
                                                    },
                                                    React.createElement("span", { className: "icon-read" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Mark as Read"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "markAsUnread")
                                                    },
                                                    React.createElement("span", { className: "icon-unread" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Mark as Unead"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "blackList")
                                                    },
                                                    React.createElement("span", { className: "icon-block" }),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Block Sender"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "inbox-list" },
                            React.createElement("table", {
                                className: "table table-hover table-inbox row-border clickable",
                                id: "emailListTable",
                                onClick: this.handleClick.bind(this, "readEmail")
                            })
                        )
                    )
                )
            );
        }
    });
});