export default class OrderDetailDTO {
    constructor(orderId, itemCode, qty, unitPrice) {
        this._orderId = orderId;
        this._itemCode = itemCode;
        this._qty = qty;
        this._unitPrice = unitPrice;
    }

    get orderId() { return this._orderId; }
    get itemCode() { return this._itemCode; }
    get qty() { return this._qty; }
    get unitPrice() { return this._unitPrice; }
}