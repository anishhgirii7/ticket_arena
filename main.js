const API = 'https://ticket-arena-backend-production.up.railway.app';

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

async function logout() {
  try {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {}
  sessionStorage.removeItem('user');
  window.location.href = 'index.html';
}

function updateNav() {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;
  const user = getStoredUser();
  if (user) {
    navButtons.innerHTML = `
      <span style="color:var(--muted);font-size:13px;">Hi, ${user.full_name || user.name || 'Guest'}</span>
      <a href="dashboard.html" class="btn-outline">My Tickets</a>
      <button class="btn-primary" onclick="logout()">Logout</button>
    `;
  }
}

function requireLogin() {
  const user = getStoredUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function formatEventDate(date) {
  return new Date(date).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function searchEvents() {
  const query = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
  const sport = document.getElementById('sportFilter') ? document.getElementById('sportFilter').value : '';
  window.location.href = `events.html?search=${encodeURIComponent(query)}&sport=${encodeURIComponent(sport)}`;
}

// Legacy support for old booking save
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('ticketArenaBookings') || '[]');
  } catch {
    return [];
  }
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem('ticketArenaBookings', JSON.stringify(bookings));
}

window.addEventListener('DOMContentLoaded', () => {
  updateNav();

  // Protect booking and dashboard pages
  const page = window.location.pathname;
  if (page.includes('booking.html') || page.includes('dashboard.html')) {
    requireLogin();
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') searchEvents();
    });
  }
});