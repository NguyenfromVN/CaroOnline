import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function Google(props) {
    const history = useHistory();

    const username = (new URL(document.location)).searchParams.get('user');
    const token = (new URL(document.location)).searchParams.get('token');

    useEffect(() => {
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        localStorage.setItem("loginStatus", true);
        props.handleChangeLoginStatus();
        history.push('/');
    }, []);

    return (null);
}