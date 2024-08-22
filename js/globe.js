const canvas = document.getElementById('globe-canvas');
const mapDiv = document.getElementById('map');
mapDiv.appendChild(canvas);
const width = mapDiv.offsetWidth;
const height = Math.min(width, 1809);
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
const context = canvas.getContext('2d');
context.scale(dpr, dpr);

const projection = d3.geoOrthographic()
  .fitExtent([[0, 0], [width, height]], { type: 'Sphere' })
  .scale(Math.min(width, height) / 4) // Adjust the scale value to make the globe smaller
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection, context);

let currentRotation = [0, 0, 0];
const rotationSpeed = 0.2; // Reduced for smoother rotation

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

function rotateGlobe(deltaTime) {
  currentRotation[0] += rotationSpeed * deltaTime;
  projection.rotate(currentRotation);
}

d3.json('https://raw.githubusercontent.com/simonrenauld/simonrenauld.github.io/main/data/countries-50m.json').then(data => {
  if (!data || !data.objects || !data.objects.countries) {
    console.error('Data is missing required properties:', data);
    return;
  }

  const world = topojson.feature(data, data.objects.countries);
  let lastTime = 0;

  function animate(time) {
    const deltaTime = (time - lastTime) / 16.67; // Normalize to 60 FPS
    lastTime = time;

    rotateGlobe(deltaTime);
    render(world);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}).catch(error => {
  console.error('Error fetching or processing data:', error);
});