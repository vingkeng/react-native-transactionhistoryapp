import uuid from 'react-native-uuid';

class Transaction {
    constructor(id, cardNumber, datetime, amount, desc, type) {
        this.id = id
        this.cardNumber = cardNumber
        this.datetime = datetime;
        this.amount = amount;
        this.desc = desc;
        this.type = type;
    }

    // Convert instance to JSON
    toJSON() {
        return JSON.stringify({
            id: this.id,
            cardNumber: this.cardNumber,
            datetime: this.datetime,
            amount: this.amount,
            desc: this.desc,
            type: this.type,
        });
    }

    // Create an instance from JSON
    static fromJSON(json) {
        const parsedData = JSON.parse(json);
        return new Transaction(
            parsedData.id,
            parsedData.cardNumber,
            parsedData.datetime,
            parsedData.amount,
            parsedData.desc,
            parsedData.type);
    }
}

export default Transaction;