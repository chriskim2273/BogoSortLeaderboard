import React from 'react';
import {
  Container,
  Flex,
  Text,
} from '@chakra-ui/react';

function BogoSort(props) {
  const array = props.array;
  return (
    <Container maxW="70%" centerContent>
      <Flex direction="row" align="flex-end" justify="space-between" wrap="nowrap">
        {array.map((item, index) => (
          <Flex key={index} direction="column" bg="tomato" height={`${item * 50}px`} borderRadius="lg" boxShadow="lg" p={4} m={2} justify="flex-end">
            <Text>{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Container>
  );
}

export default BogoSort;
