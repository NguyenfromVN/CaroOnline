import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardActions, CardActionArea, CardContent, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    }
}));

const usersList = users => (
    users.map((user) => {
        return (
            <UserBoardItem key={user._id}
                userItem={user} />
        );
    })
);

export default function SearchedUserList(props) {
    const classes = useStyles();
    const users = props.location.state.users;

    return (
        <main>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {usersList(users)}
                </Grid>
            </Container>
        </main>
    );
}

function UserBoardItem(props) {
    const classes = useStyles();
    const user = props.userItem;
    const history = useHistory();

    let boardColor = (user.block) ? "rgb(255, 242, 242)" : "#deffde";

    async function viewUser() {
        history.push(`/detail?user=${user.username}`);
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                <CardActionArea style={{ flexGrow: 1, backgroundColor: boardColor }}>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {user.username}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Email: <b>{user.email}</b>
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Status: <b>{(user.block) ? "Blocked" : "Normal"}</b>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* </Link> */}
                <CardActions >
                    <Button variant="outlined" color="primary" onClick={viewUser}>
                        VIEW USER
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}