let currentTab = 0; // Tab đầu tiên là 0 (Bước 1)
const tabs = document.getElementsByClassName("tab");
showTab(currentTab);

// Hàm hiển thị tab hiện tại và cập nhật UI
function showTab(n) {
    tabs[n].style.display = "block";
    
    // Cập nhật nút Quay lại (ẩn ở bước 1)
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    
    // Cập nhật nút Tiếp theo / Xác nhận
    if (n === (tabs.length - 1)) {
        document.getElementById("nextBtn").textContent = "Xác nhận & Gửi";
        document.getElementById("nextBtn").classList.add("btn-success"); // Đổi màu thành xanh lá nếu muốn
    } else {
        document.getElementById("nextBtn").textContent = "Tiếp theo";
        document.getElementById("nextBtn").classList.remove("btn-success");
    }
    
    // Cập nhật thanh tiến trình (Progress Bar)
    const stepNum = n + 1;
    const totalSteps = tabs.length;
    document.getElementById("stepIndicator").textContent = `Bước ${stepNum} / ${totalSteps}`;
    document.getElementById("progressBar").style.width = `${(stepNum / totalSteps) * 100}%`;
}

// Xử lý sự kiện click nút Tiếp theo / Quay lại
document.getElementById("nextBtn").addEventListener("click", () => nextPrev(1));
document.getElementById("prevBtn").addEventListener("click", () => nextPrev(-1));

function nextPrev(n) {
    // NẾU ĐI TỚI (n = 1), PHẢI VALIDATE TAB HIỆN TẠI TRƯỚC
    if (n === 1 && !validateCurrentTab()) return false;
    
    // Ẩn tab hiện tại
    tabs[currentTab].style.display = "none";
    
    // Tăng/giảm currentTab
    currentTab = currentTab + n;
    
    // NẾU ĐÃ ĐẾN CUỐI CÙNG (SUBMIT)
    if (currentTab >= tabs.length) {
        document.getElementById("multiForm").style.display = "none";
        document.getElementById("successMessage").style.display = "block";
        document.querySelector(".progress-wrapper").style.display = "none";
        document.getElementById("stepIndicator").style.display = "none";
        return false;
    }
    
    // NẾU CHUYỂN SANG BƯỚC 3: Điền dữ liệu tổng hợp
    if (currentTab === 2) {
        populateSummary();
    }
    
    // Hiển thị tab mới
    showTab(currentTab);
}

// Lấy dữ liệu từ Bước 1 & 2 nhét vào Bước 3
function populateSummary() {
    document.getElementById("sum_name").textContent = document.getElementById("ms_fullname").value;
    
    // Định dạng lại ngày sinh cho đẹp (từ YYYY-MM-DD sang DD/MM/YYYY)
    const rawDate = document.getElementById("ms_dob").value;
    if(rawDate) {
        const d = new Date(rawDate);
        document.getElementById("sum_dob").textContent = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    }
    
    document.getElementById("sum_gender").textContent = document.getElementById("ms_gender").value;
    document.getElementById("sum_email").textContent = document.getElementById("ms_email").value;
}

// HÀM VALIDATE CHỈ CHO TAB HIỆN TẠI
function validateCurrentTab() {
    let isValid = true;
    
    if (currentTab === 0) {
        // Validate Bước 1
        const name = document.getElementById("ms_fullname");
        const dob = document.getElementById("ms_dob");
        const gender = document.getElementById("ms_gender");
        
        if (name.value.trim().length < 3) {
            showErr(name, "err_ms_fullname", "Vui lòng nhập họ tên (≥ 3 ký tự).");
            isValid = false;
        } else { clearErr(name, "err_ms_fullname"); }
        
        if (!dob.value) {
            showErr(dob, "err_ms_dob", "Vui lòng chọn ngày sinh.");
            isValid = false;
        } else { clearErr(dob, "err_ms_dob"); }
        
        if (!gender.value) {
            showErr(gender, "err_ms_gender", "Vui lòng chọn giới tính.");
            isValid = false;
        } else { clearErr(gender, "err_ms_gender"); }
        
    } else if (currentTab === 1) {
        // Validate Bước 2
        const email = document.getElementById("ms_email");
        const pass = document.getElementById("ms_password");
        const confirm = document.getElementById("ms_confirm");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email.value)) {
            showErr(email, "err_ms_email", "Email không hợp lệ.");
            isValid = false;
        } else { clearErr(email, "err_ms_email"); }
        
        if (pass.value.length < 8) {
            showErr(pass, "err_ms_password", "Mật khẩu phải từ 8 ký tự trở lên.");
            isValid = false;
        } else { clearErr(pass, "err_ms_password"); }
        
        if (!confirm.value || confirm.value !== pass.value) {
            showErr(confirm, "err_ms_confirm", "Mật khẩu xác nhận không khớp.");
            isValid = false;
        } else { clearErr(confirm, "err_ms_confirm"); }
    }
    
    return isValid; // Nếu true thì nextPrev() mới cho đi tiếp
}

// Hàm hỗ trợ UI (rút gọn)
function showErr(inputEl, errId, msg) {
    inputEl.classList.add("is-invalid");
    document.getElementById(errId).textContent = msg;
}
function clearErr(inputEl, errId) {
    inputEl.classList.remove("is-invalid");
    document.getElementById(errId).textContent = "";
}

// Bắt sự kiện input để xóa lỗi khi người dùng gõ lại
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        const errSpan = this.nextElementSibling;
        if(errSpan && errSpan.classList.contains('error')) errSpan.textContent = '';
    });
});
