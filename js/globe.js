// Place your JavaScript code for the globe visualization here
// Place your JavaScript code for the globe visualization here
const canvas = document.getElementById('globe-canvas');
const mapDiv = document.getElementById('map');
mapDiv.appendChild(canvas); // Append the canvas to the map div
const width = mapDiv.offsetWidth;
const height = Math.min(width, 600);
const dpr = window.devicePixelRatio ?? 0.1;
canvas.width = dpr * width;
canvas.height = dpr * height;
canvas.style.width = `${width}px`;
const context = canvas.getContext('2d');
context.scale(dpr, dpr);
const projection = d3.geoOrthographic().fitExtent([[10, 10], [width - 10, height - 10]], { type: 'Sphere' }).scale(150);
const path = d3.geoPath(projection, context);
const tilt = 20;

function render(country, land, borders, arc) {
  context.clearRect(0, 0, width, height);
  context.beginPath(), path(land), context.fillStyle = '#ccc', context.fill();
  context.beginPath(), path(country), context.fillStyle = '#f00', context.fill();
  context.beginPath(), path(borders), context.strokeStyle = '#fff', context.lineWidth = 0.5, context.stroke();
  context.beginPath(), path({ type: 'Sphere' }), context.strokeStyle = '#000', context.lineWidth = 1.5, context.stroke();
  context.beginPath(), path(arc), context.stroke();
  return context.canvas;
}

// Update the path to your JSON file hosted on GitHub
d3.json('https://raw.githubusercontent.com/simonrenauld/simonrenauld.github.io/main/data/countries-50m.json').then(data => {
  const countries = data.objects.countries.geometries;
  const land = topojson.feature(data, data.objects.land);
  const borders = topojson.mesh(data, data.objects.countries);
  let p1, p2 = [0, 0], r1, r2 = [0, 0, 0];

  for (const country of countries) {
    const name = country.properties.name;
    render(country, land, borders);
    p1 = p2, p2 = d3.geoCentroid(country);
    r1 = r2, r2 = [-p2[0], tilt - p2[1], 0];
    const ip = d3.geoInterpolate(p1, p2);
    const iv = Versor.interpolateAngles(r1, r2);
    d3.transition()
      .duration(1250)
      .tween('render', () => t => {
        projection.rotate(iv(t));
        render(country, land, borders, { type: 'LineString', coordinates: [p1, ip(t)] });
      })
      .transition()
      .tween('render', () => t => {
        render(country, land, borders, { type: 'LineString', coordinates: [ip(t), p2] });
      })
      .end();
  }
});
