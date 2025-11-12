import CustomerDTO from "../dto/CustomerDTO.js";
import { saveCustomer, updateCustomer, deleteCustomer, getCustomer, getAllCustomers } from "../model/CustomerModel.js";
import { validateCustomer, clearValidation } from "./ValidationController.js";

const generateCustomerId = () => {
    const customers = getAllCustomers();
    if (customers.length === 0) return "C001";

    const lastId = customers[customers.length - 1].id;
    const numericPart = parseInt(lastId.replace("C", ""), 10);
    const nextId = numericPart + 1;

    return `C${nextId.toString().padStart(3, "0")}`;
};

const setNextCustomerId = () => {
    const nextId = generateCustomerId();
    $('#customer_id').val(nextId);
    $('#customer_id').prop('readonly', true);
};

export const loadCustomerTable = () => {
    const customers = getAllCustomers();
    $('#customer_tbl_body').empty();

    customers.map(customer => {
        let row = `<tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.contact}</td>
        </tr>`;
        $('#customer_tbl_body').append(row);
    });
};

$('#customer_save_btn').on('click', () => {
    const id = $('#customer_id').val();
    const name = $('#customer_name').val();
    const address = $('#customer_address').val();
    const contact = $('#customer_contact').val();

    if (!validateCustomer(id, name, address, contact)) return;

    if (getCustomer(id)) {
        Swal.fire('Error', 'Customer ID already exists!', 'error');
        return;
    }

    const customer = new CustomerDTO(id, name, address, contact);
    saveCustomer(customer);

    Swal.fire('Saved!', 'Customer has been saved.', 'success');
    loadCustomerTable();
    $('#customer_form')[0].reset();
    clearValidation('customer_form');
    setNextCustomerId();
});

$('#customer_tbl_body').on('click', 'tr', function() {
    const id = $(this).children().eq(0).text();
    const customer = getCustomer(id);

    if (customer) {
        $('#customer_id').val(customer.id);
        $('#customer_name').val(customer.name);
        $('#customer_address').val(customer.address);
        $('#customer_contact').val(customer.contact);
        $('#customer_id').prop('readonly', true);
        clearValidation('customer_form');
    }
});

$('#customer_update_btn').on('click', () => {
    const id = $('#customer_id').val();
    const name = $('#customer_name').val();
    const address = $('#customer_address').val();
    const contact = $('#customer_contact').val();

    if (!validateCustomer(id, name, address, contact)) return;

    const customer = new CustomerDTO(id, name, address, contact);

    if (updateCustomer(customer)) {
        Swal.fire('Updated!', 'Customer details have been updated.', 'success');
        loadCustomerTable();
        $('#customer_form')[0].reset();
        clearValidation('customer_form');
        setNextCustomerId();
    } else {
        Swal.fire('Error', 'Customer not found.', 'error');
    }
});

$('#customer_delete_btn').on('click', () => {
    const id = $('#customer_id').val();

    if (!getCustomer(id)) {
        Swal.fire('Error', 'Please select a customer to delete.', 'warning');
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteCustomer(id);
            Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
            loadCustomerTable();
            $('#customer_form')[0].reset();
            clearValidation('customer_form');
            setNextCustomerId();
        }
    });
});

$('#customer_clear_btn').on('click', () => {
    $('#customer_form')[0].reset();
    clearValidation('customer_form');
    setNextCustomerId();
});

loadCustomerTable();
setNextCustomerId();
