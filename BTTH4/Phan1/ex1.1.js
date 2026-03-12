// Mảng lưu trữ danh sách sinh viên
let students = [];

// Lấy các phần tử DOM
const nameInput = document.getElementById('name');
const scoreInput = document.getElementById('score');
const btnAdd = document.getElementById('btnAdd');
const tbody = document.getElementById('studentBody');
const totalCountEl = document.getElementById('totalCount');
const avgScoreEl = document.getElementById('avgScore');

// Hàm tính xếp loại
function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

// Hàm vẽ lại bảng và cập nhật thống kê
function renderTable() {
    tbody.innerHTML = ''; // Xóa nội dung cũ
    let totalScore = 0;

    students.forEach((student, index) => {
        const tr = document.createElement('tr');
        
        // Kích hoạt class tô vàng nếu điểm dưới 5.0
        if (student.score < 5.0) {
            tr.classList.add('low-score');
        }

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.score}</td>
            <td>${getRank(student.score)}</td>
            <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
        `;
        tbody.appendChild(tr);
        totalScore += student.score;
    });

    // Cập nhật thống kê
    totalCountEl.textContent = students.length;
    avgScoreEl.textContent = students.length > 0 ? (totalScore / students.length).toFixed(2) : "0.0";
}

// Hàm thêm sinh viên
function addStudent() {
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    // Validate dữ liệu
    if (!name) {
        alert("Vui lòng nhập họ tên!");
        return;
    }
    if (isNaN(score) || score < 0 || score > 10) {
        alert("Điểm không hợp lệ! Vui lòng nhập số từ 0 đến 10.");
        return;
    }

    // Thêm vào mảng và render lại
    students.push({ name, score });
    renderTable();

    // Reset ô nhập và đưa con trỏ về ô họ tên
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

// Sự kiện click nút Thêm
btnAdd.addEventListener('click', addStudent);

// Sự kiện nhấn Enter ở ô Điểm
scoreInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addStudent();
    }
});

// EVENT DELEGATION: Xử lý sự kiện Xóa
// Thay vì gắn event cho từng nút Xóa, ta gắn cho thẻ <tbody> cha
tbody.addEventListener('click', function(event) {
    // Kiểm tra xem phần tử bị click có class 'btn-delete' không
    if (event.target.classList.contains('btn-delete')) {
        // Lấy index từ thuộc tính data-index
        const index = event.target.getAttribute('data-index');
        
        // Xóa phần tử khỏi mảng và render lại bảng
        students.splice(index, 1);
        renderTable();
    }
});
