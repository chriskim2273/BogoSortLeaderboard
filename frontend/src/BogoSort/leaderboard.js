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
} from '@chakra-ui/react';
import { getUserScores } from '../Requests/GeneralRequests';
import axios from 'axios';

function Leaderboard() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amountOfElements, setAmountOfElements] = useState(7);
    const [userScores, setUserScores] = useState();
    const btnRef = useRef();

    useEffect(() => {
        const fetchBestScores = async () => {
            try {
                const result = await axios.get('http://127.0.0.1:5000/getBestScores?amount_of_elements=' + String(amountOfElements)).then((response) => {
                    console.log(response.data.result);
                    setUserScores(response.data.result);
                }, (error) => {
                    console.log(JSON.stringify(error));
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchBestScores();
    }, [amountOfElements]);

    const scoresArray = userScores ? Array.from(userScores, (x) => x) : undefined;

    return (
        <>
            <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
                Leaderboard
            </Button>
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
                        <OrderedList>
                            {scoresArray ? scoresArray.map((score_element, index) => {
                                const { amount_of_elements, score, time_of_score } = score_element;
                                return (<ListItem>{score}</ListItem>)
                            }) : <Skeleton height='20px' />}
                        </OrderedList>
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