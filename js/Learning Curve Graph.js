function createLearningCurveGraph() {
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 40, bottom: 50, left: 50 };
  
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
  
    // Define the curve functions for Automatic Expert (red) and Deliberate Expert (blue)
    const lineExpert = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);
  
    const dataExpert = [
      { x: 0, y: 0 },
      { x: 20, y: 40 },
      { x: 40, y: 60 },
      { x: 60, y: 75 },
      { x: 80, y: 85 },
      { x: 100, y: 90 }
    ];
  
    const dataDeliberateExpert = [
      { x: 0, y: 0 },
      { x: 20, y: 45 },
      { x: 40, y: 70 },
      { x: 60, y: 80 },
      { x: 80, y: 95 },
      { x: 100, y: 98 }
    ];
  
    // Automatic Expert Line (red)
    svg.append("path")
      .datum(dataExpert)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", lineExpert);
  
    // Deliberate Expert Line (blue)
    svg.append("path")
      .datum(dataDeliberateExpert)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineExpert);
  
    // X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    // Y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  
    // Add X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Time Spent in Training or Practice");
  
    // Add Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Performance");
  
    // Add labels for stages
    const stages = [
      { label: "NOVICE: Not allowed to practice", x: 5, y: 10 },
      { label: "ADVANCED: Practice with full supervision", x: 30, y: 30 },
      { label: "COMPETENT: Practice with supervision on call", x: 55, y: 55 },
      { label: "PROFICIENT: Practice without supervision", x: 75, y: 80 },
      { label: "EXPERT: Supervises others", x: 90, y: 88 },
      { label: "AUTOMATIC EXPERT", x: 80, y: 92 },
      { label: "DELIBERATE EXPERT", x: 85, y: 98 }
    ];
  
    stages.forEach(stage => {
      svg.append("text")
        .attr("x", x(stage.x))
        .attr("y", y(stage.y))
        .attr("text-anchor", "start")
        .style("font-size", "10px")
        .style("fill", "black")
        .text(stage.label);
    });
  
    // Add dashed line to separate Automatic Expert and Deliberate Expert
    svg.append("line")
      .attr("x1", x(60))
      .attr("x2", x(100))
      .attr("y1", y(85))
      .attr("y2", y(85))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
  
    svg.append("line")
      .attr("x1", x(60))
      .attr("x2", x(100))
      .attr("y1", y(75))
      .attr("y2", y(90))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
  }
  
  // Call the function when the window loads
  window.onload = createLearningCurveGraph;
  