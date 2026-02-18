  
   // Toggle Wishlist Modal
function toggleWishlist() {
    const overlay = document.getElementById('wishlistOverlay');
    overlay.classList.toggle('active');
}

// Toggle Filter Modal
function toggleFilter() {
    const overlay = document.getElementById('filterOverlay');
    overlay.classList.toggle('active');
}

// Close modals if background is clicked
window.onclick = function(event) {
    const filter = document.getElementById('filterOverlay');
    const wishlist = document.getElementById('wishlistOverlay');
    if (event.target == filter) filter.classList.remove('active');
    if (event.target == wishlist) wishlist.classList.remove('active');
}