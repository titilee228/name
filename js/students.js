// 学生管理模块

// 初始化页面
function initStudents() {
    renderAllClasses();
    setupAddStudentForm();
    setupAddClassForm();
}

// 渲染所有班级和学生
function renderAllClasses() {
    const container = document.getElementById('classesContainer');
    container.innerHTML = '';
    
    const classes = getClasses();
    
    classes.forEach(className => {
        const section = document.createElement('div');
        section.className = 'class-section';
        
        const students = getStudentsByClass(className);
        
        section.innerHTML = `
            <div class="class-header">
                <span class="class-title">${className} (${students.length}人)</span>
                <button class="btn btn-danger" onclick="deleteClass('${className}')" style="padding: 5px 10px; font-size: 12px;">删除班级</button>
            </div>
            <ul class="student-list" id="list-${className.replace(/[^a-zA-Z0-9]/g, '')}">
                ${students.map(s => `
                    <li class="student-item">
                        <span class="student-name">
                            <span class="gender-icon">${s.gender === 'male' ? '👦' : s.gender === 'female' ? '👧' : '❓'}</span>
                            ${s.name}
                        </span>
                        <div>
                            <select class="select" style="font-size: 12px; padding: 4px;" onchange="transferTo('${className}', '${s.name}', this.value)">
                                <option value="">转移到...</option>
                                ${classes.filter(c => c !== className).map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                            <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="deleteStudent('${className}', '${s.name}')">删除</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
        
        container.appendChild(section);
    });
}

// 设置添加学生表单
function setupAddStudentForm() {
    const classSelect = document.getElementById('addStudentClass');
    classSelect.innerHTML = '<option value="">-- 选择班级 --</option>';
    getClasses().forEach(c => {
        classSelect.innerHTML += `<option value="${c}">${c}</option>`;
    });
    
    document.getElementById('addStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const gender = document.getElementById('studentGender').value;
        const className = document.getElementById('addStudentClass').value;
        
        if (!className) {
            showMsg('请选择班级！', 'warning');
            return;
        }
        
        if (addStudent(className, name, gender)) {
            showMsg('添加成功！', 'success');
            document.getElementById('studentName').value = '';
            renderAllClasses();
            setupAddStudentForm();
        } else {
            showMsg('添加失败！', 'danger');
        }
    });
}

// 设置添加班级表单
function setupAddClassForm() {
    document.getElementById('addClassForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('className').value;
        
        if (addClass(name)) {
            showMsg('班级添加成功！', 'success');
            document.getElementById('className').value = '';
            renderAllClasses();
            setupAddStudentForm();
        } else {
            showMsg('班级已存在或名称无效！', 'danger');
        }
    });
}

// 删除学生
function deleteStudent(className, studentName) {
    if (confirm(`确定删除学生 "${studentName}" 吗？`)) {
        if (removeStudent(className, studentName)) {
            showMsg('删除成功！', 'success');
            renderAllClasses();
        }
    }
}

// 删除班级
function deleteClass(className) {
    if (confirm(`确定删除班级 "${className}" 及其所有学生吗？`)) {
        if (removeClass(className)) {
            showMsg('班级删除成功！', 'success');
            renderAllClasses();
            setupAddStudentForm();
        }
    }
}

// 转移学生
function transferTo(fromClass, studentName, toClass) {
    if (!toClass) return;
    if (transferStudent(fromClass, toClass, studentName)) {
        showMsg('转移成功！', 'success');
        renderAllClasses();
    }
}

// 显示消息
function showMsg(msg, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.className = 'alert alert-' + type;
    msgDiv.classList.remove('hidden');
    setTimeout(() => msgDiv.classList.add('hidden'), 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initStudents);
