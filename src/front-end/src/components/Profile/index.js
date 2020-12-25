import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../../api/userApi';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function UserProfile() {
    const classes = useStyles();
    const history = useHistory();

    const username = (new URL(document.location)).searchParams.get('user');
    const email = (new URL(document.location)).searchParams.get('email');
    const token = localStorage.getItem("token");

    if (!token) {
        history.push('/signin');
    }

    function handleSubmit(e) {
        // fetch(`${config.uriPath}/users`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "userID": userID
        //     },
        //     body: JSON.stringify({
        //         "name": nameText,
        //         "password": passwordText
        //     })
        // }).then(resp => resp.json())
        //     .then(data => {
        //         console.log(data);
        //         if (data.code === 0) {
        //             history.push('/');
        //             handleEditProfile();
        //             alert("Update profile successfully!");

        //         } else {
        //             alert('Update failed. Please fill out password fields to update!');
        //         }

        //         //loadData();
        //         //setOpen(false);
        //     })

        // e.preventDefault();
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Profile
                </Typography>
                <form method='PUT' className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="username"
                                variant="outlined"
                                fullWidth
                                defaultValue={username}
                                disabled
                                id="username"
                                label="Username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                defaultValue={email}
                                disabled
                                id="email"
                                label="Email"
                            />
                        </Grid>
                    </Grid>
                    {/* <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button> */}
                    {/* <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button> */}
                </form>
            </div>
        </Container>
    );
}