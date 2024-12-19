import React, { Component } from "react";

import axios from "axios";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import PropTypes from "prop-types";
import InfoIcon from "@material-ui/icons/Info";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const rows = [
    {
        id: "name",
        label: ""
    },
    {
        id: "commNet",
        label: "Comm.(Net)"
    },
    {
        id: "commGross",
        label: "Comm.(Gross)"
    },
    {
        id: "sales",
        label: "Sales-Net"
    },
    {
        id: "clicks",
        label: "Clicks"
    },
    {
        id: "EPC",
        label: "EPC"
    },
    {
        id: "commRate",
        label: "CR"
    }
];

class EnhancedTableHead extends Component {
    render() {
        return (
            <TableHead>
                <TableRow>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                padding={row.disablePadding ? "none" : "default"}
                                align={"right"} className="border-bottom-black"
                            >                                
                                {row.label}
                            </TableCell>                        
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}
const styles = theme => ({
	root: {
		width: "100%",
        marginTop: theme.spacing.unit * 10,
        marginBottom: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 700,
        marginBottom: theme.spacing.unit * 3
    },
    tableWrapper: {
        overflowX: "auto"
    }
});
class Home extends Component {

	constructor(props) {
        super(props);
        this.state = {
            overview: [],
            personalOverview: [],
            startDate: new Date(),
            endDate: new Date()
        }
	}

	async componentDidMount() {
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
        let th = this;
		await axios.get("/api/home/getOverview").then(res => {
            this.setState({ overview: res.data });
        }).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });
        
        await axios.get("/api/home/getPersonalOverview").then(res => {
            this.setState({personalOverview: res.data});
        }).catch(function (error) {
            if (error.response.status === 403) {
                th.props.history.push('/logout')
            }
        });
	}

