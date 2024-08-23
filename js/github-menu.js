// Replace 'simonrenauld' with your GitHub username
const username = 'simonrenauld';

async function fetchRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();
    return repos.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

function createMenuItems(repos) {
  const menu = document.getElementById('github-repo-menu');
  
  repos.forEach(repo => {
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.textContent = repo.name;
    link.target = '_blank';
    menu.appendChild(link);
  });
}

async function initGitHubMenu() {
  const repos = await fetchRepositories();
  createMenuItems(repos);
}

document.addEventListener('DOMContentLoaded', initGitHubMenu);