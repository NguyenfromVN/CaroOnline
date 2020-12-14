import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardActions, CardContent, Button, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    additionCard: {
        height: (150),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    }
}));

export default function Board(props) {
    const classes = useStyles();
    const board = props.boardItem;

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className={classes.card}>
                {/* <Link style={{ textDecoration: 'none', color: 'black' }} to={`/boards/${board.id}`}> */}
                <CardActionArea>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {board.boardName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {board.user}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* </Link> */}
                <CardActions >
                    <Button variant="outlined" size="small" color="primary">
                        Join game
                    </Button >
                </CardActions>
            </Card>
        </Grid>
    );
}