const linkedinLinks = [
    "https://www.linkedin.com/posts/charlotteledoux_dataquality-datagovernance-activity-7250026037881843713-aeU3?utm_source=share&utm_medium=member_desktop",
    // Add more links here
  ];
  
  const linkedinActivityDiv = document.getElementById("linkedin-activity");
  
  function displayLinkedInPost(link) {
    fetch(link)
      .then(response => response.text())
      .then(htmlContent => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
  
        // Extract relevant information from the parsed HTML
        const titleElement = doc.querySelector("h1.text-heading-xlarge");
        const jobTitleElement = doc.querySelector("h2.text-heading-medium");
        const postContentElement = doc.querySelector(".feed-shared-update-v2__text");
  
        if (titleElement && jobTitleElement && postContentElement) {
          const title = titleElement.textContent.trim();
          const jobTitle = jobTitleElement.textContent.trim();
          const postContent = postContentElement.textContent.trim();
  
          // Create a new element for each post
          const postElement = document.createElement("div");
          postElement.classList.add("linkedin-post");
  
          const titleAndJob = document.createElement("h3");
          titleAndJob.textContent = `${title} - ${jobTitle}`;
  
          const postContentDiv = document.createElement("p");
          postContentDiv.textContent = postContent;
  
          postElement.appendChild(titleAndJob);
          postElement.appendChild(postContentDiv);
  
          linkedinActivityDiv.appendChild(postElement);
        } else {
          console.warn(`Failed to extract data from link: ${link}`);
        }
      })
      .catch(error => console.error("Error fetching LinkedIn post:", error));
  }
  
  linkedinLinks.forEach(displayLinkedInPost);