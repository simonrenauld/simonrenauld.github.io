const username = 'simonrenauld';

async function fetchRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
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
    const menuItem = document.createElement('li');
    
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.textContent = repo.name;
    link.target = '_blank';
    
    menuItem.appendChild(link);
    menu.appendChild(menuItem);
  });
}

async function initGitHubMenu() {
  const repos = await fetchRepositories();
  createMenuItems(repos);
}

document.addEventListener('DOMContentLoaded', initGitHubMenu);