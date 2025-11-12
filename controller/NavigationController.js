import { validateUser } from "../model/UserModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems } from "../model/ItemModel.js";
import { getAllOrders }
    from "../model/OrderModel.js";
import { loadCustomerTable } from "./CustomerController.js";
import { loadItemTable } from "./ItemController.js";
import { loadOrderForm, loadOrderHistoryTable } from "./OrderController.js";

const loginPage = $('#login_page');
const mainApp = $('#main_app');
const dashboardContent = $('#dashboard_content');
const customerContent = $('#customer_content');
const itemContent = $('#item_content');
const orderContent = $('#order_content');
const orderHistoryContent = $('#order_history_content');

const pages = [dashboardContent, customerContent, itemContent, orderContent, orderHistoryContent];

const showPage = (pageToShow) => {
    pages.forEach(page => page.hide());
    pageToShow.show();
};

loginPage.show();
mainApp.hide();
$('#login_btn').on('click', () => {
    const username = $('#username').val();
    const password = $('#password').val();

    if (validateUser(username, password)) {

        Swal.fire({
            icon: 'success',
            title: 'Welcome back!',
            html: `Hello <b>${username}</b>. Logging you in...`,
            timer: 3000,
            showConfirmButton: false,

        }).then(() => {
            loginPage.fadeOut(400, () => {
                mainApp.fadeIn(400);
                $('#login_page').remove();
                $('#app').show();
                $('#loggedUser').text(`User: ${username}`);
                showPage(dashboardContent);
                loadDashboardStats();
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid username or password.',
        });
    }
});


$('#logout_btn').on('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out and returned to the login page.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out!'
    }).then((result) => {
        if (result.isConfirmed) {

            Swal.fire({
                icon: 'info',
                title: 'Logging out...',
                text: 'Returning to login page.',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    });
});


$('#nav_dashboard').on('click', () => {
    showPage(dashboardContent);
    loadDashboardStats();
});

$('#nav_customers').on('click', () => {
    showPage(customerContent);
    loadCustomerTable();
});

$('#nav_items').on('click', () => {
    showPage(itemContent);
    loadItemTable();
});

$('#nav_orders').on('click', () => {
    showPage(orderContent);
    loadOrderForm();
});

$('#nav_order_history').on('click', () => {
    showPage(orderHistoryContent);
    loadOrderHistoryTable();
});


const loadDashboardStats = () => {
    $('#total_customers_card').text(getAllCustomers().length);
    $('#total_items_card').text(getAllItems().length);
    $('#total_orders_card').text(getAllOrders().length);
};