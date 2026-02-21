  // ============================================
// PROPERTY DATA
// ============================================
const properties = [
    {
        id: 1,
        title: "Cozy Studio Apartment",
        price: 15000,
        address: "123 Blue Valley, Mumbai",
        city: "Mumbai",
        type: "1 BHK",
        amenities: ["Fully Furnished", "WiFi", "AC"],
        contact: "9876543210",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        rating: 4.5,
        reviews: 28,
        available: true
    },
    {
        id: 2,
        title: "Modern Family Suite",
        price: 35000,
        address: "45 Green Park, Delhi",
        city: "Delhi",
        type: "2 BHK",
        amenities: ["Gym", "Parking", "24/7 Security"],
        contact: "9123456789",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        rating: 4.8,
        reviews: 42,
        available: true
    },
    {
        id: 3,
        title: "Premium Luxury Room",
        price: 28000,
        address: "789 Silicon Valley, Bangalore",
        city: "Bangalore",
        type: "2 BHK",
        amenities: ["WiFi", "AC", "Parking", "Gym"],
        contact: "8765432109",
        image: "https://images.unsplash.com/photo-1512576661531-b34081773eb9?w=800",
        rating: 4.7,
        reviews: 35,
        available: true
    },
    {
        id: 4,
        title: "Spacious Penthouse",
        price: 50000,
        address: "12 Marine Drive, Mumbai",
        city: "Mumbai",
        type: "3 BHK",
        amenities: ["Fully Furnished", "Gym", "Parking", "24/7 Security", "WiFi", "AC"],
        contact: "9988776655",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        rating: 4.9,
        reviews: 56,
        available: true
    },
    {
        id: 5,
        title: "Budget Friendly Studio",
        price: 10000,
        address: "34 MG Road, Delhi",
        city: "Delhi",
        type: "1 BHK",
        amenities: ["WiFi", "Shared Kitchen"],
        contact: "9876543211",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        rating: 4.2,
        reviews: 18,
        available: true
    },
    {
        id: 6,
        title: "Eco-Friendly Home",
        price: 22000,
        address: "56 Indiranagar, Bangalore",
        city: "Bangalore",
        type: "1 BHK",
        amenities: ["Solar Panel", "Garden", "WiFi"],
        contact: "9123456790",
        image: "https://images.unsplash.com/photo-1512576661531-b34081773eb9?w=800",
        rating: 4.6,
        reviews: 31,
        available: true
    }
];

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentView = 'grid';
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProperties = [...properties];
let currentSortBy = 'newest';
let displayedCount = 2;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderProperties();
    updateWishlistCount();
    setupPriceSlider();
    restoreWishlistState();
}

