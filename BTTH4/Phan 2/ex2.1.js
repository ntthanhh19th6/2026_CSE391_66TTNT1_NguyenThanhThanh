// Các hàm hỗ trợ hiển thị/xóa lỗi
const showError = (fieldId, errorId, message) => {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(errorId);
    if(field) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
};

const clearError = (fieldId, errorId) => {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(errorId);
    if(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
};

// Các hàm Validate từng trường
const validateFullname = () => {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!val) { showError('fullname', 'fullnameError', 'Họ tên không được để trống.'); return false; }
    if (val.length < 3) { showError('fullname', 'fullnameError', 'Họ tên phải từ 3 ký tự trở lên.'); return false; }
    if (!regex.test(val)) { showError('fullname', 'fullnameError', 'Họ tên chỉ được chứa chữ cái và khoảng trắng.'); return false; }
    clearError('fullname', 'fullnameError'); return true;
};

const validateEmail = () => {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError('email', 'emailError', 'Email không được để trống.'); return false; }
    if (!regex.test(val)) { showError('email', 'emailError', 'Email sai định dạng.'); return false; }
    clearError('email', 'emailError'); return true;
};

const validatePhone = () => {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0[0-9]{9}$/;
    if (!val) { showError('phone', 'phoneError', 'Số điện thoại không được để trống.'); return false; }
    if (!regex.test(val)) { showError('phone', 'phoneError', 'SĐT phải có 10 số và bắt đầu bằng số 0.'); return false; }
    clearError('phone', 'phoneError'); return true;
};

const validatePassword = () => {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!val) { showError('password', 'passwordError', 'Mật khẩu không được để trống.'); return false; }
    if (!regex.test(val)) { showError('password', 'passwordError', 'Mật khẩu ≥ 8 ký tự, gồm chữ hoa, chữ thường và số.'); return false; }
    clearError('password', 'passwordError'); return true;
};

const validateConfirmPassword = () => {
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    if (!confirmPass) { showError('confirmPassword', 'confirmPasswordError', 'Vui lòng xác nhận mật khẩu.'); return false; }
    if (pass !== confirmPass) { showError('confirmPassword', 'confirmPasswordError', 'Mật khẩu không khớp.'); return false; }
    clearError('confirmPassword', 'confirmPasswordError'); return true;
};

const validateGender = () => {
    const genders = document.getElementsByName('gender');
    let isChecked = false;
    for (let i = 0; i < genders.length; i++) { if (genders[i].checked) isChecked = true; }
    if (!isChecked) { showError(null, 'genderError', 'Vui lòng chọn giới tính.'); return false; }
    clearError(null, 'genderError'); return true;
};

const validateTerms = () => {
    const terms = document.getElementById('terms');
    if (!terms.checked) { showError(null, 'termsError', 'Bạn phải đồng ý với điều khoản.'); return false; }
    clearError(null, 'termsError'); return true;
};

// Gắn sự kiện BLUR (khi rời ô) và INPUT (khi gõ)
const setupEventListeners = (id, validateFn) => {
    const el = document.getElementById(id);
    el.addEventListener('blur', validateFn);
    el.addEventListener('input', () => {
        // Xóa lỗi ngay khi người dùng bắt đầu nhập lại
        const errorSpan = document.getElementById(id + 'Error');
        if (errorSpan.style.display === 'block') { validateFn(); }
    });
};

setupEventListeners('fullname', validateFullname);
setupEventListeners('email', validateEmail);
setupEventListeners('phone', validatePhone);
setupEventListeners('password', validatePassword);
setupEventListeners('confirmPassword', validateConfirmPassword);

// Riêng radio và checkbox dùng change
document.getElementsByName('gender').forEach(radio => radio.addEventListener('change', validateGender));
document.getElementById('terms').addEventListener('change', validateTerms);

// Xử lý khi SUBMIT form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Chặn hành vi tải lại trang mặc định

    const isValid1 = validateFullname();
    const isValid2 = validateEmail();
    const isValid3 = validatePhone();
    const isValid4 = validatePassword();
    const isValid5 = validateConfirmPassword();
    const isValid6 = validateGender();
    const isValid7 = validateTerms();

    if (isValid1 && isValid2 && isValid3 && isValid4 && isValid5 && isValid6 && isValid7) {
        this.style.display = 'none';
        const successDiv = document.getElementById('successMessage');
        const name = document.getElementById('fullname').value;
        successDiv.textContent = `Đăng ký thành công! 🎉 Chào mừng, ${name}.`;
        successDiv.style.display = 'block';
    }
});
