import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useAuth } from "../context/auth";

function User(props) {

    const { setAccessToken } = useAuth();

    function handleClick() {
        setAccessToken('');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
            User-Profile
            </Typography>
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleClick}>
            Sign Out
          </Button>
        </Container>
    );
}

export default User;