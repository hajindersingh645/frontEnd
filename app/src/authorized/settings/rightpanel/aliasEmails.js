define([
    "react",
    "app",
    "dataTable",
    "dataTableBoot",
    "cmpld/authorized/settings/rightpanel/rightTop",
    "quill",
], function (React, app, DataTable, dataTableBoot, RightTop, Quill) {
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

            $(".note-editable").attr("contenteditable", "false");

            // Initiate editor toolbar [Quill]
            const quill = new Quill("#com-the-con-editor__alias", {
                modules: {
                    toolbar: "#editor_toolbar",
                },
                handlers: {
                    link: function (value) {
                        if (value) {
                            const href = prompt("Enter the URL");
                            this.quill.format("link", href);
                        } else {
                            this.quill.format("link", false);
                        }
                    },
                },
            });

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
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
                    { orderDataType: "data-sort", targets: [1, 2] },
                    { sClass: "data-cols", targets: [1, 2] },
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
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
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
                                                <col width="40" />
                                                <col width="40" />
                                                <col width="40" />
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
                                        <div className="com-content-editor editor">
                                            <div className="c-editor-actions">
                                                <div
                                                    className="c-editor-formating ql-formats"
                                                    id="editor_toolbar"
                                                >
                                                    <button
                                                        type="submit"
                                                        className="ql-bold"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M14 36V8h11.4q3.3 0 5.725 2.1t2.425 5.3q0 1.9-1.05 3.5t-2.8 2.45v.3q2.15.7 3.475 2.5 1.325 1.8 1.325 4.05 0 3.4-2.625 5.6Q29.25 36 25.75 36Zm4.3-16.15h6.8q1.75 0 3.025-1.15t1.275-2.9q0-1.75-1.275-2.925Q26.85 11.7 25.1 11.7h-6.8Zm0 12.35h7.2q1.9 0 3.3-1.25t1.4-3.15q0-1.85-1.4-3.1t-3.3-1.25h-7.2Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-italic"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M10 40v-5h6.85l8.9-22H18V8h20v5h-6.85l-8.9 22H30v5Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-underline"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M10 42v-3h28v3Zm14-8q-5.05 0-8.525-3.45Q12 27.1 12 22.1V6h4v16.2q0 3.3 2.3 5.55T24 30q3.4 0 5.7-2.25Q32 25.5 32 22.2V6h4v16.1q0 5-3.475 8.45Q29.05 34 24 34Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-blockquote"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M29 23h8v-8h-8Zm-18 0h8v-8h-8Zm20.3 11 4-8H26V12h14v14.4L36.2 34Zm-18 0 4-8H8V12h14v14.4L18.2 34ZM15 19Zm18 0Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-list"
                                                        value="ordered"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M6 40v-1.7h4.2V37H8.1v-1.7h2.1V34H6v-1.7h5.9V40Zm10.45-2.45v-3H42v3ZM6 27.85v-1.6l3.75-4.4H6v-1.7h5.9v1.6l-3.8 4.4h3.8v1.7Zm10.45-2.45v-3H42v3ZM8.1 15.8V9.7H6V8h3.8v7.8Zm8.35-2.55v-3H42v3Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-list"
                                                        value="bullet"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M8.55 39q-1.05 0-1.8-.725T6 36.55q0-1.05.75-1.8t1.8-.75q1 0 1.725.75.725.75.725 1.8 0 1-.725 1.725Q9.55 39 8.55 39ZM16 38v-3h26v3ZM8.55 26.5q-1.05 0-1.8-.725T6 24q0-1.05.75-1.775.75-.725 1.8-.725 1 0 1.725.75Q11 23 11 24t-.725 1.75q-.725.75-1.725.75Zm7.45-1v-3h26v3ZM8.5 14q-1.05 0-1.775-.725Q6 12.55 6 11.5q0-1.05.725-1.775Q7.45 9 8.5 9q1.05 0 1.775.725Q11 10.45 11 11.5q0 1.05-.725 1.775Q9.55 14 8.5 14Zm7.5-1v-3h26v3Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-link"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M22.5 34H14q-4.15 0-7.075-2.925T4 24q0-4.15 2.925-7.075T14 14h8.5v3H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h15.5v3ZM25.5 34v-3H34q2.9 0 4.95-2.05Q41 26.9 41 24q0-2.9-2.05-4.95Q36.9 17 34 17h-8.5v-3H34q4.15 0 7.075 2.925T44 24q0 4.15-2.925 7.075T34 34Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={this.handleClick.bind(
                                                            this,
                                                            "attachFile"
                                                        )}
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M21.586 10.461l-10.05 10.075c-1.95 1.949-5.122 1.949-7.071 0s-1.95-5.122 0-7.072l10.628-10.585c1.17-1.17 3.073-1.17 4.243 0 1.169 1.17 1.17 3.072 0 4.242l-8.507 8.464c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7.093-7.05-1.415-1.414-7.093 7.049c-1.172 1.172-1.171 3.073 0 4.244s3.071 1.171 4.242 0l8.507-8.464c.977-.977 1.464-2.256 1.464-3.536 0-2.769-2.246-4.999-5-4.999-1.28 0-2.559.488-3.536 1.465l-10.627 10.583c-1.366 1.368-2.05 3.159-2.05 4.951 0 3.863 3.13 7 7 7 1.792 0 3.583-.684 4.95-2.05l10.05-10.075-1.414-1.414z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-clean"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M25.35 21.8 21.5 18l1.2-2.8h-3.95l-5.2-5.2H40v5H28.25ZM40.3 45.2 22.85 27.7 18.45 38H13l6-14.1L2.8 7.7l2.1-2.1 37.5 37.5Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div id="toolbar"></div>
                                            <div
                                                className="com-the-con-editor__settings"
                                                id="com-the-con-editor__alias"
                                            ></div>
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
