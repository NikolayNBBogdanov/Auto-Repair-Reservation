// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadServices();
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
                console.log(`Ausgewählt: ${service.name} - €${service.price}`);
            }
        }
    });
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservation-date').setAttribute('min', today);
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
    }
}

// ==================== DASHBOARD ====================

let services = [];

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        const stats = await response.json();

        document.getElementById('stat-customers').textContent = stats.total_customers;
        document.getElementById('stat-reservations').textContent = stats.total_reservations;
        document.getElementById('stat-confirmed').textContent = stats.confirmed_reservations;
        document.getElementById('stat-cancelled').textContent = stats.cancelled_reservations;
    } catch (error) {
        console.error('Fehler beim Laden der Statistiken:', error);
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
        serviceSelect.innerHTML = '<option value="">-- Wählen Sie einen Service --</option>' +
            services.map(service => `<option value="${service.id}">${service.name} (€${service.price.toFixed(2)})</option>`).join('');
    } catch (error) {
        console.error('Fehler beim Laden der Services:', error);
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
                        <th>Kunde</th>
                        <th>Service</th>
                        <th>Datum</th>
                        <th>Zeit</th>
                        <th>Status</th>
                        <th>Preis</th>
                        <th>Aktionen</th>
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
                                <button class="btn-small btn-danger" onclick="cancelReservation(${r.id})">Stornieren</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>Keine Reservierungen gefunden</p>';

        document.getElementById('reservations-list').innerHTML = html;
    } catch (error) {
        console.error('Fehler beim Laden der Reservierungen:', error);
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
        timeSlotSelect.innerHTML = '<option value="">-- Wählen Sie einen Zeitslot --</option>' +
            data.available_slots.map(slot => `<option value="${slot}">${slot} Uhr</option>`).join('');

        if (data.available_slots.length === 0) {
            timeSlotSelect.innerHTML += '<option disabled>Keine freien Zeitslots</option>';
        }
    } catch (error) {
        console.error('Fehler beim Laden der verfügbaren Slots:', error);
    }
}

async function submitReservation() {
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const serviceId = document.getElementById('service-select').value;
    const reservationDate = document.getElementById('reservation-date').value;
    const timeSlot = document.getElementById('time-slot').value;
    const notes = document.getElementById('reservation-notes').value;

    const messageDiv = document.getElementById('form-message');

    try {
        // Step 1: Create or get customer
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
        const customerId = customer.id;

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
            messageDiv.textContent = `✓ Reservierung erfolgreich erstellt! (ID: ${reservation.id})`;
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
            messageDiv.textContent = `✗ Fehler: ${error.error}`;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = `✗ Fehler: ${error.message}`;
        messageDiv.className = 'message error';
        console.error('Fehler:', error);
    }
}

async function cancelReservation(id) {
    if (!confirm('Reservierung wirklich stornieren?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Reservierung storniert');
            loadReservations();
            loadDashboard();
        }
    } catch (error) {
        console.error('Fehler beim Stornieren:', error);
        alert('Fehler beim Stornieren');
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
                        <th>Telefon</th>
                        <th>Email</th>
                        <th>Beigetreten</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.name}</td>
                            <td>${c.phone}</td>
                            <td>${c.email || '-'}</td>
                            <td>${new Date(c.created_at).toLocaleDateString('de-DE')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>Keine Kunden gefunden</p>';

        document.getElementById('customers-list').innerHTML = html;
    } catch (error) {
        console.error('Fehler beim Laden der Kunden:', error);
    }
}
