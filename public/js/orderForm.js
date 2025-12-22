    import { clearCart, updateCartResumen, getCart } from '/js/cart.js';

    export function initConfirmOrderForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); 

      const formData = new FormData(form);
      const name = formData.get('name');
      const phone = formData.get('phone');

      const emailText = jsonToEmailText();

      const subject = encodeURIComponent(`${name} - New Order`);
      console.log(emailText);
      const body = encodeURIComponent(`G'day, My name is ${name}.\nMy phone number is ${phone}.\n I would like to order a cake... \n\n${emailText}`);

      window.location.href = `mailto:earthmamaskitchen@gmail.com?subject=${subject}&body=${body}`;
    });
    }

    function jsonToEmailText() {
      let text = "ORDER DETAILS\n------------------------\n\n";

        const data = getCart();
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            Object.entries(value).forEach(([subKey, subValue]) => {
                if(subKey === 'options' && typeof subValue === 'object' ) {
                    text += `${subKey}:\n`;
                    Object.entries(subValue).forEach(([optionKey, optionValue]) => {
                        if(optionValue.length > 0) {
                            text += `  - ${optionKey}: ${optionValue}\n`;

                        }   
                    });
                } else if (subKey !== 'id') {
                    text += `${subKey}: ${subValue}\n`;
                }
            });
          }
                  text += `\n------------------------\n`;

        });
      return text;
    }

   

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#clearBtn')
      if (!btn) return
      clearCart()
    })

    document.addEventListener('astro:page-load', () => {
        if (!document.querySelector('#cart-resumen')) return;
        updateCartResumen();
        initConfirmOrderForm();
    });

    window.addEventListener('cart:update', () => updateCartResumen());

    