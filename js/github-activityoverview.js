const githubUsername = 'simonrenauld';
const activityOverview = document.querySelector('.activity-overview');
const activityCountElement = document.getElementById('activity-count');
const repositoryCountElement = document.getElementById('repository-count');
const repositoryList = document.querySelector('.repository-list');

function fetchActivityData() {
  fetch(`https://api.github.com/users/${githubUsername}/events?per_page=30`)
    .then(response => response.json())
    .then(data => {
      const activityCount = data.length;
      const repositoryCount = new Set(data.map(event => event.repo.name)).size;
      
      if (activityCountElement) {
        activityCountElement.textContent = `Created ${activityCount} events`;
      }
      if (repositoryCountElement) {
        repositoryCountElement.textContent = `in ${repositoryCount} repositories`;
      }
      
      if (repositoryList) {
        repositoryList.innerHTML = '';
        data.forEach(event => {
          if (event.type === 'PushEvent') {
            const repositoryName = event.repo.name;
            const commitCount = event.payload.commits ? event.payload.commits.length : 0;
            repositoryList.innerHTML += `<li><a href="https://github.com/${repositoryName}" target="_blank">${repositoryName} (${commitCount} commits)</a></li>`;
          }
        });
      }
    })
    .catch(error => {
      console.error('Error fetching activity data:', error);
    });
}

fetchActivityData();