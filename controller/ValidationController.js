const custIdRegex = /^C\d{3}$/;
const custNameRegex = /^[A-Za-z\s]{3,}$/;
const custAddressRegex = /^[A-Za-z0-9\s,.-]{3,}$/;
const custContactRegex = /^(?:\+94|0)?7[0-9]{8}$/;

const itemCodeRegex = /^I\d{3}$/;
const itemNameRegex = /^[A-Za-z0-9\s]{2,}$/;
const itemPriceRegex = /^\d+(\.\d{1,2})?$/;
const itemQtyRegex = /^\d+$/;

const showError = (field, feedback, message) => {
    field.addClass('is-invalid').removeClass('is-valid');
    feedback.text(message);
    return false;
};

const showSuccess = (field, feedback) => {
    field.addClass('is-valid').removeClass('is-invalid');
    feedback.text('');
    return true;
};

export const validateCustomer = (id, name, address, contact) => {
    let isValid = true;
    if (!custIdRegex.test(id)) isValid = showError($('#customer_id'), $('#customer_id_feedback'), 'Invalid ID... Format: C001');
    else showSuccess($('#customer_id'), $('#customer_id_feedback'));

    if (!custNameRegex.test(name)) isValid = showError($('#customer_name'), $('#customer_name_feedback'), 'Invalid Name... Min 3 letters.');
    else showSuccess($('#customer_name'), $('#customer_name_feedback'));

    if (!custAddressRegex.test(address)) isValid = showError($('#customer_address'), $('#customer_address_feedback'), 'Invalid Address... Min 3 chars.');
    else showSuccess($('#customer_address'), $('#customer_address_feedback'));

    if (!custContactRegex.test(contact)) isValid = showError($('#customer_contact'), $('#customer_contact_feedback'), 'Invalid Contact... Format: 07xxxxxxxx');
    else showSuccess($('#customer_contact'), $('#customer_contact_feedback'));

    return isValid;
};

export const validateItem = (code, name, price, qty) => {
    let isValid = true;
    if (!itemCodeRegex.test(code)) isValid = showError($('#item_code'), $('#item_code_feedback'), 'Invalid Code... Format: I001');
    else showSuccess($('#item_code'), $('#item_code_feedback'));

    if (!itemNameRegex.test(name)) isValid = showError($('#item_name'), $('#item_name_feedback'), 'Invalid Name... Min 2 chars.');
    else showSuccess($('#item_name'), $('#item_name_feedback'));

    if (!itemPriceRegex.test(price)) isValid = showError($('#item_price'), $('#item_price_feedback'), 'Invalid Price... Format: 150.00');
    else showSuccess($('#item_price'), $('#item_price_feedback'));

    if (!itemQtyRegex.test(qty)) isValid = showError($('#item_qty'), $('#item_qty_feedback'), 'Invalid Qty... Must be a number.');
    else showSuccess($('#item_qty'), $('#item_qty_feedback'));

    return isValid;
};

export const validateOrderQty = (qty, qtyOnHand) => {
    if (!itemQtyRegex.test(qty) || parseInt(qty) <= 0) {
        return showError($('#order_qty'), $('#order_qty_feedback'), 'Invalid Qty...');
    }
    if (parseInt(qty) > parseInt(qtyOnHand)) {
        return showError($('#order_qty'), $('#order_qty_feedback'), 'Not enough stock...');
    }
    return showSuccess($('#order_qty'), $('#order_qty_feedback'));
};

export const clearValidation = (formId) => {
    $(`#${formId} .form-control`).removeClass('is-valid is-invalid');
};