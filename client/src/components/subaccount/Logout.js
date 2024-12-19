import React, { Component } from "react";
import { Redirect } from "react-router";

class Logout extends Component {
	constructor(props) {
		super(props);
		localStorage.clear();
	}
	componentDidMount() {
		this.props.onChange(false);
	}

	render() {
		return <Redirect to='/' />;
	}
}

export default Logout;
