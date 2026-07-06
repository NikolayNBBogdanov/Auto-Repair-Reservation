// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadServices();
    loadCustomersForReservation();
    setupEventListeners();
    setMinDate();
});

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Reservation form submission
    document.getElementById('reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitReservation();
    });

    // Customer edit form submission
    document.getElementById('customer-edit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCustomer();
    });

    // Date change - reload available time slots
    document.getElementById('reservation-date').addEventListener('change', () => {
        loadAvailableSlots();
    });

    // Service change - show price
    document.getElementById('service-select').addEventListener('change', (e) => {
        const serviceId = e.target.value;
        if (serviceId) {
            const service = services.find(s => s.id == serviceId);
            if (service) {
                console.log(`Selected: ${service.name} - €${service.price}`);
            }
        }
    });

    // Existing customer selection - auto-fill customer details
    document.getElementById('customer-select').addEventListener('change', (e) => {
        const selectedCustomerId = e.target.value;
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        const emailInput = document.getElementById('customer-email');

        if (!selectedCustomerId) {
            nameInput.disabled = false;
            phoneInput.disabled = false;
            emailInput.disabled = false;
            nameInput.value = '';
            phoneInput.value = '';
            emailInput.value = '';
            return;
        }

        const customer = customers.find(c => c.id == selectedCustomerId);
        if (customer) {
            nameInput.disabled = true;
            phoneInput.disabled = true;
            emailInput.disabled = true;
            nameInput.value = customer.name || '';
            phoneInput.value = customer.phone || '';
            emailInput.value = customer.email || '';
        }
    });
}

// Set minimum date to today and load the initial time slots
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('reservation-date');
    dateInput.setAttribute('min', today);
    dateInput.value = today;
    loadAvailableSlots();
}

// ==================== SECTION NAVIGATION ====================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Mark button as active
    event.target.classList.add('active');

    // Load section-specific data
    if (sectionId === 'reservations') {
        loadReservations();
    } else if (sectionId === 'customers') {
        loadCustomers();
    } else if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'new-reservation') {
        loadServices();
        loadCustomersForReservation();
        const dateInput = document.getElementById('reservation-date');
        if (!dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        loadAvailableSlots();
    }
}

// ==================== DASHBOARD ====================

let services = [];
let customers = [];

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        const stats = await response.json();

        document.getElementById('stat-customers').textContent = stats.total_customers;
        document.getElementById('stat-reservations').textContent = stats.total_reservations;
        document.getElementById('stat-confirmed').textContent = stats.confirmed_reservations;
        document.getElementById('stat-cancelled').textContent = stats.cancelled_reservations;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        services = await response.json();

        // Display services on dashboard
        const servicesList = document.getElementById('services-list');
        servicesList.innerHTML = services.map(service => `
            <div class="service-card">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <div class="service-footer">
                    <span class="price">€${service.price.toFixed(2)}</span>
                    <span class="duration">${service.duration_minutes}min</span>
                </div>
            </div>
        `).join('');

        // Populate service dropdown
        const serviceSelect = document.getElementById('service-select');
        serviceSelect.innerHTML = '<option value="">-- Select a service --</option>' +
            services.map(service => `<option value="${service.id}">${service.name} (€${service.price.toFixed(2)})</option>`).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function loadCustomersForReservation() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        customers = await response.json();

        const customerSelect = document.getElementById('customer-select');
        if (!customerSelect) return;

        customerSelect.innerHTML = '<option value="">-- Add new customer --</option>' +
            customers.map(customer => `
                <option value="${customer.id}">${customer.name} (${customer.phone})</option>
            `).join('');
    } catch (error) {
        console.error('Error loading customers for reservation form:', error);
    }
}

// ==================== RESERVATIONS ====================

