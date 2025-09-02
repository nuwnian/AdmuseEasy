// Mascot card selection and simple animation logic
const mascotCards = document.querySelectorAll('.mascot-card');
let selectedMascot = null;
mascotCards.forEach(card => {
  card.addEventListener('click', () => {
    mascotCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMascot = card.getAttribute('data-mascot');
  });
});

document.getElementById('generate-btn').addEventListener('click', () => {
  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-desc').value;
  const audience = document.getElementById('product-audience').value;
  const format = document.getElementById('output-format').value;
  if (!selectedMascot) {
    document.getElementById('error-message').textContent = 'Please select a mascot!';
    return;
  }
  // Placeholder: Show a simple generated ad
  document.getElementById('result-section').style.display = 'block';
  // Security: Use textContent instead of innerHTML to prevent XSS
  const adLayout = document.getElementById('ad-layout');
  adLayout.innerHTML = '';
  const adDiv = document.createElement('div');
  adDiv.style.cssText = 'padding:2em;background:#f4f4f4;border-radius:1em;text-align:center;';
  
  const h1 = document.createElement('h1');
  h1.textContent = name || 'Product Name';
  const h2 = document.createElement('h2');
  h2.textContent = selectedMascot;
  const p1 = document.createElement('p');
  p1.textContent = description || 'Product description goes here.';
  const p2 = document.createElement('p');
  const em = document.createElement('em');
  em.textContent = `For: ${audience || 'Target Audience'}`;
  p2.appendChild(em);
  const button = document.createElement('button');
  button.textContent = 'Buy Now';
  button.style.cssText = 'margin-top:1em;padding:0.5em 2em;font-size:1.2em;';
  
  adDiv.appendChild(h1);
  adDiv.appendChild(h2);
  adDiv.appendChild(p1);
  adDiv.appendChild(p2);
  adDiv.appendChild(button);
  adLayout.appendChild(adDiv);
  // Security: Use textContent to prevent XSS
  const adCopy = document.getElementById('ad-copy');
  adCopy.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = 'Copywriting';
  const p1 = document.createElement('p');
  p1.innerHTML = '<b>Headline:</b> ';
  p1.appendChild(document.createTextNode(`Experience ${name || 'our product'}!`));
  const p2 = document.createElement('p');
  p2.innerHTML = '<b>Tagline:</b> ';
  p2.appendChild(document.createTextNode(`Perfect for ${audience || 'everyone'}.`));
  const p3 = document.createElement('p');
  p3.innerHTML = '<b>CTA:</b> Buy Now';
  const p4 = document.createElement('p');
  p4.innerHTML = '<b>Blurb:</b> ';
  p4.appendChild(document.createTextNode(description || 'Discover the benefits today!'));
  
  adCopy.appendChild(h3);
  adCopy.appendChild(p1);
  adCopy.appendChild(p2);
  adCopy.appendChild(p3);
  adCopy.appendChild(p4);
});
