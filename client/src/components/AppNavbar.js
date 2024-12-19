import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	Container
} from "reactstrap";

class AppNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		};
	}
	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		return (
			<div>
				<Navbar color='dark' dark expand='sm' className='mb-5'>
					<Container>
						<Link className='navbar-brand' to='/'>Affiliate Marketing Web Scrapping</Link>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className='ml-auto' navbar>
								{this.props.isLoggedin && (
									<React.Fragment>
										<NavItem>
											<Link className='nav-link' to='/home'>Home</Link>
										</NavItem>
										<NavItem>
											<Link className='nav-link' to='/dashboard'>Dashboard</Link>
										</NavItem>
										<UncontrolledDropdown nav inNavbar>
											<DropdownToggle nav caret>
												Management
											</DropdownToggle>
											<DropdownMenu>												
												<Link className='dropdown-item' to='/merchant/management'>Merchants</Link>
												<Link className='dropdown-item' to='/subaccount/management'>Sub Accounts</Link>
												<Link className='dropdown-item' to='/profile/management'>Profiles</Link>
											</DropdownMenu>
										</UncontrolledDropdown>
										<UncontrolledDropdown nav inNavbar>
											<DropdownToggle nav caret>
												Register
											</DropdownToggle>
											<DropdownMenu>
												<Link className='dropdown-item' to='/merchant/register'>Merchant</Link>
												<Link className='dropdown-item' to='/subaccount/register'>Sub Account</Link>
												<Link className='dropdown-item' to='/profile/register'>Profile</Link>												
											</DropdownMenu>
										</UncontrolledDropdown>
										<NavItem>
											<Link className='nav-link' to='/logout'>Logout</Link>
										</NavItem>
									</React.Fragment>
								)}
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

export default AppNavbar;
