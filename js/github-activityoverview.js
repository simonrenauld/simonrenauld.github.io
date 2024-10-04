const githubUsername = 'simonrenauld';

const activityOverview = document.querySelector('.activity-overview');
const activityCountElement = document.getElementById('activity-count');
const repositoryCountElement = document.getElementById('repository-count');
const repositoryList = document.querySelector('.repository-list');

function fetchActivityData() {
  fetch(`/api/github-activity?username=${githubUsername}`)
  .then(response => response.json())
  .then(data => {
    const activityCount = data.length;
    const repositoryCount = new Set(data.map(event => event.repo.name)).size;
    
    activityCountElement.textContent = `Created ${activityCount} events`;
    repositoryCountElement.textContent = `in ${repositoryCount} repositories`;
    
    repositoryList.innerHTML = '';
    data.forEach(event => {
      const repositoryName = event.repo.name;
      const commitCount = event.payload.commits ? event.payload.commits.length : 0;
      repositoryList.innerHTML += `<li><a href="https://github.com/${repositoryName}">${repositoryName} (${commitCount} commits)</a></li>`;
    });
  })
  .catch(error => {
    console.error('Error fetching activity data:', error);
  });
}

fetchActivityData();