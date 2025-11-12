export default class ItemDTO {
    constructor(code, name, price, qty) {
        this._code = code;
        this._name = name;
        this._price = price;
        this._qty = qty;
    }

    get code() { return this._code; }
    get name() { return this._name; }
    get price() { return this._price; }
    get qty() { return this._qty; }

    set code(code) { this._code = code; }
    set name(name) { this._name = name; }
    set price(price) { this._price = price; }
    set qty(qty) { this._qty = qty; }
}