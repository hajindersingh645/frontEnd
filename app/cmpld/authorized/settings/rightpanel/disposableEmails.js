define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, DataTable, dataTableBoot, RightTop) {
    "use strict";

    return React.createClass({
        /**
         *
         */
        getInitialState: function () {
            return {
                viewFlag: false,
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body hidden",
                thirdPanelClass: "panel-body hidden",
                fourthPanelClass: "panel-body hidden",
                firstTab: "active",
                secondTab: "",

                dataAlias: this.getAliasData(),
                dataDispisable: this.getDisposableDataData(),

                aliasForm: {},
                //aliasEmail:app.defaults.get("aliasEmail"),
                aliasEmail: "",

                button1Click: "addAlias",
                button1enabled: true,
                button1iClass: "",
                button1text: "Add New Alias",
                button1visible: "",

                button2text: "Add Alias",
                button2enabled: true,
                button2iClass: "",

                button3Click: "addDisposable",
                button3enabled: true,
                button3iClass: "",
                button3text: "Add Disposable",
                button3visible: "hidden",
                isDefault: false,

                includeSignature: false,
                signature: "",
                domain: app.defaults.get("domainMail").toLowerCase(),
                domains: [],

                showDisplayName: app.user.get("showDisplayName"),
                aliasName: app.user.get("displayName")
            };
        },
        domains: function () {
            var thisComp = this;
            var options = [];
            app.serverCall.ajaxRequest("availableDomainsForAlias", {}, function (result) {
                if (result["response"] == "success") {
                    var localDomain = app.user.get("customDomains");

                    $.each(result["data"], function (index, domain) {
                        options.push(React.createElement(
                            "option",
                            {
                                key: "@" + domain["domain"],
                                value: "@" + domain["domain"]
                            },
                            "@" + domain["domain"]
                        ));

                        if (localDomain[app.transform.to64str(domain["domain"])] !== undefined) {
                            var selDomain = localDomain[app.transform.to64str(domain["domain"])];

                            if (selDomain["subdomain"] !== undefined && selDomain["subdomain"].length > 0) {
                                $.each(selDomain["subdomain"], function (ind, subdom64) {
                                    var domStr = app.transform.from64str(subdom64);
                                    options.push(React.createElement(
                                        "option",
                                        {
                                            key: "@" + subdom64,
                                            value: "@" + domStr + "." + selDomain["domain"]
                                        },
                                        "@" + domStr + "." + selDomain["domain"]
                                    ));
                                });
                            }
                        }
                    });

                    thisComp.setState({
                        domains: options
                    });
                } else {
                    app.notifications.systemMessage("tryAgain");
                }
            });
        },
        componentWillUnmount: function () {},
        /**
         *
         * @param {string} name
         * @param {string} email
         * @param {string} domain
         * @param {string} type
         */
        addAlDisp: function (name, email, domain, type) {
            //console.log(name,email,domain);

            app.user.set({ inProcess: true });

            var changeObj = {};
            var firPart = {};
            var secPart = {};
            var dfdmail = new $.Deferred();
            var thisComp = this;
            var newKey = {};
            app.user.set({ inProcess: true });

            var email64 = app.transform.to64str(email + domain);

            if (type === "disposable") {
                firPart = {
                    addrType: 2,
                    canSend: false,
                    email: email64,
                    isDefault: false,
                    keyLength: app.user.get("defaultPGPKeybit"),
                    name: "",
                    includeSignature: false,
                    signature: "",
                    date: Math.round(new Date().getTime() / 1000),
                    keysModified: Math.round(new Date().getTime() / 1000)
                };

                //	thisComp.setState({button1:{text:"Generating Keys",enabled:false,iClass:"fa fa-spin fa-refresh",onClick:""}});
            } else {
                firPart = {
                    addrType: 3,
                    canSend: true,
                    email: email64,
                    isDefault: thisComp.state.isDefault,
                    keyLength: app.user.get("defaultPGPKeybit"),
                    name: app.transform.to64str(name),
                    displayName: name != "" ? app.transform.to64str(name + " <" + app.transform.from64str(email64) + ">") : email64,
                    includeSignature: this.state.includeSignature,
                    signature: this.state.includeSignature ? app.transform.to64str(app.globalF.filterXSSwhite(this.state.signature)) : "",
                    date: Math.round(new Date().getTime() / 1000),
                    keysModified: Math.round(new Date().getTime() / 1000)
                };

                //	thisComp.setState({button2:{text:"Generating Keys",enabled:false,iClass:"fa fa-spin fa-refresh"}});
            }

            app.generate.generatePairs(app.user.get("defaultPGPKeybit"), name + "<" + app.transform.from64str(email64) + ">", function (PGPkeys) {
                //app.generate.generatePairs(app.user.get("defaultPGPKeybit")).done(function(PGPkeys){ //todo revert

                if (app.user.get("inProcess")) {
                    secPart = {
                        keyPass: PGPkeys["password"],
                        v2: {
                            privateKey: app.transform.to64str(PGPkeys["privateKey"]),
                            publicKey: app.transform.to64str(PGPkeys["publicKey"]),
                            receiveHash: app.transform.SHA512(app.transform.from64str(email64)).substring(0, 10)
                        }
                    };

                    //changeObj[email64]=$.extend(firPart, secPart);
                    //var keys=app.user.get("allKeys");

                    //keys[email64]=$.extend(firPart, secPart);
                    newKey = $.extend(firPart, secPart);
                    //console.log(changeObj);
                }
                dfdmail.resolve();
            });

            dfdmail.done(function () {
                if (app.user.get("inProcess")) {
                    $("#dntInter").modal("hide");

                    app.user.set({ inProcess: false });
                    //app.user.set({"pgpKeysChanged":true});
                    app.user.set({ newPGPKey: newKey });
                    //app.userObjects.updateObjects();

                    app.userObjects.updateObjects("addPGPKey", "", function (result) {
                        if (result == "saved") {
                            if (type == "disposable") {
                                //console.log(app.user.get("newPGPKey"));
                                thisComp.setState({
                                    dataDispisable: thisComp.getDisposableDataData()
                                });
                            } else {
                                thisComp.setState({
                                    dataAlias: thisComp.getAliasData()
                                });

                                thisComp.handleClick("showFirst");

                                //thisComp.setState({dataAlias:thisComp.getAliasData()});
                            }
                        } else if (result == "newerFound") {
                            //app.notifications.systemMessage('newerFnd');
                        } else if (result == "emailAdOverLimit") {
                            app.notifications.systemMessage("rchdLimits");
                        } else {
                            app.notifications.systemMessage("tryAgain");
                        }

                        app.user.unset("newPGPKey");
                    });
                }
            });
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "changeDomain":
                    var validator = this.state.aliasForm;
                    validator.resetForm();
                    $("#fromAliasEmail").valid();
                    console.log(this.state.domain);
                    this.setState({ domain: event.target.value });
                    break;

                case "changeAliasName":
                    this.setState({ aliasName: event.target.value });

                    break;

                case "changeAliasEmail":
                    var email = event.target.value.split("@")[0];
                    this.setState({ aliasEmail: email });

                    break;

                case "displaySign":
                    this.setState({
                        includeSignature: !this.state.includeSignature,
                        signatureEditable: !this.state.includeSignature
                    });

                    break;

                case "defaultChange":
                    this.setState({
                        isDefault: !this.state.isDefault
                    });

                    break;

                case "editSignature":
                    this.setState({
                        signature: event
                    });
                    break;

                case "editAlias":
                    var keys = app.user.get("allKeys")[event];

                    if (keys["addrType"] == 1) {
                        this.setState({
                            deleteAlias: "hidden"
                        });
                    } else {
                        this.setState({
                            deleteAlias: ""
                        });
                    }

                    this.setState({
                        firstPanelClass: "panel-body hidden",
                        secondPanelClass: "panel-body hidden",
                        thirdPanelClass: "panel-body hidden",
                        fourthPanelClass: "panel-body",
                        firstTab: "active",
                        secondTab: "",

                        button1enabled: true,
                        button1iClass: "",
                        button1visible: "hidden",

                        aliasId: event,
                        aliasEmail: app.transform.from64str(event),
                        aliasName: app.transform.from64str(keys["name"]),

                        isDefault: keys["isDefault"],
                        includeSignature: keys["includeSignature"],
                        signature: app.transform.from64str(keys["signature"]),

                        aliasNameEnabled: false,
                        button5click: "enableEdit",
                        button5text: "Edit",
                        button5class: "btn btn-warning",
                        signatureEditable: false
                    });

                    break;
            }
        },

        /**
         *
         * @param {string} action
         */
        handleClick: function (action, event) {
            switch (action) {
                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body hidden",
                        thirdPanelClass: "panel-body hidden",
                        fourthPanelClass: "panel-body hidden",
                        firstTab: "active",
                        secondTab: "",

                        button1visible: "",

                        button3visible: "hidden",

                        isDefault: false,
                        aliasId: "",
                        aliasName: "",
                        aliasEmail: "",
                        domain: app.defaults.get("domainMail").toLowerCase(),
                        includeSignature: false,
                        signature: "",
                        signatureEditable: false
                    });

                    $("#fromAliasName").removeClass("invalid");
                    $("#fromAliasName").removeClass("valid");

                    $("#fromAliasEmail").removeClass("invalid");
                    $("#fromAliasEmail").removeClass("valid");

                    var validator = $("#addNewAliasForm").validate();
                    validator.resetForm();

                    break;

                case "showSecond":
                    this.setState({
                        firstPanelClass: "panel-body hidden",
                        secondPanelClass: "panel-body hidden",
                        thirdPanelClass: "panel-body ",
                        fourthPanelClass: "panel-body hidden",
                        firstTab: "",
                        secondTab: "active",
                        aliasId: "",

                        button1visible: "hidden",
                        button3visible: ""
                    });
                    break;

                case "addAlias":
                    var thisComp = this;
                    //     console.log(thisComp.state.dataAlias.length)
                    //  console.log(thisComp.state.dataAlias)

                    app.globalF.checkPlanLimits("alias", thisComp.state.dataAlias.length - 1, function (result) {
                        if (result) {
                            thisComp.setState({
                                firstPanelClass: "panel-body hidden",
                                secondPanelClass: "panel-body ",
                                thirdPanelClass: "panel-body hidden",
                                firstTab: "active",
                                secondTab: "",

                                button1visible: "hidden",
                                signature: '<div>Sent using Encrypted Email Service -&nbsp;<a href="https://cyberfear.com/index.html#createUser/' + app.user.get("userPlan")["coupon"] + '" target="_blank">CyberFear.com</a></div>'
                            });
                        } else {
                            thisComp.props.updateAct("Plan");
                            Backbone.history.navigate("settings/Plan", {
                                trigger: true
                            });
                        }
                    });

                    break;

                case "saveEditAlias":
                    var thisComp = this;
                    var aliasId = this.state.aliasId;

                    var keys = app.user.get("allKeys")[aliasId];

                    if (this.state.isDefault) {
                        var keysAll = app.user.get("allKeys");

                        $.each(keysAll, function (email64, emailData) {
                            keysAll[email64]["isDefault"] = false;
                        });
                    }

                    if (keys != undefined) {
                        keys["name"] = app.transform.to64str(this.state.aliasName);
                        keys["displayName"] = this.state.aliasName != "" ? app.transform.to64str(this.state.aliasName + " <" + app.transform.from64str(aliasId) + ">") : aliasId, keys["includeSignature"] = this.state.includeSignature;
                        keys["isDefault"] = this.state.isDefault;

                        keys["signature"] = this.state.includeSignature ? app.transform.to64str(app.globalF.filterXSSwhite($("#summernote1").code())) : keys["signature"];

                        app.globalF.checkSecondPass(function () {
                            app.userObjects.updateObjects("editPGPKeys", "", function (result) {
                                //if (result['response'] == "success") {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });

                                    thisComp.handleClick("showFirst");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick("showFirst");
                                }

                                //}
                            });
                        });
                    }

                    break;

                case "saveNewAlias":
                    var validator = this.state.aliasForm;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#dntModHead").html("Please Wait");
                        $("#dntModBody").html("Sit tight while we working. It may take a minute, depend on your device. Or you can cancel");

                        $("#dntOk").on("click", function () {
                            app.user.set({ inProcess: false });

                            $("#dntInter").modal("hide");
                        });

                        var email = thisComp.state.aliasEmail.toLowerCase();
                        var name = thisComp.state.aliasName;
                        var domain = thisComp.state.domain;

                        //thisComp.setState({
                        //button2text:"Generating Keys",
                        //button2enabled:false,
                        //button2iClass:"fa fa-spin fa-refresh"
                        //});

                        //app.user.set({"inProcess":true});
                        app.globalF.checkSecondPass(function () {
                            $("#dntInter").modal({
                                backdrop: "static",
                                keyboard: false
                            });

                            //$('#dntInter').modal('show');
                            thisComp.addAlDisp(name, email, domain, "alias");
                        });
                    }

                    break;

                case "addDisposable":
                    var email = app.generate.makerandomEmail();
                    var name = "";
                    var domain = app.defaults.get("domainMail").toLowerCase();

                    var thisComp = this;
                    app.globalF.checkPlanLimits("disposable", thisComp.state.dataDispisable.length, function (result) {
                        if (result) {
                            var postData = { fromEmail: email + domain };

                            app.serverCall.ajaxRequest("checkEmailExist", postData, function (result) {
                                if (result) {
                                    $("#dntModHead").html("Please Wait");
                                    $("#dntModBody").html("Sit tight while we working. It may take a minute, depend on your device. Or you can cancel");

                                    $("#dntOk").on("click", function () {
                                        app.user.set({
                                            inProcess: false
                                        });

                                        $("#dntInter").modal("hide");
                                    });

                                    app.globalF.checkSecondPass(function () {
                                        $("#dntInter").modal({
                                            backdrop: "static",
                                            keyboard: false
                                        });

                                        //$('#dntInter').modal('show');
                                        thisComp.addAlDisp(name, email, domain, "disposable");
                                    });
                                } else {
                                    app.notifications.systemMessage("tryAgain");
                                    thisComp.handleClick("cancelDispos");
                                }
                            });
                        }
                    });

                    break;

                case "enableEdit":
                    this.setState({
                        aliasNameEnabled: true,
                        button5click: "saveEditAlias",
                        button5text: "Save",
                        signatureEditable: this.state.includeSignature,
                        button5class: "btn btn-primary"
                    });

                    //if(this.state.includeSignature){
                    //$('.note-editable').attr('contenteditable','true');
                    //}
                    break;

                case "selectRowTab1":
                    var id = $(event.target).parents("tr").attr("id");
                    if (id != undefined) {
                        this.handleChange("editAlias", id);
                    }

                    break;

                case "deleteAlias":
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html("Email alias will be deleted, and you wont be able to send or receive email with it. Continue?");

                    var keys = app.user.get("allKeys");
                    var thisComp = this;

                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");
                        app.globalF.checkSecondPass(function () {
                            app.user.set({
                                newPGPKey: keys[thisComp.state.aliasId]
                            });

                            delete keys[thisComp.state.aliasId];

                            app.userObjects.updateObjects("deletePGPKeys", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showFirst");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');

                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showFirst");
                                }

                                app.user.unset("newPGPKey");
                            });
                        });
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "deleteDisposable":
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html("Email alias will be deleted, and you wont be able to send or receive email with it. Continue?");

                    var keys = app.user.get("allKeys");
                    var thisComp = this;

                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");
                        app.globalF.checkSecondPass(function () {
                            app.user.set({
                                newPGPKey: keys[thisComp.state.aliasId]
                            });

                            delete keys[thisComp.state.aliasId];

                            app.userObjects.updateObjects("deletePGPKeys", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataDispisable: thisComp.getDisposableDataData()
                                    });

                                    //thisComp.setState({dataAlias:thisComp.getAliasData()});
                                    thisComp.handleClick("showSecond");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');

                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showSecond");
                                }

                                app.user.unset("newPGPKey");
                            });
                        });

                        //app.user.set({"newPGPKey":newKey});

                        //app.user.set({"pgpKeysChanged":true});
                        //app.userObjects.updateObjects();
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "selectRowTab2":
                    //$(event.target).parents('tr').toggleClass('highlight');

                    var thisComp = this;
                    var keys = app.user.get("allKeys");

                    if ($(event.target).parents("a").attr("class") == "deleteDispos") {
                        thisComp.setState({
                            aliasId: $(event.target).parents("tr").attr("id")
                        });

                        thisComp.handleClick("deleteDisposable");
                    }

                    break;

                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag
                    });
                    break;
            }
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr("contenteditable", nextState.signatureEditable);
            }

            if (JSON.stringify(nextState.dataDispisable) !== JSON.stringify(this.state.dataDispisable)) {
                var t = $("#table2").DataTable();
                t.clear();
                var dataDispisable = nextState.dataDispisable;
                t.rows.add(dataDispisable);
                t.draw(false);
            }
        },

        render: function () {
            var classFullSettSelect = "col-xs-12";

            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle disposable-email" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            {
                                className: `arrow-back ${ this.state.viewFlag ? "" : "d-none" }`
                            },
                            React.createElement("a", {
                                onClick: this.handleClick.bind(this, "toggleDisplay")
                            })
                        ),
                        React.createElement(
                            "h2",
                            null,
                            "Profile"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `bread-crumb ${ this.state.viewFlag ? "" : "d-none" }`
                            },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    null,
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "toggleDisplay")
                                        },
                                        "Disposable address"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Add address"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            {
                                className: `the-view ${ this.state.viewFlag ? "d-none" : "" }`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Disposable address"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "middle-content-top-right" },
                                    React.createElement(
                                        "div",
                                        { className: "add-contact-btn" },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "toggleDisplay")
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                "+"
                                            ),
                                            " ",
                                            "Add Address"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "table-row" },
                                React.createElement(
                                    "div",
                                    { className: "table-responsive" },
                                    React.createElement(
                                        "table",
                                        {
                                            className: "table",
                                            id: "table2",
                                            onClick: this.handleClick.bind(this, "selectRowTab2")
                                        },
                                        React.createElement(
                                            "colgroup",
                                            null,
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", null),
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", { width: "50" })
                                        ),
                                        React.createElement(
                                            "thead",
                                            null,
                                            React.createElement(
                                                "tr",
                                                null,
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement(
                                                        "label",
                                                        { className: "container-checkbox" },
                                                        React.createElement("input", { type: "checkbox" }),
                                                        React.createElement("span", { className: "checkmark" })
                                                    )
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    "Email",
                                                    " ",
                                                    React.createElement("button", { className: "btn-sorting" })
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    "\xA0"
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement("button", { className: "trash-btn" })
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "dropdown" },
                                                        React.createElement("button", {
                                                            className: "btn btn-secondary dropdown-toggle ellipsis-btn",
                                                            type: "button",
                                                            "data-bs-toggle": "dropdown",
                                                            "aria-expanded": "false"
                                                        }),
                                                        React.createElement(
                                                            "ul",
                                                            { className: "dropdown-menu" },
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Action"
                                                                )
                                                            ),
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Another action"
                                                                )
                                                            ),
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Something here"
                                                                )
                                                            )
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
                            {
                                className: `the-creation ${ this.state.viewFlag ? "" : "d-none" }`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Add address"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewAliasForm2" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromName",
                                                    className: "form-control with-icon icon-name",
                                                    id: "fromAliasName2",
                                                    value: this.state.aliasName,
                                                    placeholder: "From name",
                                                    onChange: this.handleChange.bind(this, "changeAliasName"),
                                                    disabled: !this.state.aliasNameEnabled
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement(
                                                    "div",
                                                    { className: "row" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-6" },
                                                        React.createElement(
                                                            "label",
                                                            { className: "container-checkbox with-label" },
                                                            React.createElement("input", {
                                                                className: "pull-left",
                                                                type: "checkbox",
                                                                disabled: !this.state.aliasNameEnabled,
                                                                checked: this.state.isDefault,
                                                                onChange: this.handleChange.bind(this, "defaultChange")
                                                            }),
                                                            React.createElement("span", { className: "checkmark" }),
                                                            "Default"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-6" },
                                                        React.createElement(
                                                            "label",
                                                            { className: "container-checkbox with-label" },
                                                            React.createElement("input", {
                                                                className: "pull-left",
                                                                type: "checkbox",
                                                                checked: this.state.includeSignature,
                                                                onChange: this.handleChange.bind(this, "displaySign"),
                                                                disabled: !this.state.aliasNameEnabled
                                                            }),
                                                            "Signature"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "editor" },
                                        React.createElement(
                                            "div",
                                            {
                                                id: "summernote1",
                                                className: "col-col-xs-12 summernote"
                                            },
                                            this.state.signature
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-section-bottom" },
                                        React.createElement(
                                            "div",
                                            { className: "btn-row" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-border fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "toggleDisplay")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, this.state.button5click)
                                                },
                                                "Save"
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-danger " + this.state.deleteAlias,
                                        onClick: this.handleClick.bind(this, "deleteAlias")
                                    },
                                    "Delete Alias"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right disposable-email" },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "h2",
                                null,
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Disposable email addresses"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "are a randomly generated string of characters that are used to create a unique alternate email address for your account. The difference between regular email aliases and disposable addresses is that disposable addresses are intended to be temporary. For example you can use them for a short term purpose before deleting the address to prevent your real address from being sold and added to spam lists. Disposable email addresses are for receiving email, they can not be used to send emails.."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Signature"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "A unique signature can be created for each of your email aliases. For example, you may want different signatures if your account has multiple aliases or business purposes associated with them."
                            )
                        )
                    )
                )
            );
        },

        /**
         *
         * @returns {Array}
         */
        getAliasData: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                //console.log(emailData);

                if (emailData["addrType"] == 3) {
                    var el = {
                        DT_RowId: email64,
                        email: app.transform.from64str(emailData["email"]),
                        name: app.transform.escapeTags(app.transform.from64str(emailData["name"])),
                        main: 0
                    };
                    alEm.push(el);
                }
                if (emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        email: "<b>" + app.transform.from64str(emailData["email"]) + "</b>",
                        name: "<b>" + app.transform.escapeTags(app.transform.from64str(emailData["name"])) + "</b>",
                        main: 1
                    };
                    alEm.push(el);
                }
            });
            //this.setState({dataAlias:alEm});

            return alEm;
        },

        /**
         *
         * @returns {Array}
         */
        getDisposableDataData: function () {
            var alEm = [];
            // columns: [{ data: "checkbox" }, { data: "email" }, { data: "dispose" }, { data: "delete" }, { data: "options" }],
            $.each(app.user.get("allKeys"), function (email64, emailData) {
                //console.log(emailData);
                if (emailData["addrType"] == 2) {
                    var el = {
                        DT_RowId: email64,
                        checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: app.transform.from64str(emailData["email"]),
                        dispose: '<button class="disposed-button"></button>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                    };
                    alEm.push(el);
                }
            });

            //this.setState({dataDispisable:alEm});
            return alEm;
        },

        componentDidMount: function () {
            var thsComp = this;

            $(".summernote").summernote({
                shortcuts: false,
                toolbar: [["style", ["style"]], ["font", ["bold", "italic", "underline", "clear"]], ["fontname", ["fontname"]], ["para", ["paragraph"]], ["insert", ["link", "hr"]], ["view", ["codeview"]]],
                //onChange: function(contents, $editable) {
                //	thisComp.handleChange('editSignature',contents);
                //},
                height: 150,
                minHeight: 50,
                maxHeight: 250
            });

            $(".note-editable").attr("contenteditable", "false");

            var thsComp = this;

            $("#table2").dataTable({
                dom: '<"middle-search"f>',
                data: thsComp.getDisposableDataData(),
                columns: [{ data: "checkbox" }, { data: "email" }, { data: "dispose" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ bSortable: false, aTargets: [2] }, { orderDataType: "data-sort", targets: 1 }],
                order: [[1, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    }
                }
            });

            $.validator.addMethod("uniqueUserName", function (value, element) {
                var isSuccess = false;
                var email = $("#fromAliasEmail").val().toLowerCase();
                email = email.split("@")[0] + $("#aliasDomain").val();

                if (app.globalF.IsEmail(email)) {
                    return true;
                } else return false;
            }, "no special symbols");

            this.setState({ aliasForm: $("#addNewAliasForm").validate() });

            this.domains();
        }
    });
});