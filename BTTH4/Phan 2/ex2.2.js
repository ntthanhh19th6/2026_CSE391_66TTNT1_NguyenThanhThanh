// Bảng giá sản phẩm
const prices = {
    "Tai nghe Tanchjim One DSP": 350000,
    "Màn hình 27-inch 2K 180Hz": 4500000,
    "Router Wifi 6": 850000
};

// Hàm hỗ trợ UI (Giống bài 2.1)
const showError = (fieldId, errorId, message) => {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(errorId);
    if(field) { field.classList.add('is-invalid'); field.classList.remove('is-valid'); }
    if(errorSpan) { errorSpan.textContent = message; errorSpan.style.display = 'block'; }
};

const clearError = (fieldId, errorId) => {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(errorId);
    if(field) { field.classList.remove('is-invalid'); field.classList.add('is-valid'); }
    if(errorSpan) { errorSpan.textContent = ''; errorSpan.style.display = 'none'; }
};

// Tự động tính tổng tiền
const calculateTotal = () => {
    const product = document.getElementById('product').value;
    const qty = parseInt(document.getElementById('quantity').value) || 0;
    const totalSpan = document.getElementById('totalPrice');
    
    if (product && qty > 0) {
        const total = prices[product] * qty;
        totalSpan.textContent = total.toLocaleString("vi-VN") + " ₫";
    } else {
        totalSpan.textContent = "0 ₫";
    }
};

document.getElementById('product').addEventListener('change', calculateTotal);
document.getElementById('quantity').addEventListener('input', calculateTotal);

// Xử lý đếm ký tự Ghi chú
const noteInput = document.getElementById('note');
const charCount = document.getElementById('charCount');
noteInput.addEventListener('input', () => {
    const len = noteInput.value.length;
    charCount.textContent = `${len}/200`;
    if (len > 200) {
        charCount.classList.add('over-limit');
        showError('note', 'noteError', 'Ghi chú không được vượt quá 200 ký tự.');
    } else {
        charCount.classList.remove('over-limit');
        clearError('note', 'noteError');
    }
});

// Các hàm Validate
const validateProduct = () => {
    const val = document.getElementById('product').value;
    if (!val) { showError('product', 'productError', 'Vui lòng chọn một sản phẩm.'); return false; }
    clearError('product', 'productError'); return true;
};

const validateQty = () => {
    const val = parseInt(document.getElementById('quantity').value);
    if (!val || val < 1 || val > 99) { showError('quantity', 'quantityError', 'Số lượng phải từ 1 đến 99.'); return false; }
    clearError('quantity', 'quantityError'); return true;
};

const validateDate = () => {
    const dateStr = document.getElementById('deliveryDate').value;
    if (!dateStr) { showError('deliveryDate', 'deliveryDateError', 'Vui lòng chọn ngày giao hàng.'); return false; }
    
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30); // Tối đa 30 ngày từ hôm nay

    if (selectedDate < today) {
        showError('deliveryDate', 'deliveryDateError', 'Ngày giao hàng không được ở trong quá khứ.'); return false;
    }
    if (selectedDate > maxDate) {
        showError('deliveryDate', 'deliveryDateError', 'Ngày giao hàng không được quá 30 ngày kể từ hôm nay.'); return false;
    }
    
    clearError('deliveryDate', 'deliveryDateError'); return true;
};

const validateAddress = () => {
    const val = document.getElementById('address').value.trim();
    if (val.length < 10) { showError('address', 'addressError', 'Địa chỉ phải có ít nhất 10 ký tự.'); return false; }
    clearError('address', 'addressError'); return true;
};

const validatePayment = () => {
    const payments = document.getElementsByName('payment');
    let isChecked = false;
    for (let p of payments) { if (p.checked) isChecked = true; }
    if (!isChecked) { showError(null, 'paymentError', 'Vui lòng chọn phương thức thanh toán.'); return false; }
    clearError(null, 'paymentError'); return true;
};

// Gắn sự kiện Blur & Input
['product', 'quantity', 'deliveryDate', 'address'].forEach(id => {
    const el = document.getElementById(id);
    const validateFn = eval('validate' + id.charAt(0).toUpperCase() + id.slice(1)); // Gọi hàm validate tương ứng
    
    el.addEventListener('blur', validateFn);
    el.addEventListener('input', () => {
        if (document.getElementById(id + 'Error').style.display === 'block') validateFn();
    });
});
document.getElementsByName('payment').forEach(r => r.addEventListener('change', validatePayment));


// XỬ LÝ SUBMIT VÀ XÁC NHẬN
const orderForm = document.getElementById('orderForm');
const confirmBox = document.getElementById('confirmBox');

orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const v1 = validateProduct(), v2 = validateQty(), v3 = validateDate(), 
          v4 = validateAddress(), v5 = validatePayment();
    const isNoteValid = noteInput.value.length <= 200;

    if (v1 && v2 && v3 && v4 && v5 && isNoteValid) {
        // Form hợp lệ -> Ẩn form, hiện Tóm tắt đơn hàng
        orderForm.style.display = 'none';
        
        // Điền dữ liệu vào bảng tóm tắt
        document.getElementById('sumProduct').textContent = document.getElementById('product').value;
        document.getElementById('sumQty').textContent = document.getElementById('quantity').value;
        document.getElementById('sumDate').textContent = document.getElementById('deliveryDate').value;
        document.getElementById('sumTotal').textContent = document.getElementById('totalPrice').textContent;
        
        confirmBox.style.display = 'block';
    }
});

// Nút Hủy: Quay lại form
document.getElementById('btnCancel').addEventListener('click', () => {
    confirmBox.style.display = 'none';
    orderForm.style.display = 'block';
});

// Nút Xác nhận: Hiển thị thành công
document.getElementById('btnConfirm').addEventListener('click', () => {
    confirmBox.style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
});
