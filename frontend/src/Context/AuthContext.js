import { useContext, createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import axios from "axios";

//import { useNavigation } from '@react-navigation/core';

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //const navigation = useNavigation();
    const googleSignIn = async () => {
        const googleAuthProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleAuthProvider).then(async function (result) {
            const isNewUser = result._tokenResponse.isNewUser;
            //console.log(isNewUser ? "This user just registered" : "Existing User");
            if (isNewUser) {
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': result.user.stsTokenManager.accessToken
                    }
                }
                await axios.post('http://127.0.0.1:5000/createNewUser', {
                    'user_id': result.user.uid,
                    'email': result.user.email,
                    'display_name': result._tokenResponse.displayName
                }, options).then((response) => {
                    console.log(JSON.stringify(response.data));
                }, (error) => {
                    console.log(JSON.stringify(error));
                    if (error.code === 'auth/wrong-password') {
                        alert('Wrong password provided.');
                    } else {
                        alert('An error occurred while signing in.');
                    }
                });
            }
        });


        //return result;
    }

    const registerNewUserOnDatabase = async (user, display_name) => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.stsTokenManager.accessToken
            }
        }
        await axios.post('http://127.0.0.1:5000/createNewUser', {
            'user_id': user.uid,
            'email': user.email,
            'display_name': display_name
        }, options).then((response) => {
            console.log(JSON.stringify(response.data));
        }, (error) => {
            console.log(JSON.stringify(error));
            if (error.code === 'auth/wrong-password') {
                alert('Wrong password provided.');
            } else {
                alert('An error occurred while signing in.');
            }
        });
    }

    const signUp = () => {
        try {
            createUserWithEmailAndPassword(auth, "christopher.kim.1@stonybrook.edu", "pokemon2273")
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log("Registered as ", user.email);
                    registerNewUserOnDatabase(user);
                })
                .catch(error => alert(error.message));
        } catch (error) {
            console.log(error);
        }
    }


    const signIn = () => {
        try {
            signInWithEmailAndPassword(auth, "christopher.kim.1@stonybrook.edu", "pokemon2273")
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log("Logged in as ", user.email);
                    // Load splits?
                })
                .catch(error => alert(error.message));
        } catch (error) {
            console.log(error);
        }
    }

    const logOut = () => {
        console.log("current user", auth.currentUser);
        signOut(auth)
            .then((result) => {
                console.log("entered sign out functions");
                setUser(null);
            })
            .catch(error => alert(error.message));
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (current_user) => {
            if (current_user) {
                //console.log('user' + JSON.stringify(current_user));
                setUser(current_user);
                //navigation.navigate("Home")
            }
        })
        return () => unsubscribe;
    }, [user])

    const saveSplitsToDatabase = async (all_splits) => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.stsTokenManager.accessToken
            }
        }
        await axios.post('http://127.0.0.1:5000/setUserSplits', {
            'user_id': user.uid,
            'all_splits': all_splits,
        }, options).then((response) => {
            console.log(JSON.stringify(response.data));
        }, (error) => {
            console.log(error);
        });
    }

    return (<AuthContext.Provider value={{ user, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}

export const UserAuth = () => {
    return useContext(AuthContext)
}