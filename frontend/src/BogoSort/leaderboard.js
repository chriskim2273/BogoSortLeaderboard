import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Input,
    DrawerFooter,
    useDisclosure,
    OrderedList,
    ListItem,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Divider,
    Skeleton,
    IconButton,
    Box,
} from '@chakra-ui/react';
import { getUserScores } from '../Requests/GeneralRequests';
import axios from 'axios';
import { FaCrown } from "react-icons/fa";
import { API_URL } from '../Variables/apiVariables';

function Leaderboard() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amountOfElements, setAmountOfElements] = useState(7);
    const [userScores, setUserScores] = useState();
    const [loadingScores, setLoadingScores] = useState(false);
    const btnRef = useRef();

    useEffect(() => {
        const fetchBestScores = async () => {
            setLoadingScores(true);
            try {
                const result = await axios.get(API_URL + 'getBestScores?amount_of_elements=' + String(amountOfElements)).then((response) => {
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
        fetchBestScores();
    }, [amountOfElements]);

    const scoresArray = userScores ? Array.from(userScores, (x) => x) : undefined;
    const scoresComponent = loadingScores ? <Skeleton m={5} height='100%' /> : <OrderedList>
        {scoresArray ? scoresArray.map((score_element, index) => {
            const { time_of_score, score, amount_of_elements, user_id, display_name, email } = score_element;
            //console.log(typeof time_of_score)
            return (<Box key={"leaderboard_box_" + String(amountOfElements) + "_" + String(index)} paddingTop={4}><ListItem key={"leaderboard_" + String(amountOfElements) + "_" + String(index)}>θ({score}) - {time_of_score} - {display_name}</ListItem><Divider paddingTop={2} paddingBottom={2} /></Box>)
        }) : <Skeleton height='20px' />}
    </OrderedList>;

    return (
        <>
            <IconButton as={FaCrown} ref={btnRef} colorScheme='teal' onClick={onOpen}>
                Leaderboard
            </IconButton>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>BogoBoard
                    </DrawerHeader>

                    <DrawerBody>
                        <NumberInput onChange={(valueString) => setAmountOfElements(parseInt(valueString))} size='lg' defaultValue={amountOfElements} min={1} max={15}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Divider />
                        {scoresComponent}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {//<Button colorScheme='blue'>Save</Button>
                        }
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Leaderboard;