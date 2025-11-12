import { order_db, order_detail_db, item_db } from "../db/db.js";

export const saveOrder = (order, orderDetails) => {
    order_db.push(order);

    for (const detail of orderDetails) {
        order_detail_db.push(detail);

        const item = item_db.find(i => i.code === detail.itemCode);
        if (item) {
            item.qty = item.qty - detail.qty;
        }
    }
    return true;
};

export const getAllOrders = () => {
    return order_db;
};

export const getNextOrderId = () => {
    if (order_db.length === 0) {
        return "O-001";
    }
    const lastOrderId = order_db[order_db.length - 1].orderId;
    const lastIdNum = parseInt(lastOrderId.split("-")[1]);
    const nextIdNum = lastIdNum + 1;
    return `O-${nextIdNum.toString().padStart(3, '0')}`;
};