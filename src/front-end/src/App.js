import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, makeStyles, Breadcrumbs } from '@material-ui/core';
import LinkUI from '@material-ui/core/Link'
import WebLogo from '@material-ui/icons/Cake';
import AccountIcon from '@material-ui/icons/AccountBox';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Board from './components/Board';
import CheckMail from './components/CheckMail';
import MailValidate from './components/MailValidate';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <LinkUI color="inherit" href="https://github.com/">
                My Github
      		</LinkUI>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    breadCrumbsBlock: {
        display: 'flex',
        marginLeft: 700,
    },
    link: {
        display: 'flex',
        marginRight: 10,
    },
    iconForBreadSrum: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));

function App() {
    const classes = useStyles();
    const [loginStatus, setLoginStatus] = useState(false);

    const username = localStorage.getItem("username");
    // const token = localStorage.getItem("token");
    localStorage.setItem("loginStatus", loginStatus);

    // if (token) {
    //     setLoginStatus(true);
    // } else {
    //     setLoginStatus(false);
    // }

    const handleChangeLoginStatus = () => {
        setLoginStatus(!loginStatus);
    }

    return (
        <Router>
            <React.Fragment>
                <CssBaseline />
                <div className="App">
                    <AppBar position="relative">
                        <Toolbar>
                            <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>
                                <WebLogo className={classes.icon} />
                            </Link>
                            <NavLink
                                style={{ textDecoration: 'none', color: 'black' }}
                                to='/'
                                className={classes.link}>
                                <Typography variant="h6" color="textPrimary" noWrap>
                                    Caro online
          						</Typography>
                            </NavLink>

                            <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrumbsBlock}>
                                {!loginStatus ?
                                    <NavLink
                                        exact
                                        style={{ textDecoration: 'none' }}
                                        activeStyle={{ textDecoration: 'none', color: 'yellow' }}
                                        color="inherit"
                                        to="/signin"
                                        className={classes.link}>
                                        <AccountIcon className={classes.iconForBreadSrum} />
        									Sign in
									</NavLink> : null}
                                {!loginStatus ?
                                    <NavLink
                                        exact
                                        style={{ textDecoration: 'none' }}
                                        activeStyle={{ textDecoration: 'none', color: 'yellow' }}
                                        color="inherit"
                                        to="/register"
                                        className={classes.link}>
                                        <AccountIcon className={classes.iconForBreadSrum} />
        									Sign up
								  	</NavLink> : null}
                                {loginStatus ?
                                    <NavLink
                                        exact
                                        style={{ textDecoration: 'none' }}
                                        activeStyle={{ textDecoration: 'none', color: 'yellow' }}
                                        color="inherit"
                                        to={`/profile`}
                                        className={classes.link}>
                                        <AccountIcon className={classes.iconForBreadSrum} />
                                        Hi, {username}
                                    </NavLink> : null}
                                {loginStatus ?
                                    <NavLink
                                        exact
                                        style={{ textDecoration: 'none' }}
                                        activeStyle={{ textDecoration: 'none', color: 'yellow' }}
                                        color="inherit"
                                        to="/signin"
                                        // onClick={handleLogout}
                                        className={classes.link}>
                                        <AccountIcon className={classes.iconForBreadSrum} />
								  			Sign out
									</NavLink> : null}
                                {/* {renderValue} */}

                            </Breadcrumbs>
                        </Toolbar>
                    </AppBar>
                    <main>
                        <Switch>
                            <Route path='/signin' exact component={() => (<Login handleChangeLoginStatus={handleChangeLoginStatus} />)} />
                            <Route path='/register' exact component={Register} />
                            <Route path='/' exact component={Home} />
                            <Route path='/board' exact component={Board} />
                            <Route path='/check-mail' exact component={CheckMail} />
                            <Route path='/validate' exact component={MailValidate} />
                        </Switch>
                    </main>
                    {/* Footer */}
                    <footer className={classes.footer}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Footer
        				</Typography>
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                            Something here to give the footer a purpose!
        				</Typography>
                        <Copyright />
                    </footer>
                    {/* End footer */}
                </div>
            </React.Fragment>
        </Router>
    );
}

export default App;