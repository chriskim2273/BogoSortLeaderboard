import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Text,
    VStack,
    Grid,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Stat,
    StatLabel,
    StatNumber,
    StatArrow,
    IconButton,
    Button,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { FiRepeat } from "react-icons/fi";
import BogoSort from '../BogoSort/bogoSort'
import { UserAuth } from '../Context/AuthContext';

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] < arr[i]) {
            return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const DEFAULT_AMOUNT = 7;
let newScoreFound = false;

function MainApp(props) {
    const { user } = UserAuth();
    const { array } = props;
    const { uploadScore } = UserAuth();
    const [bogoSize, setBogoSize] = useState(DEFAULT_AMOUNT);
    const [bogoArray, setBogoArray] = useState(array.slice(0, DEFAULT_AMOUNT));
    const [restarting, setRestarting] = useState(false);
    const [countType, setCountType] = useState('increase');
    let bogoCount = useRef(0);

    const notLoggedInAlert = !user ? (<Alert status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='100px'>
        <AlertIcon />
        <AlertTitle>You are not logged in!</AlertTitle>
        <AlertDescription>Any scores will not be uploaded!</AlertDescription>
    </Alert>) : <></>
    //BogoArray.sort((a, b) => b - a);
    //console.log(bogoArray)
    const toast = useToast()
    useEffect(() => {
        const interval = setInterval(() => {
            if (!newScoreFound) {
                bogoCount.current = bogoCount.current + 1;
                setBogoArray((prevArray) => shuffleArray([...prevArray]));
            }
            if (bogoCount.current > bogoSize * bogoSize * bogoSize)
                setCountType('decrease');
        }, 50);
        return () => clearInterval(interval);
    }, []);


    if (isSorted([...bogoArray]) && !newScoreFound) {
        //newScoreFound = true;
        console.log("Sorted!: " + String(bogoCount.current));
        const uploadPromise = uploadScore(bogoCount.current, bogoSize);
        toast.promise(uploadPromise, {
            success: { title: 'Successfully uploaded score!', description: 'Great score!' },
            error: { title: 'Failed to upload score...', description: 'So sorry :(' },
            loading: { title: 'Sorted! - Uploading To Leaderboard...', description: "Time: " + String(new Date(Date.now())) + ", Score: " + String(bogoCount.current) + ", N: " + String(bogoSize) },
        })
        /*
        toast({
            title: 'Sorted! - Uploading To Leaderboard...',
            description: "Time: " + String(new Date(Date.now())) + ", Score: " + String(bogoCount.current) + ", N: " + String(bogoSize),//Uploading to Leaderboard... {"\n"}Time: {Date.now()}, Score: {bogoCount}, N: {bogoSize}</Text>,
            status: 'success',
            duration: 10000,
            isClosable: true,
        })*/
        bogoCount.current = 0;
        setBogoArray(array.slice(0, bogoSize));
        setCountType('increase');
        //setTimeout(() => {
        //    newScoreFound = false;
        //}, 2500);

    }
    //const type = bogoCount < 100 ? 'increase' : 'decrease';
    return (
        <Grid minH="100vh" p={3}>
            {notLoggedInAlert}
            <Stat>
                <StatLabel>Runtime:</StatLabel>
                <StatNumber><StatArrow type={countType} />θ({bogoCount.current})</StatNumber>
            </Stat>
            {//<Text>RunTime: θ({bogoCount.current})</Text>
            }
            <BogoSort array={bogoArray} />
            <VStack spacing={8}>
                <NumberInput onChange={(valueString) => setBogoSize(parseInt(valueString))} size='lg' defaultValue={DEFAULT_AMOUNT} min={7} max={15}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>

                <IconButton isLoading={restarting} onClick={() => {
                    setRestarting(true);
                    bogoCount.current = 0;
                    setBogoArray(array.slice(0, bogoSize));
                    setCountType('increase');
                    setTimeout(() => {
                        setRestarting(false);
                    }, 1500);
                }} isRound={true} aria-label='Restart' icon={<FiRepeat />} />
            </VStack>
        </Grid>
    );
}

export default MainApp;
