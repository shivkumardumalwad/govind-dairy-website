document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const customerName = e.target[0].value;
  const address = e.target[1].value;
  const city = e.target[2].value;
  const postalCode = e.target[3].value;
  const phoneNumber = e.target[4].value;

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if(cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        address,
        city,
        postalCode,
        phoneNumber,
        items: cart,
        totalPrice
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Order placed successfully! Order ID: ' + data.orderId);
      localStorage.removeItem('cart');
      window.location.href = '../home page/index.html';
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Failed to place order. Please try again later.');
  }
});
