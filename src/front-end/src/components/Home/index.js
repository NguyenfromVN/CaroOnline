import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';
import {
    Grid, Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Card, CardActionArea, CardActions, CardContent, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/* const boards = [
    {
        id: 1,
        board: {
            boardName: "demo1",
            user: "Phat Wang"
        }
    },
    {
        id: 2,
        board: {
            boardName: "demo2",
            user: "Nguyen Nguyen"
        }
    },
    {
        id: 3,
        board: {
            boardName: "demo3",
            user: "Phan Huy"
        }
    },
    {
        id: 4,
        board: {
            boardName: "demo4",
            user: "Phat Wang"
        }
    },
] */

const boardsList = boards => (
    boards.map((board) => {
        // if (error) {
        //     return <div>Error: {error.message}</div>;
        // } else if (loading) {
        //     return <div>Loading...</div>;
        // } else {
        return (
            <BoardItem key={board.boardId}
                boardItem={board} />
        );
        // }
    })
);

export default function Home() {
    const classes = useStyles();
    const [boards,setBoards]=useState([]);
    const history = useHistory();

    useEffect(()=>{
        (async ()=>{
            // call API and get boards
            let response = await api.getAllBoards();
            if (response.message == 'Unauthorized'){
                history.push('/signin');
                return;
            }
            setBoards(response);
        })();
    },[]);

    return (
        <main>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4} md={4}>
                        <AddBoardDialog />
                    </Grid>
                </Grid>
            </Container>
            <Container className={classes.cardGrid} maxWidth="md">
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

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                {/* <Link style={{ textDecoration: 'none', color: 'black' }} to={`/boards/${board.id}`}> */}
                <CardActionArea>
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
                <Button variant="outlined" color="primary" onClick={()=>history.push(`/board?id=${board.boardId}`)}>
                    JOIN GAME
                </Button>
                </CardActions>
            </Card>
        </Grid>
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

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                New game
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new game, please fill out board's name in the box.
                    </DialogContentText>
                    <form method="POST">
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
                            <Button type="submit" color="primary">
                                Create
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}