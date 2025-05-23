const token = localStorage.getItem('token');
const container = document.getElementById('menu-container');

if (!token) {
  container.innerHTML = 'Inte inloggad. Gå till login';
} else {
  fetch('http://localhost:3000/api/menu', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${item.title} <small>(${item.category})</small></h3>
          <p>${item.description}</p>
          <p><strong>${item.price} kr</strong></p>
           <button class="delete-btn" data-id="${item._id}">Radera</button>
          <hr />
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = 'Fel vid hämtning av meny';
    });
    const addForm = document.getElementById('addForm');

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
      const res = await fetch('http://localhost:3000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(newItem)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Ny rätt tillagd');
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