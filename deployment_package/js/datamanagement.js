
const data = {
  name: "Data Management",
  children: [
    {
      name: "Data Quality",
      children: [
        { name: "Data Profiling" },
        { name: "Data Cleansing" },
        { name: "Data Validation" },
        { name: "Data Monitoring" }
      ]
    },
    {
      name: "Data Modeling & Design",
      children: [
        { name: "Conceptual Modeling" },
        { name: "Logical Modeling" },
        { name: "Physical Modeling" },
        { name: "Data Normalization" }
      ]
    },
    {
      name: "Data Storage & Operations",
      children: [
        { name: "Database Management" },
        { name: "Data Archiving" },
        { name: "Data Backup" },
        { name: "Data Recovery" }
      ]
    },
    {
      name: "Data Security",
      children: [
        { name: "Access Control" },
        { name: "Data Encryption" },
        { name: "Data Masking" },
        { name: "Audit Trails" }
      ]
    },
    {
      name: "Data Integration & Interoperability",
      children: [
        { name: "ETL Processes" },
        { name: "API Management" },
        { name: "Data Synchronization" },
        { name: "Data Mapping" },
        { name: "Data Contracts" }
      ]
    },
    {
      name: "Documents & Content",
      children: [
        { name: "Document Management" },
        { name: "Content Categorization" },
        { name: "Version Control" },
        { name: "Digital Asset Management" }
      ]
    },
    {
      name: "Reference & Master Data",
      children: [
        { name: "Master Data Management" },
        { name: "Data Governance" },
        { name: "Data Stewardship" },
        { name: "Golden Record Creation" }
      ]
    },
    {
      name: "Data Warehousing & Business Intelligence",
      children: [
        { name: "Data Warehouse Design" },
        { name: "OLAP" },
        { name: "Data Mining" },
        { name: "Reporting & Dashboards" }
      ]
    },
    {
      name: "Metadata",
      children: [
        { name: "Metadata Repository" },
        { name: "Metadata Standards" },
        { name: "Metadata Integration" },
        { name: "Business Glossary" }
      ]
    }
  ]
};

// Create the chart
const chart = (() => {
  // Specify the chart's dimensions.
  const width = 928;
  const height = 1200;

  // Create the color scale.
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

  // Compute the layout.
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.children ? 0 : 1)  // Assign 1 to leaves, 0 to others
    .sort((a, b) => b.height - a.height || b.value - a.value);
  const root = d3.partition()
    .size([height, (hierarchy.height + 1) * width / 3])
    (hierarchy);

  // Create the SVG container.
  const svg = d3.select("#icicle-chart").append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Append cells.
  const cell = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y0},${d.x0})`);

  const rect = cell.append("rect")
    .attr("width", d => d.y1 - d.y0 - 1)
    .attr("height", d => rectHeight(d))
    .attr("fill-opacity", 0.6)
    .attr("fill", d => {
      if (!d.depth) return "#ccc";
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .style("cursor", "pointer")
    .on("click", clicked);

  const text = cell.append("text")
    .style("user-select", "none")
    .attr("pointer-events", "none")
    .attr("x", 4)
    .attr("y", 13)
    .attr("fill-opacity", d => +labelVisible(d));

  text.append("tspan")
    .text(d => d.data.name);

  cell.append("title")
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}`);

  // On click, change the focus and transitions it into view.
  let focus = root;
  function clicked(event, p) {
    focus = focus === p ? p = p.parent : p;
    root.each(d => d.target = {
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0
    });
    const t = cell.transition().duration(750)
      .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
    rect.transition(t).attr("height", d => rectHeight(d.target));
    text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
  }

  function rectHeight(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d) {
    return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
  }

  return svg.node();
})();
