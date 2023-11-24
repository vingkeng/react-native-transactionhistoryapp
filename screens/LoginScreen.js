import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'
import Authentication from '../utils/Authentication'

const DetailsScreen = ({ navigation }) => {

    // wherever the useState is located 
    const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);
    const [isAuthenticationError, seIstAuthenticationError] = React.useState(false);

    const handleBiometricAuth = async () => {
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (!savedBiometrics)
            return Alert.alert(
                'Biometric record not found',
                'Please verify your identity with your password',
                'OK',
                () => fallBackToDefaultAuth()
            );
    }

    // Check if hardware supports biometrics
    React.useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    });

    return (
        <View style={styles.container}>

            <Text style={styles.text}>
                {isBiometricSupported ? 'Your device is compatible with Biometrics'
                    : 'Face or Fingerprint scanner is available on this device'}
            </Text>

            <View style={[{ width: "75%", margin: 8 }]}>
                <Button
                    title='Login'
                    onPress={() => {
                        Authentication.doAuthentication((error, isSuccess) => {
                            if (error) {
                                seIstAuthenticationError(true)
                            } else if (isSuccess) {
                                navigation.navigate('Home')
                            }
                        })
                    }}
                >
                </Button>
            </View>

            <Text style={styles.text}>
                {isAuthenticationError ? 'Error using Biometrics Authentication'
                    : ''}
            </Text>

            <StatusBar style="auto" />
        </View>
    );
}

export default DetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        padding: 8,
    },
});