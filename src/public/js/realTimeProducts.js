const socket = io.connect();

socket.on('loadProducts', (products) => {

      const productsContainer = document.getElementById('productsContainer');

      productsContainer.innerHTML = "";

      products.forEach((product) => {

            const productCard = document.createElement('div');

            productCard.innerHTML = `
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            `;

            productsContainer.appendChild(productCard);

      });

});