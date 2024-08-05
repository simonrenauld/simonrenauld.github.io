// Import necessary libraries
import * as d3 from 'd3';
import scrollama from 'scrollama';
import { gsap } from 'gsap';

// Create the main SVG
const svg = d3.select('#visualization')
  .append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight);

// Create a group for the city
const cityGroup = svg.append('g').attr('class', 'city');

// Function to create a building
function createBuilding(data) {
  return cityGroup.append('rect')
    .attr('x', data.x)
    .attr('y', data.y)
    .attr('width', data.width)
    .attr('height', 0)
    .attr('fill', data.color);
}

// Animation function
function animateBuilding(building, data) {
  gsap.to(building.node(), {
    height: data.height,
    duration: 1,
    ease: 'power2.out'
  });
}

// Scrollytelling setup
const scroller = scrollama();

scroller
  .setup({
    step: '.step',
    offset: 0.5,
  })
  .onStepEnter((response) => {
    // Trigger animations based on the current step
    if (response.index === 0) {
      // Animate first building
      const building = createBuilding({x: 100, y: 300, width: 50, height: 100, color: 'blue'});
      animateBuilding(building, {height: 100});
    }
    // Add more steps as needed
  });

// Responsive resize
window.addEventListener('resize', () => {
  scroller.resize();
});