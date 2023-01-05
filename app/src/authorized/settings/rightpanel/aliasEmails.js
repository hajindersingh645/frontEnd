define([
    "react",
    "app",
    "dataTable",
    "dataTableBoot",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, DataTable, dataTableBoot, RightTop) {
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
                aliasName: app.user.get("displayName"),
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
                        name: app.transform.escapeTags(
                            app.transform.from64str(emailData["name"])
                        ),
                        main: 0,
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
                        checkbox:
                            '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email:
                            "<b>" +
                            app.transform.from64str(emailData["email"]) +
                            "</b>",
                        name:
                            "<b>" +
                            app.transform.escapeTags(
                                app.transform.from64str(emailData["name"])
                            ) +
                            "</b>",
                        main: 1,
                        edit: '<a class="table-icon edit-button"></a>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options:
                            '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                    };
                    alEm.push(el);
                }
            });

            return alEm;
        },
        domains: function () {
            var thisComp = this;
            var options = [];
            app.serverCall.ajaxRequest(
                "availableDomainsForAlias",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        var localDomain = app.user.get("customDomains");

                        $.each(result["data"], function (index, domain) {
                            options.push(
                                <option
                                    key={"@" + domain["domain"]}
                                    value={"@" + domain["domain"]}
                                >
                                    {"@" + domain["domain"]}
                                </option>
                            );

                            if (
                                localDomain[
                                    app.transform.to64str(domain["domain"])
                                ] !== undefined
                            ) {
                                var selDomain =
                                    localDomain[
                                        app.transform.to64str(domain["domain"])
                                    ];

                                if (
                                    selDomain["subdomain"] !== undefined &&
                                    selDomain["subdomain"].length > 0
                                ) {
                                    $.each(
                                        selDomain["subdomain"],
                                        function (ind, subdom64) {
                                            var domStr =
                                                app.transform.from64str(
                                                    subdom64
                                                );
                                            options.push(
                                                <option
                                                    key={"@" + subdom64}
                                                    value={
                                                        "@" +
                                                        domStr +
                                                        "." +
                                                        selDomain["domain"]
                                                    }
                                                >
                                                    {"@" +
                                                        domStr +
                                                        "." +
                                                        selDomain["domain"]}
                                                </option>
                                            );
                                        }
                                    );
                                }
                            }
                        });

                        thisComp.setState({
                            domains: options,
                        });
                    } else {
                        app.notifications.systemMessage("tryAgain");
                    }
                }
            );
        },
        componentWillUpdate: function (nextProps, nextState) {
            if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr(
                    "contenteditable",
                    nextState.signatureEditable
                );
            }

            if (
                JSON.stringify(nextState.dataAlias) !==
                JSON.stringify(this.state.dataAlias)
            ) {
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
                toolbar: [
                    ["style", ["style"]],
                    ["font", ["bold", "italic", "underline", "clear"]],
                    ["fontname", ["fontname"]],
                    ["para", ["paragraph"]],
                    ["insert", ["link", "hr"]],
                    ["view", ["codeview"]],
                ],
                height: 150,
                minHeight: 50,
                maxHeight: 250,
            });

            $(".note-editable").attr("contenteditable", "false");

            $("#table1").dataTable({
                dom: '<"middle-search"f>',
                data: thsComp.getAliasData(),
                columns: [
                    { data: "checkbox" },
                    { data: "email" },
                    { data: "name" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                ],
                columnDefs: [
                    { orderDataType: "data-sort", targets: [0, 3, 4, 5] },
                ],
                order: [
                    [2, "desc"],
                    [0, "asc"],
                ],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    // info: "_START_ to _END_ of _TOTAL_",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                    },
                },
            });
            $.validator.addMethod(
                "uniqueUserName",
                function (value, element) {
                    var isSuccess = false;
                    var email = $("#fromAliasEmail").val().toLowerCase();
                    email = email.split("@")[0] + $("#aliasDomain").val();

                    if (app.globalF.IsEmail(email)) {
                        return true;
                    } else return false;
                },
                "no special symbols"
            );

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
                        withCredentials: true,
                    },
                    data: {
                        fromEmail: function () {
                            var email = $("#fromAliasEmail")
                                .val()
                                .toLowerCase();
                            email =
                                email.split("@")[0] + $("#aliasDomain").val();
                            return email;
                        },
                    },
                },
                messages: {
                    remote: "already in use",
                },
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
                        signatureEditable: !this.state.includeSignature,
                    });

                    break;

                case "defaultChange":
                    this.setState({
                        isDefault: !this.state.isDefault,
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
                        viewFlag: !this.state.viewFlag,
                    });
                    break;
            }
        },
        render: function () {
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle alias-email">
                        <div className="middle-top">
                            <div
                                className={`arrow-back ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <a
                                    onClick={this.handleClick.bind(
                                        this,
                                        "toggleDisplay"
                                    )}
                                ></a>
                            </div>
                            <h2>Profile</h2>
                            <div
                                className={`bread-crumb ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <ul>
                                    <li>
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "toggleDisplay"
                                            )}
                                        >
                                            Alias
                                        </a>
                                    </li>
                                    <li>Add alias</li>
                                </ul>
                            </div>
                        </div>
                        <div className="middle-content">
                            <div
                                className={`the-view ${
                                    this.state.viewFlag ? "d-none" : ""
                                }`}
                            >
                                <div className="middle-content-top">
                                    <h3>Alias</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "toggleDisplay"
                                                )}
                                            >
                                                <span className="icon">+</span>{" "}
                                                Add Alias
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-responsive">
                                        <table
                                            className="table"
                                            id="table1"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "selectRowTab1"
                                            )}
                                        >
                                            <colgroup>
                                                <col width="40" />
                                                <col />
                                                <col />
                                                <col width="60" />
                                                <col width="40" />
                                                <col width="50" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <label className="container-checkbox">
                                                            <input type="checkbox" />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </th>
                                                    <th scope="col">
                                                        Email{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th scope="col">
                                                        Name{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th scope="col">&nbsp;</th>
                                                    <th scope="col">
                                                        <button className="trash-btn"></button>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn btn-secondary dropdown-toggle ellipsis-btn"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            ></button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <a href="#">
                                                                        Action
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        Another
                                                                        action
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        Something
                                                                        here
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`the-creation ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <div className="middle-content-top">
                                    <h3>Add alias</h3>
                                </div>

                                <div className="form-section">
                                    <form id="addNewAliasForm">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="fromName"
                                                        className="form-control with-icon icon-name"
                                                        id="fromAliasName"
                                                        value={
                                                            this.state.aliasName
                                                        }
                                                        placeholder="Enter name"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeAliasName"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="fromEmail"
                                                        className="form-control with-icon icon-email"
                                                        id="fromAliasEmail"
                                                        value={
                                                            this.state
                                                                .aliasEmail
                                                        }
                                                        placeholder="email alias"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeAliasEmail"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <select
                                                        className="form-select"
                                                        value={
                                                            this.state.domain
                                                        }
                                                        id="aliasDomain"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeDomain"
                                                        )}
                                                    >
                                                        {this.state.domains}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="container-checkbox with-label">
                                                                <input
                                                                    className="pull-left"
                                                                    type="checkbox"
                                                                    checked={
                                                                        this
                                                                            .state
                                                                            .isDefault
                                                                    }
                                                                    onChange={this.handleChange.bind(
                                                                        this,
                                                                        "defaultChange"
                                                                    )}
                                                                />
                                                                <span className="checkmark"></span>
                                                                Default
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="container-checkbox with-label">
                                                                <input
                                                                    className="pull-left"
                                                                    type="checkbox"
                                                                    checked={
                                                                        this
                                                                            .state
                                                                            .includeSignature
                                                                    }
                                                                    onChange={this.handleChange.bind(
                                                                        this,
                                                                        "displaySign"
                                                                    )}
                                                                />
                                                                <span className="checkmark"></span>
                                                                Signature
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="editor">
                                            <div
                                                id="summernote"
                                                className="col-col-xs-12 summernote"
                                            >
                                                {this.state.signature}
                                            </div>
                                        </div>
                                        <div className="form-section-bottom">
                                            <div className="btn-row">
                                                <button
                                                    type="button"
                                                    className="btn-border fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "toggleDisplay"
                                                    )}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-blue fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "saveNewAlias"
                                                    )}
                                                >
                                                    {`Save`}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-right alias-email">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>
                            <div className="panel-body">
                                <h3>Email Aliases</h3>
                                <p>
                                    this is an alternate addresses that can be
                                    used to receive email at your CyberFear
                                    account. Email aliases are not alternative
                                    login addresses. Using email aliases makes
                                    it possible to give out an email addresses
                                    that can't be targeted for login attacks.
                                </p>
                                <h3>Display Name</h3>
                                <p>
                                    is the real name or nickname that you would
                                    like people to see when you send email from
                                    one of your email aliases.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
