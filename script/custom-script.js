function addAboutScrollingNavbarBehavior(navbarId, brandNameId, iconClass) {
  const navbar = document.getElementById(navbarId);
  const brandName = document.getElementById(brandNameId);
  const accountIcon = document.getElementById(iconClass);
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');

      brandName.classList.remove('d-none');
      brandName.classList.add('d-block');

      accountIcon.classList.remove('text-primary');
      accountIcon.classList.add('text-white');
    } else {
      navbar.classList.remove('scrolled');

      brandName.classList.remove('d-block');
      brandName.classList.add('d-none');

    
      accountIcon.classList.remove('text-white');
      accountIcon.classList.add('text-primary');
    }
  });
}
addAboutScrollingNavbarBehavior('mainNavAbout', 'brandName', 'accountIcon');


