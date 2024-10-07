async function fetchGitHubActivity() {
    try {
      const response = await fetch('https://api.github.com/users/simonrenauld/events');
      const data = await response.json();
  
      // Display recent activity
      const activityDiv = document.querySelector('.about-desc');
    //  const activityList = document.createElement('ul');
      activityList.classList.add('activity-list');
  
      data.slice(0, 5).forEach(event => {
        const eventElement = document.createElement('li');
        eventElement.innerHTML = `
          <strong>${event.type}</strong> on ${event.repo.name}
          <br>
          <small>${new Date(event.created_at).toLocaleString()}</small>
        `;
        activityList.appendChild(eventElement);
      });
  
      activityDiv.appendChild(activityList);
  
      // Prepare data for the chart
      const dates = data.map(event => new Date(event.created_at).toLocaleDateString());
      const counts = dates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const labels = Object.keys(counts);
      const values = Object.values(counts);
  
      // Render the chart
      const ctx = document.getElementById('contributionChart').getContext('2d');
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
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Contributions'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          },
          // Add the following lines to make the chart smaller
          width: 100,
          height: 100
        }
      });
    } catch (error) {
   //   console.error('Error fetching GitHub activity:', error);
      const activityDiv = document.querySelector('.about-desc');
   //     activityDiv.innerHTML += '<p>Error loading GitHub activity. Please try again later.</p>';
    }
  }
  
  // Call the function when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fetchGitHubActivity);