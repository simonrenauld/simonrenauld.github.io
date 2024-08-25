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
  
  // Group repos by their first two digits
  const groupedRepos = repos.reduce((acc, repo) => {
    const group = repo.name.substring(0, 2);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(repo);
    return acc;
  }, {});

  Object.entries(groupedRepos).forEach(([group, groupRepos]) => {
    const dropdownItem = document.createElement('li');
    dropdownItem.className = 'nav-item dropdown';
    
    const dropdownToggle = document.createElement('a');
    dropdownToggle.className = 'nav-link dropdown-toggle';
    dropdownToggle.href = '#';
    dropdownToggle.role = 'button';
    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.textContent = `Group ${group}`;
    
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';
    
    groupRepos.forEach(repo => {
      const link = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = repo.html_url;
      a.textContent = repo.name;
      a.target = '_blank';
      link.appendChild(a);
      dropdownMenu.appendChild(link);
    });
    
    dropdownItem.appendChild(dropdownToggle);
    dropdownItem.appendChild(dropdownMenu);
    menu.appendChild(dropdownItem);
  });
}

async function initGitHubMenu() {
  const repos = await fetchRepositories();
  createMenuItems(repos);
}

document.addEventListener('DOMContentLoaded', initGitHubMenu);