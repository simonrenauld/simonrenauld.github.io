const githubUsername = 'simonrenauld'; // Replace with your actual username
const  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
const activityOverview = document.querySelector('.activity-overview');
const activityCountElement = document.getElementById('activity-count');
const repositoryCountElement = document.getElementById('repository-count');
const repositoryList = document.querySelector('.repository-list');

function fetchActivityData() {
  fetch(`https://api.github.com/users/${githubUsername}/events`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const activityCount = data.length;
    const repositoryCount = new Set(data.map(event => event.repo.name)).size;

    activityCountElement.textContent = `Created ${activityCount} commits`;
    repositoryCountElement.textContent = `in ${repositoryCount} repositories`;

    repositoryList.innerHTML = '';
    data.forEach(event => {
      const repositoryName = event.repo.name;
      const commitCount = event.repo.name.commit_count;
      repositoryList.innerHTML += `<li><a href="${event.repo.url}">${repositoryName} (${commitCount} commits)</a></li>`;
    });
  })
  .catch(error => {
    console.error('Error fetching activity data:', error);
  });
}

fetchActivityData();