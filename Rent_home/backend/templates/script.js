  // 1. Modal Toggle
function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.toggle('active');
}
// 2. Side Panel Toggle
function toggleSidePanel() {
    document.getElementById('sidePanel').classList.toggle('active');
    document.getElementById('sidePanelOverlay').classList.toggle('active');
}
// 3. Price Slider Logic
const slider = document.getElementById('priceRange');
const priceVal = document.getElementById('priceNum');
if (slider) {
    slider.oninput = function() {
  priceVal.innerText = this.value;
    }
}

// 4. Open Property Details (The "Small Page")
function openProperty(title, price, address, type, amenities, contact, imgSrc) {
    document.getElementById('detailTitle').innerText = title;
    document.getElementById('detailPrice').innerText = price;
    document.getElementById('detailAddress').innerText = address;
    document.getElementById('detailType').innerText = type;
    document.getElementById('detailAmenities').innerText = amenities;
    document.getElementById('detailContact').innerText = contact;
    document.getElementById('detailImg').src = imgSrc;
    toggleModal('propertyModal');
}

// 5. Close on Outside Click
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
    if (event.target.id === 'sidePanelOverlay') {
        toggleSidePanel();
    }
}; 