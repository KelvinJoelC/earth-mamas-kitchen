export function initPreOrderForm() {
  console.log('Initializing Pre-Order Form');
  const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); 

      const formData = new FormData(form);
      const name = formData.get('name');
      const phone = formData.get('phone');

      const subject = encodeURIComponent(`${name} - New Order`);
      const body = encodeURIComponent(`G'day, My name is ${name}.\nMi phone number is ${phone}.\n I would like to order a cake...`);

      window.location.href = `mailto:earthmamaskitchen@gmail.com?subject=${subject}&body=${body}`;
    });
}


