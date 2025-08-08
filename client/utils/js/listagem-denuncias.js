let map;
let markers = [];

// Inicializa o mapa com a localização do usuário ou padrão
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        map = L.map('map').setView(userLocation, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        carregarDenuncias();
      },
      () => {
        // Fallback para São Paulo se geolocalização falhar
        map = L.map('map').setView([-23.55, -46.63], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        carregarDenuncias();
      }
    );
  } else {
    // Fallback para São Paulo se geolocalização não for suportada
    map = L.map('map').setView([-23.55, -46.63], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    carregarDenuncias();
  }
}

// Carrega as denúncias
async function carregarDenuncias(query = '') {
  // Limpa marcadores anteriores
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const url = query 
    ? `http://localhost:5000/denuncias?q=${encodeURIComponent(query)}`
    : 'http://localhost:5000/denuncias';

  const res = await fetch(url);
  const denuncias = await res.json();

  denuncias.forEach(denuncia => {
    // Ajuste para GeoJSON: coordinates é [long, lat]
    const coords = [
      denuncia.localizacao.coordinates[1], 
      denuncia.localizacao.coordinates[0]
    ];
    
    const marker = L.marker(coords).addTo(map);
    markers.push(marker);
    
    marker.bindPopup(`
      <strong>${denuncia.titulo}</strong><br>
      ${denuncia.descricao}<br>
      <em>${denuncia.categoria}</em><br><br>
      <button onclick="editarDenuncia('${denuncia._id}')" class='text-blue-600 underline'>✏️ Editar</button>
      <button onclick="deletarDenuncia('${denuncia._id}')" class='text-red-600 underline ml-2'>🗑️ Deletar</button>
    `);
  });
}

// Busca denúncias por texto
function buscarDenuncias() {
  const query = document.getElementById('buscaTexto').value;
  carregarDenuncias(query);
}

// Editar denúncia
async function editarDenuncia(id) {
  const res = await fetch(`http://localhost:5000/denuncias/${id}`);
  if (!res.ok) return alert('Denúncia não encontrada.');

  const denuncia = await res.json();

  document.getElementById('editId').value = id;
  document.getElementById('editTitulo').value = denuncia.titulo;
  document.getElementById('editDescricao').value = denuncia.descricao;
  document.getElementById('editCategoria').value = denuncia.categoria;

  document.getElementById('editForm').classList.remove('hidden');
}

// Deletar denúncia
async function deletarDenuncia(id) {
  if (!confirm('Tem certeza que deseja deletar esta denúncia?')) return;

  const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('Denúncia deletada com sucesso!');
    carregarDenuncias();
  } else {
    const error = await res.json();
    alert('Erro ao deletar: ' + (error.message || 'Erro desconhecido'));
  }
}

// Atualizar denúncia
document.getElementById('editForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const titulo = document.getElementById('editTitulo').value;
  const descricao = document.getElementById('editDescricao').value;
  const categoria = document.getElementById('editCategoria').value;

  try {
    const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, categoria })
    });

    if (res.ok) {
      alert('Denúncia atualizada com sucesso!');
      document.getElementById('editForm').classList.add('hidden');
      carregarDenuncias();
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao atualizar');
    }
  } catch (error) {
    alert('Erro ao atualizar denúncia: ' + error.message);
  }
});

// Inicializa o mapa quando a página carrega
window.onload = initMap;