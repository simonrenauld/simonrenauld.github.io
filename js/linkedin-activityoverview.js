async function fetchLinkedInActivity() {
    const apiUrl = `https://api.linkedin.com/v2/shares?authors=List(simonrenauld)`;
  
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        const latestLinkedInDiv = document.getElementById('linkedin-activity');
        latestLinkedInDiv.innerHTML = '<h3>Latest LinkedIn Activity:</h3>';
  
        const postList = document.createElement('ul');
        postList.className = 'post-list';
  
        data.elements.slice(0, 5).forEach(post => {
            const postElement = document.createElement('li');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <p>${post.text.body.slice(0, 100)}${post.text.body.length > 100 ? '...' : ''}</p>
                <small>${new Date(post.created.time).toLocaleString()}</small>
            `;
            postList.appendChild(postElement);
        });
  
        latestLinkedInDiv.appendChild(postList);
  
    } catch (error) {
        console.error('Error fetching LinkedIn activity:', error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = '<p>Error loading LinkedIn activity. Please try again later.</p>';
        document.body.appendChild(errorDiv);
    }
  }
  
  // Call the function when the page loads
  document.addEventListener('DOMContentLoaded', fetchLinkedInActivity);
  