import React from 'react';
import {
    IconButton,
} from '@chakra-ui/react';
import { UserAuth } from '../Context/AuthContext';


function AuthenticationComponent(props) {
    const { user, googleSignIn, logOut } = UserAuth();
    const refreshApp = props.refreshApp;

    const Component = !user ? (
        <IconButton onClick={() => {
            googleSignIn();
            refreshApp();
        }}>Sign In/Up (Google)</IconButton>) :
        <IconButton onClick={() => {
            logOut();
        }}>Log Out</IconButton>

    //console.log(user);

    return (
        Component
    );
}

export default AuthenticationComponent;
