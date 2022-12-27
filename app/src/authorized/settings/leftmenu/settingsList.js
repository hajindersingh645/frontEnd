define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        //getInitialState : function() {
        //return {
        //	setings:{profile:'active'}
        //};
        //},
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
                        Backbone.history.navigate("/settings/Profile", {
                            trigger: true,
                        });
                        break;
                    case "Layout":
                        Backbone.history.navigate("/settings/Layout", {
                            trigger: true,
                        });
                        break;

                    case "Password":
                        Backbone.history.navigate("/settings/Password", {
                            trigger: true,
                        });
                        break;
                    case "Disposable-Aliases":
                        Backbone.history.navigate(
                            "/settings/Disposable-Aliases",
                            {
                                trigger: true,
                            }
                        );
                        break;
                    case "Custom-Domain":
                        Backbone.history.navigate("/settings/Custom-Domain", {
                            trigger: true,
                        });
                        break;
                    case "2-Step":
                        Backbone.history.navigate("/settings/2-Step", {
                            trigger: true,
                        });
                        break;
                    case "Contacts":
                        Backbone.history.navigate("/settings/Contacts", {
                            trigger: true,
                        });
                        break;
                    case "WebDiv":
                        Backbone.history.navigate("/settings/WebDiv", {
                            trigger: true,
                        });
                        break;
                    case "PGP-Keys":
                        Backbone.history.navigate("/settings/PGP-Keys", {
                            trigger: true,
                        });
                        break;

                    case "AdminPanel":
                        Backbone.history.navigate("/settings/AdminPanel", {
                            trigger: true,
                        });
                        break;

                    case "Filter":
                        Backbone.history.navigate("/settings/Filter", {
                            trigger: true,
                        });
                        break;
                    case "BlackList":
                        Backbone.history.navigate("/settings/Black-List", {
                            trigger: true,
                        });
                        break;
                    case "Folders":
                        Backbone.history.navigate("/settings/Folders", {
                            trigger: true,
                        });
                        break;

                    case "Security-Log":
                        Backbone.history.navigate("/settings/Security-Log", {
                            trigger: true,
                        });
                        break;
                    case "Coupon":
                        Backbone.history.navigate("/settings/Coupons", {
                            trigger: true,
                        });
                        break;

                    case "Plan":
                        Backbone.history.navigate("/settings/Plan", {
                            trigger: true,
                        });
                        break;

                    case "Delete-Account":
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
                                    <h2 className="accordion-header" id="">
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
                                                    <li className="active">
                                                        <a
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "Contacts"
                                                            )}
                                                        >
                                                            Contacts
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a>Alias</a>
                                                    </li>
                                                    <li>
                                                        <a>
                                                            Disposable address
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a>Custom domain</a>
                                                    </li>
                                                    <li>
                                                        <a>Delete account</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="">
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
                                                    <li>
                                                        <a>Password</a>
                                                    </li>
                                                    <li>
                                                        <a>2AF</a>
                                                    </li>
                                                    <li>
                                                        <a>PGP Keys</a>
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
                                                    <li>
                                                        <a>Folder / Label</a>
                                                    </li>
                                                    <li>
                                                        <a>Email filter</a>
                                                    </li>
                                                    <li>
                                                        <a>
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
                                                    <li>
                                                        <a>Upgrade</a>
                                                    </li>
                                                    <li>
                                                        <a>Coupons</a>
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
