import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const DetailsScreen = ({ route }) => {

    const transaction = route.params?.data || 'No data received';

    return (
        <View style={styles.container}>
            <Text>DetailsScreen</Text>
            <Text>{transaction.id}</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});