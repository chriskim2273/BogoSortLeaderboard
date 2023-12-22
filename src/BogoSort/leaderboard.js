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
} from '@chakra-ui/react';

function Leaderboard() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef();

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
                        <NumberInput onChange={(valueString) => parseInt(valueString)} size='lg' defaultValue={7} min={7} max={15}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Divider />
                        <OrderedList>
                            <ListItem>Lorem ipsum dolor sit amet</ListItem>
                            <ListItem>Consectetur adipiscing elit</ListItem>
                            <ListItem>Integer molestie lorem at massa</ListItem>
                            <ListItem>Facilisis in pretium nisl aliquet</ListItem>
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