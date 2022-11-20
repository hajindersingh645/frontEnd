define(["react", "app", "quill"], function (React, app, Quill) {
    return React.createClass({
        getInitialState: function () {
            return {
                isMaximized: false,
                isMinimized: false
            };
        },
        componentDidMount: function () {
            // Initiate toolbar
            const quill = new Quill("#com-the-con-editor", {
                modules: {
                    toolbar: "#editor_toolbar"
                },
                handlers: {
                    link: function (value) {
                        if (value) {
                            const href = prompt("Enter the URL");
                            this.quill.format("link", href);
                        } else {
                            this.quill.format("link", false);
                        }
                    }
                }
            });
        },
        renderEditor: function () {},
        handleEmailHeaderAction: function (i) {
            switch (i) {
                case "maximize":
                    this.setState({
                        isMaximized: this.state.isMaximized ? false : true,
                        isMinimized: false
                    });
                    break;
                case "minimize":
                    this.setState({
                        isMaximized: false,
                        isMinimized: this.state.isMinimized ? false : true
                    });
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                {
                    className: `compose-email-wrapper ${ this.state.isMaximized ? "compose-maximize" : this.state.isMinimized ? "compose-minimize" : "" }`
                },
                React.createElement(
                    "div",
                    { className: "compose-ec" },
                    React.createElement(
                        "div",
                        { className: "the-header" },
                        React.createElement(
                            "div",
                            { className: "c-title" },
                            React.createElement(
                                "h3",
                                null,
                                "New message"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "c-actions" },
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    onClick: this.handleEmailHeaderAction.bind(this, "minimize")
                                },
                                React.createElement(
                                    "span",
                                    {
                                        className: `icon ${ this.state.isMinimized ? "d-none" : "" }`
                                    },
                                    React.createElement(
                                        "svg",
                                        {
                                            viewBox: "0 0 48 48",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement("path", { d: "M12 41.5v-3h24.05v3Z" })
                                    )
                                ),
                                React.createElement(
                                    "span",
                                    {
                                        className: `icon ${ this.state.isMinimized ? "d-block" : "d-none" }`
                                    },
                                    React.createElement(
                                        "svg",
                                        {
                                            viewBox: "0 0 48 48",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement("path", { d: "M5.95 9.5v-3H42v3Z" })
                                    )
                                )
                            ),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    onClick: this.handleEmailHeaderAction.bind(this, "maximize")
                                },
                                React.createElement(
                                    "span",
                                    {
                                        className: `icon ${ this.state.isMaximized ? "d-none" : "" }`
                                    },
                                    React.createElement(
                                        "svg",
                                        {
                                            viewBox: "0 0 48 48",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement("path", { d: "M6 42V27h3v9.9L36.9 9H27V6h15v15h-3v-9.9L11.1 39H21v3Z" })
                                    )
                                ),
                                React.createElement(
                                    "span",
                                    {
                                        className: `icon ${ this.state.isMaximized ? "d-block" : "d-none" }`
                                    },
                                    React.createElement(
                                        "svg",
                                        {
                                            viewBox: "0 0 48 48",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement("path", { d: "M8.1 42 6 39.9l10.7-10.7h-5.9v-3h11v11h-3v-5.9Zm18.15-20.25v-11h3v5.9L39.9 6 42 8.1 31.35 18.75h5.9v3Z" })
                                    )
                                )
                            ),
                            React.createElement(
                                "button",
                                { type: "button" },
                                React.createElement(
                                    "span",
                                    { className: "icon" },
                                    React.createElement(
                                        "svg",
                                        {
                                            viewBox: "0 0 48 48",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement("path", { d: "m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" })
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "the-content" },
                        React.createElement(
                            "div",
                            { className: "the-content-wrapper" },
                            React.createElement("div", { className: "com-content-header" }),
                            React.createElement(
                                "div",
                                { className: "com-content-editor" },
                                React.createElement(
                                    "div",
                                    {
                                        className: "com-the-con-editor",
                                        id: "com-the-con-editor"
                                    },
                                    "This is something new we had to try and give a shot at"
                                ),
                                React.createElement("div", { id: "toolbar" }),
                                React.createElement(
                                    "div",
                                    { className: "c-editor-actions" },
                                    React.createElement(
                                        "div",
                                        {
                                            className: "c-editor-formating ql-formats",
                                            id: "editor_toolbar"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-bold"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M14 36V8h11.4q3.3 0 5.725 2.1t2.425 5.3q0 1.9-1.05 3.5t-2.8 2.45v.3q2.15.7 3.475 2.5 1.325 1.8 1.325 4.05 0 3.4-2.625 5.6Q29.25 36 25.75 36Zm4.3-16.15h6.8q1.75 0 3.025-1.15t1.275-2.9q0-1.75-1.275-2.925Q26.85 11.7 25.1 11.7h-6.8Zm0 12.35h7.2q1.9 0 3.3-1.25t1.4-3.15q0-1.85-1.4-3.1t-3.3-1.25h-7.2Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-italic"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M10 40v-5h6.85l8.9-22H18V8h20v5h-6.85l-8.9 22H30v5Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-underline"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M10 42v-3h28v3Zm14-8q-5.05 0-8.525-3.45Q12 27.1 12 22.1V6h4v16.2q0 3.3 2.3 5.55T24 30q3.4 0 5.7-2.25Q32 25.5 32 22.2V6h4v16.1q0 5-3.475 8.45Q29.05 34 24 34Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-blockquote"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M29 23h8v-8h-8Zm-18 0h8v-8h-8Zm20.3 11 4-8H26V12h14v14.4L36.2 34Zm-18 0 4-8H8V12h14v14.4L18.2 34ZM15 19Zm18 0Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-list",
                                                value: "ordered"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M6 40v-1.7h4.2V37H8.1v-1.7h2.1V34H6v-1.7h5.9V40Zm10.45-2.45v-3H42v3ZM6 27.85v-1.6l3.75-4.4H6v-1.7h5.9v1.6l-3.8 4.4h3.8v1.7Zm10.45-2.45v-3H42v3ZM8.1 15.8V9.7H6V8h3.8v7.8Zm8.35-2.55v-3H42v3Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-list",
                                                value: "bullet"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M8.55 39q-1.05 0-1.8-.725T6 36.55q0-1.05.75-1.8t1.8-.75q1 0 1.725.75.725.75.725 1.8 0 1-.725 1.725Q9.55 39 8.55 39ZM16 38v-3h26v3ZM8.55 26.5q-1.05 0-1.8-.725T6 24q0-1.05.75-1.775.75-.725 1.8-.725 1 0 1.725.75Q11 23 11 24t-.725 1.75q-.725.75-1.725.75Zm7.45-1v-3h26v3ZM8.5 14q-1.05 0-1.775-.725Q6 12.55 6 11.5q0-1.05.725-1.775Q7.45 9 8.5 9q1.05 0 1.775.725Q11 10.45 11 11.5q0 1.05-.725 1.775Q9.55 14 8.5 14Zm7.5-1v-3h26v3Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-link"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M22.5 34H14q-4.15 0-7.075-2.925T4 24q0-4.15 2.925-7.075T14 14h8.5v3H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h15.5v3ZM25.5 34v-3H34q2.9 0 4.95-2.05Q41 26.9 41 24q0-2.9-2.05-4.95Q36.9 17 34 17h-8.5v-3H34q4.15 0 7.075 2.925T44 24q0 4.15-2.925 7.075T34 34Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            { type: "submit" },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M10 44q-2.5 0-4.25-1.75T4 38V10q0-2.5 1.75-4.25T10 4h28q2.5 0 4.25 1.75T44 10v28q0 2.5-1.75 4.25T38 44Zm0-3h28q1.3 0 2.15-.875Q41 39.25 41 38V10q0-1.3-.85-2.15Q39.3 7 38 7H10q-1.25 0-2.125.85T7 10v28q0 1.25.875 2.125T10 41Zm3.2-5.5 6.8-6.8 3.65 3.6L28 26.8l6.95 8.7Zm2.8-16q-1.45 0-2.475-1.025Q12.5 17.45 12.5 16q0-1.45 1.025-2.475Q14.55 12.5 16 12.5q1.45 0 2.475 1.025Q19.5 14.55 19.5 16q0 1.45-1.025 2.475Q17.45 19.5 16 19.5Z" })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "ql-clean"
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 48 48"
                                                    },
                                                    React.createElement("path", { d: "M25.35 21.8 21.5 18l1.2-2.8h-3.95l-5.2-5.2H40v5H28.25ZM40.3 45.2 22.85 27.7 18.45 38H13l6-14.1L2.8 7.7l2.1-2.1 37.5 37.5Z" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "c-editor-send-actions" },
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                className: "send-email-button"
                                            },
                                            "Send email"
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});