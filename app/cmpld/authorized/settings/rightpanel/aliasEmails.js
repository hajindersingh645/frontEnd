define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, DataTable, dataTableBoot, RightTop) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                viewFlag: false,
                dataAlias: this.getAliasData(),
                aliasForm: {},
                aliasEmail: "",

                includeSignature: false,
                signature: "",
                domain: app.defaults.get("domainMail").toLowerCase(),
                domains: [],

                showDisplayName: app.user.get("showDisplayName"),
                aliasName: app.user.get("displayName")
            };
        },
        /**
         *
         * @returns {Array}
         */
        getAliasData: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                if (emailData["addrType"] == 3) {
                    var el = {
                        DT_RowId: email64,
                        email: app.transform.from64str(emailData["email"]),
                        name: app.transform.escapeTags(app.transform.from64str(emailData["name"])),
                        main: 0
                    };
                    alEm.push(el);
                }
                /**
                 * { data: "checkbox" },
                    { data: "email" },
                    { data: "name" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                 */
                if (emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: "<b>" + app.transform.from64str(emailData["email"]) + "</b>",
                        name: "<b>" + app.transform.escapeTags(app.transform.from64str(emailData["name"])) + "</b>",
                        main: 1,
                        edit: '<a class="table-icon edit-button"></a>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                    };
                    alEm.push(el);
                }
            });

            return alEm;
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
        componentWillUpdate: function (nextProps, nextState) {
            if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr("contenteditable", nextState.signatureEditable);
            }

            if (JSON.stringify(nextState.dataAlias) !== JSON.stringify(this.state.dataAlias)) {
                var t = $("#table1").DataTable();
                t.clear();
                var dataAlias = nextState.dataAlias;
                t.rows.add(dataAlias);
                t.draw(false);
            }
        },
        componentWillUnmount: function () {},
        componentDidMount: function () {
            var thsComp = this;

            $(".summernote").summernote({
                shortcuts: false,
                toolbar: [["style", ["style"]], ["font", ["bold", "italic", "underline", "clear"]], ["fontname", ["fontname"]], ["para", ["paragraph"]], ["insert", ["link", "hr"]], ["view", ["codeview"]]],
                height: 150,
                minHeight: 50,
                maxHeight: 250
            });

            $(".note-editable").attr("contenteditable", "false");

            $("#table1").dataTable({
                dom: '<"middle-search"f>',
                data: thsComp.getAliasData(),
                columns: [{ data: "checkbox" }, { data: "email" }, { data: "name" }, { data: "edit" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ orderDataType: "data-sort", targets: [0, 3, 4, 5] }],
                order: [[2, "desc"], [0, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    // info: "_START_ to _END_ of _TOTAL_",
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
            //console.log(this.state.domain);

            $("#fromAliasEmail").rules("add", {
                required: true,
                minlength: 2,
                maxlength: 90,
                uniqueUserName: true,
                remote: {
                    url: app.defaults.get("apidomain") + "/checkEmailExistV2",
                    type: "post",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        fromEmail: function () {
                            var email = $("#fromAliasEmail").val().toLowerCase();
                            email = email.split("@")[0] + $("#aliasDomain").val();
                            return email;
                        }
                    }
                },
                messages: {
                    remote: "already in use"
                }
            });

            this.domains();
        },
        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "editAlias":
                    var keys = app.user.get("allKeys")[event];
                    break;
                case "changeDomain":
                    var validator = this.state.aliasForm;
                    validator.resetForm();
                    $("#fromAliasEmail").valid();
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
            }
        },
        /**
         *
         * @param {string} action
         */
        handleClick: function (action, event) {
            switch (action) {
                case "selectRowTab1":
                    var id = $(event.target).parents("tr").attr("id");
                    if (id != undefined) {
                        this.handleChange("editAlias", id);
                    }

                    break;
                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag
                    });
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle alias-email" },
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
                                        "Alias"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Add alias"
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
                                    "Alias"
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
                                            "Add Alias"
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
                                            id: "table1",
                                            onClick: this.handleClick.bind(this, "selectRowTab1")
                                        },
                                        React.createElement(
                                            "colgroup",
                                            null,
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", null),
                                            React.createElement("col", null),
                                            React.createElement("col", { width: "60" }),
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
                                                    "th",
                                                    { scope: "col" },
                                                    "Name",
                                                    " ",
                                                    React.createElement("button", { className: "btn-sorting" })
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
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
                                    "Add alias"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewAliasForm" },
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
                                                    id: "fromAliasName",
                                                    value: this.state.aliasName,
                                                    placeholder: "Enter name",
                                                    onChange: this.handleChange.bind(this, "changeAliasName")
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromEmail",
                                                    className: "form-control with-icon icon-email",
                                                    id: "fromAliasEmail",
                                                    value: this.state.aliasEmail,
                                                    placeholder: "email alias",
                                                    onChange: this.handleChange.bind(this, "changeAliasEmail")
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
                                                    "select",
                                                    {
                                                        className: "form-select",
                                                        value: this.state.domain,
                                                        id: "aliasDomain",
                                                        onChange: this.handleChange.bind(this, "changeDomain")
                                                    },
                                                    this.state.domains
                                                )
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
                                                                onChange: this.handleChange.bind(this, "displaySign")
                                                            }),
                                                            React.createElement("span", { className: "checkmark" }),
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
                                                id: "summernote",
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
                                                    onClick: this.handleClick.bind(this, "saveNewAlias")
                                                },
                                                `Save`
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
                    { className: "setting-right alias-email" },
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
                                "Email Aliases"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "this is an alternate addresses that can be used to receive email at your CyberFear account. Email aliases are not alternative login addresses. Using email aliases makes it possible to give out an email addresses that can't be targeted for login attacks."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Display Name"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "is the real name or nickname that you would like people to see when you send email from one of your email aliases."
                            )
                        )
                    )
                )
            );
        }
    });
});