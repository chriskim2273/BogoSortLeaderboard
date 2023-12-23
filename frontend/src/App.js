import React, { useState } from 'react';
import {
  Box,
  ChakraProvider,
  Divider,
  Flex,
  Grid,
  Text,
  extendTheme,
} from '@chakra-ui/react';
import { AuthContextProvider } from './Context/AuthContext';
import MainApp from './Components/Main';
import AuthenticationComponent from './Components/Authentication';
import Leaderboard from './BogoSort/leaderboard';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 3. Extend the theme
const theme = extendTheme({ config })

let array = Array.from({ length: 15 }, (_, i) => i + 1);
array.sort((a, b) => a - b);

function App() {
  const [refresh, setRefresh] = useState(false);
  const refreshApp = () => {
    setRefresh(!refresh);
  }
  return (
    <AuthContextProvider>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Text>BogoSort</Text>
          <Divider m={4} />
          <AuthenticationComponent refreshApp={refreshApp} />
          <Leaderboard />
          <MainApp array={array} />
        </Box>
      </ChakraProvider>
    </AuthContextProvider>
  );
}

export default App;
