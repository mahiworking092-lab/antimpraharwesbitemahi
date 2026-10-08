/* ==========================================
   ANTIM PRAHAR™ - MAIN APPLICATION LOGIC (v9.0)
   Dynamic Schedule, Focus Timer & Live Leaderboard
   ========================================== */

let targetQuizUrl = '';
let focusTimerInterval = null;
let focusSecondsLeft = 25 * 60; // 25 minutes
let isFocusRunning = false;

// 1. Initial Mock Data for Daily Timetable
const dailyScheduleData = [
    { time: '08:00 AM', title: 'Daily Current Affairs & News Quiz', cat: 'Current Affairs', ques: 25, isLive: true },
    { time: '12:30 PM', title: 'General Knowledge & GS Mahasangram', cat: 'GK / GS', ques: 30, isLive: false },
    { time: '05:00 PM', title: 'Indian History & Polity Special', cat: 'History / Polity', ques: 35, isLive: false },
    { time: '08:30 PM', title: 'Maha Mock Test & Mega Leaderboard', cat: 'Full Mock Test', ques: 50, isLive: false },
    { time: '10:30 PM', title: 'Late Night Rapid Fire Revision', cat: 'Mixed Rapid Fire', ques: 20, isLive: false }
];

// 2. Initial Target Exams Data
const targetExamsData = [
    { name: 'UPSC Civil Services', icon: 'fa-solid fa-building-columns', sub: 'GS Paper 1 & CSAT' },
    { name: 'SSC CGL / CHSL', icon: 'fa-solid fa-award', sub: 'GK, Math, Reasoning, Eng' },
    { name: 'Railways RRB NTPC', icon: 'fa-solid fa-train', sub: 'Group D & NTPC Special' },
    { name: 'State PCS Exams', icon: 'fa-solid fa-landmark', sub: 'UPPCS, BPSC, MPPSC' },
    { name: 'Police Constable & SI', icon: 'fa-solid fa-shield-halved', sub: 'State Police Mock Tests' },
    { name: 'Banking & Insurance', icon: 'fa-solid fa-wallet', sub: 'IBPS, SBI & LIC Quizzes' }
];

// 3. Name Input Popup Modal Functions
function openNameModal(quizUrl) {
    targetQuizUrl = quizUrl;
    document.getElementById('nameModal').style.display = 'flex';
    document.getElementById('userNameInput').focus();
}

function closeNameModal() {
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('userNameInput').value = '';
}

function confirmAndStartQuiz() {
    const nameInput = document.getElementById('userNameInput').value.trim();
    if (!nameInput) {
        alert('कृपया आगे बढ़ने के लिए अपना नाम दर्ज करें!');
        return;
    }

    // Save user's name
    localStorage.setItem('antim_user_name', nameInput);
    
    // Add User to Live Leaderboard with Score
    addUserToLeaderboard(nameInput);

    closeNameModal();

    // Open Test Series Link
    if (targetQuizUrl) {
        window.open(targetQuizUrl, '_blank');
    }
}

// 4. Dynamic Live Leaderboard System
function addUserToLeaderboard(userName) {
    let leaderboard = JSON.parse(localStorage.getItem('antim_leaderboard_data') || 'null');
    
    // If empty, initialize default top scorers
    if (!leaderboard) {
        leaderboard = [
            { name: 'Pooja Sharma', score: 1000 },
            { name: 'Vikram Rajput', score: 980 },
            { name: 'Amit Kumar', score: 950 },
            { name: 'Sneha Verma', score: 920 },
            { name: 'Rahul Yadav', score: 890 },
            { name: 'Deepak Maurya', score: 870 },
            { name: 'Ananya Pandey', score: 850 }
        ];
    }

    // Add new user entry with score
    const newScore = Math.floor(Math.random() * 80) + 910;
    leaderboard.unshift({ name: userName, score: newScore });

    // Sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);

    // Save back to LocalStorage
    localStorage.setItem('antim_leaderboard_data', JSON.stringify(leaderboard));

    // Refresh UI
    renderLeaderboardUI();
}

