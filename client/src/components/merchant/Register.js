import React, { Component } from "react";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { ValidatorForm } from "react-form-validator-core";
import TextValidator from "../TextValidator";

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: ""
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		e.preventDefault();
		let th = this;
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		axios
			.post("/api/merchants/register", {
				name: this.state.name
			})
			.then(res => {
				if (res.data.success) {
					NotificationManager.success(res.data.msg, "Notification!", 3000);
					th.props.history.push("/Dashboard");
				} else {
					NotificationManager.error(res.data.msg, "Error!", 3000);
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
							<h3 className='h3 mb-5 font-weight-normal text-center'>Please Register New Merchant</h3>
							<div className='form-group row'>
								<label htmlFor='name' className='col-sm-4 col-form-label'>
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
