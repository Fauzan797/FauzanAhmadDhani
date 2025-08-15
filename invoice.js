document.addEventListener('DOMContentLoaded', () => {
    const orderDataJSON = localStorage.getItem('latestOrder');
    if (!orderDataJSON) {
        document.querySelector('.invoice-container').innerHTML = `
            <div style="text-align: center;">
                <h1>Error</h1>
                <p>Data pesanan tidak ditemukan. Silakan kembali ke beranda dan lakukan pemesanan terlebih dahulu.</p>
                <a href="index.html" class="home-button" style="margin-top: 1rem; background-color: #dc3545;">Kembali ke Beranda</a>
            </div>
        `;
        return;
    }

    const orderData = JSON.parse(orderDataJSON);

    document.getElementById('order-number').textContent = orderData.orderNumber;
    document.getElementById('order-date').textContent = new Date(orderData.orderDate).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('customer-name').textContent = orderData.customer.name;
    
    const itemsBody = document.getElementById('invoice-items-body');
    orderData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
            <td>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
        `;
        itemsBody.appendChild(row);
    });

    document.getElementById('service-method').textContent = orderData.customer.serviceMethod;
    document.getElementById('payment-method').textContent = orderData.customer.paymentMethod;
    document.getElementById('invoice-total').textContent = `Rp ${orderData.total.toLocaleString('id-ID')}`;

    const printButton = document.getElementById('print-button');
    printButton.addEventListener('click', () => {
        window.print();
    });
    
    localStorage.removeItem('latestOrder');
});