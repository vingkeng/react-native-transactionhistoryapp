import * as LocalAuthentication from 'expo-local-authentication'

class Authentication {

    static async doAuthentication(callback) {
        await LocalAuthentication.authenticateAsync()
            .then((result) => {
                console.log(result);
                callback(null, result.success)
            })
            .catch((error) => {
                console.error(error);
                callback(error, false)
            });
    }
}

export default Authentication;