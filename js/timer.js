// 倒计时模块
let timerInterval = null;
let remainingSeconds = 0;
let timerStatus = 'idle'; // idle, running, paused
let bellAudio = null;

// 初始化
function initTimer() {
    // 快捷按钮
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            setDuration(minutes);
        });
    });
    
    // 自定义时长
    document.getElementById('customMinutes').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const minutes = parseInt(e.target.value);
            if (minutes > 0) setDuration(minutes);
        }
    });
    
    document.getElementById('setCustomBtn').addEventListener('click', () => {
        const minutes = parseInt(document.getElementById('customMinutes').value);
        if (minutes > 0) setDuration(minutes);
    });
    
    // 控制按钮
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('stopBellBtn').addEventListener('click', stopBell);
    
    updateDisplay();
}

// 设置时长
function setDuration(minutes) {
    remainingSeconds = minutes * 60;
    timerStatus = 'idle';
    updateDisplay();
    hideTimeUp();
}

// 格式化时间
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 更新显示
function updateDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(remainingSeconds);
    
    // 更新按钮状态
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (timerStatus === 'running') {
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        pauseBtn.textContent = '暂停';
    } else if (timerStatus === 'paused') {
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        pauseBtn.textContent = '继续';
    } else {
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }
}

// 开始倒计时
function startTimer() {
    if (remainingSeconds <= 0) {
        alert('请先设置倒计时时长！');
        return;
    }
    
    timerStatus = 'running';
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateDisplay();
        
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerStatus = 'idle';
            onTimeUp();
        }
    }, 1000);
    
    updateDisplay();
}

// 暂停/继续
function pauseTimer() {
    if (timerStatus === 'running') {
        clearInterval(timerInterval);
        timerStatus = 'paused';
    } else if (timerStatus === 'paused') {
        timerStatus = 'running';
        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateDisplay();
            
            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                timerStatus = 'idle';
                onTimeUp();
            }
        }, 1000);
    }
    updateDisplay();
}

// 重置
function resetTimer() {
    clearInterval(timerInterval);
    remainingSeconds = 0;
    timerStatus = 'idle';
    updateDisplay();
    hideTimeUp();
    stopBell();
}

// 时间到
function onTimeUp() {
    document.getElementById('timerDisplay').classList.add('time-up');
    document.getElementById('timeUpAlert').classList.remove('hidden');
    playBell();
}

// 隐藏时间到提示
function hideTimeUp() {
    document.getElementById('timerDisplay').classList.remove('time-up');
    document.getElementById('timeUpAlert').classList.add('hidden');
}

// 播放铃声
function playBell() {
    try {
        // 尝试使用MP3文件
        bellAudio = new Audio('assets/sounds/上课铃声-铃声.mp3');
        bellAudio.loop = true;
        bellAudio.play().catch(e => {
            console.log('MP3播放失败，使用备用铃声', e);
            playBackupBell();
        });
    } catch (e) {
        console.error('播放铃声失败', e);
        playBackupBell();
    }
}

// 备用铃声（Web Audio API生成）
function playBackupBell() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playTone(freq, startTime, duration) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            osc.start(startTime);
            osc.stop(startTime + duration);
        }
        
        const now = audioCtx.currentTime;
        for (let i = 0; i < 5; i++) {
            playTone(800, now + i * 0.5, 0.3);
            playTone(600, now + i * 0.5 + 0.15, 0.3);
        }
    } catch (e) {
        console.error('备用铃声也失败了', e);
    }
}

// 停止铃声
function stopBell() {
    if (bellAudio) {
        bellAudio.pause();
        bellAudio.currentTime = 0;
        bellAudio = null;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initTimer);
