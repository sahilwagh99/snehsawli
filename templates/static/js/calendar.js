// calendar.js — Mini Sidebar Calendar + Upcoming Events List

const miniCalGrid = document.getElementById('miniCalGrid');
const miniMonthYear = document.getElementById('miniMonthYear');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const upcomingList = document.getElementById('upcomingList');

let currentDate = new Date();

// ─── Data ───────────────────────────────────────
function getEvents() {
    const raw = localStorage.getItem('ngo_events');
    return raw ? JSON.parse(raw) : [];
}

// Seed sample events on first load
function seedEvents() {
    if (!localStorage.getItem('ngo_events')) {
        const samples = [
            { date: '2026-03-05', title: 'event_scrap_suncity_title', description: 'event_scrap_suncity_desc' },
            { date: '2026-03-08', title: 'event_storytelling_title', description: 'event_storytelling_desc' },
            { date: '2026-03-15', title: 'event_blood_title', description: 'event_blood_desc' },
            { date: '2026-03-22', title: 'event_edu_fund_title', description: 'event_edu_fund_desc' },
            { date: '2026-03-28', title: 'event_scrap_greenpark_title', description: 'event_scrap_greenpark_desc' },
            { date: '2026-04-02', title: 'event_health_checkup_title', description: 'event_health_checkup_desc' },
            { date: '2026-08-20', title: 'event_murti_title', description: 'event_murti_desc' }
        ];
        localStorage.setItem('ngo_events', JSON.stringify(samples));
    }
}

// ─── Render Mini Calendar ───────────────────────
function renderMiniCalendar() {
    miniCalGrid.innerHTML = '';

    const lang = window.currentLang || 'en';
    const dayNames = translations[lang].days_short;
    dayNames.forEach(d => {
        const el = document.createElement('div');
        el.className = 'mini-day-name';
        el.textContent = d;
        miniCalGrid.appendChild(el);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStr = translations[lang].months[month];
    miniMonthYear.textContent = `${monthStr} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const events = getEvents();
    const today = new Date();

    // Previous month padding
    for (let i = firstDay; i > 0; i--) {
        createMiniDay(prevLastDate - i + 1, true, false, [], '');
    }

    // Current month
    for (let d = 1; d <= lastDate; d++) {
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        createMiniDay(d, false, isToday, dayEvents, dateStr);
    }

    // Next month padding (fill to 42 cells = 6 rows)
    const total = firstDay + lastDate;
    const remaining = (total <= 35 ? 35 : 42) - total;
    for (let i = 1; i <= remaining; i++) {
        createMiniDay(i, true, false, [], '');
    }
}

function createMiniDay(num, isOther, isToday, dayEvents, dateStr) {
    const el = document.createElement('div');
    el.className = 'mini-day';
    if (isOther) el.classList.add('other-month');
    if (isToday) el.classList.add('today');
    if (dayEvents.length > 0) el.classList.add('has-event');
    el.textContent = num;

    if (dateStr) {
        el.addEventListener('click', () => showEventModal(dayEvents, dateStr));
    }

    miniCalGrid.appendChild(el);
}

// ─── Upcoming Events List ───────────────────────
function renderUpcoming() {
    upcomingList.innerHTML = '';
    const events = getEvents();
    const todayStr = new Date().toISOString().slice(0, 10);

    const upcoming = events
        .filter(e => e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

    if (upcoming.length === 0) {
        const lang = window.currentLang || 'en';
        upcomingList.innerHTML = `<div class="no-events">${translations[lang].calendar_no_events}</div>`;
        return;
    }

    upcoming.forEach(evt => {
        const d = new Date(evt.date + 'T00:00:00');
        const lang = window.currentLang || 'en';
        const monthShort = translations[lang].months_short[d.getMonth()];
        const dayNum = d.getDate();

        const translatedTitle = translations[lang][evt.title] || evt.title;
        const translatedDesc = translations[lang][evt.description] || evt.description;

        const card = document.createElement('div');
        card.className = 'upcoming-event';
        card.onclick = () => showEventModal([evt], evt.date);
        card.innerHTML = `
            <div class="event-date-badge">
                <span style="font-size:0.6rem;text-transform:uppercase;">${monthShort}</span>
                <span class="day">${dayNum}</span>
            </div>
            <div class="upcoming-event-info">
                <h5>${translatedTitle}</h5>
                <p>${translatedDesc || ''}</p>
            </div>
        `;
        upcomingList.appendChild(card);
    });
}

// ─── Modal ──────────────────────────────────────
function showEventModal(events, dateStr) {
    const modal = document.getElementById('eventModal');
    const titleEl = document.getElementById('modalEventTitle');
    const dateEl = document.getElementById('modalEventDate');
    const descEl = document.getElementById('modalEventDescription');

    const d = new Date(dateStr + 'T00:00:00');
    const lang = window.currentLang || 'en';
    const dayName = translations[lang].days_long[d.getDay()];
    const monthName = translations[lang].months[d.getMonth()];
    const fullDate = `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}`;

    if (events.length > 0) {
        // Show all events for that day
        const firstTitle = translations[lang][events[0].title] || events[0].title;
        titleEl.textContent = events.length === 1 ? firstTitle : `${events.length} ${translations[lang].events_plural}`;
        dateEl.textContent = fullDate;

        if (events.length === 1) {
            descEl.textContent = translations[lang][events[0].description] || events[0].description || 'No additional details.';
        } else {
            descEl.innerHTML = events.map(e => {
                const t = translations[lang][e.title] || e.title;
                const d = translations[lang][e.description] || e.description;
                return `<strong>${t}</strong><br>${d || 'No details.'}`;
            }).join('<br><br>');
        }
    } else {
        titleEl.textContent = translations[lang].modal_no_events;
        dateEl.textContent = fullDate;
        descEl.textContent = translations[lang].modal_no_events_desc;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// ─── Toast ──────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Navigation ─────────────────────────────────
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMiniCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMiniCalendar();
});

// Close modal
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) closeModal();
});

// ─── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    seedEvents();
    renderMiniCalendar();
    renderUpcoming();
});
