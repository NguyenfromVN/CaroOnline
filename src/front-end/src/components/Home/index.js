import RankingBoard from './rankingBoard';
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
        flexDirection: 'column'
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

const usersList = (users, isAdmin) => (
    users.map(user => {
        return (
            <UserItem key={user.username} user={user} isAdmin={isAdmin} />
        );
    })
);

export default function Home() {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [boards, setBoards] = useState([]);
    const [searchedBoardIdText, setSearchedBoardIdText] = useState('');
    const [rankingBoard, setRankingBoard] = useState([]);
    const history = useHistory();
    const [isAdmin, setIsAdmin] = useState(false);

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
            // set isAdmin
            setIsAdmin(localStorage.getItem('username') == 'Admin');
            // init web socket client
            const username = localStorage.getItem('username');
            const privateTopic = `private-${username}`;
            ws.createConnection(username, async (topicName, msg) => {
                let callbacks = {
                    usersList: async () => {
                        let arr = await api.getUsers();
                        setUsers(arr);
                    },
                    boardsList: async () => {
                        let arr = await api.getAllBoards();
                        setBoards(arr);
                    },
                };
                callbacks[privateTopic] = async () => {
                    if (msg.split('-')[0] == 'invite') {
                        // recieve invitation
                        const boardId = msg.split('-')[1];
                        const accepted = window.confirm(`You are invited to board ${boardId}. Accept it?`);
                        const invitedBoard = await api.getBoard(boardId);
                        if (accepted) {
                            // join game and redirect to board screen
                            await api.joinBoard(boardId);
                            history.push(`/board?id=${boardId}`);
                            ws.notifyChange(`private-${invitedBoard.userId1}`, `invitation-User ${username} accepted your invitation!`);
                        } else {
                            ws.notifyChange(`private-${invitedBoard.userId1}`, `invitation-User ${username} refused your invitation!`);
                        }
                    } else {
                        // invitation response                      
                        alert(msg.split('-')[1]);
                    }
                };
                if (callbacks[topicName]) {
                    callbacks[topicName]();
                }
            });
            ws.subscribeTopic('boardsList');
            ws.subscribeTopic('usersList');
            // get users list
            let arr = await api.getUsers();
            setUsers(arr);
            // get ranking board
            const rankingBoard = await api.getRankingBoard();
            setRankingBoard(rankingBoard);
        })();
    }, []);

    const handleJoinGameById = async () => {
        const boardId = searchedBoardIdText;
        const boardResponse = await api.getBoard(boardId);
        if (boardResponse._id) {
            const username = localStorage.getItem("username");
            if (username == boardResponse.userId1) {
                alert('You are already the owner of this game!');
                history.push(`/board?id=${boardId}`);
            } else {
                if (!boardResponse.userId2) {
                    await api.joinBoard(boardId);
                    history.push(`/board?id=${boardId}`);
                    alert("You have successfully joined the game as the second player. Play your best!");
                } else {
                    history.push(`/board?id=${boardId}`);
                    if (boardResponse.userId2 == username) {
                        alert("You already joined this game as a player!");
                    } else {
                        alert("This game is full. You have joined the game as a spectator. Enjoy the match!");
                    }
                }
            }
        } else {
            alert("There is no game to match your search. Please try again!");
        }
    }

    async function handleFindUsersByUsernameOrEmail() {
        // TODO
    }

    function topLeftTextbox() {
        if (isAdmin)
            return (
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} md={4}>
                            <Paper variant="outlined" style={{ display: 'flex' }}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Find users by username/email"
                                    inputProps={{ 'aria-label': 'Find users by username/email' }}
                                    onChange={(e) => {
                                        setSearchedBoardIdText(e.target.value)
                                    }}
                                />
                                <IconButton onClick={handleFindUsersByUsernameOrEmail} className={classes.iconButton} aria-label="Find">
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            );
        return (
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4} md={4}>
                        <Paper variant="outlined" style={{ display: 'flex' }}>
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
        );
    }

    return (
        <main>
            <div className="home-container">
                <div>
                    {topLeftTextbox()}
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                            {boardsList(boards)}
                        </Grid>
                    </Container>
                </div>
                <div className="right-panel">
                    <div className='right-panel-container'>
                        <div className='users-list'>
                            {usersList(users, isAdmin)}
                        </div>
                        <RankingBoard rankingBoard={rankingBoard} />
                    </div>
                </div>
            </div>
        </main>
    );
}

function BoardItem(props) {
    const classes = useStyles();
    const board = props.boardItem;
    const history = useHistory();
    let boardColor = (board.winner) ? '#ebebeb' : (board.userId2) ? "#deffde" : "#ededff";
    let boardStatusText = (board.winner) ? "Finished" : (board.userId2) ? "Playing" : "Waiting";

    async function viewGame() {
        history.push(`/board?id=${board.boardId}`);
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                <CardActionArea style={{ flexGrow: 1, backgroundColor: boardColor }}>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {board.boardId}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Owner: <b>{board.userId1}</b>
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Other: <b>{board.userId2}</b>
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Status: <b>{boardStatusText}</b>
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
    const [boardName, setBoardName] = useState('');
    const [open, setOpen] = React.useState(false);
    const username = localStorage.getItem("username");

    let statusColor = (user.isActive ? "#29ba29" : "#d9d9d9");

    const handleClickOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = (e) => {
        setOpen(false);
        setBoardName('');
    };

    const handleInvite = async (e) => {
        const board = await api.getBoard(boardName);
        if (board.boardId && username == board.userId1 && !board.userId2 && !board.winner) {
            ws.notifyChange(`private-${user.username}`, `invite-${boardName}`);
        } else {
            alert("Can not invite. Check your board name again!");
        }
        handleClose(e);
    }

    function handleBlockUser(e) {
        // TODO
        e.stopPropagation();
    }

    function userItemActionButton() {
        const isAdmin = props.isAdmin;
        if (isAdmin) {
            return (
                <button
                    style={{
                        width: "4rem",
                        margin: "5px",
                        cursor: "pointer"
                    }}
                    onClick={handleBlockUser}
                >Block</button>
            );
        }
        return (
            <button
                style={{
                    width: "4rem",
                    margin: "5px",
                    ...(user.username == localStorage.getItem('username') ? { display: "none" } : {}),
                    cursor: "pointer"
                }}
                disabled={!user.isActive}
                onClick={handleClickOpen}
            >Invite</button>
        );
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Invite player {user.username}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Input a board name that is yours and currently empty
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={e => {
                            setBoardName(e.target.value);
                        }}
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                            </Button>
                        <Button type="submit" color="primary" onClick={handleInvite}>
                            Invite
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <div
                className="user-item"
                onClick={() => {
                    history.push(`/detail?user=${user.username}`);
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}><FiberManualRecordIcon style={{ color: statusColor }} /></div>
                <div style={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>{user.username}</div>
                <div style={{ flexGrow: 1 }}></div>
                {userItemActionButton()}
            </div>
        </React.Fragment>
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
        const response = await api.createBoard(nameText, nameText);
        if (response != 'Success') {
            alert(response);
            return;
        }
        ws.notifyChange('boardsList');
    }

    return (
        <div style={{ position: 'absolute' }}>
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