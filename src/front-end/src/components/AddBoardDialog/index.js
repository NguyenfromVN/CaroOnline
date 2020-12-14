import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircle';

export default function AddBoardDialog(props) {
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
