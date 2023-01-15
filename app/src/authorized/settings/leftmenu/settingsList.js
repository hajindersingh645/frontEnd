define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                setings: { profile: "active" },
                activeLink: "",
            };
        },
        boxSize: function () {
            return (
                <div>
                    <div className="used_one">
                        {accounting.toFixed(
                            app.user.get("mailboxSize") / 1024 / 1024 / 1024,
                            2
                        )}{" "}
                        GB
                    </div>{" "}
                    <span>
                        &nbsp;/&nbsp;
                        <strong>
                            {app.user.get("userPlan")["planData"]["bSize"] /
                                1000}{" "}
                            GB
                        </strong>
                    </span>
                </div>
            );
        },
        handleClick: function (i) {
            if (!app.user.get("inProcess")) {
                this.props.updateAct(i);

                switch (i) {
                    case "Profile":
                        this.setState({
                            activeLink: `Profile`,
                        });
                        Backbone.history.navigate("/settings/Profile", {
                            trigger: true,
                        });
                        break;
                    case "Layout":
                        this.setState({
                            activeLink: `Layout`,
                        });
                        Backbone.history.navigate("/settings/Layout", {
                            trigger: true,
                        });
                        break;

                    case "Password":
                        this.setState({
                            activeLink: `Password`,
                        });
                        Backbone.history.navigate("/settings/Password", {
                            trigger: true,
                        });
                        break;
                    case "Aliases":
                        this.setState({
                            activeLink: `Aliases`,
                        });
                        Backbone.history.navigate("/settings/Aliases", {
                            trigger: true,
                        });
                        break;
                    case "Disposable-Aliases":
                        this.setState({
                            activeLink: `Disposable-Aliases`,
                        });
                        Backbone.history.navigate(
                            "/settings/Disposable-Aliases",
                            {
                                trigger: true,
                            }
                        );
                        break;
                    case "Custom-Domain":
                        this.setState({
                            activeLink: `Custom-Domain`,
                        });
                        Backbone.history.navigate("/settings/Custom-Domain", {
                            trigger: true,
                        });
                        break;
                    case "2-Step":
                        this.setState({
                            activeLink: `2-Step`,
                        });
                        Backbone.history.navigate("/settings/2-Step", {
                            trigger: true,
                        });
                        break;
                    case "Contacts":
                        this.setState({
                            activeLink: `Contacts`,
                        });
                        Backbone.history.navigate("/settings/Contacts", {
                            trigger: true,
                        });
                        break;
                    case "WebDiv":
                        this.setState({
                            activeLink: `WebDiv`,
                        });
                        Backbone.history.navigate("/settings/WebDiv", {
                            trigger: true,
                        });
                        break;
                    case "PGP-Keys":
                        this.setState({
                            activeLink: `PGP-Keys`,
                        });
                        Backbone.history.navigate("/settings/PGP-Keys", {
                            trigger: true,
                        });
                        break;

                    case "AdminPanel":
                        this.setState({
                            activeLink: `AdminPanel`,
                        });
                        Backbone.history.navigate("/settings/AdminPanel", {
                            trigger: true,
                        });
                        break;

                    case "Filter":
                        this.setState({
                            activeLink: `Filter`,
                        });
                        Backbone.history.navigate("/settings/Filter", {
                            trigger: true,
                        });
                        break;
                    case "BlackList":
                        this.setState({
                            activeLink: `BlackList`,
                        });
                        Backbone.history.navigate("/settings/Black-List", {
                            trigger: true,
                        });
                        break;
                    case "Folders":
                        this.setState({
                            activeLink: `Folders`,
                        });
                        Backbone.history.navigate("/settings/Folders", {
                            trigger: true,
                        });
                        break;

                    case "Security-Log":
                        this.setState({
                            activeLink: `Security-Log`,
                        });
                        Backbone.history.navigate("/settings/Security-Log", {
                            trigger: true,
                        });
                        break;
                    case "Coupon":
                        this.setState({
                            activeLink: `Coupon`,
                        });
                        Backbone.history.navigate("/settings/Coupons", {
                            trigger: true,
                        });
                        break;

                    case "Plan":
                        this.setState({
                            activeLink: `Plan`,
                        });
                        Backbone.history.navigate("/settings/Plan", {
                            trigger: true,
                        });
                        break;

                    case "Delete-Account":
                        this.setState({
                            activeLink: `Delete-Account`,
                        });
                        Backbone.history.navigate("/settings/Delete-Account", {
                            trigger: true,
                        });
                        break;
                }
            } else {
                $("#infoModHead").html("Active Process");
                $("#infoModBody").html(
                    "Please cancel or wait until process is finished before go to the next page."
                );
                $("#infoModal").modal("show");

                //todo add cancel button
                //console.log('no');
            }
        },
        render: function () {
            //console.log(this.props.activeLink);
            //console.log(this.props.classes.leftClass);
            var admin = "hidden";
            if (
                app.transform.SHA512(app.user.get("loginEmail")) ==
                    "eff5ce297f6dbec57ea9b44cea193bd1f053ebd207efbecc751c11307a1ea1ef3f1f2ddc64d744685e69e842b50a88228cd50aa2d3d411bdbfd448e72448b98d" ||
                app.transform.SHA512(app.user.get("loginEmail")) ==
                    "30742f1d394011fdaaa1842001d5b9a7332356b60004e48f3141c7e0c3de4e35430ebe4fabdd646454d397c0f8dfb5674a4891e0e7b53fe79695d0d098216689"
            ) {
                var admin = "";
            }
            var st3 = {
                width:
                    (accounting.toFixed(
                        app.user.get("mailboxSize") / 1024 / 1024,
                        2
                    ) *
                        100) /
                        app.user.get("userPlan")["planData"]["bSize"] +
                    "%",
            };
            return (
                <div
                    className={this.props.classes.leftClass}
                    id="leftSettingPanel"
                >
                    <div className="left-container">
                        <div className="logo">
                            <a href="#">
                                <img
                                    src="images/logo.svg"
                                    alt=""
                                    className="light-theme-logo"
                                />{" "}
                                <img
                                    src="images/logo-white.svg"
                                    alt=""
                                    className="dark-theme-logo"
                                />
                            </a>
                        </div>
                        <div className="left-acco-menu">
                            <div className="accordion" id="settingsAccordion">
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="headingProfile"
                                    >
                                        <button
                                            className="accordion-button icon-profile collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseProfile"
                                            aria-expanded="false"
                                            aria-controls="collapseProfile"
                                        >
                                            Profile
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseProfile"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingProfile"
                                        data-bs-parent="#settingsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="acco-menu-list">
                                                <ul>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Contacts`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Contacts"
                                                            )}
                                                        >
                                                            Contacts
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Aliases`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Aliases"
                                                            )}
                                                        >
                                                            Alias
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Disposable-Aliases`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Disposable-Aliases"
                                                            )}
                                                        >
                                                            Disposable address
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Custom-Domain`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Custom-Domain"
                                                            )}
                                                        >
                                                            Custom domain
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Delete-Account`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Delete-Account"
                                                            )}
                                                        >
                                                            Delete account
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="headingSecurity"
                                    >
                                        <button
                                            className="accordion-button icon-security collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseSecurity"
                                            aria-expanded="false"
                                            aria-controls="collapseSecurity"
                                        >
                                            Security
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseSecurity"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingSecurity"
                                        data-bs-parent="#settingsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="acco-menu-list">
                                                <ul>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Password`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Password"
                                                            )}
                                                        >
                                                            Password
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `2-Step`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "2-Step"
                                                            )}
                                                        >
                                                            2AF
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `PGP-Keys`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "PGP-Keys"
                                                            )}
                                                        >
                                                            PGP Keys
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="headingMailbox"
                                    >
                                        <button
                                            className="accordion-button icon-mailbox collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseMailbox"
                                            aria-expanded="false"
                                            aria-controls="collapseMailbox"
                                        >
                                            Mailbox
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseMailbox"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingMailbox"
                                        data-bs-parent="#settingsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="acco-menu-list">
                                                <ul>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Folders`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Folders"
                                                            )}
                                                        >
                                                            Folder / Label
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Filter`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Filter"
                                                            )}
                                                        >
                                                            Email filter
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `BlackList`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "BlackList"
                                                            )}
                                                        >
                                                            Blacklist /
                                                            Whitelist
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="headingPremium"
                                    >
                                        <button
                                            className="accordion-button icon-premium collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapsePremium"
                                            aria-expanded="false"
                                            aria-controls="collapsePremium"
                                        >
                                            Premium
                                        </button>
                                    </h2>
                                    <div
                                        id="collapsePremium"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingPremium"
                                        data-bs-parent="#settingsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="acco-menu-list">
                                                <ul>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Plan`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Plan"
                                                            )}
                                                        >
                                                            Upgrade
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={`${
                                                            this.state
                                                                .activeLink ===
                                                            `Coupon`
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Coupon"
                                                            )}
                                                        >
                                                            Coupons
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <a
                                            className="accordion-button icon-setting"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "Profile"
                                            )}
                                        >
                                            Setting
                                        </a>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="left-bottom">
                        <div className="left-cta">
                            <div className="call-to-action">
                                <div className="cta-title">
                                    Let's explore the full
                                    <br />
                                    version of your mailbox
                                </div>
                                <div className="white-btn">
                                    <a href="#">Discover Pro</a>
                                </div>
                            </div>
                        </div>
                        <div className="storage">
                            <div className="storage-count">
                                {this.boxSize()}
                            </div>
                            <div className="storage-bar">
                                <span style={st3}></span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
