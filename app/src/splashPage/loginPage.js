define(['react','app','validation'], function (React,app,Validation) {
	return React.createClass({
		/**
         *
         * @returns {{compSafe: boolean, secondFactorInput: boolean, fac2Text: string, fac2Type: string}}
         */
		 getInitialState: function () {
			return {
				compSafe:false,
				secondFactorInput:false,
				fac2Text:"",
				fac2Type:""

			};
		},
		componentWillUnmount: function() {
			createUserFormValidator = undefined;
		},

		componentDidMount: function() {
			createUserFormValidator = $("#loginUserForm").validate({
				highlight: function(element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('has-error');
					//$(element).closest('.form-group').addClass('has-success');

				},
				errorElement: 'span',
				errorClass: 'help-block pull-left',
				errorPlacement: function(error, element) {
					if(element.parent('.input-group').length) {
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

            if(app.defaults.get('dev')===true){
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
						fac2Text:event.target.value
					});
					break

			}
		},
		/**
         *
         * @param {string} action
         * @param {object} event
         */
		 handleClick: function(action,event) {
			//app.user.set({id:10});

			switch(action) {
				case 'makePayment':
					$('#loginUser').modal('hide');
					break;

				case 'openDB':
					app.indexedDBWorker.showRecord('');


					break;
				case 'AddData':

					app.indexedDBWorker.addData('','');

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
					var thisComp=this;
					createUserFormValidator.form();

					if (createUserFormValidator.numberOfInvalids() == 0) {
						var email=$('#LoginForm_username').val();
						var password=$('#LoginUser_password').val();
						var factor2=this.state.fac2Text;


						app.indexedDBWorker.set({"allowedToUse":$('#computerSafe').is(':checked')});
						//app.userObjects.retrieveUserObject();

						app.auth.Login(email,password,factor2,function(result){
							if( result=='good' ){
								location.href = '/index.html#mail/Inbox'
							}
							if(result=='needGoogle'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:1
								});
							}else if(result=='needYubi'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:2
								});
							}
						});

					}
					break;
				case 'enterLogin':
					if(event.keyCode==13){
						this.handleClick('login');
					}
					break;
				case 'forgotPassword':
					Backbone.history.navigate("forgotPassword", {
						trigger : true
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

		return 	(
				<div>
					<h1>Login</h1>
					<div className="welcome-text">Welcome back to <span>Cyberfear.</span></div>
					<div className="form-section">
					<form id="loginUserForm" onKeyDown={this.handleClick.bind(this, 'enterLogin')}>
						<div className="row">
							<div className="col-sm-7">
								<div className="form-group">
									<input type="email" className="form-control" name="email" id="LoginForm_username" placeholder="Email" defaultValue={app.defaults.get('userName')} />
								</div>
							</div>
							<div className="col-sm-5">
								<div className="form-group">
									<select className="form-select" aria-label="Default select example" defaultValue={`0`}>
									<option value="0">@cyberfear.com</option>
									<option value="1">@cyberfear.com</option>
									<option value="2">@cyberfear.com</option>
									<option value="3">@cyberfear.com</option>
									</select>
								</div>
							</div>
							<div className="col-sm-12">
								<div className="form-group">
									<button className="form-icon eye"></button>
									<input type="password" className="form-control with-icon" name="pP" id="LoginUser_password" placeholder="Password" defaultValue={app.defaults.get('firstPassfield')} />
								</div>
							</div>
							<div className="col-sm-12">
								<div className={"form-group " +(this.state.fac2Type==0? "d-none": "")}>
									<button className="form-icon bg-transparent">
										<span className={"mt-n1 "+(this.state.fac2Type==1? "": "d-none")}><svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" width="20px" height="20px"><path d="M 18.683594 15.40625 C 18.683594 13.429688 21.894531 13.257813 21.894531 9.394531 C 21.894531 6.597656 19.949219 5.257813 19.75 5.136719 L 21.6875 5.136719 L 23.625 4 L 17.347656 4 C 10.960938 4 9.9375 8.46875 9.9375 9.949219 C 9.9375 12.15625 11.664063 14.898438 15.136719 14.898438 C 15.453125 14.898438 15.789063 14.878906 16.144531 14.839844 C 16.085938 15.003906 15.835938 15.566406 15.835938 16.074219 C 15.835938 17.136719 16.515625 17.8125 16.75 18.222656 C 12.949219 18.1875 8.375 19.835938 8.375 23.503906 C 8.375 24.84375 9.527344 28 14.941406 28 C 21.117188 28 22.988281 24.1875 22.988281 22.050781 C 22.984375 17.96875 18.683594 17.292969 18.683594 15.40625 Z M 16.585938 14.042969 C 14.425781 14.042969 12.601563 11.324219 12.601563 8.417969 C 12.601563 7.554688 13.015625 5.046875 15.40625 5.046875 C 18.484375 5.046875 19.234375 9.609375 19.234375 10.851563 C 19.234375 11.140625 19.4375 14.042969 16.585938 14.042969 Z M 16.4375 26.679688 C 14.457031 26.679688 11.039063 25.835938 11.039063 22.835938 C 11.039063 21.796875 11.644531 19.082031 16.902344 19.082031 C 17.171875 19.082031 17.40625 19.09375 17.605469 19.113281 C 18.699219 19.929688 20.964844 21.109375 20.964844 23.28125 C 20.964844 24.265625 20.378906 26.679688 16.4375 26.679688 Z"/></svg></span>
										<span className={"mt-n1 "+this.state.fac2Type==2? "": "d-none"}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64"><path d="M32.225 31.1l5.52-15.663h7.985l-13.46 33.126h-8.435l3.862-9.075-9.43-24.027h8.15z" fill="#98c93c"/><circle cx="32" cy="32" r="29.091" fillOpacity="0" stroke="#98c93c" strokeWidth="5.818"/></svg></span>
									</button>
									<input type="text" className="form-control input-lg" placeholder="PIN" value={this.state.fac2Text} onChange={this.handleChange.bind(this, 'enter2FacText')} />
								</div>
							</div>
							<div className="col-sm-12">
								<div className="forgot-link"><a href="login.html#forgotPassword">Forgot Password?</a></div>
							</div>
							<div className="col-sm-12">
								<button className="btn-blue full-width mt60" type="buton" onClick={this.handleClick.bind(this, 'login')}>Sign in</button>
							</div>
						</div>
					</form>
					</div>
				</div>
			);
		}
	});
});