document.addEventListener('DOMContentLoaded', function() { 
  const canvas = document.getElementById('globe-canvas');
  const mapDiv = document.getElementById('globe-container');

  if (!canvas || !mapDiv) {
      console.error('Required elements not found. Make sure "globe-canvas" and "globe-container" exist in your HTML.');
      return;
  }

  // Set canvas dimensions and scaling for high-resolution displays
  const width = mapDiv.offsetWidth;
  const height = Math.min(width, 1000);
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
      .scale(Math.min(width, height) / 3.0)
      .translate([width / 3, height / 3.0]);

  const path = d3.geoPath(projection, context);

  // Rotation variables
  let currentRotation = [0, 0, 0];
  const rotationSpeed = 0.3; // Adjust for smoothness

  // Create a starry background
  function createStarryBackground() {
      const stars = [];
      for (let i = 0; i < 200; i++) {
          stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 1.5
          });
      }
      return stars;
  }

  const stars = createStarryBackground();

  // Render the globe and countries
  function render(world) {
      context.clearRect(2, 0, width, height);
      
      // Draw the globe background with gradient
      const gradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.min(width, height) / 3.0);
      gradient.addColorStop(0, '#1a3d5c');
      gradient.addColorStop(1, '#10273a');
      
      context.beginPath();
      path({type: 'Sphere'});
      context.fillStyle = gradient;
      context.fill();
      
      // Draw the land with glow effect
      context.beginPath();
      path(world);
      context.fillStyle = '#00a86b';
      context.fill();
      
      // Add glow effect
      context.shadowColor = '#00ff9d';
      context.shadowBlur = 15;
      context.beginPath();
      path(world);
      context.strokeStyle = '#00ff9d';
      context.lineWidth = 0.5;
      context.stroke();
      context.shadowBlur = 0;
      
      // Draw country borders
      context.beginPath();
      path(world);
      context.strokeStyle = '#ffffff';
      context.lineWidth = 0.2;
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
          // Skip logging if the required properties are missing
          return;
      }

      const world = topojson.feature(data, data.objects.countries);
      const validFeatures = world.features.filter(feature => feature.geometry && feature.geometry.coordinates);

      let lastTime = 0;

      // Animation loop
      function animate(time) {
          const deltaTime = (time - lastTime) / 16.67; // Normalize to 60 FPS
          lastTime = time;

          rotateGlobe(deltaTime);
          render({ type: 'FeatureCollection', features: validFeatures });
          requestAnimationFrame(animate);
      }

      // Start the animation
      requestAnimationFrame(animate);
  })
  .catch(error => {
      console.error('Error fetching or processing data:', error);
  });
});
