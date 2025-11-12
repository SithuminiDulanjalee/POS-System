import { customer_db } from "../db/db.js";

export const saveCustomer = (customer) => {
    customer_db.push(customer);
};

export const updateCustomer = (updatedCustomer) => {
    const index = customer_db.findIndex(customer => customer.id === updatedCustomer.id);
    if (index > -1) {
        customer_db[index] = updatedCustomer;
        return true;
    }
    return false;
};

export const deleteCustomer = (id) => {
    const index = customer_db.findIndex(customer => customer.id === id);
    if (index > -1) {
        customer_db.splice(index, 1);
        return true;
    }
    return false;
};

export const getCustomer = (id) => {
    return customer_db.find(customer => customer.id === id);
};

export const getAllCustomers = () => {
    return customer_db;
};