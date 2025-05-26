const token = localStorage.getItem('token');
const container = document.getElementById('menu-container');
const addForm = document.getElementById('addForm');

let editMode = false;
let editingId = null;

if (!token) {
  container.innerHTML = 'Inte inloggad. Gå till login';
} else {
  fetch('https://restaurant-backend-u697.onrender.com/api/menu', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';

      const grouped = data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});

      for (const category in grouped) {
        const section = document.createElement('section');
        const heading = document.createElement('h2');
        heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        section.appendChild(heading);


       grouped[category].forEach(item => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
          <h3>${item.title} <small>(${item.category})</small></h3>
          <p>${item.description}</p>
          <p><strong>${item.price} kr</strong></p>
          <button class="edit-btn" data-id="${item._id}">Redigera</button>
          <button class="delete-btn" data-id="${item._id}">Radera</button>
          <hr />
        `;
        section.appendChild(div);
    });
        container.appendChild(section);
      }

      //delete knapp
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const confirmed = confirm('Är du säker på att du vill ta bort denna rätt?');
      
          if (!confirmed) return;
      
          try {
            const res = await fetch(`https://restaurant-backend-u697.onrender.com/api/menu/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: 'Bearer ' + token
              }
            });
      
            if (res.ok) {
              alert('Rätt borttagen');
              location.reload();
            } else {
              const error = await res.json();
              alert(error.error || 'Fel vid borttagning');
            }
          } catch (err) {
            console.error('Fel vid DELETE:', err);
            alert('Något gick fel');
          }
        });
      });

      //edit knapp
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = data.find(i => i._id === id);

          // Fyll formulär
          document.getElementById('title').value = item.title;
          document.getElementById('description').value = item.description;
          document.getElementById('price').value = item.price;
          document.getElementById('imageUrl').value = item.imageUrl;
          document.getElementById('category').value = item.category;

          document.querySelector('#addForm button').textContent = 'Spara ändringar';
          editMode = true;
          editingId = id;
        });
      });
      
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = 'Fel vid hämtning av meny';
    });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newItem = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: document.getElementById('price').value,
      imageUrl: document.getElementById('imageUrl').value,
      category: document.getElementById('category').value
    };

    try {
        const url = editMode
        ? `https://restaurant-backend-u697.onrender.com/api/menu/${editingId}`
        : `https://restaurant-backend-u697.onrender.com/api/menu/`;

        const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(newItem)
      });

      const data = await res.json();

      if (res.ok) {
        alert(editMode ? 'Rätt uppdaterad' : 'Ny rätt tillagd');
        location.reload();
      } else {
        alert(data.error || 'Fel vid tillägg');
      }
    } catch (err) {
      console.error('Fel vid POST:', err);
      alert('Något gick fel');
    }
  });
}