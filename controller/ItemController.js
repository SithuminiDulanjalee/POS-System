import ItemDTO from "../dto/ItemDTO.js";
import { saveItem, updateItem, deleteItem, getItem, getAllItems } from "../model/ItemModel.js";
import { validateItem, clearValidation } from "./ValidationController.js";

const generateItemCode = () => {
    const items = getAllItems();
    if (items.length === 0) return "I001";

    const lastCode = items[items.length - 1].code;
    const numericPart = parseInt(lastCode.replace("I", ""), 10);
    const nextCode = numericPart + 1;

    return `I${nextCode.toString().padStart(3, "0")}`;
};

const setNextItemCode = () => {
    const nextCode = generateItemCode();
    $('#item_code').val(nextCode);
    $('#item_code').prop('readonly', true);
};

export const loadItemTable = () => {
    const items = getAllItems();
    $('#item_tbl_body').empty();

    items.map(item => {
        let row = `<tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
        </tr>`;
        $('#item_tbl_body').append(row);
    });
};

$('#item_save_btn').on('click', () => {
    const code = $('#item_code').val();
    const name = $('#item_name').val();
    const price = $('#item_price').val();
    const qty = $('#item_qty').val();

    if (!validateItem(code, name, price, qty)) return;

    if (getItem(code)) {
        Swal.fire('Error', 'Item Code already exists!', 'error');
        return;
    }

    const item = new ItemDTO(code, name, parseFloat(price), parseInt(qty));
    saveItem(item);

    Swal.fire('Saved!', 'Item has been saved.', 'success');
    loadItemTable();
    $('#item_form')[0].reset();
    clearValidation('item_form');
    setNextItemCode();
});

$('#item_tbl_body').on('click', 'tr', function() {
    const code = $(this).children().eq(0).text();
    const item = getItem(code);

    if (item) {
        $('#item_code').val(item.code);
        $('#item_name').val(item.name);
        $('#item_price').val(item.price.toFixed(2));
        $('#item_qty').val(item.qty);
        $('#item_code').prop('readonly', true);
        clearValidation('item_form');
    }
});

$('#item_update_btn').on('click', () => {
    const code = $('#item_code').val();
    const name = $('#item_name').val();
    const price = $('#item_price').val();
    const qty = $('#item_qty').val();

    if (!validateItem(code, name, price, qty)) return;

    const item = new ItemDTO(code, name, parseFloat(price), parseInt(qty));

    if (updateItem(item)) {
        Swal.fire('Updated!', 'Item details have been updated.', 'success');
        loadItemTable();
        $('#item_form')[0].reset();
        clearValidation('item_form');
        setNextItemCode();
    } else {
        Swal.fire('Error', 'Item not found.', 'error');
    }
});

$('#item_delete_btn').on('click', () => {
    const code = $('#item_code').val();

    if (!getItem(code)) {
        Swal.fire('Error', 'Please select an item to delete.', 'warning');
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
            deleteItem(code);
            Swal.fire('Deleted!', 'Item has been deleted.', 'success');
            loadItemTable();
            $('#item_form')[0].reset();
            clearValidation('item_form');
            setNextItemCode();
        }
    });
});

$('#item_clear_btn').on('click', () => {
    $('#item_form')[0].reset();
    clearValidation('item_form');
    setNextItemCode();
});

loadItemTable();
setNextItemCode();