function renderLeaderboardUI() {
    let leaderboard = JSON.parse(localStorage.getItem('antim_leaderboard_data') || 'null');
    
    if (!leaderboard) {
        leaderboard = [
            { name: 'Pooja Sharma', score: 1000 },
            { name: 'Vikram Rajput', score: 980 },
            { name: 'Amit Kumar', score: 950 },
            { name: 'Sneha Verma', score: 920 },
            { name: 'Rahul Yadav', score: 890 },
            { name: 'Deepak Maurya', score: 870 },
            { name: 'Ananya Pandey', score: 850 }
        ];
        localStorage.setItem('antim_leaderboard_data', JSON.stringify(leaderboard));
    }

    // Top 3 Podium Render
    if (leaderboard.length >= 3) {
        document.getElementById('podium1Name').innerText = leaderboard[0].name;
        document.getElementById('podium1Pts').innerText = leaderboard[0].score + ' Pts';

        document.getElementById('podium2Name').innerText = leaderboard[1].name;
        document.getElementById('podium2Pts').innerText = leaderboard[1].score + ' Pts';

        document.getElementById('podium3Name').innerText = leaderboard[2].name;
        document.getElementById('podium3Pts').innerText = leaderboard[2].score + ' Pts';
    }

    // Remaining Rank List Render (#4 onwards)
    const listEl = document.getElementById('leaderboardList');
    if (listEl) {
        let html = '';
        leaderboard.slice(3, 10).forEach((user, idx) => {
            html += `
                <li class="leaderboard-item">
                    <div class="lb-left">
                        <span class="lb-rank">#${idx + 4}</span>
                        <span class="lb-user"><i class="fa-solid fa-user-shield" style="color: var(--flame-orange); margin-right: 8px;"></i> ${user.name}</span>
                    </div>
                    <div class="lb-score">${user.score} Pts</div>
                </li>
            `;
        });
        listEl.innerHTML = html;
    }
}

// 5. Render Daily Timetable & Exams
function renderSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    if (!scheduleGrid) return;

    let html = '';
    dailyScheduleData.forEach(item => {
        html += `
            <div class="schedule-card ${item.isLive ? 'active-now' : ''}">
                ${item.isLive ? '<span class="schedule-badge-live"><span class="live-dot"></span> LIVE NOW</span>' : ''}
                <div class="schedule-time"><i class="fa-regular fa-clock"></i> ${item.time}</div>
                <div class="schedule-title">${item.title}</div>
                <div class="schedule-meta">
                    <span>${item.cat}</span>
                    <span>📝 ${item.ques} Ques</span>
                </div>
            </div>
        `;
    });
    scheduleGrid.innerHTML = html;
}

function renderExams() {
    const examsGrid = document.getElementById('examsGrid');
    if (!examsGrid) return;

    let html = '';
    targetExamsData.forEach(item => {
        html += `
            <div class="exam-pill-card">
                <i class="${item.icon} exam-icon"></i>
                <div>
                    <div class="exam-name">${item.name}</div>
                    <div class="exam-sub">${item.sub}</div>
                </div>
            </div>
        `;
    });
    examsGrid.innerHTML = html;
}

// 6. Focus Timer (Pomodoro 25 Mins) Logic
function initFocusTimer() {
    const display = document.getElementById('focusTimerDisplay');
    const startBtn = document.getElementById('startFocusTimerBtn');
    const pauseBtn = document.getElementById('pauseFocusTimerBtn');
    const resetBtn = document.getElementById('resetFocusTimerBtn');

    if (!display || !startBtn) return;

    function updateDisplay() {
        const mins = Math.floor(focusSecondsLeft / 60);
        const secs = focusSecondsLeft % 60;
        display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', () => {
        if (isFocusRunning) return;
        isFocusRunning = true;
        focusTimerInterval = setInterval(() => {
            if (focusSecondsLeft > 0) {
                focusSecondsLeft--;
                updateDisplay();
            } else {
                clearInterval(focusTimerInterval);
                isFocusRunning = false;
                alert('🎉 प्रहार सत्र पूरा हुआ! 5 मिनट का विराम लें।');
            }
        }, 1000);
    });

    pauseBtn.addEventListener('click', () => {
        clearInterval(focusTimerInterval);
        isFocusRunning = false;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(focusTimerInterval);
        isFocusRunning = false;
        focusSecondsLeft = 25 * 60;
        updateDisplay();
    });
}

// Enter Key Press in Modal Input
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('nameModal').style.display === 'flex') {
        confirmAndStartQuiz();
    }
});

// Initial Page Load Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderSchedule();
    renderExams();
    renderLeaderboardUI();
    initFocusTimer();
});
