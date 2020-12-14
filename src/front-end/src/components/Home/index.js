import React from 'react';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Board from '../Board';
import AddBoardDialog from '../AddBoardDialog';

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