let map = L.map('map').setView([-23.55, -46.63], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Carrega as denúncias
async function carregarDenuncias() {
  const res = await fetch('http://localhost:3000/denuncias');
  const denuncias = await res.json();

  denuncias.forEach(denuncia => {
    const marker = L.marker([denuncia.latitude, denuncia.longitude]).addTo(map);
    marker.bindPopup(`
      <strong>${denuncia.titulo}</strong><br>
      ${denuncia.descricao}<br>
      <em>${denuncia.categoria}</em><br><br>
      <button onclick="editar(${denuncia.id})" class='text-blue-600 underline'>✏️ Editar</button>
      <button onclick="deletar(${denuncia.id})" class='text-red-600 underline ml-2'>🗑️ Deletar</button>
    `);
  });
}

async function editar(id) {
  const res = await fetch(`http://localhost:3000/denuncias`);
  const denuncias = await res.json();
  const denuncia = denuncias.find(d => d.id === id);

  if (!denuncia) return alert('Denúncia não encontrada.');

  document.getElementById('editId').value = id;
  document.getElementById('editTitulo').value = denuncia.titulo;
  document.getElementById('editDescricao').value = denuncia.descricao;
  document.getElementById('editCategoria').value = denuncia.categoria;

  document.getElementById('editForm').classList.remove('hidden');
}

async function deletar(id) {
  if (!confirm('Tem certeza que deseja deletar?')) return;

  const res = await fetch(`http://localhost:3000/denuncias/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('Denúncia deletada.');
    location.reload();
  } else {
    alert('Erro ao deletar.');
  }
}

document.getElementById('editForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const titulo = document.getElementById('editTitulo').value;
  const descricao = document.getElementById('editDescricao').value;
  const categoria = document.getElementById('editCategoria').value;

  const resGet = await fetch(`http://localhost:3000/denuncias`);
  const denuncias = await resGet.json();
  const original = denuncias.find(d => d.id === parseInt(id));

  const res = await fetch(`http://localhost:3000/denuncias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo,
      descricao,
      categoria,
      longitude: original.longitude,
      latitude: original.latitude
    })
  });

  if (res.ok) {
    alert('Denúncia atualizada!');
    location.reload();
  } else {
    alert('Erro ao atualizar.');
  }
});

carregarDenuncias();
