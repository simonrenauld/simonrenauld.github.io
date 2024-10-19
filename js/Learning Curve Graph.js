// Create the learning curve graph
function createLearningCurveGraph() {
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
    const svg = d3.select("#learning-curve-graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);
  
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);
  
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
  
    const data = [
      { x: 0, y: 0 },
      { x: 20, y: 40 },
      { x: 40, y: 60 },
      { x: 60, y: 75 },
      { x: 80, y: 85 },
      { x: 100, y: 90 }
    ];
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .text("Experience");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Skill Level");
  }
  
  // Call the function when the window loads
  window.onload = createLearningCurveGraph;