async function fetchGitHubActivity() {
  const response = await fetch('https://api.github.com/users/simonrenauld/events');
  const data = await response.json();
  const activityDiv = document.getElementById('activity');

  data.slice(0, 5).forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('activity');
      eventElement.innerHTML = `
          <p><strong>Type:</strong> ${event.type}</p>
          <p><strong>Repo:</strong> ${event.repo.name}</p>
          <p><strong>Date:</strong> ${new Date(event.created_at).toLocaleString()}</p>
      `;
      activityDiv.appendChild(eventElement);
  });

  // Prepare data for the chart
  const dates = data.map(event => new Date(event.created_at).toLocaleDateString());
  const counts = dates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  // Render the chart
  const ctx = document.getElementById('contributionChart').getContext('2d'); // Corrected ID
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'Contributions',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

fetchGitHubActivity();
