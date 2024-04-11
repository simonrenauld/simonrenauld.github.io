document.addEventListener("DOMContentLoaded", function() {
    // Define your data structure
    const data = {
        name: "CLOUD",
        children: [
            { name: "GOVERN", children: [
                { name: "Policy" },
                { name: "Cost" }
            ]},
            { name: "MIGRATE", children: [
                { name: "Migrate" },
                { name: "Automate" },
                { name: "Monitor" }
            ]},
            { name: "CONFIGURE", children: [
                { name: "Configuration" },
                { name: "Update" },
                { name: "Automation" },
                { name: "Scripting" }
            ]},
            { name: "SECURE", children: [
                { name: "Security" },
                { name: "Threat" }
            ]},
            { name: "PROTECT", children: [
                { name: "Backup" },
                { name: "Recovery" }
            ]}
        ]
    };

    const width = 650; // Set SVG width
    const height = 600; // Set SVG height

    // Set initial positions for nodes
    data.children.forEach((d, i) => {
        d.x = width / 2;
        d.y = height / 2 + (i - (data.children.length - 1) / 2) * 100;
    });

    data.children.forEach(parent => {
        parent.children.forEach((d, i) => {
            d.x = width / 2 + 100 * (i - parent.children.length / 2);
            d.y = height / 2 + 100;
        });
    });

    // Add links between grey circles and their blue circles
    const greyBlueLinks = [
        { source: "Policy", target: "GOVERN" },
        { source: "Cost", target: "GOVERN" },
        { source: "Migrate", target: "MIGRATE" },
        { source: "Automate", target: "MIGRATE" },
        { source: "Monitor", target: "MIGRATE" },
        { source: "Configuration", target: "CONFIGURE" },
        { source: "Update", target: "CONFIGURE" },
        { source: "Automation", target: "CONFIGURE" },
        { source: "Scripting", target: "CONFIGURE" },
        { source: "Security", target: "SECURE" },
        { source: "Threat", target: "SECURE" },
        { source: "Backup", target: "PROTECT" },
        { source: "Recovery", target: "PROTECT" }
    ];

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const margin = 50; // Define margin to keep nodes within SVG boundaries

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.name).distance(0.5)) // Decrease distance for tighter spacing
        .force("charge", d3.forceManyBody().strength(-20)) // Increase repulsion for tighter spacing
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(50)) // Added force to prevent overlap
        .force("x", d3.forceX().x(d => Math.max(margin, Math.min(width - margin, d.x)))) // Restrict nodes on X-axis
        .force("y", d3.forceY().y(d => Math.max(margin, Math.min(height - margin, d.y)))); // Restrict nodes on Y-axis

    const link = svg.append("g")
        .attr("stroke", "#007bff")
        .attr("stroke-width", 2)
        .selectAll("line")
        .data(greyBlueLinks)
        .join("line");

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.children.concat(data.children.flatMap(d => d.children)))
        .join("circle")
        .attr("r", d => d.children ? 50 : 30)
        .attr("fill", d => d.children ? "#007bff" : "#6c757d")
        .attr("fill-opacity", d => d.children ? 1 : 0.9) // Set fill-opacity based on the condition
        .call(drag(simulation));

    const text = svg.append("g")
        .attr("font-family", "sans-serif")
        .selectAll("text")
        .data(data.children.concat(data.children.flatMap(d => d.children)))
        .join("text")
        .attr("text-anchor", "middle")
        .style("font-size", d => d.children ? "12px" : "10px") // Adjust font size based on condition
        .text(d => d.name)
        .attr("fill", "#fff");

    // Position text within circles
    const labelPadding = 8;
    text.attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", d => d.children ? "0.35em" : "0.25em")
        .attr("transform", d => d.children ? "" : "translate(0, 3)"); // Adjust y position for smaller circles

    simulation.nodes(data.children.concat(data.children.flatMap(d => d.children))).on("tick", () => {
        // Update link positions
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // Update node positions
        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // Update text positions
        text.attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    simulation.force("link").links(greyBlueLinks);

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});
