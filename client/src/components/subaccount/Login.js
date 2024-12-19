import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { ValidatorForm } from "react-form-validator-core";
import TextValidator from "../TextValidator";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			isLoggedin: false
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	async onSubmit(e) {
		e.preventDefault();
		let th = this;
		await axios
			.post("/api/subaccounts/login", {
				username: this.state.username,
				password: this.state.password
			})
			.then(res => {
				if (res.data.success) {					
					localStorage.setItem("token", res.data.token);
					setTimeout(function(){
						th.setState({ isLoggedin: true });
						th.props.onChange(true);
						th.props.checkLogin(true);
						NotificationManager.success(res.data.message, res.data.title, 3000);
					}, 1000);					
				} else {
					NotificationManager.error(res.data.errors[0].message, res.data.errors[0].title, 3000);
				}
			});
	}
	render() {
		const { isLoggedin } = this.state;
		return (
			<React.Fragment>
				{isLoggedin && <Redirect to='/home' />}
				{!isLoggedin && (
					<div className='container'>
						<div className='row'>
							<div className='col-md-6 mt-100 mx-auto'>
								<ValidatorForm ref='form' onSubmit={this.onSubmit}>
									<h3 className='h3 mb-5 font-weight-normal text-center'>Log in</h3>
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
										<div className='col-sm-8 offset-sm-4'>
											<button type='submit' className='btn btn-lg btn-info btn-block'>
												Login
											</button>
										</div>
									</div>
								</ValidatorForm>
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default Login;
