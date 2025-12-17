import { addItem } from './cart.js';

function initPreOrderForm() {
  const form = document.getElementById('preOrderForm');
  if (!form || form.dataset.bound) return;

  form.dataset.bound = 'true';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    
    const item = {
      id: Date.now().toString(),
      product: form.dataset.productTitle,
      options: {
        ...values,
        addOns: data.getAll('addOns'),
      }
    };
    addItem(item);
    alert('Item added to cart!');

    document.getElementById('preOrderDetail')?.removeAttribute('open');
  });
}

document.addEventListener('astro:page-load', initPreOrderForm);



