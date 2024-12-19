import "date-fns";
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, InlineDatePicker } from "material-ui-pickers";

const actionsStyles = theme => ({
	root: {
		flexShrink: 0,
		color: theme.palette.text.secondary,
		marginLeft: theme.spacing.unit * 2.5
	},
	customButton: {
		outline: "none",
		"&:focus": {
			outline: "none"
		}
	}
});

class TablePaginationActions extends React.Component {
	handleFirstPageButtonClick = event => {
		this.props.onChangePage(event, 0);
	};

	handleBackButtonClick = event => {
		this.props.onChangePage(event, this.props.page - 1);
	};

	handleNextButtonClick = event => {
		this.props.onChangePage(event, this.props.page + 1);
	};

	handleLastPageButtonClick = event => {
		this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
	};

	render() {
		const { classes, count, page, rowsPerPage, theme } = this.props;

		return (
			<div className={classes.root}>
				<IconButton
					className={classes.customButton}
					onClick={this.handleFirstPageButtonClick}
					disabled={page === 0}
					aria-label='First Page'
				>
					{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
				</IconButton>
				<IconButton
					className={classes.customButton}
					onClick={this.handleBackButtonClick}
					disabled={page === 0}
					aria-label='Previous Page'
				>
					{theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
				</IconButton>
				<IconButton
					className={classes.customButton}
					onClick={this.handleNextButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage) - 1}
					aria-label='Next Page'
				>
					{theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
				</IconButton>
				<IconButton
					className={classes.customButton}
					onClick={this.handleLastPageButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage) - 1}
					aria-label='Last Page'
				>
					{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
				</IconButton>
			</div>
		);
	}
}

TablePaginationActions.propTypes = {
	classes: PropTypes.object.isRequired,
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(TablePaginationActions);

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3
	},
	table: {
		minWidth: 500,
		marginTop: 10
	},
	tableCell: {
		fontSize: "1rem"
	},
	tableWrapper: {
		overflowX: "auto",
		paddingTop: theme.spacing.unit * 3
	}
});

