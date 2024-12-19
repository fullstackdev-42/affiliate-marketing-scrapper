import React, { Component } from "react";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { ValidatorForm } from "react-form-validator-core";
import TextValidator from "../TextValidator";

class Register extends Component {
	constructor() {
		super();
		this.state = {
            displayName: "",
            url:""
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		e.preventDefault();
		const th = this;
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		axios
			.post("/api/profiles/register", {
                displayName: this.state.displayName,
                url: this.state.url
			})
			.then(res => {
				if (res.data.success) {
					NotificationManager.success(res.data.msg, "Notification!", 5000);
					//this.props.history.push("/Dashboard");
				} else {
					NotificationManager.error(res.data.msg, "Error!", 5000);
				}
			})
			.catch(function (error) {
				if (error.response.status === 403) {
					th.props.history.push('/logout')
				}
			});
	}
	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-6 mt-100 mx-auto'>
						<ValidatorForm ref='form' onSubmit={this.onSubmit}>
							<h3 className='h3 mb-5 font-weight-normal text-center'>Please Register New Profile</h3>
							<div className='form-group row'>
								<label htmlFor='displayName' className='col-sm-4 col-form-label'>
									Display Name:
								</label>
								<div className='col-sm-8'>
									<TextValidator
										onChange={this.onChange}
										name='displayName'
										className='form-control'
										value={this.state.displayName}
										validators={["required"]}
										errorMessages={["This field is required"]}
									/>
								</div>
							</div>
                            <div className='form-group row'>
								<label htmlFor='url' className='col-sm-4 col-form-label'>
									URL:
								</label>
								<div className='col-sm-8'>
									<TextValidator
										onChange={this.onChange}
										name='url'
										className='form-control'
										value={this.state.url}
										validators={["required"]}
										errorMessages={["This field is required"]}
									/>
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
		);
	}
}

export default Register;