    formatAmount = function(temp){
       
        var result = "";
        var fraction = "";
        if((temp === "") || (temp === undefined)){
            result = "0";
        } else {
            var tempString = temp.toString();            
            if(tempString.indexOf('.') !== -1){
                fraction = tempString.slice(tempString.indexOf('.'));
            }
            temp = parseInt(temp).toString();
            var dots = 0;
            if(temp.length % 3 === 0){
                dots = parseInt(temp.length / 3) - 1;
            } else {
                dots = parseInt(temp.length / 3);
            }
            for(var i = dots; i >= 1; i--){
                result += "," + temp.slice(temp.length - i * 3, temp.length - (i - 1) * 3);
            }
            result = temp.slice(0, temp.length - dots * 3) + result;
        }			
        return result + fraction;
    }
    renderProfile(overview, index) {
        const lists = overview.info;
        var sumCommNet = 0, sumCommGross = 0, sumSales = 0, sumClicks = 0, sumEPC = 0, sumCR = 0;
        for(var i=0; i<lists.length; i++){
            sumCommNet += lists[i].commNet;
            sumCommGross += lists[i].commGross;
            sumSales += lists[i].sales;
            sumClicks += lists[i].clicks;
            // sumEPC += lists[i].EPC;
            // sumCR += lists[i].commRate;
        }
        if(overview.expand === true ){
            return (
                <TableRow
                    hover
                    key={index}
                    onClick = {event => this.dropdownExpand(index)}                                                        
                >
                    <TableCell className="border-bottom-black"><ArrowDropUpIcon /> {overview.profileName} ({overview.info.length}) </TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black"></TableCell>                                            
                </TableRow>                                        
            );
        } else {
            return (
                <TableRow
                    hover
                    key={index}
                    onClick = {event => this.dropdownExpand(index)}                                                        
                >
                    <TableCell className="border-bottom-black"><ArrowDropDownIcon /> {overview.profileName} ({overview.info.length}) </TableCell>
                    <TableCell align={"right"} className="border-bottom-black">${this.formatAmount(sumCommNet.toFixed(2))}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">${this.formatAmount(sumCommGross.toFixed(2))}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(sumSales)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(sumClicks)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(lists[0].EPC)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{lists[0].commRate}%</TableCell>                                            
                </TableRow>                                        
            );
        }
    }
    renderLists(nodes) {
        const lists = nodes;
        return lists
            .map((item, index) => {
                return (
                    <TableRow
                        hover                        
                        key={index}
                    >
                        <TableCell className="padding-left-50 home-child">{item.name}</TableCell>
                        <TableCell align={"right"} className="home-child">${this.formatAmount(item.commNet)}</TableCell>
                        <TableCell align={"right"} className="home-child">${this.formatAmount(item.commGross)}</TableCell>
                        <TableCell align={"right"} className="home-child">{this.formatAmount(item.sales)}</TableCell>
                        <TableCell align={"right"} className="home-child">{this.formatAmount(item.clicks)}</TableCell>
                        <TableCell align={"right"} className="home-child">{this.formatAmount(item.EPC)}</TableCell>
                        <TableCell align={"right"} className="home-child">{item.commRate}%</TableCell>                                            
                    </TableRow>                                        
                );
            })
    }
    renderProfileSum(nodes) {
        const lists = nodes;
        var sumCommNet = 0, sumCommGross = 0, sumSales = 0, sumClicks = 0, sumEPC = 0, sumCR = 0;
        for(var i=0; i<lists.length; i++){
            sumCommNet += lists[i].commNet;
            sumCommGross += lists[i].commGross;
            sumSales += lists[i].sales;
            sumClicks += lists[i].clicks;
            // sumEPC += lists[i].EPC;
            // sumCR += lists[i].commRate;
        }
        return (
            <TableRow
                    hover                                                    
                >
                    <TableCell className="border-bottom-black"></TableCell>
                    <TableCell align={"right"} className="border-bottom-black">${this.formatAmount(sumCommNet.toFixed(2))}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">${this.formatAmount(sumCommGross.toFixed(2))}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(sumSales)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(sumClicks)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{this.formatAmount(lists[0].EPC)}</TableCell>
                    <TableCell align={"right"} className="border-bottom-black">{lists[0].commRate}%</TableCell>                                            
                </TableRow>
        )
    }
    handleStartDateChange = date => {
        this.setState({ startDate: date });
    };
    handleEndDateChange = date => {
        this.setState({ endDate: date });
    };
    dropdownExpand(index){        
        var newOverviews = this.state.personalOverview;        
        newOverviews[index].expand = !newOverviews[index].expand;
        this.setState({personalOverview: newOverviews});
    }
	render() {
        var overviews = this.state.personalOverview;
        const { classes } = this.props;
        const { startDate, endDate } = this.state;
		return (
			
            <div className='container'>
                <div className='row'>
                    <div className='col-md-3 offset-md-6'>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <InlineDatePicker
                                keyboard
                                variant="outlined"
                                value={startDate}
                                format="dd MMM yyyy"
                                onChange={this.handleStartDateChange}                                
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className='col-md-3'>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <InlineDatePicker
                                keyboard
                                variant="outlined"
                                value={endDate}
                                format="dd MMM yyyy"
                                onChange={this.handleEndDateChange}                                
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>${this.formatAmount(this.state.overview['realComm'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Real Commission (Net)</h6>
                        </div>                        
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>${this.formatAmount(this.state.overview['allComm'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>All Commission (Gross)</h6>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>${this.formatAmount(this.state.overview['disputedComm'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Disputed Commission</h6>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>${this.formatAmount(this.state.overview['EPC'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Earnings Per Click (EPC)</h6>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>{this.formatAmount(this.state.overview['clicks'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Clicks</h6>
                        </div>                        
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>{this.formatAmount(this.state.overview['sales'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Sales (Net)</h6>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>${this.formatAmount(this.state.overview['AOV'])}<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Avg Order Value (EPR)</h6>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='homepage-border'>
                            <h4 className='amount'>{this.formatAmount(this.state.overview['commRate'])}%<InfoIcon className='icon' /></h4>
                            <h6 className='description'>Commission Rate</h6>
                        </div>
                    </div>
                </div>
                <div className="line"></div>

                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                            />
                            <TableBody>
                                {overviews
                                .map((overview, index) => {
                                    if(overview.expand === true ){
                                        return (
                                            <React.Fragment key={index}>
                                                { this.renderProfile(overview, index) }
                                                { this.renderLists(overview.info) }
                                                { this.renderProfileSum(overview.info) }
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (
                                            <React.Fragment key={index}>
                                                { this.renderProfile(overview, index) }
                                            </React.Fragment>
                                        );
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            </div>
			
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
