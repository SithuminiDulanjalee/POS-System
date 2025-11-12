import { item_db } from "../db/db.js";

export const saveItem = (item) => {
    item_db.push(item);
};

export const updateItem = (updatedItem) => {
    const index = item_db.findIndex(item => item.code === updatedItem.code);
    if (index > -1) {
        item_db[index] = updatedItem;
        return true;
    }
    return false;
};

export const deleteItem = (code) => {
    const index = item_db.findIndex(item => item.code === code);
    if (index > -1) {
        item_db.splice(index, 1);
        return true;
    }
    return false;
};

export const getItem = (code) => {
    return item_db.find(item => item.code === code);
};

export const getAllItems = () => {
    return item_db;
};