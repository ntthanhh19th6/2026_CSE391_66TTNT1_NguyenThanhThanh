let students = []; 
let filteredStudents = []; 
let sortDirection = 0; // 0: không sắp xếp, 1: tăng dần, -1: giảm dần

const nameInput = document.getElementById('name');
const scoreInput = document.getElementById('score');
const btnAdd = document.getElementById('btnAdd');

const searchInput = document.getElementById('searchInput');
const rankFilter = document.getElementById('rankFilter');
const sortScoreBtn = document.getElementById('sortScore');
const sortIcon = document.getElementById('sortIcon');

const tbody = document.getElementById('studentBody');
const totalCountEl = document.getElementById('totalCount');
const avgScoreEl = document.getElementById('avgScore');

function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const selectedRank = rankFilter.value;

    filteredStudents = students.filter(student => {
        const matchName = student.name.toLowerCase().includes(keyword);
        const matchRank = selectedRank === "All" || getRank(student.score) === selectedRank;
        return matchName && matchRank;
    });

    if (sortDirection !== 0) {
        filteredStudents.sort((a, b) => {
            return sortDirection === 1 ? a.score - b.score : b.score - a.score;
        });
    }

    renderTable();
}

function renderTable() {
    tbody.innerHTML = ''; 
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-result">Không có kết quả</td></tr>';
        totalCountEl.textContent = "0";
        avgScoreEl.textContent = "0.0";
        return;
    }

    let totalScore = 0;

    filteredStudents.forEach((student, index) => {
        const tr = document.createElement('tr');
        if (student.score < 5.0) tr.classList.add('low-score');

        const originalIndex = students.indexOf(student);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.score}</td>
            <td>${getRank(student.score)}</td>
            <td><button class="btn-delete" data-index="${originalIndex}">Xóa</button></td>
        `;
        tbody.appendChild(tr);
        totalScore += student.score;
    });

    totalCountEl.textContent = filteredStudents.length;
    avgScoreEl.textContent = (totalScore / filteredStudents.length).toFixed(2);
}

function addStudent() {
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    if (!name) return alert("Vui lòng nhập họ tên!");
    if (isNaN(score) || score < 0 || score > 10) return alert("Điểm không hợp lệ!");

    students.push({ name, score });
    
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();

    applyFilters(); 
}

// --- GẮN SỰ KIỆN ---
btnAdd.addEventListener('click', addStudent);

scoreInput.addEventListener('keyup', (e) => { 
    if (e.key === 'Enter') addStudent(); 
});

tbody.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-delete')) {
        const index = event.target.getAttribute('data-index');
        students.splice(index, 1);
        applyFilters(); 
    }
});

searchInput.addEventListener('input', applyFilters);
rankFilter.addEventListener('change', applyFilters);

sortScoreBtn.addEventListener('click', function() {
    if (sortDirection === 0 || sortDirection === -1) {
        sortDirection = 1; 
        sortIcon.textContent = "▲";
    } else {
        sortDirection = -1; 
        sortIcon.textContent = "▼";
    }
    applyFilters();
});
