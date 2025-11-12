import { getAllCustomers, getCustomer } from "../model/CustomerModel.js";
import { getAllItems, getItem } from "../model/ItemModel.js";
import { getNextOrderId, saveOrder, getAllOrders } from "../model/OrderModel.js";
import OrderDTO from "../dto/OrderDTO.js";
import OrderDetailDTO from "../dto/OrderDetailDTO.js";
import { validateOrderQty, clearValidation } from "./ValidationController.js";

let cart = [];

export const loadOrderForm = () => {
    $('#order_id').val(getNextOrderId());

    const today = new Date().toISOString().split('T')[0];
    $('#order_date').val(today);

    const customers = getAllCustomers();
    $('#order_customer_select').empty().append('<option selected disabled>Select Customer</option>');
    customers.map(c => $('#order_customer_select').append(`<option value="${c.id}">${c.id} - ${c.name}</option>`));

    const items = getAllItems();
    $('#order_item_select').empty().append('<option selected disabled>Select Item</option>');
    items.map(i => $('#order_item_select').append(`<option value="${i.code}">${i.code} - ${i.name}</option>`));

    $('#order_customer_name').val('');
    clearItemSelection();
    cart = [];
    loadCartTable();
    calculateTotals();
};

$('#order_customer_select').on('change', function() {
    const customerId = $(this).val();
    const customer = getCustomer(customerId);
    if (customer) {
        $('#order_customer_name').val(customer.name);
    }
});

$('#order_item_select').on('change', function() {
    const itemCode = $(this).val();
    const item = getItem(itemCode);
    if (item) {
        $('#order_item_name').val(item.name);
        $('#order_item_price').val(item.price.toFixed(2));
        $('#order_item_qty_on_hand').val(item.qty);
        clearValidation('order_content');
    }
});

$('#add_to_cart_btn').on('click', () => {
    const itemCode = $('#order_item_select').val();
    const qtyOnHand = parseInt($('#order_item_qty_on_hand').val());
    const orderQty = parseInt($('#order_qty').val());

    if (!itemCode) {
        Swal.fire('Warning', 'Please select an item.', 'warning');
        return;
    }
    if (!validateOrderQty(orderQty, qtyOnHand)) return;

    const item = getItem(itemCode);
    const total = item.price * orderQty;

    const cartItem = cart.find(i => i.code === itemCode);
    if (cartItem) {
        if (cartItem.qty + orderQty > item.qty) {
            Swal.fire('Error', 'Not enough stock!', 'error');
            return;
        }
        cartItem.qty += orderQty;
        cartItem.total += total;
    } else {
        cart.push({
            code: item.code,
            name: item.name,
            price: item.price,
            qty: orderQty,
            total: total
        });
    }

    loadCartTable();
    calculateTotals();
    clearItemSelection();
});

const loadCartTable = () => {
    $('#cart_tbl_body').empty();
    cart.map((item, index) => {
        let row = `<tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>${item.total.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" data-index="${index}"><i class="bi bi-trash"></i></button></td>
        </tr>`;
        $('#cart_tbl_body').append(row);
    });
};

$('#cart_tbl_body').on('click', '.btn-danger', function() {
    const index = $(this).data('index');
    cart.splice(index, 1);
    loadCartTable();
    calculateTotals();
});

const calculateTotals = () => {
    let grossTotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discountPerc = parseInt($('#order_discount').val()) || 0;
    let discount = (grossTotal * discountPerc) / 100;
    let netTotal = grossTotal - discount;

    $('#net_total_display').text(`Total: ${netTotal.toFixed(2)} LKR`);
};

$('#order_discount').on('input', calculateTotals);

const clearItemSelection = () => {
    $('#order_item_select').val(null);
    $('#order_item_name').val('');
    $('#order_item_price').val('');
    $('#order_item_qty_on_hand').val('');
    $('#order_qty').val('');
    clearValidation('order_content');
};

$('#purchase_btn').on('click', () => {
    const orderId = $('#order_id').val();
    const date = $('#order_date').val();
    const customerId = $('#order_customer_select').val();

    if (!customerId) {
        Swal.fire('Warning', 'Please select a customer.', 'warning');
        return;
    }
    if (cart.length === 0) {
        Swal.fire('Warning', 'Your cart is empty.', 'warning');
        return;
    }

    let grossTotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discountPerc = parseInt($('#order_discount').val()) || 0;
    let netTotal = grossTotal - (grossTotal * discountPerc) / 100;

    const order = new OrderDTO(orderId, date, customerId, netTotal);
    const orderDetails = cart.map(item => new OrderDetailDTO(
        orderId,
        item.code,
        item.qty,
        item.price
    ));

    Swal.fire({
        title: 'Confirm Purchase?',
        text: `Total amount is ${netTotal.toFixed(2)} LKR.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, purchase!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (saveOrder(order, orderDetails)) {
                Swal.fire('Success!', 'Order placed successfully.', 'success');
                loadOrderForm();
            } else {
                Swal.fire('Error', 'Failed to place order.', 'error');
            }
        }
    });
});

export const loadOrderHistoryTable = () => {
    const orders = getAllOrders();
    $('#order_history_tbl_body').empty();

    orders.map(order => {
        let row = `<tr>
            <td>${order.orderId}</td>
            <td>${order.date}</td>
            <td>${order.customerId}</td>
            <td>${order.total.toFixed(2)}</td>
        </tr>`;
        $('#order_history_tbl_body').append(row);
    });
};