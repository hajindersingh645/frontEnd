define(["react", "app", "slate"], function (React, app, slate) {
    return React.createClass({
        getInitialState: function () {
            return {
                isMaximized: false,
                isMinimized: false,
            };
        },
        componentDidMount: function () {},
        renderEditor: function () {},
        handleEmailHeaderAction: function (i) {
            switch (i) {
                case "maximize":
                    this.setState({
                        isMaximized: this.state.isMaximized ? false : true,
                        isMinimized: false,
                    });
                    break;
                case "minimize":
                    this.setState({
                        isMaximized: false,
                        isMinimized: this.state.isMinimized ? false : true,
                    });
                    break;
            }
        },
        render: function () {
            return (
                <div
                    className={`compose-email-wrapper ${
                        this.state.isMaximized
                            ? "compose-maximize"
                            : this.state.isMinimized
                            ? "compose-minimize"
                            : ""
                    }`}
                >
                    <div className="compose-ec">
                        <div className="the-header">
                            <div className="c-title">
                                <h3>New message</h3>
                            </div>
                            <div className="c-actions">
                                <button
                                    type="button"
                                    onClick={this.handleEmailHeaderAction.bind(
                                        this,
                                        "minimize"
                                    )}
                                >
                                    <span
                                        className={`icon ${
                                            this.state.isMinimized
                                                ? "d-none"
                                                : ""
                                        }`}
                                    >
                                        <svg
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 41.5v-3h24.05v3Z" />
                                        </svg>
                                    </span>
                                    <span
                                        className={`icon ${
                                            this.state.isMinimized
                                                ? "d-block"
                                                : "d-none"
                                        }`}
                                    >
                                        <svg
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M5.95 9.5v-3H42v3Z" />
                                        </svg>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleEmailHeaderAction.bind(
                                        this,
                                        "maximize"
                                    )}
                                >
                                    <span
                                        className={`icon ${
                                            this.state.isMaximized
                                                ? "d-none"
                                                : ""
                                        }`}
                                    >
                                        <svg
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M6 42V27h3v9.9L36.9 9H27V6h15v15h-3v-9.9L11.1 39H21v3Z" />
                                        </svg>
                                    </span>
                                    <span
                                        className={`icon ${
                                            this.state.isMaximized
                                                ? "d-block"
                                                : "d-none"
                                        }`}
                                    >
                                        <svg
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M8.1 42 6 39.9l10.7-10.7h-5.9v-3h11v11h-3v-5.9Zm18.15-20.25v-11h3v5.9L39.9 6 42 8.1 31.35 18.75h5.9v3Z" />
                                        </svg>
                                    </span>
                                </button>
                                <button type="button">
                                    <span className="icon">
                                        <svg
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="the-content">
                            <div className="the-content-wrapper">
                                <div className="com-content-header"></div>
                                <div className="com-content-editor">
                                    <div
                                        className="com-the-con-editor"
                                        id="com-the-con-editor"
                                    >
                                        This is something new we had to try and
                                        give a shot at
                                    </div>
                                    <div className="c-editor-actions">
                                        <div className="c-editor-formating">
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M14 36V8h11.4q3.3 0 5.725 2.1t2.425 5.3q0 1.9-1.05 3.5t-2.8 2.45v.3q2.15.7 3.475 2.5 1.325 1.8 1.325 4.05 0 3.4-2.625 5.6Q29.25 36 25.75 36Zm4.3-16.15h6.8q1.75 0 3.025-1.15t1.275-2.9q0-1.75-1.275-2.925Q26.85 11.7 25.1 11.7h-6.8Zm0 12.35h7.2q1.9 0 3.3-1.25t1.4-3.15q0-1.85-1.4-3.1t-3.3-1.25h-7.2Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M10 40v-5h6.85l8.9-22H18V8h20v5h-6.85l-8.9 22H30v5Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M10 42v-3h28v3Zm14-8q-5.05 0-8.525-3.45Q12 27.1 12 22.1V6h4v16.2q0 3.3 2.3 5.55T24 30q3.4 0 5.7-2.25Q32 25.5 32 22.2V6h4v16.1q0 5-3.475 8.45Q29.05 34 24 34Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M6 42v-3h36v3Zm0-8.25v-3h23.6v3Zm0-8.25v-3h36v3Zm0-8.25v-3h23.6v3ZM6 9V6h36v3Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M6 42v-3h36v3Zm8.2-8.25v-3h19.65v3ZM6 25.5v-3h36v3Zm8.2-8.25v-3h19.65v3ZM6 9V6h36v3Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M6 42v-3h36v3Zm12.45-8.25v-3H42v3ZM6 25.5v-3h36v3Zm12.45-8.25v-3H42v3ZM6 9V6h36v3Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M22.5 34H14q-4.15 0-7.075-2.925T4 24q0-4.15 2.925-7.075T14 14h8.5v3H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h15.5v3ZM25.5 34v-3H34q2.9 0 4.95-2.05Q41 26.9 41 24q0-2.9-2.05-4.95Q36.9 17 34 17h-8.5v-3H34q4.15 0 7.075 2.925T44 24q0 4.15-2.925 7.075T34 34Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M37.5 33.45 35.05 31q2.55-.5 4.25-2.4 1.7-1.9 1.7-4.45 0-2.9-2.05-4.95-2.05-2.05-4.95-2.05h-7.75v-3H34q4.15 0 7.075 2.925T44 24.15q0 3.1-1.8 5.6-1.8 2.5-4.7 3.7Zm-7.8-7.8-3-3h5.05v3Zm11 19.55L3.15 7.65 5.3 5.5l37.55 37.55ZM22.5 34H14q-4.15 0-7.075-2.925T4 24q0-3.6 2.225-6.35Q8.45 14.9 11.9 14.2l2.8 2.8H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h3.95l3 3Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button type="submit">
                                                <span className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path d="M10 44q-2.5 0-4.25-1.75T4 38V10q0-2.5 1.75-4.25T10 4h28q2.5 0 4.25 1.75T44 10v28q0 2.5-1.75 4.25T38 44Zm0-3h28q1.3 0 2.15-.875Q41 39.25 41 38V10q0-1.3-.85-2.15Q39.3 7 38 7H10q-1.25 0-2.125.85T7 10v28q0 1.25.875 2.125T10 41Zm3.2-5.5 6.8-6.8 3.65 3.6L28 26.8l6.95 8.7Zm2.8-16q-1.45 0-2.475-1.025Q12.5 17.45 12.5 16q0-1.45 1.025-2.475Q14.55 12.5 16 12.5q1.45 0 2.475 1.025Q19.5 14.55 19.5 16q0 1.45-1.025 2.475Q17.45 19.5 16 19.5Z" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                        <div className="c-editor-send-actions">
                                            <button
                                                type="submit"
                                                className="send-email-button"
                                            >
                                                Send email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
