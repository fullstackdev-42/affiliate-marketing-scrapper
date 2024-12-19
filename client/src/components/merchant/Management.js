import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
	{
		id: "name",
		label: "Name"
	}
];

class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy } = this.props;
		return (
			<TableHead>
				<TableRow>
					{rows.map(row => {
						return (
							<TableCell key={row.id} align={"center"} sortDirection={orderBy === row.id ? order : false}>
								<Tooltip title='Sort' enterDelay={300}>
									<TableSortLabel
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}
EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3
	},
	table: {
		minWidth: 300
	},
	tableWrapper: {
		overflowX: "auto"
	}
});

class Management extends Component {
	constructor() {
		super();
		this.state = {
			merchantList: [],
			order: "asc",
			orderBy: "name",
			page: 0,
			rowsPerPage: 10
		};
		this.onChange = this.onChange.bind(this);
	}

	async componentDidMount() {
		axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
		const th = this;
		await axios.get("/api/merchants/getAllMerchants").then(res => {
			this.setState({ merchantList: res.data });
		}).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });
	}
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}

		this.setState({ order, orderBy });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	render() {
		var data = this.state.merchantList;
		const { classes } = this.props;
		const { order, orderBy, rowsPerPage, page } = this.state;

		return (
			<div className='merchant-list container'>
				<h3 className='h3 mb-5 font-weight-normal'>Merchant List</h3>
				<Paper className={classes.root}>
					<div className={classes.tableWrapper}>
						<Table className={classes.table} aria-labelledby='tableTitle'>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={this.handleRequestSort}
								rowCount={data.length}
							/>
							<TableBody>
								{stableSort(data, getSorting(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(merchant => {
										return (
											<TableRow hover tabIndex={-1} key={merchant._id}>
												<TableCell align={"center"}>{merchant.name}</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						component='div'
						count={data.length}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							"aria-label": "Previous Page"
						}}
						nextIconButtonProps={{
							"aria-label": "Next Page"
						}}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		);
	}
}

Management.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Management);
