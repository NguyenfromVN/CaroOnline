import './index.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, CssBaseline, Typography, Container, Grid, Card, CardActionArea, CardContent, CardActions, Button } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../api/userApi';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
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
    },
}));

const boardsList = boards => (
    boards.map((board) => {
        if (board.boardId && board.result) { //kiểm tra boardID rỗng và đã kết thúc
            return (
                <BoardItem key={board.boardId}
                    boardItem={board} />
            );
        }
    })
);

export default function UserProfile() {
    const classes = useStyles();
    const history = useHistory();
    const [user, setUser] = useState({});
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const username = (new URL(document.location)).searchParams.get('user');

        (async () => {
            let response = await api.getUserByUsername(username);
            if (response.message) {
                history.push('/signin');
                return;
            }
            setUser(response);
            setBoards(response.history);
        })();
    }, []);

    return (
        <main>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Profile
                    </Typography>
                    <div className='profile-content'>
                        <div>Username: <b>{user.username}</b></div><br />
                        <div>Email: <b>{user.email}</b></div><br />
                        <div>Games played: <b>{user.win + user.lose}</b></div><br />
                        <div>Games won: <b>{user.win}</b></div><br />
                        <div>Games lost: <b>{user.lose}</b></div><br />
                        <div>Trophy: <b>{user.trophy}</b></div>
                    </div>
                </div>
            </Container>
            <Container className={classes.cardGrid} maxWidth="md">
                <Typography component="h1" variant="h5" style={{ marginBottom: 20, color: "orange" }}>
                    LIST GAMES PLAYED
                </Typography>
                <Grid container spacing={4}>
                    {boardsList(boards)}
                </Grid>
            </Container>
        </main>
    );
}

function BoardItem(props) {
    const classes = useStyles();
    const board = props.boardItem;
    const history = useHistory();
    const result = board.result;
    let boardColor = (result == "lose") ? "bisque" : "aqua";

    async function viewGame() {
        history.push(`/board?id=${board.boardId}`);
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                <CardActionArea style={{ flexGrow: 1, backgroundColor: boardColor }}>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h4" component="h4" style={{ color: "blue" }}>
                            {board.boardId}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h5" style={{ color: "red" }}>
                            Result: {result}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions >
                    <Button variant="outlined" color="primary" onClick={viewGame}>
                        VIEW GAME
                </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}