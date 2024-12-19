import React, { Component } from "react";
import { Redirect } from "react-router";
import { Input, Label } from "reactstrap";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { ValidatorForm } from "react-form-validator-core";
import TextValidator from "../TextValidator";
import Script from "react-load-script";
import $ from "jquery";
window.$ = $;
global.jQuery = $;

class Register extends Component {
	constructor() {
		super();
		this.state = {
			merchants: [],
			merchantId: "",
			profiles: [],
			profileId: "",
			profileType: true,
			subAcctId: "",
			websiteUrl: "",
			name: "",
			affUrl: "",
			loginUrl: "",
			username: "",
			password: "",
			cpassword: "",
			cronSched: "",
			isRegistered: false
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	async componentDidMount() {
		const th = this;
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		await axios.get("/api/merchants/getAllMerchants").then(res => {
			if (res.data.length === 0) {
				this.setState({ merchants: "no result" });
			} else {
				this.setState({
					merchants: res.data.map(merchant => {
						return { value: merchant._id, name: merchant.name };
					})
				});
				this.setState({ merchantId: this.state.merchants[0].value });
			}
			
			axios.get("/api/profiles/getAllProfiles").then(res => {
				if (res.data.length === 0) {
					this.setState({ profiles: "no result" });
				} else {
					this.setState({
						profiles: res.data.map(profile => {
							return { value: profile._id, displayName: profile.displayName, url: profile.url };
						})
					});
					this.setState({ profileId: this.state.profiles[0].value });
				}
			}).catch(function (error) {
				if (error.response.status === 403) {
					th.props.history.push('/logout')
				}
			});
		}).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		const th = this;
		e.preventDefault();
		if (this.state.password !== this.state.cpassword) {
			NotificationManager.error("Password should be confirmed", "Error!", 5000);
		} else {
			if(this.state.profileType === true){
				for(var i=0; i<this.state.profiles.length; i++){
					if(this.state.profiles[i].value === this.state.profileId){
						this.state.websiteUrl = this.state.profiles[i].url;
						this.state.name = this.state.profiles[i].displayName;
					}
				}
			}
			axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
			axios
				.post("/api/subaccounts/register", {
					merchantId: this.state.merchantId,
					subAcctId: this.state.subAcctId,
					websiteUrl: this.state.websiteUrl,
					name: this.state.name,
					affUrl: this.state.affUrl,
					loginUrl: this.state.loginUrl,
					username: this.state.username,
					password: this.state.password,
					cronSched: this.state.cronSched
				})
				.then(res => {
					if (res.data.success) {
						NotificationManager.success(res.data.msg, "Notification!", 5000);
						this.setState({ isRegistered: true });
						this.props.history.push("/Dashboard");
					} else {
						NotificationManager.error(res.data.msg, "Error!", 5000);
					}
				})
				.catch(function (error) {
					if (error.response.status === 403) {
						th.props.history.push('/logout')
					}
				});;
		}
	}
	handleScriptCreate() {
		// this.setState({ scriptLoaded: false })
	}

	handleScriptError() {
		// this.setState({ scriptError: true })
	}

	handleScriptLoad() {
		// this.setState({ scriptLoaded: true })
		let th = this;
		$(function() {
			// Initialize DOM with cron builder with options
			$("#cron-expression").cronBuilder({
				selectorLabel: "Select time period:  ",
				onChange: function(expression) {
					expression = expression.replace("?", "*").replace("0/", "*/");
					expression = expression.substr(0, expression.length-2);
					th.setState({ cronSched: expression });
					$("#expression-result").text(expression);
				}
			});
		});
	}
	render() {
		const { isRegistered } = this.state;
		if (this.state.merchants === "no result") {
			return (
				<div className='container text-center'>
					<h3 className='h3 mt-100 mb-5 font-weight-normal'>Please Register Merchant Account First</h3>
					<a className='btn btn-lg btn-info' href='/merchant/register'>
						Register Merchant Account
					</a>
				</div>
			);
		} else {
			return (
				<React.Fragment>
					{isRegistered && <Redirect to='/login' />}
					{!isRegistered && (
						<React.Fragment>
							<Script
								url='/assets/jquery-cron-quartz.min.js'
								onCreate={this.handleScriptCreate.bind(this)}
								onError={this.handleScriptError.bind(this)}
								onLoad={this.handleScriptLoad.bind(this)}
							/>

							<div className='container'>
								<div className='row'>
									<div className='col-md-6 mt-100 mx-auto'>
										<ValidatorForm ref='form' onSubmit={this.onSubmit}>
											<h3 className='h3 mb-5 font-weight-normal text-center'>
												Please Register New Sub Account
											</h3>
											<div className='form-group row'>
												<label htmlFor='merchantId' className='col-sm-4 col-form-label'>
													Select Merchant:
												</label>
												<div className='col-sm-8'>
													<Input
														type='select'
														name='merchantId'
														value={this.state.merchantId}
														onChange={e => this.setState({ merchantId: e.target.value })}
													>
														{this.state.merchants.map(merchant => (
															<option key={merchant.value} value={merchant.value}>
																{merchant.name}
															</option>
														))}
													</Input>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='subAcctId' className='col-sm-4 col-form-label'>
													Sub Account ID:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='subAcctId'
														className='form-control'
														value={this.state.subAcctId}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='profileType' className='col-sm-4 col-form-label'>
													Select or Input Profile:
												</label>
												<div className='col-sm-8'>
												<Label check className="profile-radio">
													<Input type="radio" name="profileType" value={true} checked={this.state.profileType} onChange={e => this.setState({ profileType: e.target.value === "true" })}/>{' '}
													Select Profile
												</Label>
												<Label check>
													<Input type="radio" name="profileType" value={false} checked={!this.state.profileType} onChange={e =>this.setState({ profileType: e.target.value === "true", websiteUrl: "", name: "" })}/>{' '}
													Input Profile
												</Label>
												</div>
											</div>
											{this.state.profileType && (
												<div className='form-group row'>
													<label htmlFor='profileId' className='col-sm-4 col-form-label padding-left-50'>
														Select Profile:
													</label>
													<div className='col-sm-8'>
														<Input
															type='select'
															name='profileId'
															value={this.state.profileId}
															onChange={e => this.setState({ profileId: e.target.value })}
														>
															{this.state.profiles.map(profile => (
																<option key={profile.value} value={profile.value}>
																	{profile.displayName}-{profile.url}
																</option>
															))}
														</Input>
													</div>
												</div>
											)}
											{!this.state.profileType && (
												<React.Fragment>
												<div className='form-group row'>
													<label htmlFor='websiteUrl' className='col-sm-4 col-form-label padding-left-50'>
														Website URL:
													</label>
													<div className='col-sm-8'>
														<TextValidator
															onChange={this.onChange}
															name='websiteUrl'
															className='form-control'
															value={this.state.websiteUrl}
															validators={["required"]}
															errorMessages={["This field is required"]}
														/>
													</div>
												</div>
												<div className='form-group row'>
													<label htmlFor='name' className='col-sm-4 col-form-label padding-left-50'>
														Name:
													</label>
													<div className='col-sm-8'>
														<TextValidator
															onChange={this.onChange}
															name='name'
															className='form-control'
															value={this.state.name}
															validators={["required"]}
															errorMessages={["This field is required"]}
														/>
													</div>
												</div>
												</React.Fragment>
											)}
											<div className='form-group row'>
												<label htmlFor='affUrl' className='col-sm-4 col-form-label'>
													Affiliate URL:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='affUrl'
														className='form-control'
														value={this.state.affUrl}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
																	<label htmlFor='loginUrl' className='col-sm-4 col-form-label'>
													Login URL:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='loginUrl'
														className='form-control'
														value={this.state.loginUrl}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='username' className='col-sm-4 col-form-label'>
													Username:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='username'
														className='form-control'
														value={this.state.username}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='password' className='col-sm-4 col-form-label'>
													Password:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='password'
														type='password'
														className='form-control'
														value={this.state.password}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='cpassword' className='col-sm-4 col-form-label'>
													Confirm Password:
												</label>
												<div className='col-sm-8'>
													<TextValidator
														onChange={this.onChange}
														name='cpassword'
														type='password'
														className='form-control'
														value={this.state.cpassword}
														validators={["required"]}
														errorMessages={["This field is required"]}
													/>
												</div>
											</div>
											<div className='form-group row'>
												<label htmlFor='cronSched' className='col-sm-4 col-form-label'>
													Cron Schedule:
												</label>
												<div className='col-sm-8'>
													<div className='demo'>
														<div id='cron-expression' className='cron-builder' />
														<div className='alert alert-warning'>
															<p>
																<strong>Cron Expression:</strong>{" "}
																<span id='expression-result' />
															</p>
														</div>
													</div>
												</div>
											</div>
											<div className='form-group row'>
												<div className='col-sm-8 offset-sm-4'>
													<button type='submit' className='btn btn-lg btn-info btn-block'>
														Register
													</button>
												</div>
											</div>
										</ValidatorForm>
									</div>
								</div>
							</div>
						</React.Fragment>
					)}
				</React.Fragment>
			);
		}
	}
}

export default Register;
