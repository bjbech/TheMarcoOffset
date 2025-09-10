let deviceData = {};
let conversionRates = {};
let currentCountry = 'USA';

async function loadData() {
    try {
        const [deviceResponse, conversionResponse] = await Promise.all([
            fetch('data/devices.json'),
            fetch('data/conversionRate.json')
        ]);
        
        deviceData = await deviceResponse.json();
        conversionRates = await conversionResponse.json();
        
        initializeTable();
        updateCurrency();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function initializeTable() {
    const tableBody = document.getElementById('deviceTableBody');
    const countryData = deviceData[currentCountry];
    
    if (!countryData) return;
    
    tableBody.innerHTML = '';
    
    Object.entries(countryData.devices).forEach(([deviceName, price]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${deviceName}</td>
            <td class="device-price">${countryData.symbol}${price.toFixed(2)}</td>
            <td><input type="number" class="quantity-input" id="${deviceName.replace(/\s+/g, '_')}" min="0" value="0" onchange="updateTotals()"></td>
            <td class="device-total">${countryData.symbol}<span id="${deviceName.replace(/\s+/g, '_')}_total">0.00</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateCurrency() {
    const countryData = deviceData[currentCountry];
    if (!countryData) return;
    
    document.getElementById('currencySymbol').textContent = countryData.symbol;
}

function updateTotals() {
    const countryData = deviceData[currentCountry];
    if (!countryData) return;
    
    let totalBase = 0;
    
    Object.entries(countryData.devices).forEach(([deviceName, price]) => {
        const inputId = deviceName.replace(/\s+/g, '_');
        const quantity = parseInt(document.getElementById(inputId)?.value || 0);
        const subtotal = quantity * price;
        
        const subtotalElement = document.getElementById(`${inputId}_total`);
        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2);
        }
        
        totalBase += subtotal;
    });
    
    document.getElementById('totalBasePrice').textContent = totalBase.toFixed(2);
}

function calculateOffset() {
    const countryData = deviceData[currentCountry];
    if (!countryData) return;
    
    let totalBase = 0;
    
    Object.entries(countryData.devices).forEach(([deviceName, price]) => {
        const inputId = deviceName.replace(/\s+/g, '_');
        const quantity = parseInt(document.getElementById(inputId)?.value || 0);
        totalBase += quantity * price;
    });
    
    const purchaseTotal = parseFloat(document.getElementById('purchaseTotal').value) || 0;
    const monthlyAppleCare = parseFloat(document.getElementById('monthlyAppleCare').value) || 0;
    
    const totalPurchase = purchaseTotal + (monthlyAppleCare * 12);
    let offset = totalPurchase - totalBase;
    
    offset = offset < 0 ? 0 : offset;
    
    const formatter = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    
    // Calculate USD value for donation
    const conversionRate = conversionRates[currentCountry] || 1;
    const offsetUSD = offset * conversionRate;
    
    // Update display
    document.getElementById('offsetAmountUSD').textContent = formatter.format(offsetUSD);
    
    // Show local currency in parentheses if not USA
    const localCurrencyDisplay = document.getElementById('localCurrencyDisplay');
    if (currentCountry !== 'USA') {
        localCurrencyDisplay.textContent = `(${countryData.symbol}${formatter.format(offset)})`;
        localCurrencyDisplay.style.fontWeight = 'normal';
    } else {
        localCurrencyDisplay.textContent = '';
    }
    
    // Update donation link with USD value
    const baseUrl = "https://donate.tiltify.com/@bbech/the-marco-offset";
    const updatedUrl = baseUrl + "?amount=" + offsetUSD.toFixed(2);
    document.getElementById("donationLink").href = updatedUrl;
}

// Event listener for country change
document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    countrySelect.addEventListener('change', function() {
        currentCountry = this.value;
        initializeTable();
        updateCurrency();
        updateTotals();
    });
    
    // Load data on page load
    loadData();
});