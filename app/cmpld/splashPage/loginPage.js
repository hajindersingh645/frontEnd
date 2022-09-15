define(['react', 'app', 'validation'], function (React, app, Validation) {
	return React.createClass({
		/**
         *
         * @returns {{compSafe: boolean, secondFactorInput: boolean, fac2Text: string, fac2Type: string}}
         */
		getInitialState: function () {
			return {
				compSafe: false,
				secondFactorInput: false,
				fac2Text: "",
				fac2Type: ""

			};
		},
		componentWillUnmount: function () {
			createUserFormValidator = undefined;
		},

		componentDidMount: function () {
			createUserFormValidator = $("#loginUserForm").validate({
				highlight: function (element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight: function (element) {
					$(element).closest('.form-group').removeClass('has-error');
					//$(element).closest('.form-group').addClass('has-success');
				},
				errorElement: 'span',
				errorClass: 'help-block pull-left',
				errorPlacement: function (error, element) {
					if (element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			});
			$("#LoginForm_username").rules("add", {
				required: true,
				minlength: 2,
				maxlength: 200
			});

			$("#LoginUser_password").rules("add", {
				required: true,
				minlength: 4,
				maxlength: 80
			});

			if (app.defaults.get('dev') === true) {
				this.handleClick('login');
			}
		},
		/**
         *
         * @param {string} action
         * @param {object} event
         */
		handleChange: function (action, event) {
			switch (action) {
				case 'enter2FacText':
					this.setState({
						fac2Text: event.target.value
					});
					break;

			}
		},
		/**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function (action, event) {
			//app.user.set({id:10});

			switch (action) {
				case 'makePayment':
					$('#loginUser').modal('hide');
					break;

				case 'openDB':
					app.indexedDBWorker.showRecord('');

					break;
				case 'AddData':

					app.indexedDBWorker.addData('', '');

					break;

				case 'DeleteStore':

					app.indexedDBWorker.deleteStore('');
					break;
				case 'RemoveOldData':
					app.indexedDBWorker.deleteRecord();

					console.log(app.indexedDBWorker);
					//var request = db.transaction(["user_1"], "readwrite")
					//	.objectStore("user_1")
					//	.delete(["777-44-4444"]);

					//request.onsuccess = function(event) {
					//	alert("Gone");
					//};

					break;

				case 'login':
					event.preventDefault();
					var thisComp = this;
					createUserFormValidator.form();

					if (createUserFormValidator.numberOfInvalids() == 0) {
						var email = $('#LoginForm_username').val();
						var password = $('#LoginUser_password').val();
						var factor2 = this.state.fac2Text;

						app.indexedDBWorker.set({ "allowedToUse": $('#computerSafe').is(':checked') });
						//app.userObjects.retrieveUserObject();

						app.auth.Login(email, password, factor2, function (result) {
							if (result == 'needGoogle') {
								thisComp.setState({
									secondFactorInput: true
								});

								thisComp.setState({
									fac2Type: 1
								});
							} else if (result == 'needYubi') {
								thisComp.setState({
									secondFactorInput: true
								});

								thisComp.setState({
									fac2Type: 2
								});
							}
						});
					}
					break;
				case 'enterLogin':
					if (event.keyCode == 13) {
						this.handleClick('login');
					}
					break;
				case 'forgotPassword':
					Backbone.history.navigate("forgotPassword", {
						trigger: true
					});
					$('#loginUser').modal('hide');
					$('#forgPass-modal').modal('show');

					break;
			}
		},
		render: function () {

			var styleYes = {
				color: '#006600'
			};
			var styleNA = {
				color: '#aaaa00'
			};

			var overflow = {
				overflow: 'hidden'
			};

			return React.createElement(
				'form',
				{ id: 'loginUserForm', onKeyDown: this.handleClick.bind(this, 'enterLogin') },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-sm-7' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('input', { type: 'email', className: 'form-control', name: 'email', id: 'LoginForm_username', placeholder: 'Email', defaultValue: app.defaults.get('userName') })
						)
					),
					React.createElement(
						'div',
						{ className: 'col-sm-5' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'select',
								{ className: 'form-select', 'aria-label': 'Default select example', defaultValue: `0` },
								React.createElement(
									'option',
									{ value: '0' },
									'@cyberfear.com'
								),
								React.createElement(
									'option',
									{ value: '1' },
									'@cyberfear.com'
								),
								React.createElement(
									'option',
									{ value: '2' },
									'@cyberfear.com'
								),
								React.createElement(
									'option',
									{ value: '3' },
									'@cyberfear.com'
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'col-sm-12' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('button', { className: 'form-icon eye' }),
							React.createElement('input', { type: 'password', className: 'form-control with-icon', name: 'pP', id: 'LoginUser_password', placeholder: 'Password', defaultValue: app.defaults.get('firstPassfield') })
						)
					),
					React.createElement(
						'div',
						{ className: 'col-sm-12' },
						React.createElement(
							'div',
							{ className: 'forgot-link' },
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(this, 'forgotPassword') },
								'Forgot Password?'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'col-sm-12' },
						React.createElement(
							'button',
							{ className: 'btn-blue full-width mt60', type: 'buton', onClick: this.handleClick.bind(this, 'login') },
							'Sign in'
						)
					)
				)
			);
		}

	});
});