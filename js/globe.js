const canvas = document.getElementById('globe-canvas');
const mapDiv = document.getElementById('globe-container');

// Set canvas dimensions and scaling for high-resolution displays
const width = mapDiv.offsetWidth;
const height = Math.min(width, 1809);
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const context = canvas.getContext('2d');
context.scale(dpr, dpr);

// Create the projection and path for the globe
const projection = d3.geoOrthographic()
  .fitExtent([[0, 0], [width, height]], { type: 'Sphere' })
  .scale(Math.min(width, height) / 2.1)
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection, context);

// Rotation variables
let currentRotation = [0, 0, 0];
const rotationSpeed = 0.2; // Adjust for smoothness

// Render the globe and countries
function render(world) {
  context.clearRect(0, 0, width, height);
  
  // Draw the globe background
  context.beginPath();
  path({ type: 'Sphere' });
  context.fillStyle = '#10273a'; // Color of the ocean or globe background
  context.fill();
  
  // Draw the land
  context.beginPath();
  path(world);
  context.fillStyle = '#006872'; // Color of the landmasses
  context.fill();
  
  // Draw country borders
  context.beginPath();
  path(world);
  context.strokeStyle = '#ffffff'; // Color for the borders
  context.lineWidth = 0.5;
  context.stroke();
}

// Function to handle globe rotation
function rotateGlobe(deltaTime) {
  currentRotation[0] += rotationSpeed * deltaTime;
  projection.rotate(currentRotation);
}

// Fetch and render the world data using D3 and TopoJSON
d3.json('https://raw.githubusercontent.com/simonrenauld/simonrenauld.github.io/main/data/countries-50m.json')
  .then(data => {
    if (!data || !data.objects || !data.objects.countries) {
      console.error('Data is missing required properties:', data);
      return;
    }

    const world = topojson.feature(data, data.objects.countries);
    let lastTime = 0;

    // Animation loop
    function animate(time) {
      const deltaTime = (time - lastTime) / 16.67; // Normalize to 60 FPS
      lastTime = time;

      rotateGlobe(deltaTime);
      render(world);
      requestAnimationFrame(animate);
    }

    // Start the animation
    requestAnimationFrame(animate);
  })
  .catch(error => {
    console.error('Error fetching or processing data:', error);
  });


  