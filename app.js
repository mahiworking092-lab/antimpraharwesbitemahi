/* ==========================================
   ANTIM PRAHAR™ - CORE APPLICATION JS (v10.0)
   ========================================== */

let currentUser = {
    name: localStorage.getItem("antim_prahar_user_name") || "",
    score: 0
};

let timerInterval = null;
let timerSeconds = 25 * 60;

document.addEventListener("DOMContentLoaded", () => {
    initEmbersCanvas();
    loadLeaderboard();
});

/* Open BRICS Test & Verify Candidate Name */
function startBRICSTest() {
    if (!currentUser.name || currentUser.name.trim() === "") {
        document.getElementById("nameModal").style.display = "flex";
        document.getElementById("candidateNameInput").focus();
    } else {
        redirectToQuiz();
    }
}

/* Save User Name from Modal */
function saveUserName() {
    const input = document.getElementById("candidateNameInput");
    const nameVal = input.value.trim();
    const errorEl = document.getElementById("modalError");

    if (!nameVal || nameVal.length < 2) {
        errorEl.style.display = "block";
        return;
    }

    errorEl.style.display = "none";
    currentUser.name = nameVal;
    localStorage.setItem("antim_prahar_user_name", nameVal);

    document.getElementById("nameModal").style.display = "none";
    
    // Notify Telegram Bot
    sendTestResultToTelegram("BRICS Summit 2026 Special Test", "Registered / Started", 50);
    
    redirectToQuiz();
}

/* Redirect User to Telegram Quiz Bot */
function redirectToQuiz() {
    const targetUrl = `https://t.me/${CONFIG.TELEGRAM_BOT_USERNAME}?start=brics2026`;
    window.open(targetUrl, "_blank");
}

/* Send Result / Registration to Telegram Bot */
function sendTestResultToTelegram(testTitle, score, maxScore) {
    const botToken = CONFIG.TELEGRAM_BOT_TOKEN;
    if (!botToken) return;

    const messageText = `🔥 *ANTIM PRAHAR™ PORTAL ACTIVITY* 🔥\n\n` +
                        `👤 *Candidate:* ${currentUser.name}\n` +
                        `📝 *Test:* ${testTitle}\n` +
                        `📊 *Status/Score:* ${score} / ${maxScore}\n` +
                        `⏰ *Time:* ${new Date().toLocaleTimeString('en-IN')}\n\n` +
                        `🌐 _Live Portal Notification_`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: "@mahiquizbot",
            text: messageText,
            parse_mode: "Markdown"
        })
    }).catch(err => console.log("Telegram notification sent asynchronously."));
}

/* Render Dynamic Leaderboard */
function loadLeaderboard() {
    const tbody = document.getElementById("leaderboardBody");
    if (!tbody) return;

    const dummyLeaderboard = [
        { rank: 4, name: "Priya Das", test: "BRICS Special", score: "44/50" },
        { rank: 5, name: "Amit Kumar", test: "BRICS Special", score: "42/50" },
        { rank: 6, name: "Sneha Roy", test: "BRICS Special", score: "40/50" },
        { rank: 7, name: "Manish Tiwari", test: "BRICS Special", score: "38/50" }
    ];

    if (currentUser.name) {
        dummyLeaderboard.unshift({
            rank: 8,
            name: `${currentUser.name} (You)`,
            test: "BRICS Special",
            score: "Registered"
        });
    }

    tbody.innerHTML = dummyLeaderboard.map(item => `
        <tr>
            <td><strong>#${item.rank}</strong></td>
            <td>${item.name}</td>
            <td>${item.test}</td>
            <td><span class="badge-score">${item.score}</span></td>
        </tr>
    `).join("");
}

/* Pomodoro Timer Functions */
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("⏰ Focus Time Over! Take a 5-minute break.");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const display = document.getElementById("timerDisplay");
    if (display) {
        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

/* Background Embers Canvas Animation */
function initEmbersCanvas() {
    const canvas = document.getElementById("embers-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.2
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230, 35, 20, ${p.opacity})`;
            ctx.fill();
            p.y -= p.speedY;
            if (p.y < 0) p.y = canvas.height;
        });
        requestAnimationFrame(draw);
    }
    draw();
}
