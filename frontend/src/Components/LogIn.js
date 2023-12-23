import React from 'react';
import {
    Text,
    Button,
    Box,
} from '@chakra-ui/react';
import { UserAuth } from '../Context/AuthContext';

function AuthenticationComponent(props) {
    const { user, googleSignIn, logOut } = UserAuth();
    const refreshApp = props.refreshApp;

    const Component = !user ? (
        <Button onClick={() => {
            googleSignIn();
            refreshApp();
        }}>Sign In/Up (Google)</Button>
    ) : <Box> <Text fontSize={'sm'}>Welcome, {user?.email}</Text><Button onClick={() => {
        logOut();
    }}>Log Out</Button></Box>

    console.log(user);

    return (
        Component
    );
}

export default AuthenticationComponent;
