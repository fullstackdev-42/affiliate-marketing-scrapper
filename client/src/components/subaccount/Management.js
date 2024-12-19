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

import { confirmAlert } from "react-confirm-alert";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import { NotificationManager } from "react-notifications";
import EditIcon from "@material-ui/icons/Edit";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Script from "react-load-script";
import $ from "jquery";
window.$ = $;
global.jQuery = $;

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
    return order === "desc"
        ? (a, b) => desc(a, b, orderBy)
        : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    {
        id: "subAcctId",
        label: "Sub Account ID"
    },
    {
        id: "websiteUrl",
        label: "Website URL"
    },
    {
        id: "name",
        label: "Name"
    },
    {
        id: "affUrl",
        label: "Affiliate URL"
    },
    {
        id: "loginUrl",
        label: "Login URL"
    },
    {
        id: "username",
        label: "Username"
    },
    {
        id: "cronSched",
        label: "Cron Schedule"
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
                            <TableCell
                                key={row.id}
                                padding={row.disablePadding ? "none" : "default"}
                                align={"center"}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                title="Sort"
                                enterDelay={300}
                                >
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
                    <TableCell>Reschedule</TableCell>
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
        minWidth: 700
    },
    tableWrapper: {
        overflowX: "auto"
    }
});

class Management extends Component {
    constructor() {
        super();
        this.state = {
            newCronSched: "",
            subAccountList: [],
            order: "asc",
            orderBy: "subAcctId",
            page: 0,
            rowsPerPage: 10
        };
    }
  
    async componentDidMount() {
        const th = this;
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
        await axios.get("/api/subaccounts/getAllSubAccounts").then(res => {
            this.setState({subAccountList: res.data});
        }).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });
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
					th.setState({ newCronSched: expression });
					$("#expression-result").text(expression);
				}
			});
		});
    }
        
    handleCronSched(accountId) {
        const th = this;
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
        axios.post("/api/subaccounts/reSchedule", {
            accountId: accountId,
            newCronSched: this.state.newCronSched
        }).then(res => {              
            if (res.data.success) {
                this.setState({ newCronSched: "" });
                this.setState(state => {
                    const subAccountList = state.subAccountList.map(account => {
                        if (account._id === accountId) {
                        account.cronSched = res.data.newCronSched;
                        return account;
                        } else {
                        return account;
                        }
                    });                  
                    return {
                        subAccountList
                    };
                });
                NotificationManager.success(
                    res.data.msg,
                    "Notification!",
                    5000
                );
            } else {
                NotificationManager.error(res.data.msg, "Error!", 5000);
            }
        }).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });        
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

    handleCronSchedConfirm = (event, accountId) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <React.Fragment>
                    <Script
                        url='/assets/jquery-cron-quartz.min.js'
                        onCreate={this.handleScriptCreate.bind(this)}
                        onError={this.handleScriptError.bind(this)}
                        onLoad={this.handleScriptLoad.bind(this)}
                    />
                    <div className="custom-confirm-alert">
                        <h2>Do you want to change the cron schedule of this account?</h2>                 

                        <div className='demo'>
                            <div id='cron-expression' className='cron-builder' />
                            <div className='alert alert-warning'>
                                <p>
                                    <strong>Cron Expression:</strong>{" "}
                                    <span id='expression-result' />
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose}>No</button>
                        <button
                            onClick={() => {
                                if(this.state.newCronSched === ""){
                                    NotificationManager.warning("Please input new cron schedule", "Warning!", 5000);
                                } else {
                                    this.handleCronSched(accountId);
                                    onClose();
                                }
                            }}
                        >
                            Yes, Change it!
                        </button>
                    </div>
                </React.Fragment>
              );
            }
        });
    }
    render() {
        var data = this.state.subAccountList;
        const { classes } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
    
        return (
            <React.Fragment>
                <div className="account-list container">
                    <h3 className="h3 mb-5 font-weight-normal">Sub Account List</h3>
                    <Paper className={classes.root}>
                        <div className={classes.tableWrapper}>
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(account => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={account._id}
                                            >
                                                <TableCell align={"center"}>{account.subAcctId}</TableCell>
                                                <TableCell align={"center"}>{account.websiteUrl}</TableCell>
                                                <TableCell align={"center"}>{account.name}</TableCell>
                                                <TableCell align={"center"}>{account.affUrl}</TableCell>
                                                <TableCell align={"center"}>{account.loginUrl}</TableCell>
                                                <TableCell align={"center"}>{account.username}</TableCell>
                                                <TableCell align={"center"}>{account.cronSched}</TableCell>
                                                <TableCell align={"center"}
                                                    onClick={event =>
                                                    this.handleCronSchedConfirm(event, account._id)
                                                    }
                                                >
                                                    <Tooltip title="Change Cron Schedule">
                                                    <IconButton aria-label="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>                                        
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <TablePagination
                            component="div"
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

            </React.Fragment>
        );
    }
}
  
Management.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(Management);