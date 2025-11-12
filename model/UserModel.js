import { user_db } from "../db/db.js";

export const validateUser = (username, password) => {
    const user = user_db.find(u => u.username === username);
    if (user && user.password === password) {
        return true;
    }
    return false;
};
