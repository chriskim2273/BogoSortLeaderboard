import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    IconButton, ListItem, OrderedList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton,
} from '@chakra-ui/react';
import { UserAuth } from '../Context/AuthContext';
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import { API_URL } from '../Variables/apiVariables';

function AuthenticationComponent(props) {
    const { user, googleSignIn, logOut } = UserAuth();
    const refreshApp = props.refreshApp;
    const [userScores, setUserScores] = useState();
    const [loadingScores, setLoadingScores] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchUserScores = async () => {
            setLoadingScores(true);
            try {
                const result = await axios.get(API_URL + 'getAllUserScoresById?uid=' + String(user.uid)).then((response) => {
                    //console.log(response.data.result);
                    setUserScores(response.data.result);
                    setLoadingScores(false);
                }, (error) => {
                    console.log(JSON.stringify(error));
                });
            }
            catch (error) {
                setLoadingScores(false);
                console.error(error);
            }
        }
        fetchUserScores();
    }, [refresh]);

    const scoresArray = userScores ? Array.from(userScores, (x) => x) : undefined;
    const scoresComponent = loadingScores && !userScores ? <Skeleton m={5} height='100%' /> : <OrderedList>
        {scoresArray ? scoresArray.map((score_element, index) => {
            const { time_of_score, score, amount_of_elements, user_id, display_name, email } = score_element;
            //console.log(typeof time_of_score)
            return (<Box key={"leaderboard_box_" + String(amount_of_elements) + "_" + String(index)} paddingTop={4}><ListItem key={"leaderboard_" + String(amount_of_elements) + "_" + String(index)}>θ({score}) - {time_of_score} - {display_name}</ListItem><Divider paddingTop={2} paddingBottom={2} /></Box>)
        }) : <Skeleton height='20px' />}
    </OrderedList>;

    const loggedInComponent = <Popover>
        <PopoverTrigger>
            <IconButton as={CgProfile} onClick={() => { setRefresh(!refresh) }}>Profile</IconButton>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>User Scores</PopoverHeader>
            <PopoverBody>
                {scoresComponent}
                <Button onClick={() => {
                    logOut();
                }}>Log Out</Button></PopoverBody>
        </PopoverContent>
    </Popover>

    const Component = !user ? (
        <IconButton as={FiLogIn} onClick={() => {
            googleSignIn();
            refreshApp();
        }}>Sign In/Up (Google)</IconButton>) :
        loggedInComponent

    //console.log(user);

    return (
        Component
    );
}

export default AuthenticationComponent;
