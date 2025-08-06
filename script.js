let map = L.map('map').fitWorld();
let marker;



map.on('click', function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lng;

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
});

async function buscarEndereco() {
  const query = document.getElementById('buscaLocal').value;
  if (!query) return;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    const coords = [parseFloat(lat), parseFloat(lon)];
    map.setView(coords, 17);

    if (marker) {
      marker.setLatLng(coords);
    } else {
      marker = L.marker(coords).addTo(map);
    }

    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lon;
  } else {
    alert('Endereço não encontrado.');
  }
}

document.getElementById('denunciaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const categoria = document.getElementById('categoria').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

  if (!latitude || !longitude) {
    return alert("Selecione uma localização no mapa.");
  }

  const res = await fetch('http://localhost:3000/denuncias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descricao, categoria, latitude, longitude })
  });

  if (res.ok) {
    alert("Denúncia enviada com sucesso!");
    location.reload();
  } else {
    const erro = await res.json();
    alert("Erro ao enviar denúncia: " + erro.error);
  }
});
