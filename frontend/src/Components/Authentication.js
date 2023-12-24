import React from 'react';
import {
    IconButton,
} from '@chakra-ui/react';
import { UserAuth } from '../Context/AuthContext';
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";

function AuthenticationComponent(props) {
    const { user, googleSignIn, logOut } = UserAuth();
    const refreshApp = props.refreshApp;

    const Component = !user ? (
        <IconButton as={FiLogIn} onClick={() => {
            googleSignIn();
            refreshApp();
        }}>Sign In/Up (Google)</IconButton>) :
        <IconButton as={FiLogOut} onClick={() => {
            logOut();
        }}>Log Out</IconButton>

    //console.log(user);

    return (
        Component
    );
}

export default AuthenticationComponent;
