const catalogEl = document.getElementById('catalog');
const monumentSelect = document.getElementById('monumentId');
const form = document.getElementById('orderForm');
const result = document.getElementById('result');

async function loadMonuments() {
  const response = await fetch('/api/monuments');
  const monuments = await response.json();

  catalogEl.innerHTML = monuments
    .map(
      (m) => `
        <article class="card">
          <img src="${m.image_url}" alt="${m.name}" />
          <div class="card-content">
            <h3>${m.name}</h3>
            <p>Материал: ${m.material}</p>
            <p>Цена: ${Number(m.price).toLocaleString('ru-RU')} ₽</p>
          </div>
        </article>
      `
    )
    .join('');

  monumentSelect.innerHTML =
    '<option value="">Выберите памятник</option>' +
    monuments
      .map((m) => `<option value="${m.id}">${m.name} — ${Number(m.price).toLocaleString('ru-RU')} ₽</option>`)
      .join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  result.textContent = 'Отправка...';

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    monumentId: Number(document.getElementById('monumentId').value),
    comment: document.getElementById('comment').value.trim()
  };

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    result.textContent = data.error || 'Ошибка отправки';
    return;
  }

  result.textContent = `${data.message}. Номер заявки: ${data.orderId}`;
  form.reset();
});

loadMonuments();
