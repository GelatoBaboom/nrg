fetch('/results')
  .then(r => r.json())
  .then(data => {
    const tbody = document.getElementById('results');
    data.forEach(r => {
      const tr = document.createElement('tr');
      const city = document.createElement('td');
      city.textContent = r.name;
      const energy = document.createElement('td');
      energy.textContent = `${r.energy.toFixed(2)} MW`;
      tr.appendChild(city);
      tr.appendChild(energy);
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error(err));
