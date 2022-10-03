define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        render: function () {
            return (
                <div
                    className="offcanvas offcanvas-end"
                    tabIndex="-1"
                    id="offcanvasRight"
                    aria-label="offcanvasRightLabel"
                >
                    <div className="offcanvas-header">
                        <div className="user-name-side-menu">
                            {" "}
                            <img src="images/user.jpg" alt="" /> Sepide Moqadasi
                            <br />
                            <span className="user-email">
                                Sepide_moqadasi@y..
                            </span>{" "}
                        </div>
                        <div className="user-side-menu">
                            <ul>
                                <li>
                                    <button
                                        className="copy-icon"
                                        id="email-copy-2"
                                    >
                                        Copy my email address
                                    </button>
                                </li>
                                <li>
                                    <a href="#" className="logout-icon">
                                        Log out
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="main-menu">
                            <ul>
                                <li className="active">
                                    <a href="#">
                                        <span className="menu-icon inbox"></span>{" "}
                                        Inbox{" "}
                                        <span className="number-badge">
                                            235
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="menu-icon send"></span>{" "}
                                        Send
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="menu-icon draft"></span>{" "}
                                        Draft
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="menu-icon spam"></span>{" "}
                                        Spam
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="menu-icon trash"></span>{" "}
                                        Trash
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="folder-menu">
                            <div className="add-folder">
                                <button></button>
                            </div>
                            <div className="accordion" id="folders">
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="headingtwo"
                                    >
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="true"
                                            aria-controls="collapseTwo"
                                        >
                                            {" "}
                                            Folders{" "}
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseTwo"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#folders"
                                    >
                                        <div className="accordion-body">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        Dribbble{" "}
                                                        <span className="number-badge">
                                                            51
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        Google Ads{" "}
                                                        <span className="number-badge">
                                                            1241
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="side-menu-cta">
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
                        <div className="side-menu">
                            <ul>
                                <li>
                                    <a href="#">Menu item 1</a>
                                </li>
                                <li>
                                    <a href="#">Menu item 2</a>
                                </li>
                                <li>
                                    <a href="#">Menu item 3</a>
                                </li>
                            </ul>
                        </div>
                        <div className="storage">
                            <div className="storage-count">
                                0.02 GB <span>/ 0.05 GB</span>
                            </div>
                            <div className="storage-bar">
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
