fetch(`/allHouseData.json`)
  .then(response => response.json())
  .then(data => {

    const tileContainer = document.getElementById('tile-grid');
    tileContainer.innerHTML = data.map(house =>
      `<a href="${house.url}">
          <div class="tile-card">
            <img src="${house.imageURL}" alt="House Image" />
            <h3 class="title">${house.name}</h3>

            <p class="summary">${house.description}</p>
          </div>
        </a>`
    ).join('');

})
  .catch(error => console.error('Error fetching articles from /en/insights/articles.json:', error));