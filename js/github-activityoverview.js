async function fetchGitHubActivity() {
    const username = 'simonrenauld';
    const apiUrlRepos = `https://api.github.com/users/${username}/repos`;

    try {
        // Fetch repositories contributed to
        const responseRepos = await fetch(apiUrlRepos);
        if (!responseRepos.ok) {
            throw new Error(`HTTP error! status: ${responseRepos.status}`);
        }
        const reposData = await responseRepos.json();

        // List of specific repositories
        const specificRepos = [
            'simonrenauld/simonrenauld.github.io',
            'simonrenauld/ServerSetup',
            'simonrenauld/14-Finance-Programming'
        ];

        // Filter repositories to match specific ones or count the remaining
        const contributedRepos = reposData.map(repo => `${username}/${repo.name}`);
        const otherReposCount = contributedRepos.length - specificRepos.length;
        
        const latestCommitsDiv = document.getElementById('github-activity');
    

        const contributedToDiv = document.createElement('div');
        contributedToDiv.className = 'contributed-repos';
        contributedToDiv.innerHTML = `
         
            <ul>
                ${specificRepos.map(repo => `<li>${repo}</li>`).join('')}
                ${otherReposCount > 0 ? `<li>and ${otherReposCount} other repositories</li>` : ''}
            </ul>
        `;
        latestCommitsDiv.appendChild(contributedToDiv);
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = '<p>Error loading GitHub activity. Please try again later.</p>';
        document.body.appendChild(errorDiv);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubActivity);
