const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://restaurant-backend-u697.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      message.textContent = 'Inloggning lyckades!';
      // gå vidare till adminpanel
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1000);
    } else {
      message.textContent = data.error || 'Inloggning misslyckades';
    }
  } catch (err) {
    message.textContent = 'Fel vid inloggning';
  }
});
