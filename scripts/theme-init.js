try {
  if (localStorage.getItem('nomadauto-theme') === 'light') {
    document.documentElement.classList.add('light-theme');
  }
} catch (error) {

}
