const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const scoreInput = document.getElementById('scoreInput');
const scoreLabel = document.getElementById('scoreLabel');
const previewImg = document.getElementById('previewImg');
const searchBtn = document.getElementById('searchBtn');
const resultsEl = document.getElementById('results');
const seedBtn = document.getElementById('seedBtn');
const categoryFilter = document.getElementById('categoryFilter');
const loadProductsBtn = document.getElementById('loadProductsBtn');

scoreInput.addEventListener('input', () => {
  scoreLabel.textContent = Number(scoreInput.value).toFixed(2);
});

fileInput.addEventListener('change', () => {
  const f = fileInput.files?.[0];
  if (f) {
    const url = URL.createObjectURL(f);
    previewImg.src = url;
  }
});

urlInput.addEventListener('input', () => {
  if (urlInput.value) previewImg.src = urlInput.value;
});

async function uploadImageAndGetUrlAndEmbedding() {
  if (fileInput.files && fileInput.files[0]) {
    const fd = new FormData();
    fd.append('image', fileInput.files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
  if (urlInput.value) {
    const res = await fetch('/api/upload', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageUrl: urlInput.value }) });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
  throw new Error('Provide a file or image URL');
}

function renderResults(items) {
  resultsEl.innerHTML = '';
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}"/>
      <div class="meta">
        <div><strong>${item.name}</strong></div>
        <div>${item.category} · <span class="score">${(item._score ?? item.score ?? 0).toFixed(3)}</span></div>
      </div>
    `;
    resultsEl.appendChild(div);
  }
}

searchBtn.addEventListener('click', async () => {
  searchBtn.disabled = true;
  searchBtn.textContent = 'Searching...';
  try {
    const up = await uploadImageAndGetUrlAndEmbedding();
    const minScore = Number(scoreInput.value);
    const res = await fetch('/api/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageUrl: up.url, minScore, topK: 24 }) });
    const data = await res.json();
    renderResults(data.results || []);
  } catch (e) {
    alert(e.message || 'Search failed');
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search similar';
  }
});

seedBtn?.addEventListener('click', async () => {
  seedBtn.disabled = true;
  seedBtn.textContent = 'Seeding...';
  try {
    const res = await fetch('/api/products/seed', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ count: 50 }) });
    const data = await res.json();
    alert(`Inserted ${data.inserted} products`);
  } catch (e) {
    alert('Seed failed');
  } finally {
    seedBtn.disabled = false;
    seedBtn.textContent = 'Seed 50 demo products';
  }
});

loadProductsBtn?.addEventListener('click', async () => {
  const category = categoryFilter.value || '';
  const url = '/api/products' + (category ? `?category=${encodeURIComponent(category)}` : '');
  const res = await fetch(url);
  const list = await res.json();
  renderResults(list.map(p => ({ ...p, score: 1 })));
});
