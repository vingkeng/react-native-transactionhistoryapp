import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Utils from '../utils/Utils'

const DetailsScreen = ({ route }) => {

    const transaction = route.params?.data || 'No data received';
    const isAuthenticated = route.params?.isAuthenticated || false;

    return (
        <View style={styles.container}>

            <Text style={styles.bigTitle}>
                $ {transaction.amount}
            </Text>

            <Text style={styles.bodyText}>
                ID: {transaction.id}
            </Text>

            <Text style={styles.bodyText}>
                Card Number: {isAuthenticated ? transaction.cardNumber : Utils.mask16Digits(transaction.cardNumber)}
            </Text>

            <Text style={styles.bodyText}>
                Date time: {transaction.datetime}
            </Text>

            <Text style={styles.bodyText}>
                Type: {transaction.type}
            </Text>

            <Text style={styles.bodyText}>
                Description: {transaction.desc}
            </Text>

            <StatusBar style="auto" />
        </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20
    },
    bigTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1877F2'
    },
    bodyText: {
        fontSize: 16,
        color: '#333',
    }
});