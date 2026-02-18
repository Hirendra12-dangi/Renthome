  // Function to update the price number live as you slide
const rangeInput = document.getElementById('priceRange');
const priceText = document.getElementById('priceNum');

if (rangeInput) {
    rangeInput.addEventListener('input', function() {
        priceText.innerText = this.value;
    });
}

// Function to open and close any modal
function toggleModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.classList.toggle('active');
    }
}

// Close the modal if the user clicks anywhere on the dark background
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
});



function toggleSidePanel() {
    const panel = document.getElementById('sidePanel');
    const overlay = document.getElementById('sidePanelOverlay');
    
    // Toggle the 'active' class to slide the panel in or out
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Update your existing window.onclick to close the side panel too
window.addEventListener('click', function(event) {
    const panel = document.getElementById('sidePanel');
    const overlay = document.getElementById('sidePanelOverlay');
    
    if (event.target === overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }
});