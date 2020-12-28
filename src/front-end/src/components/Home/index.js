import React, { useEffect, useState } from 'react';
import './index.css';
import ws from '../../webSocketClient';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useHistory, Link } from 'react-router-dom';
import api from '../../api/userApi';
import {
    Grid, Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Card, CardActionArea, CardActions, CardContent, Typography, Paper, InputBase, IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
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
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

const boardsList = boards => (
    boards.map((board) => {
        return (
            <BoardItem key={board.boardId}
                boardItem={board} />
        );
    })
);

const usersList = users => (
    users.map(user => {
        return (
            <UserItem key={user.username} user={user} />
        );
    })
);

export default function Home() {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [boards, setBoards] = useState([]);
    const [searchedBoardIdText, setSearchedBoardIdText] = useState('');
    const history = useHistory();

    useEffect(() => {
        (async () => {
            // call API and get boards
            let response = await api.getAllBoards();
            if (response.message) {
                history.push('/signin');
                return;
            }
            // set boards list
            setBoards(response);
            // init web socket client
            ws.createConnection(localStorage.getItem('username'), (topicName) => {
                let callbacks = {
                    general: function () {
                        let needToRefresh = topicName.split('-')[1];
                        switch (needToRefresh) {
                            case "users": {
                                (async () => {
                                    let arr = await api.getUsers();
                                    setUsers(arr);
                                })();
                                break;
                            }
                            case "boards": {
                                (async () => {
                                    let arr = await api.getAllBoards();
                                    setBoards(arr);
                                })();
                                break;
                            }
                        }
                    }
                };
                let arr = topicName.split('>>>')[0];
                arr = arr.split('-');
                let topic = arr[0];
                if (callbacks[topic]) {
                    callbacks[topic]();
                }
            });
        })();
    }, []);

    const handleJoinGameById = async () => {
        if (await api.getBoard(searchedBoardIdText)) {
            history.push(`/board?id=${searchedBoardIdText}`)
            window.alert('Join game successfully!');
        } else {
            window.alert('Failed');
        }
    }

    return (
        <main>
            <div className="home-container">
                <div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={4} md={4}>
                                <Paper variant="outlined" style={{display: 'flex'}}>
                                    <InputBase
                                        className={classes.input}
                                        placeholder="Join game by id/key"
                                        inputProps={{ 'aria-label': 'join game by key' }}
                                        onChange={(e) => {
                                            setSearchedBoardIdText(e.target.value)
                                        }}
                                    />
                                    <IconButton onClick={handleJoinGameById} className={classes.iconButton} aria-label="join">
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={4} md={4}>
                                <AddBoardDialog callback={setBoards} />
                            </Grid>
                        </Grid>
                    </Container>
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                            {boardsList(boards)}
                        </Grid>
                    </Container>
                </div>
                <div className="users-list">
                    {usersList(users)}
                </div>
            </div>
        </main>
    );
}

function BoardItem(props) {
    const classes = useStyles();
    const board = props.boardItem;
    const history = useHistory();

    async function viewGame() {
        history.push(`/board?id=${board.boardId}`);
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                <CardActionArea style={{flexGrow: 1}}>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {board.name}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            {board.boardId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {board.userId1}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {board.userId2}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* </Link> */}
                <CardActions >
                    <Button variant="outlined" color="primary" onClick={viewGame}>
                        VIEW GAME
                </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}

function UserItem(props) {
    const user = props.user;
    const history = useHistory();

    let statusColor = (user.isActive ? "#00ff00" : "#aaaaaa");

    return (
        <div
            className="user-item"
            onClick={() => {
                history.push(`/detail?user=${user.username}`);
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}><FiberManualRecordIcon style={{ color: statusColor }} /></div>
            <div style={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>{user.username}</div>
            <div style={{ flexGrow: 1 }}></div>
            <button
                style={{
                    width: "4rem",
                    margin: "5px",
                    ...(user.username == localStorage.getItem('username') ? { display: "none" } : {}),
                    cursor: "pointer"
                }}
                disabled={!user.isActive}
                onClick={e => {
                    e.stopPropagation();
                }}
            >Invite</button>
        </div>
    );
}

function AddBoardDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameText, setNameText] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNameText('');
    };

    const handleNameChange = (e) => {
        setNameText(e.target.value);
    };

    async function createNewBoard(e) {
        handleClose();
        await api.createBoard(nameText, nameText);
        ws.notifyChange('boards');
    }

    return (
        <div style={{position: 'absolute'}}>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Create game
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new game, please fill out board's name in the box.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={handleNameChange}
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                            </Button>
                        <Button type="submit" color="primary" onClick={createNewBoard}>
                            Create
                            </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}