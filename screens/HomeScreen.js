import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Transaction from '../Transaction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Authentication from '../utils/Authentication'
import Utils from '../utils/Utils'

const HomeScreen = ({ navigation }) => {
    let STORAGE_KEY = "transdata"

    const [isLoading, setIsLoading] = useState(false);
    const [dataFromDatabase, setDataFromDatabase] = useState([]);
    const [isAuthenticated, setisAuthenticated] = useState(false);

    const createClearAlert = () =>
        Alert.alert('Clear items', 'Confirm clear all items?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    console.log('OK Pressed')
                    clearStorage();
                }
            },
        ]);

    const storeData = async (newData) => {
        try {
            setIsLoading(true);
            // Retrieve existing data
            const existingData = await getData();

            // If there's existing data, merge it with the new data
            const updatedData = existingData ? [...newData, ...existingData] : newData;

            // Store the updated data
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
            setDataFromDatabase(updatedData)
            setIsLoading(false);
            // console.log('updatedData ' + updatedData.length)
        } catch (error) {
            console.error('Error storing data:', error);
            setIsLoading(false);
        }
    };

    const getData = async () => {
        setIsLoading(true);
        try {
            const jsonArrayString = await AsyncStorage.getItem(STORAGE_KEY);
            // console.log('getdata = ' + jsonArrayString);
            if (jsonArrayString == null) {
                setIsLoading(false);
                return [];
            }

            const transArray = JSON.parse(jsonArrayString).map(jsonString => Transaction.fromJSON(jsonString));
            setIsLoading(false);
            return transArray ? transArray : [];
        } catch (error) {
            console.error('Error getting data:', error);
            setIsLoading(false);
            return [];
        }
    };

    const clearStorage = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
            setDataFromDatabase(getData())
            console.log(`Key "${STORAGE_KEY}" cleared successfully.`);
        } catch (error) {
            console.error(`Error clearing key "${key}":`, error);
        }
    };

    const generateRandomData = async () => {
        setIsLoading(true);
        const randomTrans = [];

        for (let i = 1; i <= 20; i++) {
            const randomAmount = Math.floor(Math.random() * 100) + 1; // Random amount between 1 and 100
            const randomNumber = (Math.random() + ' ').substring(2, 10) + (Math.random() + ' ').substring(2, 10);
            const randomTran = new Transaction(
                UUID.v4(),
                randomNumber,
                getCurrentDateTime(),
                randomAmount,
                generateRandomSentence(Math.floor(Math.random() * 15) + 1),
                (Math.random() < 0.5 ? 'Credit' : 'Debit')
            );

            // Add the random trans to the front of the array
            randomTrans.unshift(randomTran);
        }

        storeData(randomTrans);
        setIsLoading(false);
    }

    function getCurrentDateTime() {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Months are zero-based
        const day = currentDate.getDate();

        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const milliseconds = currentDate.getMilliseconds();

        // Format the date and time
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;

        return formattedDateTime;
    };

    function generateRandomWord(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let randomWord = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }

        return randomWord;
    }

    function generateRandomSentence(wordCount) {
        const words = [];
        for (let i = 0; i < wordCount; i++) {
            const wordLength = Math.floor(Math.random() * 10) + 1
            const randomWord = generateRandomWord(wordLength);
            words.push(randomWord);
        }

        return words.join(' ');
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (

                <View style={styles.headerContainer}>
                    <Button
                        title='Add items'
                        onPress={generateRandomData}
                    >
                    </Button>

                    <TouchableOpacity onPress={() => {
                        Authentication.doAuthentication((error, isSuccess) => {
                            if (error) {
                                console.error(error);
                            } else if (isSuccess) {
                                setisAuthenticated(isSuccess);
                            }
                        })
                    }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="fingerprint" size={25} color="#1877F2" />
                        </View>
                    </TouchableOpacity>
                </View>

            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await getData(); // Use your function to fetch data
                setDataFromDatabase(storedData || null); // Set the data in the component state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, []); // The empty dependency array ensures that this effect runs only once on mount

    // Render each item in the FlatList
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleTransactionPress(item)}>
            <View style={styles.itemContainer}>
                <Text>ID: {item.id}</Text>
                <Text>{item.type} {isAuthenticated ? item.cardNumber : Utils.mask16Digits(item.cardNumber)}</Text>
                <Text>Date time: {item.datetime}</Text>
                <Text>Amount: ${item.amount}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleTransactionPress = (transaction) => {
        // Handle onPress logic here
        console.log('Selected transaction:', transaction);
        navigation.navigate('Details', {
            data: transaction,
            isAuthenticated: isAuthenticated
        });
    };

    return (
        <View style={styles.container}>

            <Text>
                Total transactions: {dataFromDatabase.length == null ? 0 : dataFromDatabase.length}
            </Text>
            {/* <View style={[{ width: "75%", alignItems: 'center' }]}>
                {dataFromDatabase.length == 0 ? (
                    <Text>Empty!</Text>
                ) : null
                }
            </View> */}

            {/* <View style={[{ width: "75%" }]}>
                <Button
                    title='Details'
                    onPress={() => navigation.navigate('Details')}>
                </Button>
            </View> */}

            <FlatList
                style={[{
                    width: "95%",
                    padding: 10,
                }]}
                data={dataFromDatabase}
                renderItem={renderItem}
                keyExtractor={(item, index) => { return item.id }}
            />

            <View style={[{
                width: "75%",
                justifyContent: 'bottom',
                padding: 10
            }]}>
                <Button
                    title='Clear'
                    onPress={createClearAlert}>
                </Button>
            </View>

            <Modal isVisible={isLoading}>
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            </Modal>

            <StatusBar style="auto" />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'top',
        gap: 10
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginEnd: 24
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 0,
        borderRadius: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});