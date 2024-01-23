function updateContent(name, value) {
  const items = document.querySelectorAll(`[data-info=${name}]`);
  items.forEach(item => (item.textContent = value));
}

async function updateVersionData() {
  try {
    const baseUrl = window.location.pathname.split('/').length === 3 ? '' : '../';
    const data = await fetch(`${baseUrl}version_data.json`);
    const json = await data.json();

    document.querySelector('[data-info=devbuildpath]')?.setAttribute('href', json.devbuildpath);
    updateContent('version', json.version);
    updateContent('version-range', `(${json.min_friefox_version} - ${json.max_friefox_version})`);
  } catch (error) {
    console.log('Error in updateVersionData', error);
  }
}

updateVersionData();
