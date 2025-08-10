let denunciasCache = [];

async function listarDenuncias(){
  try{
    const resposta = await fetch('http://localhost:5000/denuncias');

    if(!resposta.ok){
      throw new Error(`Erro ao buscar denúncias: ${resposta.status}`);
    }

    denunciasCache = await resposta.json();
    renderizarDenuncias(denunciasCache);
  } 
  catch(error){
    console.error(error);
    alert('Erro ao carregar denúncias.');
  }
}

function renderizarDenuncias(lista){
  const container = document.getElementById('lista-denuncias');
  container.innerHTML = '';

  if (lista.length === 0){
    container.innerHTML = '<p class="text-gray-500">Nenhuma denúncia encontrada.</p>';
    return;
  }

  lista.forEach((denuncia) => {
    const div = document.createElement('div');
    div.className = 'p-4 border-b border-gray-200 flex justify-between items-center';

    div.innerHTML = `
      <div>
        <h3 class="font-bold text-lg">${denuncia.titulo}</h3>
        <p class="text-gray-700">${denuncia.descricao}</p>
        <p class="text-gray-700 font-bold">${denuncia.categoria}</p>
      </div>
      <div>
        <button
          class="btn-editar px-2 py-1"
          data-id="${denuncia._id}"
          type="button"
        >
          📝
        </button>
        <button
          class="btn-excluir px-2 py-1"
          data-id="${denuncia._id}"
          type="button"
        >
          🗑️
        </button>
      </div>
    `;

    container.appendChild(div);

    div.querySelector('.btn-editar').addEventListener('click', editarDenuncia);
    div.querySelector('.btn-excluir').addEventListener('click', excluirDenuncia);
  });
}

function filtrarDenuncias(termo){
  const termoNormalizado = termo.toLowerCase();
  const filtradas = denunciasCache.filter(d =>
    d.titulo.toLowerCase().includes(termoNormalizado)
  );
  renderizarDenuncias(filtradas);
}

async function excluirDenuncia(event){
  const id = event.target.dataset.id;

  if(!confirm('Tem certeza que deseja excluir essa denúncia?')) return;

  try{
    const resposta = await fetch(`http://localhost:5000/denuncias/${id}`, {
      method: 'DELETE',
    });

    if(!resposta.ok){
      throw new Error(`Erro ao excluir denúncia: ${resposta.status}`);
    }

    alert('Denúncia excluída com sucesso!');
    listarDenuncias();
  } 
  catch(error){
    console.error(error);
    alert('Erro ao excluir denúncia. Veja o console para mais detalhes.');
  }
}

function editarDenuncia(event) {
  const id = event.target.dataset.id;
  const denuncia = denunciasCache.find(d => d._id === id);

  if (!denuncia) {
    alert('Denúncia não encontrada!');
    return;
  }

  document.getElementById('editar-id').value = denuncia._id;
  document.getElementById('editar-titulo').value = denuncia.titulo;
  document.getElementById('editar-descricao').value = denuncia.descricao;
  document.getElementById('editar-categoria').value = denuncia.categoria;

  document.getElementById('modal-editar').classList.remove('hidden');
}

document.getElementById('form-editar-denuncia').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editar-id').value;
  const titulo = document.getElementById('editar-titulo').value.trim();
  const descricao = document.getElementById('editar-descricao').value.trim();
  const categoria = document.getElementById('editar-categoria').value.trim();

  try{
    const resposta = await fetch(`http://localhost:5000/denuncias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo, descricao, categoria }),
    });

    if(!resposta.ok){
      throw new Error(`Erro ao atualizar denúncia: ${resposta.status}`);
    }

    alert('Denúncia atualizada com sucesso!');
    document.getElementById('modal-editar').classList.add('hidden');

    listarDenuncias();
  } 
  catch(error){
    console.error(error);
    alert('Erro ao atualizar denúncia. Veja o console para mais detalhes.');
  }
});

document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
  document.getElementById('modal-editar').classList.add('hidden');
});

window.onload = () => {
  listarDenuncias();

  document.getElementById('busca-denuncia').addEventListener('input', (e) => {
    filtrarDenuncias(e.target.value);
  });
};
