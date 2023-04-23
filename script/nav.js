// ------------------------- KIZZ'S CODE -------------------------------
function addScrollingNavbarBehavior(navbarClass) {
    const navbarElements = document.querySelectorAll(navbarClass);
    navbarElements.forEach(function(navlink) {
        window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navlink.classList.add('scrolled');
        } else {
            navlink.classList.remove('scrolled');
        }
        });
    });
}
addScrollingNavbarBehavior('.navLinks');
// ---------------------------------------------------------------------