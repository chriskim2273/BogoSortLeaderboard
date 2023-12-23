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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { FiRepeat } from "react-icons/fi";
import BogoSort from '../BogoSort/bogoSort'
import Leaderboard from '../BogoSort/leaderboard';

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) {
            return false;
        }
    }
    return true;
}

let array = Array.from({ length: 15 }, (_, i) => i + 1);
array.sort((a, b) => b - a);

const DEFAULT_AMOUNT = 7;

function MainApp() {
    //const { user, googleSignIn } = UserAuth();
    const [bogoSize, setBogoSize] = useState(DEFAULT_AMOUNT);
    const [bogoArray, setBogoArray] = useState(array.slice(array.length - DEFAULT_AMOUNT));

    let bogoCount = useRef(0);
    //BogoArray.sort((a, b) => b - a);
    //console.log(bogoArray)
    const toast = useToast()
    useEffect(() => {
        const interval = setInterval(() => {
            bogoCount.current = bogoCount.current + 1;
            setBogoArray((prevArray) => [...prevArray].sort((a, b) => Math.random() - 0.5));
        }, 50); // sort every second

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    if (isSorted(bogoArray)) {
        console.log("Sorted!: " + String(bogoCount.current));
        toast({
            title: 'Sorted! - Uploading To Leaderboard...',
            description: "Time: " + String(new Date(Date.now())) + ", Score: " + String(bogoCount.current) + ", N: " + String(bogoSize),//Uploading to Leaderboard... {"\n"}Time: {Date.now()}, Score: {bogoCount}, N: {bogoSize}</Text>,
            status: 'success',
            duration: 10000,
            isClosable: true,
        })
        bogoCount.current = 0;
        setBogoArray(array.slice(array.length - bogoSize));
    }
    return (
        <Grid minH="100vh" p={3}>
            <Leaderboard />

            <Stat>
                <StatLabel>Global Bogo Count:</StatLabel>
                <StatNumber><StatArrow type='increase' />{bogoCount.current}</StatNumber>


            </Stat>
            <Text>RunTime: θ({bogoCount.current})</Text>
            <BogoSort array={bogoArray} />
            <VStack spacing={8}>
                <NumberInput onChange={(valueString) => setBogoSize(parseInt(valueString))} size='lg' defaultValue={DEFAULT_AMOUNT} min={7} max={15}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>

                <IconButton onClick={() => {
                    bogoCount.current = 0;
                    setBogoArray(array.slice(array.length - bogoSize));
                }} isRound={true} aria-label='Restart' icon={<FiRepeat />} />
            </VStack>
        </Grid>
    );
}

export default MainApp;
