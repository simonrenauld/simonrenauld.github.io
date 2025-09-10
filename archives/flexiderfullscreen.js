document.querySelector('.cookbook').addEventListener('click', function() {
    var flexslider = document.querySelector('.flexslider');
    if (flexslider) {
      flexslider.classList.toggle('fullscreen');
    }
  });