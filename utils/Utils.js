class Utils {
    static mask16Digits(number) {
        // Check if the input is a valid 16-digit number
        if (!/^\d{16}$/.test(number)) {
            return '';
        }

        // Mask the number, excluding the first and last 4 digits
        const maskedNumber = number.substr(0, 4) + '*'.repeat(8) + number.substr(-4);

        return maskedNumber;
    }
}

export default Utils;