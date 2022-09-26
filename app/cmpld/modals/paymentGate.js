define(["app", "accounting", "react"], function (app, accounting, React) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                buttonTag: "",
                buttonText: "Create Account",
                paym: "",
                mCharge: "",
                membr: "",
                butDis: false,
                stripeId: ""
            };
        },

        componentDidMount: function () {
            var thisComp = this;
            app.user.on("change:userPlan", function () {
                // console.log(app.user.get("resetSelectedItems"));

                if (app.user.get("userPlan")["planSelected"] == 1) {
                    var pl = "year";
                } else if (app.user.get("userPlan")["planSelected"] == 2) {
                    var pl = "month";
                } else if (app.user.get("userPlan")["planSelected"] == 3) {
                    var pl = "free";
                }
                thisComp.setState({
                    mCharge: app.user.get("userPlan")["monthlyCharge"] - app.user.get("userPlan")["alrdPaid"],
                    membr: pl
                });

                // $('#selectAll>input').prop("checked",false);
            }, thisComp);

            /* $(".specButton").on({
                    mouseover:function(){
                        $(this).css({
                            left:(Math.random()*450)+"px",
                        });
                    }
                });*/
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },
        setMembership: function (duration) {
            var userObj = {};
            var thisComp = this;

            userObj["planSelector"] = duration;
            userObj["userToken"] = app.user.get("userLoginToken");

            $.ajax({
                method: "POST",
                url: app.defaults.get("apidomain") + "/SetMembershipPriceV2",
                data: userObj,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                }
            }).then(function (msg) {
                if (msg["response"] === "fail") {
                    app.notifications.systemMessage("tryAgain");
                } else if (msg["response"] === "success") {
                    app.userObjects.loadUserPlan(function () {
                        thisComp.setState({
                            butDis: false
                        }, function () {
                            console.log(thisComp.state.mCharge);
                            console.log(thisComp.state.paym);
                            if (thisComp.state.paym == "stripe" && thisComp.state.membr !== "free") {
                                var payLoad = {};
                                payLoad["planSelector"] = this.state.membr;
                                payLoad["userToken"] = app.user.get("userLoginToken");
                                payLoad["price"] = this.state.mCharge;
                                payLoad["stripeId"] = this.state.stripeId;

                                app.stripeCheckOut.updateStripe(payLoad);
                            }
                        });
                    });
                }

                //console.log(msg)
            });
        },

        handleChange: async function (action, event) {
            switch (action) {
                case "year":
                    this.setState({
                        membr: "year",
                        butDis: true
                    });
                    this.setMembership("year");
                    break;
                case "month":
                    this.setState({
                        membr: "month",
                        butDis: true
                    });
                    this.setMembership("month");

                    break;

                case "free":
                    this.setState({
                        membr: "free",
                        butDis: true
                    });
                    this.setMembership("free");
                    break;

                case "perfectm":
                    var thisComp = this;
                    this.setState({
                        paym: "perfectm"
                    });

                    break;
                case "bitc":
                    var thisComp = this;
                    this.setState({
                        paym: "bitc"
                    });

                    break;
                case "stripe":
                    var thisComp = this;
                    this.setState({
                        paym: "stripe",
                        location: "NewMembership",
                        email: app.user.get("loginEmail"),
                        toPay: this.state.mCharge,
                        forPlan: this.state.membr,
                        howMuch: 1
                    }, function () {
                        app.stripeCheckOut.start(this);
                        app.stripeCheckOut.checkout(this);
                    });

                    break;

                case "paypal":
                    var thisComp = this;
                    this.setState({
                        paym: "paypal"
                    });

                    var my_script = thisComp.new_script();

                    var self = this;
                    my_script.then(function () {
                        //self.setState({'status': 'done'});
                        paypal.Buttons({
                            style: {
                                shape: "rect",
                                color: "gold",
                                layout: "vertical",
                                label: "paypal"
                            },
                            createOrder: function (data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: thisComp.state.mCharge
                                        },
                                        custom_id: app.user.get("userId"),
                                        description: "NewMembership_1"
                                    }],
                                    application_context: {
                                        shipping_preference: "NO_SHIPPING"
                                    }
                                });
                            },
                            onApprove: function (data, actions) {
                                return actions.order.capture().then(function (details) {
                                    //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                    // alert('done');
                                });
                            }
                        }).render("#paypal-button-container");
                    }).catch(function () {
                        //self.setState({'status': 'error'});
                    });

                    break;
            }
        },

        async stripeHandleSubmit(e) {
            console.log("her551");
            //4000000000000002 -decline
            //4242 4242 4242 4242 -good
            e.preventDefault();
            app.stripeCheckOut.setLoading(true);

            var elements = app.stripeCheckOut.get("elements");
            var stripe = app.stripeCheckOut.get("stripe");

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "https://cyber.com/index.html"
                },
                redirect: "if_required"
            });

            try {
                if (paymentIntent.status === "succeeded") {
                    console.log("paid");
                    app.stripeCheckOut.showMessage("Payment was accepted. Please wait to be redirected");
                }
            } catch (error) {}

            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            // console.log(error);
            try {
                if (error.type === "card_error" || error.type === "validation_error") {
                    app.stripeCheckOut.showMessage(error.message);
                } else {
                    app.stripeCheckOut.showMessage("An unexpected error occured.");
                }
            } catch (error) {}
            app.stripeCheckOut.setLoading(false);
        },

        new_script: function () {
            return new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src = "https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD";
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            });
        },

        handleClick: function (action, event) {
            switch (action) {
                case "pay":
                    if (this.state.paym !== "perfectm") {
                        app.user.set({
                            tempCoin: true
                        });
                    }
                    break;
                case "freemium":
                    $.ajax({
                        method: "POST",
                        url: app.defaults.get("apidomain") + "/activateFreemiumV2",
                        data: {},
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        }
                    }).then(function (msg) {
                        if (msg["response"] === "fail") {
                            app.notifications.systemMessage("tryAgain");
                        } else if (msg["response"] === "success") {
                            app.userObjects.loadUserPlan(function () {});
                        }

                        //console.log(msg)
                    });

                    break;
            }
        },

        handleFreePayment: function () {
            this.state.setState({
                membr: "free"
            });
            this.handleChange.bind(this, "free");
        },

        handleMonthlyPayment: function () {
            this.state.setState({
                membr: "month"
            });
            this.handleChange.bind(this, "month");
        },
        handleYearlyPayment: function () {
            this.state.setState({
                membr: "year"
            });
            this.handleChange.bind(this, "year");
        },

        render: function () {
            if (app.user.get("userPlan")["discountApplied"] > 0) {
                var discy = accounting.formatMoney(app.user.get("userPlan")["trueYearPrice"] * (100 - app.user.get("userPlan")["discountApplied"]) / 10000);
                var discm = accounting.formatMoney(app.user.get("userPlan")["trueMonthPrice"] * (100 - app.user.get("userPlan")["discountApplied"]) / 10000);

                if (app.user.get("userPlan")["planSelected"] == 1) {
                    var full = "$" + app.user.get("userPlan")["trueYearPrice"] / 100;
                } else if (app.user.get("userPlan")["planSelected"] == 2) {
                    var full = "$" + app.user.get("userPlan")["trueMonthPrice"] / 100;
                }
                var charge = false;
            } else {
                var charge = true;
            }

            return React.createElement(
                "div",
                {
                    className: "modal modal-sheet position-fixed d-flex bg-secondary bg-opacity-75 py-0 overflow-hidden",
                    id: "makePayment",
                    tabIndex: "-1",
                    role: "dialog",
                    "aria-hidden": "true",
                    onClick: this.handleClick.bind(this, "freemium")
                },
                React.createElement(
                    "div",
                    { className: "modal-dialog modal-pricing", role: "document" },
                    React.createElement(
                        "div",
                        { className: "modal-content rounded-4 shadow px-4 py-4" },
                        React.createElement(
                            "div",
                            { className: "tab-content", id: "myTabContent" },
                            React.createElement(
                                "div",
                                {
                                    className: "tab-pane fade show active",
                                    id: "monthly-tab-pane",
                                    role: "tabpanel",
                                    "aria-labelledby": "monthly-tab",
                                    tabindex: "0"
                                },
                                React.createElement(
                                    "div",
                                    { className: "row gx-4" },
                                    React.createElement(
                                        "div",
                                        { className: "col-md-6 col-lg-4" },
                                        React.createElement(
                                            "div",
                                            { className: "pricing-box" },
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-top" },
                                                React.createElement(
                                                    "div",
                                                    { className: "pricing-title" },
                                                    "Free"
                                                ),
                                                React.createElement(
                                                    "p",
                                                    null,
                                                    "For most businesses that want to optimize web queries"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-middle" },
                                                React.createElement(
                                                    "div",
                                                    { className: "price" },
                                                    "$0.00"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "per-month" },
                                                    "per month"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "btn-row" },
                                                    React.createElement(
                                                        "button",
                                                        {
                                                            className: "btn-blue",
                                                            onClick: this.handleClick.bind(this, "freemium")
                                                        },
                                                        "Choose plan"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-bullets" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "All Limited Links"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Own Analytics Platform"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Chat Support"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Optimize Hashtags"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Unlimited Users"
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-md-6 col-lg-4" },
                                        React.createElement(
                                            "div",
                                            { className: "pricing-box" },
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-top" },
                                                React.createElement(
                                                    "div",
                                                    { className: "pricing-title" },
                                                    "Monthly"
                                                ),
                                                React.createElement(
                                                    "p",
                                                    null,
                                                    "For most businesses that want to optimize web queries"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-middle" },
                                                React.createElement(
                                                    "div",
                                                    { className: "price" },
                                                    "$",
                                                    app.user.get("userPlan")["trueMonthPrice"] / 100
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "per-month" },
                                                    discm,
                                                    " / month"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "btn-row" },
                                                    React.createElement(
                                                        "button",
                                                        { className: "btn-blue" },
                                                        "Choose plan"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-bullets" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "All Limited Links"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Own Analytics Platform"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Chat Support"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Optimize Hashtags"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Unlimited Users"
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-md-6 col-lg-4" },
                                        React.createElement(
                                            "div",
                                            { className: "pricing-box" },
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-top" },
                                                React.createElement(
                                                    "div",
                                                    { className: "pricing-title" },
                                                    "Yearly"
                                                ),
                                                React.createElement(
                                                    "p",
                                                    null,
                                                    "For most businesses that want to optimize web queries"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-box-middle" },
                                                React.createElement(
                                                    "div",
                                                    { className: "price" },
                                                    "$",
                                                    app.user.get("userPlan")["trueYearPrice"] / 100
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "per-year" },
                                                    discy,
                                                    " / year"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "btn-row" },
                                                    React.createElement(
                                                        "button",
                                                        { className: "btn-blue" },
                                                        "Choose plan"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "pricing-bullets" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "All Limited Links"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Own Analytics Platform"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Chat Support"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Optimize Hashtags"
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        "Unlimited Users"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        className: this.state.membr == "free" ? "d-none" : "panel panel-default"
                                    },
                                    React.createElement(
                                        "div",
                                        { className: "text-center" },
                                        "Payment Method:"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "panel-body" },
                                        React.createElement(
                                            "div",
                                            { className: "form-inline text-center" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group col-lg-offset-0 text-left" },
                                                React.createElement(
                                                    "div",
                                                    { className: "radio" },
                                                    React.createElement(
                                                        "label",
                                                        null,
                                                        React.createElement("input", {
                                                            className: "margin-right-10",
                                                            type: "radio",
                                                            name: "optionsRadios",
                                                            id: "optionsRadios1",
                                                            value: "option1",
                                                            checked: this.state.paym == "bitc",
                                                            onChange: this.handleChange.bind(this, "bitc")
                                                        }),
                                                        "\xA0Bitcoin & other Crypto Currency"
                                                    )
                                                ),
                                                React.createElement("div", { className: "clearfix" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "radio" },
                                                    React.createElement(
                                                        "label",
                                                        null,
                                                        React.createElement("input", {
                                                            className: "margin-right-10",
                                                            type: "radio",
                                                            name: "optionsRadios",
                                                            id: "optionsRadios2",
                                                            value: "option2",
                                                            checked: this.state.paym == "perfectm",
                                                            onChange: this.handleChange.bind(this, "perfectm")
                                                        }),
                                                        "\xA0Perfect Money"
                                                    )
                                                ),
                                                React.createElement("div", { className: "clearfix" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "radio" },
                                                    React.createElement(
                                                        "label",
                                                        null,
                                                        React.createElement("input", {
                                                            className: "margin-right-10",
                                                            type: "radio",
                                                            name: "optionsRadios",
                                                            id: "optionsRadios4",
                                                            value: "option4",
                                                            checked: this.state.paym == "stripe",
                                                            onChange: this.handleChange.bind(this, "stripe")
                                                        }),
                                                        "\xA0Credit / Debit Card (Stripe)"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "form",
                                                {
                                                    onSubmit: this.handleSubmit,
                                                    className: "d-none",
                                                    id: "perfMF",
                                                    action: "https://perfectmoney.com/api/step1.asp",
                                                    method: "POST",
                                                    target: "_blank"
                                                },
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYEE_ACCOUNT",
                                                    value: app.defaults.get("perfectMecrh")
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYEE_NAME",
                                                    value: "Cyber Fear"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYMENT_AMOUNT",
                                                    value: this.state.mCharge
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYMENT_UNITS",
                                                    value: "USD"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "STATUS_URL",
                                                    value: "https://cyberfear.com/api/PerfectPaidstatus"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYMENT_URL",
                                                    value: "https://cyberfear.com/api/Pe"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "PAYMENT_URL_METHOD",
                                                    value: "POST"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "NOPAYMENT_URL",
                                                    value: "https://cyberfear.com/api/Pe"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "NOPAYMENT_URL_METHOD",
                                                    value: "LINK"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "SUGGESTED_MEMO",
                                                    value: ""
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "userId",
                                                    value: app.user.get("userId")
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "paymentFor",
                                                    value: "NewMembership"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "howMuch",
                                                    value: "1"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "BAGGAGE_FIELDS",
                                                    value: "userId paymentFor howMuch"
                                                })
                                            ),
                                            React.createElement(
                                                "form",
                                                {
                                                    onSubmit: this.handleSubmit,
                                                    className: "d-none",
                                                    id: "cryptF",
                                                    action: "https://www.coinpayments.net/index.php",
                                                    method: "post",
                                                    target: "_blank",
                                                    ref: "crypto"
                                                },
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "cmd",
                                                    value: "_pay_simple"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "reset",
                                                    value: "1"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "merchant",
                                                    value: app.defaults.get("coinMecrh")
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "item_amount",
                                                    value: "1"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "first_name",
                                                    value: "anonymous"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "last_name",
                                                    value: "anonymous"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "email",
                                                    value: "anonymous@cyberfear.com"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "item_name",
                                                    value: "Premium Membership"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "item_desc",
                                                    value: this.state.membr == "year" ? "1 Year Subscription" : "1 Month Subscription"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "custom",
                                                    value: app.user.get("userId")
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "currency",
                                                    value: "USD"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "amountf",
                                                    value: this.state.mCharge
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "want_shipping",
                                                    value: "0"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "success_url",
                                                    value: "https://cyberfear.com/api/Pe"
                                                }),
                                                React.createElement("input", {
                                                    type: "hidden",
                                                    name: "cancel_url",
                                                    value: "https://cyberfear.com/api/Pe"
                                                })
                                            ),
                                            React.createElement("div", { className: "clearfix" }),
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.paym == "stripe" ? "" : "d-none",
                                                    id: "stripe-container"
                                                },
                                                React.createElement(
                                                    "form",
                                                    { id: "payment-form" },
                                                    React.createElement("div", { id: "payment-element" }),
                                                    React.createElement(
                                                        "button",
                                                        { id: "submit" },
                                                        React.createElement("div", {
                                                            className: "spinner d-none",
                                                            id: "spinner"
                                                        }),
                                                        React.createElement(
                                                            "span",
                                                            { id: "button-text" },
                                                            "Pay now"
                                                        )
                                                    ),
                                                    React.createElement("div", {
                                                        id: "payment-message",
                                                        className: "d-none"
                                                    })
                                                )
                                            ),
                                            React.createElement("div", {
                                                className: this.state.paym == "paypal" ? "" : "d-none",
                                                id: "paypal-button-container"
                                            })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { style: { textAlign: "center" } },
                                        React.createElement(
                                            "button",
                                            {
                                                type: "submit",
                                                form: this.state.paym === "perfectm" ? "perfMF" : "cryptF",
                                                onClick: this.handleClick.bind(this, "pay"),
                                                className: (this.state.paym == "perfectm" || this.state.paym == "bitc") && this.state.membr != "free" && !this.state.butDis ? "white-btn" : "d-none",
                                                disabled: this.state.paym == "" || this.state.butDis,
                                                style: {
                                                    float: "none",
                                                    display: "initial"
                                                }
                                            },
                                            "Pay Now"
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        className: this.state.membr == "free" ? "" : "d-none",
                                        style: { textAlign: "center" }
                                    },
                                    React.createElement(
                                        "button",
                                        {
                                            onClick: this.handleClick.bind(this, "freemium"),
                                            className: "white-btn",
                                            style: {
                                                float: "none",
                                                display: "initial"
                                            }
                                        },
                                        "Log In"
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