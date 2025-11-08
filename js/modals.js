// js/modals.js
function setupModalHandlers() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = function () { this.closest('.modal').classList.remove('active'); };
    });

    document.getElementById('cancelFeedback').onclick = () => {
        feedbackModal.classList.remove('active');
    };

    document.getElementById('sendFeedback').onclick = submitFeedback;
    document.getElementById('showStats').onclick = showStats;
    document.getElementById('showHistory').onclick = () => {
        loadHistory();
        historyModal.classList.add('active');
    };
    document.getElementById('showFeedback').onclick = showFeedback;
    document.getElementById('clearHistory').onclick = clearHistory;
    document.getElementById('exportHistory').onclick = exportHistory;

    document.querySelectorAll('.modal').forEach(modal => {
        modal.onclick = function (e) {
            if (e.target === this) this.classList.remove('active');
        };
    });
}

function showStats() {
    loadStats();

    document.getElementById('totalMessages').textContent = chatStats.totalMessages;
    document.getElementById('userMessages').textContent = chatStats.userMessages;
    document.getElementById('aiMessages').textContent = chatStats.aiMessages;
    document.getElementById('charSwitches').textContent = chatStats.charSwitches;

    const avgLength = chatStats.totalMessages > 0 ? Math.round(chatStats.totalChars / chatStats.totalMessages) : 0;
    document.getElementById('avgLength').textContent = avgLength;

    let favCharacter = "-";
    if (chatStats.hutaoUsage > 0) favCharacter = "SatriaCyber";
    document.getElementById('favCharacter').textContent = favCharacter;

    statsModal.classList.add('active');
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (chatHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align:center;padding:20px;color:#f8fafc;opacity:0.7;">Belum ada riwayat chat</div>';
        return;
    }

    chatHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div style="font-size:12px;color:#94a3b8;margin-bottom:5px;">
                ${item.sender === 'user' ? 'Anda' : AIs[item.ai].name} • ${new Date(item.timestamp).toLocaleString()}
            </div>
            <div class="history-preview">${item.message.substring(0, 50)}${item.message.length > 50 ? '...' : ''}</div>
        `;
        historyItem.onclick = () => {
            historyModal.classList.remove('active');
        };
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Yakin ingin menghapus semua riwayat chat?')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        loadHistory();
    }
}

function exportHistory() {
    const data = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function sendFeedbackToTelegram(name, message) {
    const text = `Nama: ${name || 'Tidak disebutkan'}\nFeedback dari: ${currentAI} AI\nPesan: ${message}\n\nBy satria`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Error sending feedback:', error);
        return false;
    }
}

function showFeedback() {
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackMessage').value = '';
    feedbackModal.classList.add('active');
}

async function submitFeedback() {
    const name = document.getElementById('feedbackName').value.trim();
    const message = document.getElementById('feedbackMessage').value.trim();

    if (!message) {
        alert('Tolong tulis pesan feedback terlebih dahulu!');
        return;
    }

    const success = await sendFeedbackToTelegram(name, message);

    if (success) {
        alert('Terima kasih! Feedback-mu sudah terkirim ke Satria 💻');
        feedbackModal.classList.remove('active');
    } else {
        alert('Maaf, gagal mengirim feedback. Coba lagi nanti ya');
    }
}