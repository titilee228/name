// 随机点名模块
let currentClass = null;
let isRolling = false;
let rollInterval = null;

// 初始化页面
function initRollCall() {
    renderClassSelect();
    document.getElementById('rollBtn').addEventListener('click', startRoll);
}

// 渲染班级选择下拉框
function renderClassSelect() {
    const select = document.getElementById('classSelect');
    select.innerHTML = '<option value="">-- 请选择班级 --</option>';
    
    getClasses().forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        currentClass = e.target.value || null;
    });
}

// 开始点名
function startRoll() {
    if (!currentClass) {
        showMessage('请先选择班级！', 'warning');
        return;
    }
    
    if (isRolling) return;
    
    const students = getStudentsByClass(currentClass);
    if (students.length === 0) {
        showMessage('该班级没有学生！', 'warning');
        return;
    }
    
    isRolling = true;
    const nameDisplay = document.getElementById('nameDisplay');
    const avatarDisplay = document.getElementById('avatarDisplay');
    
    // 滚动动画
    let count = 0;
    const maxCount = 20 + Math.floor(Math.random() * 10);
    
    rollInterval = setInterval(() => {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        nameDisplay.textContent = randomStudent.name;
        updateAvatar(randomStudent.gender);
        
        count++;
        if (count >= maxCount) {
            clearInterval(rollInterval);
            isRolling = false;
            // 最终结果
            const finalStudent = students[Math.floor(Math.random() * students.length)];
            nameDisplay.textContent = finalStudent.name;
            updateAvatar(finalStudent.gender);
        }
    }, 80);
}

// 更新头像显示
function updateAvatar(gender) {
    const avatar = document.getElementById('avatarDisplay');
    avatar.className = 'avatar';
    
    if (gender === 'male') {
        avatar.classList.add('avatar-male');
        avatar.textContent = '👦';
    } else if (gender === 'female') {
        avatar.classList.add('avatar-female');
        avatar.textContent = '👧';
    } else {
        avatar.classList.add('avatar-special');
        avatar.textContent = '❓';
    }
}

// 显示消息
function showMessage(msg, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.className = 'alert alert-' + type;
    msgDiv.classList.remove('hidden');
    setTimeout(() => msgDiv.classList.add('hidden'), 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initRollCall);
