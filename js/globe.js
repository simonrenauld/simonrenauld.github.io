// Place your JavaScript code for the globe visualization here
const canvas = document.getElementById('globe-canvas');
const mapDiv = document.getElementById('map');
mapDiv.appendChild(canvas); // Append the canvas to the map div
const width = mapDiv.offsetWidth;
const height = Math.min(width, 240); // Adjusted maximum height
const dpr = window.devicePixelRatio ?? 0.20;
canvas.width = dpr * width;
canvas.height = dpr * height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`; // Set canvas height explicitly
const context = canvas.getContext('2d');
context.scale(dpr, dpr);

const projection = d3.geoOrthographic()
  .fitExtent([[0, 0], [width, height]], { type: 'Sphere' })
  .scale(Math.min(width, height) / 2.1)
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection, context);

let currentRotation = [0, 0, 0];
const rotationSpeed = 0.8;

function render(world) {
  context.clearRect(0, 0, width, height);
  
  // Draw the globe
  context.beginPath();
  path({ type: 'Sphere' });
  context.fillStyle = '#10273a';
  context.fill();
  
  // Draw the land
  context.beginPath();
  path(world);
  context.fillStyle = '#006872';
  context.fill();
  
  // Draw country borders
  context.beginPath();
  path(world);
  context.strokeStyle = '#006872';
  context.lineWidth = 0.5;
  context.stroke();
}

function rotateGlobe() {
  currentRotation[0] += rotationSpeed;
  projection.rotate(currentRotation);
}

// Update the path to your JSON file hosted on GitHub
d3.json('https://raw.githubusercontent.com/simonrenauld/simonrenauld.github.io/main/data/countries-50m.json').then(data => {
  if (!data || !data.objects || !data.objects.countries) {
    console.error('Data is missing required properties:', data);
    return;
  }

  const world = topojson.feature(data, data.objects.countries);

  function animate() {
    rotateGlobe();
    render(world);
    requestAnimationFrame(animate);
  }

  animate();
}).catch(error => {
  console.error('Error fetching or processing data:', error);
});