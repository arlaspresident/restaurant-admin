const token = localStorage.getItem('token');
const container = document.getElementById('bookings-container');

if (!token) {
  container.innerHTML = 'Inte inloggad. Gå till login.';
} else {
  fetch('http://localhost:3000/api/bookings', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(bookings => {
      if (!Array.isArray(bookings)) {
        container.innerHTML = 'Inga bokningar hittades.';
        return;
      }

      container.innerHTML = '';

      bookings.forEach(b => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>${b.name}</strong> (${b.guests} pers)</p>
          <p>${b.date} kl ${b.time}</p>
          <p>${b.email} – ${b.phone}</p>
          <p><em>${b.message || 'Ingen kommentar'}</em></p>
          <hr />
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Fel vid hämtning av bokningar:', err);
      container.innerHTML = 'Kunde inte ladda bokningar.';
    });
}
