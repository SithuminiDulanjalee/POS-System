export default class OrderDTO {
    constructor(orderId, date, customerId, total) {
        this._orderId = orderId;
        this._date = date;
        this._customerId = customerId;
        this._total = total;
    }

    get orderId() { return this._orderId; }
    get date() { return this._date; }
    get customerId() { return this._customerId; }
    get total() { return this._total; }
}