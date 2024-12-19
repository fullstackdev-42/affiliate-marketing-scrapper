import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Statistics from "./Statistics";
import Referrals from "./Referrals";
import Payouts from "./Payouts";
import Visits from "./Visits";
import { Input } from "reactstrap";
import axios from "axios";

function TabContainer(props) {
	return <div style={{ padding: 20 }}>{props.children}</div>;
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired
};

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3
	}
});

class Dashboard extends Component {
	state = {
		value: 0,
		subAccounts: [],
		merchants: [],
		new_merchants: [],
		selectedAccountId: "",
		selectedMerchantId: "",
		flag: true,
		flag2: true
	};

	constructor(props) {
		super(props);
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	async componentDidMount() {
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		const th = this;
		if (this.mounted) {
			await axios.get("/api/merchants/getAllMerchants").then(res => {
				if (res.data.length === 0) {
					this.setState({ merchants: "no result" });
				} else {
					this.setState({
						merchants: res.data.map(merchant => {
							return { value: merchant._id, name: merchant.name };
						})
					});
					this.setState({ selectedMerchantId: this.state.merchants[0].value });
				}
				axios.get("/api/subaccounts/getAllSubAccounts").then(res => {
					if (res.data.length === 0) {
						this.setState({ subAccounts: "no result" });
					} else {
						var flag = true;
						var arr = [];
						res.data.map(account => {
							if (flag) {
								flag = false;
								this.setState({ flag: false, selectedAccountId: account._id });
							}
							var subAccount = {};
	
							for (var i = 0; i < this.state.merchants.length; i++) {
								if (account.merchantId === this.state.merchants[i].value) {
									subAccount.value = account._id;
									subAccount.name = account.name;
									subAccount.merchant_id = account.merchantId;
									subAccount.merchant_name = this.state.merchants[i].name;
									arr.push(subAccount);
									break;
								}
							}
						});
						this.setState({
							subAccounts: arr
						});
					}
				})
				.catch(function (error) {
					if (error.response.status === 403) {
						th.props.history.push('/logout')
					}
				});
			})
			.catch(function (error) {
				if (error.response.status === 403) {
					th.props.history.push('/logout')
				}
			});
			this.setState({ flag: true });
		}
	}

	handleTabChange = (event, value) => {
		if (this.state.value !== value) {
			this.setState({ value });
		}
	};

	accountChanged = (event, value) => {
		this.setState({ selectedAccountId: event.target.value });
	};

	// merchantChanged = async (event, value) => {
	// 	var old_selected_account_id = this.state.selectedAccountId;
	// 	this.setState({ selectedMerchantId: event.target.value });
	// 	var selectedMerchantId = event.target.value;
	// 	var flag = true;
	// 	await this.state.subAccounts.map(account => {
	// 		if (flag && account.merchantId === selectedMerchantId) {
	// 			this.setState({ selectedAccountId: account.value });
	// 			flag = false;
	// 		}
	// 	});

	// 	if (this.state.selectedAccountId !== "" && old_selected_account_id === this.state.selectedAccountId) {
	// 		await this.setState({ selectedAccountId: "" });
	// 	}
	// };

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			this.state.subAccounts && (
				<div className='container'>
					<div className='form-group row justify-content-end'>
						{/* <div className='col-md-4 offset-md-4'>
							<div className='row'>
								<label htmlFor='name' className='col-md-4 col-form-label text-right'>
									Marchants
								</label>
								<div className='col-md-8'>
									<Input type='select' onChange={this.merchantChanged}>
										{this.state.merchants.map(merchant => (
											<option key={merchant.value} value={merchant.value}>
												{merchant.name}
											</option>
										))}
									</Input>
								</div>
							</div>
						</div> */}
						<div className='col-md-8'>
							<div className='row'>
								<label htmlFor='name' className='col-md-4 col-form-label text-right'>
									Sub Accounts
								</label>
								<div className='col-md-8'>
									<Input type='select' onChange={this.accountChanged}>
										{this.state.subAccounts.map(account => (
											<option key={account.value} value={account.value}>
												{account.merchant_name} - {account.name}
											</option>
										))}
									</Input>
								</div>
							</div>
						</div>
					</div>

					<Paper className={classes.root}>
						<AppBar position='static'>
							<Tabs
								value={value}
								onChange={this.handleTabChange}
								variant='scrollable'
								scrollButtons='auto'
							>
								<Tab label='Statistics' />
								<Tab label='Referrals' />
								<Tab label='Payouts' />
								<Tab label='Visits' />
							</Tabs>
						</AppBar>
						{value === 0 && (
							<TabContainer>
								<Statistics id={this.state.selectedAccountId} />
							</TabContainer>
						)}
						{value === 1 && (
							<TabContainer>
								<Referrals id={this.state.selectedAccountId} />
							</TabContainer>
						)}
						{value === 2 && (
							<TabContainer>
								<Payouts id={this.state.selectedAccountId} />
							</TabContainer>
						)}
						{value === 3 && (
							<TabContainer>
								<Visits id={this.state.selectedAccountId} />
							</TabContainer>
						)}
					</Paper>
				</div>
			)
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
