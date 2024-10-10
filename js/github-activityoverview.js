async function fetchGitHubActivity() {
    const username = 'simonrenauld';
    const repo = 'simonrenauld.github.io';
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;
  
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        const latestCommitsDiv = document.getElementById('github-activity');
        latestCommitsDiv.innerHTML = '<h3>Latest GitHub Activity:</h3>';
  
        const commitList = document.createElement('ul');
        commitList.className = 'commit-list';
  
        data.slice(0, 5).forEach(commit => {
            const commitElement = document.createElement('li');
            commitElement.className = 'commit-item';
            commitElement.innerHTML = `
                <strong>${commit.commit.author.name}</strong>
                <p>${commit.commit.message.slice(0, 100)}${commit.commit.message.length > 100 ? '...' : ''}</p>
                <small>${new Date(commit.commit.author.date).toLocaleString()}</small>
            `;
            commitList.appendChild(commitElement);
        });
  
        latestCommitsDiv.appendChild(commitList);
  
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = '<p>Error loading GitHub activity. Please try again later.</p>';
        document.body.appendChild(errorDiv);
    }
  }
  
  // Call the function when the page loads
  document.addEventListener('DOMContentLoaded', fetchGitHubActivity);
  