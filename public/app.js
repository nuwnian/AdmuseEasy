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
    alert('Please select a mascot!');
    return;
  }
  // Placeholder: Show a simple generated ad
  document.getElementById('result-section').style.display = 'block';
  document.getElementById('ad-layout').innerHTML = `
    <div style='padding:2em;background:#f4f4f4;border-radius:1em;text-align:center;'>
      <h1>${name || 'Product Name'}</h1>
      <h2>${selectedMascot}</h2>
      <p>${description || 'Product description goes here.'}</p>
      <p><em>For: ${audience || 'Target Audience'}</em></p>
      <button style='margin-top:1em;padding:0.5em 2em;font-size:1.2em;'>Buy Now</button>
    </div>
  `;
  document.getElementById('ad-copy').innerHTML = `
    <h3>Copywriting</h3>
    <p><b>Headline:</b> Experience ${name || 'our product'}!</p>
    <p><b>Tagline:</b> Perfect for ${audience || 'everyone'}.</p>
    <p><b>CTA:</b> Buy Now</p>
    <p><b>Blurb:</b> ${description || 'Discover the benefits today!'}</p>
  `;
});
