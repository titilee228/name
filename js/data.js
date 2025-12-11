// 数据管理模块
const STORAGE_KEY = 'classroom-tools-data';

// 默认学生数据
const DEFAULT_DATA = {
    version: "1.0",
    classes: {
        "Kidsbox4-A班": [
            { name: "Hanson", gender: "male" },
            { name: "Andy", gender: "male" },
            { name: "Justin", gender: "male" },
            { name: "Jackie", gender: "male" },
            { name: "Jenny", gender: "female" },
            { name: "jerry", gender: "male" },
            { name: "random老师指定", gender: "special" }
        ],
        "Kidsbox4-B班": [
            { name: "Hanson", gender: "male" },
            { name: "Rose", gender: "female" },
            { name: "Janice", gender: "female" },
            { name: "Andy", gender: "male" },
            { name: "Jackie", gender: "male" },
            { name: "Jenny", gender: "female" },
            { name: "jerry", gender: "male" },
            { name: "Han", gender: "male" },
            { name: "random老师指定", gender: "special" }
        ],
        "新概念-周五班": [
            { name: "Hanson", gender: "male" },
            { name: "Linda", gender: "female" },
            { name: "Patrick", gender: "male" },
            { name: "Stone", gender: "male" },
            { name: "Allen", gender: "male" },
            { name: "Anthony", gender: "male" },
            { name: "william", gender: "male" },
            { name: "random老师指定", gender: "special" }
        ],
        "KET班": [
            { name: "luna", gender: "female" },
            { name: "seven", gender: "male" },
            { name: "carson", gender: "male" },
            { name: "phoebe", gender: "female" },
            { name: "random老师指定", gender: "special" }
        ]
    }
};

// 当前数据
let appData = null;

// 初始化数据
function initData() {
    loadData();
}

// 从LocalStorage加载数据
function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            appData = JSON.parse(stored);
        } else {
            appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
            saveData();
        }
    } catch (e) {
        console.error('加载数据失败，使用默认数据', e);
        appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData();
    }
}

// 保存数据到LocalStorage
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
        console.error('保存数据失败', e);
    }
}

// 获取所有班级名称
function getClasses() {
    return Object.keys(appData.classes);
}

// 获取指定班级的学生列表
function getStudentsByClass(className) {
    return appData.classes[className] || [];
}

// 添加学生
function addStudent(className, name, gender) {
    if (!appData.classes[className]) return false;
    if (!name || !name.trim()) return false;
    appData.classes[className].push({ name: name.trim(), gender: gender });
    saveData();
    return true;
}

// 删除学生
function removeStudent(className, studentName) {
    if (!appData.classes[className]) return false;
    const index = appData.classes[className].findIndex(s => s.name === studentName);
    if (index === -1) return false;
    appData.classes[className].splice(index, 1);
    saveData();
    return true;
}

// 转移学生
function transferStudent(fromClass, toClass, studentName) {
    if (!appData.classes[fromClass] || !appData.classes[toClass]) return false;
    const index = appData.classes[fromClass].findIndex(s => s.name === studentName);
    if (index === -1) return false;
    const student = appData.classes[fromClass].splice(index, 1)[0];
    appData.classes[toClass].push(student);
    saveData();
    return true;
}

// 添加新班级
function addClass(className) {
    if (!className || !className.trim()) return false;
    if (appData.classes[className.trim()]) return false;
    appData.classes[className.trim()] = [
        { name: "random老师指定", gender: "special" }
    ];
    saveData();
    return true;
}

// 删除班级
function removeClass(className) {
    if (!appData.classes[className]) return false;
    delete appData.classes[className];
    saveData();
    return true;
}

// 重置为默认数据
function resetToDefault() {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
}

// 页面加载时初始化
initData();
