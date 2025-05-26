const token = localStorage.getItem('token');
const container = document.getElementById('bookings-container');

if (!token) {
  window.location.href = 'login.html';
} else {
  fetch('https://restaurant-backend-u697.onrender.com/api/bookings', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  .then(async res => {
    if (res.status === 403) {
      alert('Din session har gått ut. Logga in igen.');
      window.location.href = 'login.html';
      return;
    }
    
    const bookings = await res.json();

      if (!Array.isArray(bookings)) {
        container.innerHTML = 'Inga bokningar hittades.';
        return;
      }

      container.innerHTML = '';

      bookings.forEach(b => {
        const div = document.createElement('div');
        div.classList.add('booking-card');
        div.innerHTML = `
          <p><strong>${b.name}</strong> (${b.guests} pers)</p>
          <p>${b.date} kl ${b.time}</p>
          <p>${b.email} – ${b.phone}</p>
          <p><em>${b.message || 'Ingen kommentar'}</em></p>
          <hr />
        `;
        //delete knapp
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Radera';
        deleteBtn.addEventListener('click', async () => {
          const confirmed = confirm('Vill du verkligen ta bort bokningen?');
          if (!confirmed) return;

          try {
            const res = await fetch(`https://restaurant-backend-u697.onrender.com/api/bookings/${b._id}`, {
              method: 'DELETE',
              headers: {
                Authorization: 'Bearer ' + token
              }
            });
            if (res.ok) {
              alert('Bokning borttagen');
              location.reload();
            } else {
              const err = await res.json();
              alert(err.error || 'Fel vid borttagning');
            }
          } catch (err) {
            console.error('Fel vid DELETE:', err);
            alert('Något gick fel');
          }
        });

        div.appendChild(deleteBtn);
        div.appendChild(document.createElement('hr'));
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Fel vid hämtning av bokningar:', err);
      container.innerHTML = 'Kunde inte ladda bokningar.';
    });
}