// ============================================
// PROPERTY RENDERING
// ============================================
function renderProperties() {
    const grid = document.getElementById('propertyGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredProperties.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    const propertiesToDisplay = filteredProperties.slice(0, displayedCount);
    
    grid.innerHTML = propertiesToDisplay.map(property => `
        <div class="room-card" onclick="openProperty(${property.id})">
            <div class="img-container">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-tag">${property.type}</div>
                <button class="wishlist-btn ${wishlist.includes(property.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(event, ${property.id})" title="Add to wishlist">
                    <i class="fa${wishlist.includes(property.id) ? 's' : 'r'} fa-heart"></i>
                </button>
            </div>
            <div class="room-info">
                <h3>${property.title}</h3>
                <p class="price">₹${property.price.toLocaleString()}/mo</p>
                <p class="address">
                    <i class="fas fa-map-marker-alt"></i> ${property.address.split(',')[1] || property.city}
                </p>
                <div class="rating-footer">
                    <div class="rating-info">
                        <span class="star"><i class="fas fa-star"></i></span>
                        <span class="rating-text">${property.rating} (${property.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    updateResultsCount();
    
    // Hide/Show load more button
    const loadMoreBtn = document.getElementById('loadMoreContainer');
    if (displayedCount < filteredProperties.length) {
        loadMoreBtn.style.display = 'flex';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================
function toggleWishlist(event, propertyId) {
    event.stopPropagation();
    const index = wishlist.indexOf(propertyId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(propertyId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderProperties();
    updateWishlistModal();
}

function toggleWishlistFromDetail() {
    const currentProperty = filteredProperties[0];
    if (currentProperty) {
        const propertyId = currentProperty.id;
        toggleWishlist({ stopPropagation: () => {} }, propertyId);
        updateDetailWishlistButton(propertyId);
    }
}

function updateDetailWishlistButton(propertyId) {
    const btn = document.getElementById('detailWishlistBtn');
    if (btn) {
        if (wishlist.includes(propertyId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

function updateWishlistCount() {
    const badge = document.getElementById('wishlist-count');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

function updateWishlistModal() {
    const wishlistBody = document.getElementById('wishlistBody');
    
    if (wishlist.length === 0) {
        wishlistBody.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="far fa-heart" style="font-size: 3rem; color: #eee;"></i>
                <p style="margin-top: 10px; color: #888;">Your wishlist is empty.</p>
            </div>
        `;
        return;
    }
    
    const wishlistItems = wishlist.map(id => {
        const prop = properties.find(p => p.id === id);
        if (!prop) return '';
        return `
            <div class="wishlist-item">
                <img src="${prop.image}" alt="${prop.title}" class="wishlist-img">
                <div class="wishlist-info">
                    <h4>${prop.title}</h4>
                    <p>${prop.address}</p>
                    <p class="wishlist-price">₹${prop.price.toLocaleString()}/mo</p>
                </div>
                <button class="remove-btn" onclick="toggleWishlist({stopPropagation: () => {}}, ${prop.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    wishlistBody.innerHTML = wishlistItems;
}

function restoreWishlistState() {
    wishlist.forEach(id => {
        const btn = document.querySelector(`.wishlist-btn[onclick*="${id}"]`);
        if (btn) {
            btn.classList.add('active');
        }
    });
}

// ============================================
// PROPERTY DETAILS
// ============================================
function openProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    document.getElementById('detailTitle').innerText = property.title;
    document.getElementById('detailPrice').innerText = `₹${property.price.toLocaleString()}`;
    document.getElementById('detailAddress').innerText = property.address;
    document.getElementById('detailType').innerText = property.type;
    document.getElementById('detailContact').innerText = property.contact;
    document.getElementById('detailRating').innerText = property.rating;
    document.getElementById('detailReviews').innerText = `(${property.reviews} reviews)`;
    document.getElementById('detailImg').src = property.image;
    
    const amenitiesStr = property.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('');
    document.getElementById('detailAmenities').innerHTML = amenitiesStr;
    
    updateDetailWishlistButton(propertyId);
    toggleModal('propertyModal');
}

// ============================================
// FILTERING & SORTING
// ============================================
function applyFilters() {
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const cities = Array.from(document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]:checked')).map(x => x.value);
    const types = Array.from(document.querySelectorAll('.filter-section:nth-child(3) input[type="checkbox"]:checked')).map(x => x.value);
    const amenities = Array.from(document.querySelectorAll('.filter-section:nth-child(4) input[type="checkbox"]:checked')).map(x => x.value);
    
    filteredProperties = properties.filter(prop => {
        const priceMatch = prop.price <= priceRange;
        const cityMatch = cities.length === 0 || cities.includes(prop.city);
        const typeMatch = types.length === 0 || types.includes(prop.type);
        const amenityMatch = amenities.length === 0 || amenities.some(a => prop.amenities.includes(a));
        
        return priceMatch && cityMatch && typeMatch && amenityMatch;
    });
    
    displayedCount = 2;
    sortProperties(currentSortBy);
}

function clearFilters() {
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('priceRange').value = 5000;
    document.getElementById('priceNum').innerText = '5000';
    filteredProperties = [...properties];
    displayedCount = 2;
    renderProperties();
}

function sortProperties(sortBy) {
    currentSortBy = sortBy;
    
    switch(sortBy) {
        case 'price-low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProperties.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            filteredProperties.sort((a, b) => b.id - a.id);
    }
    
    displayedCount = 2;
    renderProperties();
}

function updatePriceFilter() {
    const slider = document.getElementById('priceRange');
    document.getElementById('priceNum').innerText = slider.value;
}

function setupPriceSlider() {
    const slider = document.getElementById('priceRange');
    if (slider) {
        slider.addEventListener('input', updatePriceFilter);
    }
}

function updateResultsCount() {
    const count = document.getElementById('results-count');
    if (count) {
        count.innerHTML = `Showing <strong>${Math.min(displayedCount, filteredProperties.length)}</strong> of <strong>${filteredProperties.length}</strong> properties`;
    }
}

function loadMoreProperties() {
    displayedCount += 3;
    renderProperties();
    
    // Smooth scroll
    document.querySelector('.property-grid').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// VIEW TOGGLE
// ============================================
function toggleView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    const grid = document.getElementById('propertyGrid');
    if (view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    }
}

// ============================================
// SORT MENU
// ============================================
function toggleSortMenu() {
    const menu = document.getElementById('sortMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close sort menu when clicking outside
document.addEventListener('click', function(event) {
    const sortMenu = document.getElementById('sortMenu');
    const sortBtn = document.querySelector('.sort-btn');
    if (sortMenu && sortBtn && !sortBtn.contains(event.target) && !sortMenu.contains(event.target)) {
        sortMenu.classList.remove('active');
    }
});

// ============================================
// MODAL FUNCTIONS
// ============================================
function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
    if (event.target.id === 'sidePanelOverlay') {
        toggleSidePanel();
    }
};

// ============================================
// SIDE PANEL
// ============================================
function toggleSidePanel() {
    const panel = document.getElementById('sidePanel');
    const overlay = document.getElementById('sidePanelOverlay');
    if (panel) panel.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// ============================================
// CONTACT FUNCTIONS
// ============================================
function makeCall() {
    const contact = document.getElementById('detailContact').innerText;
    alert(`Calling ${contact}...\n\nNote: In a real app, this would integrate with a phone service.`);
}

function openMessage() {
    const contact = document.getElementById('detailContact').innerText;
    alert(`Opening message to ${contact}...\n\nNote: In a real app, this would open a messaging interface.`);
}

function openEmail() {
    const contact = document.getElementById('detailContact').innerText;
    alert(`Opening email client...\n\nNote: In a real app, this would open an email form.`);
}

function bookVisit() {
    const title = document.getElementById('detailTitle').innerText;
    alert(`Visit booking for "${title}" initiated!\n\nNote: In a real app, this would show a date/time picker.`);
    toggleModal('propertyModal');
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function handleSearch() {
    const city = document.getElementById('city-select').value;
    const locality = document.getElementById('loc-input').value;
    
    filteredProperties = properties.filter(prop => {
        const cityMatch = city === 'Select City' || prop.city === city;
        const localityMatch = locality === '' || prop.address.toLowerCase().includes(locality.toLowerCase());
        return cityMatch && localityMatch;
    });
    
    displayedCount = 2;
    renderProperties();
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-main-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
});

// ============================================
// WISHLIST MODAL TRIGGER
// ============================================
const wishlistTrigger = document.querySelector('.wishlist-trigger');
if (wishlistTrigger) {
    wishlistTrigger.addEventListener('click', function() {
        updateWishlistModal();
        toggleModal('wishlistOverlay');
    });
} 