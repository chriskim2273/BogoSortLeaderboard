import React from 'react';
import {
    IconButton,
} from '@chakra-ui/react';
import { UserAuth } from '../Context/AuthContext';
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";


function AuthenticationComponent(props) {
    const { user, googleSignIn, logOut } = UserAuth();
    const refreshApp = props.refreshApp;

    const Component = !user ? (
        <IconButton as={CiLogin} onClick={() => {
            googleSignIn();
            refreshApp();
        }}>Sign In/Up (Google)</IconButton>) :
        <IconButton as={CiLogout} onClick={() => {
            logOut();
        }}>Log Out</IconButton>

    //console.log(user);

    return (
        Component
    );
}

export default AuthenticationComponent;