async function loadReservations() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`);
        const reservations = await response.json();

        const html = reservations.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td>${r.customer_name}</td>
                            <td>${r.service_name}</td>
                            <td>${r.reservation_date}</td>
                            <td>${r.time_slot}</td>
                            <td><span class="status status-${r.status}">${r.status}</span></td>
                            <td>€${r.service_price.toFixed(2)}</td>
                            <td>
                                <button class="btn-small btn-danger" onclick="cancelReservation(${r.id})">Cancel</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>No reservations found</p>';

        document.getElementById('reservations-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

async function loadAvailableSlots() {
    const dateInput = document.getElementById('reservation-date');
    const date = dateInput.value;

    if (!date) return;

    try {
        const response = await fetch(`${API_BASE_URL}/availability?date=${date}`);
        const data = await response.json();

        const timeSlotSelect = document.getElementById('time-slot');
        timeSlotSelect.innerHTML = '<option value="">-- Select a time slot --</option>' +
            data.available_slots.map(slot => `<option value="${slot}">${slot} Uhr</option>`).join('');

        if (data.available_slots.length === 0) {
            timeSlotSelect.innerHTML += '<option disabled>No free time slots</option>';
        }
    } catch (error) {
        console.error('Error loading available slots:', error);
    }
}

async function submitReservation() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerEmail = document.getElementById('customer-email').value.trim();
    const serviceId = document.getElementById('service-select').value;
    const reservationDate = document.getElementById('reservation-date').value;
    const timeSlot = document.getElementById('time-slot').value;
    const notes = document.getElementById('reservation-notes').value;

    const messageDiv = document.getElementById('form-message');

    try {
        const selectedCustomerId = document.getElementById('customer-select').value;
        let customerId = selectedCustomerId;

        if (!customerId) {
            if (!customerName || !customerPhone) {
                messageDiv.textContent = '✗ Please choose an existing customer or enter a new name and phone.';
                messageDiv.className = 'message error';
                return;
            }

            const customerRes = await fetch(`${API_BASE_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail
                })
            });

            const customer = await customerRes.json();
            customerId = customer.id;
        }

        // Step 2: Create reservation
        const reservationRes = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: customerId,
                service_id: parseInt(serviceId),
                reservation_date: reservationDate,
                time_slot: timeSlot,
                notes: notes
            })
        });

        if (reservationRes.ok) {
            const reservation = await reservationRes.json();
            messageDiv.textContent = `✓ Reservation created successfully! (ID: ${reservation.id})`;
            messageDiv.className = 'message success';
            
            // Reset form
            document.getElementById('reservation-form').reset();
            
            // Reload dashboard
            setTimeout(() => {
                loadDashboard();
                loadReservations();
                showSection('dashboard');
            }, 1500);
        } else {
            const error = await reservationRes.json();
            messageDiv.textContent = `✗ Error: ${error.error}`;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = `✗ Error: ${error.message}`;
        messageDiv.className = 'message error';
        console.error('Error:', error);
    }
}

async function cancelReservation(id) {
    if (!confirm('Do you really want to cancel this reservation?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Reservation cancelled');
            loadReservations();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Error cancelling reservation');
    }
}

// ==================== CUSTOMERS ====================

async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        const customers = await response.json();

        const html = customers.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.name}</td>
                            <td>${c.phone}</td>
                            <td>${c.email || '-'}</td>
                            <td>${new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                            <td>
                                <button class="btn-small" onclick="editCustomer(${c.id})">Edit</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>No customers found</p>';

        document.getElementById('customers-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function editCustomer(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`);
        const customer = await response.json();

        document.getElementById('customer-id').value = customer.id;
        document.getElementById('edit-customer-name').value = customer.name;
        document.getElementById('edit-customer-phone').value = customer.phone;
        document.getElementById('edit-customer-email').value = customer.email || '';
        document.getElementById('customer-form-title').textContent = `Edit Customer #${customer.id}`;
        document.getElementById('customer-form-message').className = 'message';
        document.getElementById('customer-form-message').textContent = '';

        document.getElementById('customers').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error loading customer for edit:', error);
    }
}

function cancelCustomerEdit() {
    document.getElementById('customer-edit-form').reset();
    document.getElementById('customer-id').value = '';
    document.getElementById('customer-form-title').textContent = 'Edit Customer';
    document.getElementById('customer-form-message').className = 'message';
    document.getElementById('customer-form-message').textContent = '';
}

async function saveCustomer() {
    const customerId = document.getElementById('customer-id').value;
    if (!customerId) {
        return;
    }

    const messageDiv = document.getElementById('customer-form-message');
    const payload = {
        name: document.getElementById('edit-customer-name').value,
        phone: document.getElementById('edit-customer-phone').value,
        email: document.getElementById('edit-customer-email').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = 'Customer updated successfully';
            messageDiv.className = 'message success';
            cancelCustomerEdit();
            await loadCustomers();
        } else {
            messageDiv.textContent = result.error || 'Could not update customer';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'Error updating customer';
        messageDiv.className = 'message error';
        console.error('Error updating customer:', error);
    }
}
