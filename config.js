// ==========================================
// ANTIM PRAHAR™ - CONFIGURATION FILE
// Aap yahan apne Telegram Links aur Details badal sakte hain
// ==========================================

const APP_CONFIG = {
    // Brand Details
    brandName: "अंतिम प्रहार™",
    tagline: "The Last Phase Of Preparation",
    slogan: "तैयारी आज की, जीत कल की !",
    
    // Telegram Bot & Channel Links (Apne links yahan replace karein)
    telegramBotUsername: "mahiquizbot", // bina @ ke ya pura link
    telegramBotLink: "https://t.me/mahiquizbot",
    telegramGroupLink: "https://t.me/antimprahar_quiz",
    telegramChannelLink: "https://t.me/antimprahar_official",
    adminUsername: "https://t.me/your_admin_username",
    
    // Schedule Timings
    schedules: [
        { time: "08:00 AM", title: "🌅 Daily Current Affairs & News Quiz", subject: "Current Affairs", questions: 25 },
        { time: "12:30 PM", title: "⚡ General Knowledge & GS Mahasangram", subject: "GK / GS", questions: 30 },
        { time: "05:00 PM", title: "📜 Indian History & Polity Special", subject: "History / Polity", questions: 35 },
        { time: "08:30 PM", title: "🔥 Maha Mock Test & Mega Leaderboard", subject: "Full Mock Test", questions: 50 },
        { time: "10:30 PM", title: "🌙 Late Night Rapid Fire Revision", subject: "Mixed Rapid Fire", questions: 20 }
    ],

    // Target Exams
    exams: [
        { name: "UPSC & State PCS", icon: "fa-landmark", desc: "Prelims GS + CSAT Mock Tests" },
        { name: "SSC CGL / CHSL / GD", icon: "fa-bolt", desc: "Speed & Accuracy Booster Quizzes" },
        { name: "Railway NTPC / Group D", icon: "fa-train", desc: "Science & GK Special Series" },
        { name: "UP / Bihar / MP Police", icon: "fa-shield-halved", desc: "Complete Syllabus Practice" },
        { name: "Teaching (CTET / REET)", icon: "fa-graduation-cap", desc: "Pedagogy & Subject Quizzes" },
        { name: "Banking & Insurance", icon: "fa-building-columns", desc: "Reasoning & Quant Time Trials" }
    ]
};