class Statistics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			rowsPerPage: 1,
			selectedId: "",
			tableData: [],
			statisticsTable: [],
			old: {},
			isLoading: false,
			selectedDate: new Date(),
			isAvailable: true
		};
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	async componentDidMount() {
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		let th = this;
		if (this.mounted) {
			if (this.props.id) {
				this.setState({ isLoading: true });
				await axios.post("/api/statistics/getStatistics", { subAcctId: this.props.id }).then(res => {
					if(res.data.success) {
						if (res.data.statistic.length > 0) {
							this.setState({
								tableData: res.data.statistic,
								old: {},
								page: 0,
								isLoading: false,
								selectedDate: new Date(res.data.statistic[0].scrappedDate.replace(".", ""))
							});
						} else {
							this.setState({
								tableData: [],
								isLoading: false
							});
						}
					} else {
						this.setState({
							isLoading: false
						});
						NotificationManager.error(res.data.msg, "Error!", 5000);
					}					
				})
				.catch(function (error) {
					if (error.response.status === 403) {
						//th.props.history.push('/logout')
						//window.location.reload();
					}
				});
			}
		}
	}

	async componentWillReceiveProps(nextProps) {
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		if (nextProps.id !== "") {
			await this.setState({ selectedId: nextProps.id, old: {}, isLoading: true });

			await axios.post("/api/statistics/getStatistics", { subAcctId: this.props.id }).then(res => {
				if(res.data.success) {
					if (res.data.statistic.length > 0) {
						this.setState({
							tableData: res.data.statistic,
							old: {},
							page: 0,
							isLoading: false,
							selectedDate: new Date(res.data.statistic[0].scrappedDate.replace(".", ""))
						});
					} else {
						this.setState({
							tableData: [],
							isLoading: false
						});
					}
				} else {
					this.setState({
						isLoading: false
					});
					NotificationManager.error(res.data.msg, "Error!", 5000);
				}					
			})
			.catch(function (error) {
				if (error.response.status === 403) {
					//th.props.history.push('/logout')
					//window.location.reload();
				}
			});
		} else if (nextProps.id === "") {
			await this.setState({ selectedId: "", old: {}, tableData: [], page: 0, isLoading: false });
		}
	}

	handleDateChange = async date => {
		this.setState({ isAvailable: false });
		await this.setState({ selectedDate: date });
		date = this.state.selectedDate;
		var month = date.getUTCMonth() + 1; //months from 1-12
		var day = date.getUTCDate();
		var year = date.getUTCFullYear();
		this.state.tableData.map((data, key) => {
			var _month = new Date(data.scrappedDate.replace(".", "")).getUTCMonth() + 1; //months from 1-12
			var _day = new Date(data.scrappedDate.replace(".", "")).getUTCDate();
			var _year = new Date(data.scrappedDate.replace(".", "")).getUTCFullYear();
			if (month === _month && day === _day && year === _year) {
				this.setState({ page: key, isAvailable: true });
				return;
			}
		});
	};

	handleChangePage = async (event, page) => {
		await this.setState({ page });
		var date = await new Date(this.state.tableData[this.state.page].scrappedDate.replace(".", ""));
		await this.setState({ selectedDate: date });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	render() {
		const { classes } = this.props;
		const { old } = this.state;

		const { rowsPerPage, page, tableData, selectedDate } = this.state;

		return (
			<Paper className={classes.root}>
				{this.state.isLoading && (
					<div className='col-md-4 offset-md-4' style={{ textAlign: "center", fontSize: 20, padding: 40 }}>
						<div className='spinner-border' style={{ width: "3rem", height: "3rem" }} role='status'>
							<span className='sr-only'>Loading...</span>
						</div>
					</div>
				)}
				{this.state.tableData.length !== 0 && !this.state.isLoading && (
					<div className={classes.tableWrapper}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid container className={classes.grid} justify='flex-end'>
								<InlineDatePicker
									className='margin-right-50'
									keyboard
									variant="outlined"
									format="dd MMM yyyy"
									value={selectedDate}
									onChange={this.handleDateChange}
								/>
							</Grid>
						</MuiPickersUtilsProvider>
						{this.state.isAvailable && (
							<Table className={classes.table}>
								<TableBody>
									<TableRow>
										<TableCell className={classes.tableCell}>
											{tableData.slice(page + 1, page + 2).map(row => {
												old.unpaidReferrals = row.unpaidReferrals;
												old.paidReferrals = row.paidReferrals;
												old.visits = row.visits;
												old.convRate = row.convRate;
												old.unpaidEarnings = row.unpaidEarnings;
												old.paidEarnings = row.paidEarnings;
												old.commissionRate = row.commissionRate;
												old.statisticsTable = row.statisticsTable;
											})}
											{tableData.slice(page, page + 1).map(row => {
												var display = (
													<React.Fragment key={row.visits}>
														<Table className='text-center' style={{ marginBottom: 30 }}>
															<thead
																style={{
																	backgroundColor: "RGBA(0,0,0,0.1)",
																	color: "black"
																}}
															>
																<tr>
																	<th>Unpaid Referrals</th>
																	<th>Paid Referrals</th>
																	<th>Visits</th>
																	<th>Conversion Rate</th>
																	<th>Unpaid Earnings</th>
																	<th>Paid Earnings</th>
																	<th>Commission Rate</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	{old.unpaidReferrals === row.unpaidReferrals && (
																		<td>{row.unpaidReferrals}</td>
																	)}
																	{old.unpaidReferrals !== row.unpaidReferrals && (
																		<td style={{ color: "red" }}>
																			{row.unpaidReferrals}
																		</td>
																	)}
																	{old.paidReferrals === row.paidReferrals && (
																		<td>{row.paidReferrals}</td>
																	)}
																	{old.paidReferrals !== row.paidReferrals && (
																		<td style={{ color: "red" }}>
																			{row.paidReferrals}
																		</td>
																	)}
																	{old.visits === row.visits && <td>{row.visits}</td>}
																	{old.visits !== row.visits && (
																		<td style={{ color: "red" }}>{row.visits}</td>
																	)}
																	{old.convRate === row.convRate && (
																		<td>{row.convRate}</td>
																	)}
																	{old.convRate !== row.convRate && (
																		<td style={{ color: "red" }}>{row.convRate}</td>
																	)}
																	{old.unpaidEarnings === row.unpaidEarnings && (
																		<td>${row.unpaidEarnings}</td>
																	)}
																	{old.unpaidEarnings !== row.unpaidEarnings && (
																		<td style={{ color: "red" }}>
																			${row.unpaidEarnings}
																		</td>
																	)}
																	{old.paidEarnings === row.paidEarnings && (
																		<td>${row.paidEarnings}</td>
																	)}
																	{old.paidEarnings !== row.paidEarnings && (
																		<td style={{ color: "red" }}>
																			${row.paidEarnings}
																		</td>
																	)}
																	{old.commissionRate === row.commissionRate && (
																		<td>{row.commissionRate}</td>
																	)}
																	{old.commissionRate !== row.commissionRate && (
																		<td style={{ color: "red" }}>
																			{row.commissionRate}
																		</td>
																	)}
																</tr>
															</tbody>
														</Table>
														<Table className='text-center'>
															<thead
																style={{
																	backgroundColor: "RGBA(0,0,0,0.1)",
																	color: "black"
																}}
															>
																<tr>
																	<th>Campaign</th>
																	<th>Visits</th>
																	<th>Unique Links</th>
																	<th>Converted</th>
																	<th>Conversion Rate</th>
																</tr>
															</thead>
															<tbody>
																{row.statisticsTable.map((el, key) => {
																	if (old.statisticsTable !== undefined) {
																		return (
																			<tr key={el.campaign}>
																				{old.statisticsTable[key].campaign ===
																					el.campaign && (
																					<td>{el.campaign}</td>
																				)}
																				{old.statisticsTable[key].campaign !==
																					el.campaign && (
																					<td style={{ color: "red" }}>
																						{el.campaign}
																					</td>
																				)}
																				{old.statisticsTable[key].visits ===
																					el.visits && <td>{el.visits}</td>}
																				{old.statisticsTable[key].visits !==
																					el.visits && (
																					<td style={{ color: "red" }}>
																						{el.visits}
																					</td>
																				)}
																				{old.statisticsTable[key]
																					.uniqueLinks === el.uniqueLinks && (
																					<td>{el.uniqueLinks}</td>
																				)}
																				{old.statisticsTable[key]
																					.uniqueLinks !== el.uniqueLinks && (
																					<td style={{ color: "red" }}>
																						{el.uniqueLinks}
																					</td>
																				)}
																				{old.statisticsTable[key].converted ===
																					el.converted && (
																					<td>{el.converted}</td>
																				)}
																				{old.statisticsTable[key].converted !==
																					el.converted && (
																					<td style={{ color: "red" }}>
																						{el.converted}
																					</td>
																				)}
																				{old.statisticsTable[key].convRate ===
																					el.convRate && (
																					<td>{el.convRate}</td>
																				)}
																				{old.statisticsTable[key].convRate !==
																					el.convRate && (
																					<td style={{ color: "red" }}>
																						{el.convRate}
																					</td>
																				)}
																			</tr>
																		);
																	} else {
																		return (
																			<tr key={el.campaign}>
																				<td>{el.campaign}</td>
																				<td>{el.visits}</td>
																				<td>{el.uniqueLinks}</td>
																				<td>{el.converted}</td>
																				<td>{el.convRate}</td>
																			</tr>
																		);
																	}
																})}
															</tbody>
														</Table>
													</React.Fragment>
												);

												return display;
											})}
										</TableCell>
									</TableRow>
								</TableBody>
								<TableFooter>
									<TableRow>
										<TablePagination
											rowsPerPageOptions={[1]}
											colSpan={3}
											count={tableData.length}
											rowsPerPage={rowsPerPage}
											page={page}
											onChangePage={this.handleChangePage}
											onChangeRowsPerPage={this.handleChangeRowsPerPage}
											ActionsComponent={TablePaginationActionsWrapped}
										/>
									</TableRow>
								</TableFooter>
							</Table>
						)}
						{!this.state.isAvailable && (
							<div
								className='col-md-4 offset-md-4'
								style={{ textAlign: "center", fontSize: 20, padding: 40 }}
							>
								No Results
							</div>
						)}
					</div>
				)}
				{this.state.tableData.length === 0 && !this.state.isLoading && (
					<div className='row'>
						<div
							className='col-md-4 offset-md-4'
							style={{ textAlign: "center", fontSize: 20, padding: 40 }}
						>
							No Data
						</div>
					</div>
				)}
			</Paper>
		);
	}
}

Statistics.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Statistics);
