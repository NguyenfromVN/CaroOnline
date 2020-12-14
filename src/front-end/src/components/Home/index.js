import React from 'react';
import { Grid, Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddBoxOutlined';
import Board from '../Board';

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
const boards = [
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
            user: "Phat Wang"
        }
    },
    {
        id: 3,
        board: {
            boardName: "demo3",
            user: "Phat Wang"
        }
    },
    {
        id: 4,
        board: {
            boardName: "demo4",
            user: "Phat Wang"
        }
    },
]

const boardsList = boards.map((board) => {
    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // } else if (loading) {
    //     return <div>Loading...</div>;
    // } else {
    return (
        <Board key={board.id}
            boardItem={board.board} />
    );
    // }
});

export default function Home() {
    const classes = useStyles();

    return (
        <main>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {boardsList}
                    <Grid item xs={12} sm={4} md={4}>
                        <AddBoardDialog />
                    </Grid>
                </Grid>
            </Container>
        </main>
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
                <AddIcon />
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