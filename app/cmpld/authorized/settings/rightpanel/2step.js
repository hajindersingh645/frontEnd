define(["react", "app", "qrcode", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, qrcode, RightTop) {
    "use strict";

    return React.createClass({
        /**
         *
         * @returns {{
         * nav1Class: string,
         * nav2Class: string,
         * panel1Class: string,
         * panel2Class: string,
         * panel3Class: string,
         * panel4Class: string,
         * panel2Visible: string,
         * panel4Visible: string,
         * button1Class: string,
         * googlePin: string,
         * yubiPin: string
         * }}
         */
        getInitialState: function () {
            return {
                nav1Class: "",
                nav2Class: "",

                panel1Class: "d-none", //goog enab
                panel2Class: "d-none", //goog create
                panel3Class: "d-none", //yubi enab
                panel4Class: "d-none", //yubi create

                panel2Visible: "d-none",
                panel4Visible: "d-none",
                button1Class: "",
                googlePin: "",
                yubiPin: ""
            };
        },

        panelsReset: function () {
            this.setState({
                nav1Class: "",
                nav2Class: "",

                panel1Class: "d-none",
                panel2Class: "d-none",
                panel3Class: "d-none",
                panel4Class: "d-none",
                panel2Visible: "d-none",
                panel4Visible: "d-none",
                button1Class: ""
            });
        },

        whatToShow: function () {
            if (app.user.get("Factor2")["type"] == "google") {
                //google present
                this.setState({
                    nav1Class: "active",
                    nav2Class: "d-none",
                    nav1Click: "",
                    nav2Click: "",

                    panel1Class: "panel-body",
                    panel2Class: "d-none",
                    panel3Class: "d-none",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",

                    button1Class: "d-none"
                });

                //this.generateQr(this.state.secret);
            } else if (app.user.get("Factor2")["type"] == "yubi") {
                //yubi present
                this.setState({
                    nav1Class: "d-none",
                    nav2Class: "active",
                    nav1Click: "",
                    nav2Click: "",

                    panel1Class: "d-none",
                    panel2Class: "d-none",
                    panel3Class: "panel-body",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",
                    panel4Visible: "d-none",

                    button1Class: "d-none",
                    button2Class: "d-none"
                });
            } else {
                //if not selected

                this.setState({
                    nav1Class: "active",
                    nav2Class: "",
                    nav1Click: "show1Panel",
                    nav2Click: "show2Panel",

                    panel1Class: "d-none",
                    panel2Class: "panel-body",
                    panel3Class: "d-none",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",
                    panel4Visible: "d-none",
                    button1Class: ""
                });
            }
        },

        componentDidMount: function () {
            this.whatToShow();
            var thisComp = this;

            this.setState({ googleValidator: $("#googleForm").validate() });

            $("#gpin").rules("add", {
                required: true,
                number: true,
                minlength: 6,
                maxlength: 6,
                remote: {
                    url: app.defaults.get("apidomain") + "/setup2FacV2",
                    type: "post",
                    data: {
                        secret: function () {
                            return thisComp.state.secret;
                        },
                        fac2Type: "google",
                        verificationCode: function () {
                            return thisComp.state.googlePin;
                        },
                        userToken: app.user.get("userLoginToken")
                    }
                },
                messages: {
                    remote: "Incorrect Pin"
                }
            });

            this.setState({ yubiValidator: $("#yubiForm").validate() });
            $("#ypin").rules("add", {
                required: true,
                minlength: 44,
                maxlength: 60,
                // remote: {
                // 	url: app.defaults.get('apidomain')+"/setup2FacV2",
                // 	type: "post",
                // 	data:{
                // 		"secret":function(){
                // 			return thisComp.state.secret
                // 		},
                // 		'fac2Type':'yubi',
                // 		"verificationCode":function(){
                // 			return thisComp.state.yubiPin
                // 		},
                // 		'userToken':app.user.get("userLoginToken")
                // 	}
                // },
                messages: {
                    remote: "Incorrect Pin"
                }
            });
        },

        /**
         *
         * @param {string} action
         * @param {string} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "show1Panel":
                    this.handleClick("resetGoogleForm");
                    //this.whatToShow();

                    //this.setState({
                    //	nav1Class:"active",
                    //	panel2Class:"panel-body"
                    //});

                    break;

                case "show2Panel":
                    this.handleClick("resetYubiForm");

                    //this.setState({
                    //	nav1Class:"",
                    //	nav2Class:"active",
                    //	panel2Class:"d-none",
                    //	panel4Class:"panel-body",
                    //	button2Class:"",
                    //	button1Class:"d-none"
                    //});

                    break;
                case "confirmDisableGoogleAuth":
                    var thisComp = this;
                    $("#dialogModHead").html("Cancel Google 2-Factor");
                    $("#dialogModBody").html(" Are you sure?");

                    $("#dialogOk").on("click", function () {
                        thisComp.handleClick("DisableGoogleAuth");
                    });

                    $("#dialogPop").modal("show");

                    break;
                case "confirmDisableYubiAuth":
                    var thisComp = this;
                    $("#dialogModHead").html("Cancel YubiKey 2-Factor");
                    $("#dialogModBody").html("Are you sure?");

                    $("#dialogOk").on("click", function () {
                        thisComp.handleClick("DisableYubiAuth");
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "DisableYubiAuth":
                    var thisComp = this;
                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: ""
                        }
                    });

                    app.userObjects.updateObjects("saveGoogleAuth", "", function (result) {
                        if (result["response"] == "success") {
                            if (result["data"] == "saved") {
                                thisComp.setState({
                                    secret: "",
                                    yubiPin: ""
                                });

                                thisComp.whatToShow();
                            } else if (result["data"] == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            }
                        }
                    });
                    $("#dialogPop").modal("hide");

                    break;

                case "DisableGoogleAuth":
                    var thisComp = this;
                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: ""
                        }
                    });

                    $("#dialogPop").modal("hide");

                    app.userObjects.updateObjects("saveGoogleAuth", "", function (result) {
                        if (result["response"] == "success") {
                            if (result["data"] == "saved") {
                                thisComp.whatToShow();

                                thisComp.whatToShow();
                                $("#qrcode").html("");

                                thisComp.setState({
                                    secret: "",
                                    googlePin: ""
                                });
                            } else if (result["data"] == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            }
                        }
                    });

                    //app.userObjects.updateObjects();
                    break;

                case "EnableGoogleAuth":
                    this.handleClick("resetGoogleForm");
                    this.panelsReset();

                    var secret = app.generate.makeQRSecret();
                    this.setState({
                        nav1Class: "active",
                        panel2Class: "panel-body",
                        panel2Visible: "",
                        button1Class: "d-none",
                        secret: secret
                    });
                    this.generateQr(secret);

                    break;

                case "resetGoogleForm":
                    this.panelsReset();

                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: ""
                        }
                    });
                    $("#qrcode").html("");

                    this.setState({
                        nav1Class: "active",
                        panel2Class: "panel-body",
                        panel2Visible: "d-none",
                        button1Class: "",
                        secret: "",
                        googlePin: ""
                    });

                    $("#gpin").removeClass("invalid");
                    $("#gpin").removeClass("valid");

                    var validator = $("#googleForm").validate();
                    validator.resetForm();

                    break;
                case "saveNewGoogleAuth":
                    var validator = this.state.googleValidator;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        var post = {
                            secret: thisComp.state.secret,
                            fac2Type: "google",
                            verificationCode: thisComp.state.googlePin
                        };
                        app.serverCall.ajaxRequest("setup2Fac", post, function (result) {
                            if (result === true) {
                                app.user.set({
                                    Factor2: {
                                        type: "google",
                                        secret: app.transform.to64str(thisComp.state.secret),
                                        since: Math.round(new Date().getTime() / 1000)
                                    }
                                });

                                app.userObjects.updateObjects("saveGoogleAuth", "", function (result) {
                                    if (result["response"] == "success") {
                                        if (result["data"] == "saved") {
                                            thisComp.whatToShow();
                                            $("#qrcode").html("");

                                            thisComp.setState({
                                                secret: "",
                                                googlePin: ""
                                            });
                                        } else if (result["data"] == "newerFound") {}
                                    }
                                });
                            }
                        });

                        $("#gpin").removeClass("invalid");
                        $("#gpin").removeClass("valid");

                        var validator = $("#googleForm").validate();
                        validator.resetForm();
                    }

                    break;
                case "saveNewYubiAuth":
                    var validator = this.state.yubiValidator;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        app.user.set({ Fac2Changed: true });

                        app.user.set({
                            Factor2: {
                                type: "yubi",
                                secret: app.transform.to64str(this.state.yubiPin.substring(0, 12)),
                                since: Math.round(new Date().getTime() / 1000)
                            }
                        });

                        app.userObjects.updateObjects("saveGoogleAuth", thisComp.state.yubiPin, function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.whatToShow();
                                    //$('#qrcode').html('');

                                    thisComp.setState({
                                        secret: "",
                                        yubiPin: ""
                                    });
                                } else if (result["data"] == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                }
                            }
                        });

                        //app.userObjects.updateObjects();
                        //this.whatToShow();
                    }

                    break;

                case "EnableYubiKeyAuth":
                    this.panelsReset();

                    this.setState({
                        nav2Class: "active",
                        panel4Class: "panel-body",
                        panel4Visible: "",
                        button2Class: "d-none"
                    });

                    break;

                case "resetYubiForm":
                    this.panelsReset();

                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: ""
                        }
                    });
                    $("#qrcode").html("");

                    this.setState({
                        nav2Class: "active",
                        panel4Class: "panel-body",
                        panel2Visible: "d-none",
                        button2Class: "",
                        yubiPin: ""
                    });

                    $("#ypin").removeClass("invalid");
                    $("#ypin").removeClass("valid");

                    var validator = $("#yubiForm").validate();
                    validator.resetForm();

                    break;
            }
        },

        /**
         *
         * @param {sting} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "enterGCode":
                    this.setState({
                        googlePin: event.target.value
                    });
                    break;
                case "enterYCode":
                    this.setState({
                        yubiPin: event.target.value
                    });
                    break;

                case "preventEnter":
                    if (event.keyCode == 13) {
                        event.preventDefault();
                    }
                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classQRInputs = "col-xs-12 col-sm-8 col-md-9";
            var classQrDiv = "col-xs-12 col-sm-4 col-md-3";

            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle two-step-security" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            { className: "arrow-back" },
                            React.createElement("a", { href: "#" })
                        ),
                        React.createElement(
                            "h2",
                            null,
                            "Security"
                        ),
                        React.createElement(
                            "div",
                            { className: "bread-crumb" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    null,
                                    "2AF"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "mid-nav" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    { className: this.state.nav1Class },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, this.state.nav1Click)
                                        },
                                        "Google auth"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    { className: this.state.nav2Class },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, this.state.nav2Click)
                                        },
                                        "YubiKey"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel1Class },
                            React.createElement(
                                "blockquote",
                                null,
                                React.createElement(
                                    "p",
                                    null,
                                    "Using Google AUTH Since:",
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        new Date(app.user.get("Factor2")["since"] * 1000).toLocaleDateString()
                                    )
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
                                            className: "btn-blue fixed-width-btn",
                                            onClick: this.handleClick.bind(this, "confirmDisableGoogleAuth")
                                        },
                                        "Disable Google Auth"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel2Class },
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
                                            className: "btn-blue fixed-width-btn " + this.state.button1Class,
                                            onClick: this.handleClick.bind(this, "EnableGoogleAuth")
                                        },
                                        "Enable Google Auth"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: this.state.panel2Visible },
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement("div", {
                                        id: "qrcode",
                                        className: "qrcode"
                                    })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement("input", {
                                        type: "name",
                                        className: "form-control",
                                        readOnly: true,
                                        value: this.state.secret
                                    })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "form-section" },
                                    React.createElement(
                                        "form",
                                        {
                                            id: "googleForm",
                                            onKeyDown: this.handleChange.bind(this, "preventEnter")
                                        },
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
                                                        name: "verificationCode",
                                                        id: "gpin",
                                                        type: "text",
                                                        className: "form-control",
                                                        value: this.state.googlePin,
                                                        onChange: this.handleChange.bind(this, "enterGCode"),
                                                        placeholder: "Enter code"
                                                    })
                                                )
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
                                                        onClick: this.handleClick.bind(this, "resetGoogleForm")
                                                    },
                                                    "Cancel"
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        className: "btn-blue fixed-width-btn",
                                                        onClick: this.handleClick.bind(this, "saveNewGoogleAuth")
                                                    },
                                                    "Save"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel3Class },
                            React.createElement(
                                "blockquote",
                                null,
                                React.createElement(
                                    "p",
                                    null,
                                    "Using YubiKey Since:",
                                    " ",
                                    React.createElement(
                                        "strong",
                                        null,
                                        new Date(app.user.get("Factor2")["since"] * 1000).toLocaleDateString()
                                    )
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
                                            className: "btn btn-primary",
                                            onClick: this.handleClick.bind(this, "confirmDisableYubiAuth")
                                        },
                                        "Disable YubiKey"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel4Class },
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
                                            className: "btn-blue fixed-width-btn " + this.state.button2Class,
                                            onClick: this.handleClick.bind(this, "EnableYubiKeyAuth")
                                        },
                                        "Enable Yubikey"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: this.state.panel4Visible },
                                React.createElement(
                                    "div",
                                    { className: "form-section" },
                                    React.createElement(
                                        "form",
                                        {
                                            id: "yubiForm",
                                            onKeyDown: this.handleChange.bind(this, "preventEnter")
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "row" },
                                            React.createElement(
                                                "div",
                                                { className: `col-12` },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-group" },
                                                    React.createElement("input", {
                                                        name: "verificationCode",
                                                        id: "ypin",
                                                        type: "text",
                                                        className: "form-control",
                                                        value: this.state.yubiPin,
                                                        onChange: this.handleChange.bind(this, "enterYCode"),
                                                        placeholder: "Enter code"
                                                    })
                                                )
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
                                                        onClick: this.handleClick.bind(this, "resetYubiForm")
                                                    },
                                                    "Cancel"
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        className: "btn-blue fixed-width-btn",
                                                        onClick: this.handleClick.bind(this, "saveNewYubiAuth")
                                                    },
                                                    "Save"
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
                    { className: "setting-right two-step-security" },
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
                                "Google Authenticator"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Increase the security of your login with multi-factor authentication by Google Authenticator. After typing in your login password, you'll be prompted to enter the six digit code displayed in the Authenticator app on your mobile device. To begin the setup, be sure you are on the Google Auth tab and click on \"Enable Google Auth\" using the Authenticator app on your mobile device and scan the QR code displayed in your CyberFear settings."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "YubiKey"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Small usb key, that generates One Time Password in order to protect your account. Please note, that in order to verify a token, the system needs to make request on third party server, that potentially can disclose your login attempt. You can learn more at :"
                            ),
                            React.createElement(
                                "div",
                                { className: "blue-bg-text" },
                                React.createElement(
                                    "a",
                                    {
                                        href: "https://www.yubico.com/start/",
                                        target: `_blank`
                                    },
                                    "https://www.yubico.com/start/"
                                )
                            )
                        )
                    )
                )
            );
        },

        /**
         *
         * @param {string} secret
         */
        generateQr: function (secret) {
            var qrcode = new QRCode("qrcode", {
                text: "otpauth://totp/" + app.user.get("loginEmail") + "?secret=" + secret + "&issuer=CyberFear.com",
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    });
});