document.addEventListener("DOMContentLoaded", function() {
    // Define your data structure
    const data = {
        name: "CLOUD",
        children: [
            { name: "GOVERN", children: [
                { name: "Policy management" },
                { name: "Cost management" }
            ]},
            { name: "MIGRATE", children: [
                { name: "Migrate" },
                { name: "Automate" },
                { name: "Monitor" }
            ]},
            { name: "CONFIGURE", children: [
                { name: "Configuration" },
                { name: "Update management" },
                { name: "Automation" },
                { name: "Scripting" }
            ]},
            { name: "SECURE", children: [
                { name: "Security management" },
                { name: "Threat protection" }
            ]},
            { name: "PROTECT", children: [
                { name: "Backup" },
                { name: "Disaster recovery" }
            ]}
        ]
    };

    const width = 600; // Set SVG width
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
        { source: "Policy management", target: "GOVERN" },
        { source: "Cost management", target: "GOVERN" },
        { source: "Migrate", target: "MIGRATE" },
        { source: "Automate", target: "MIGRATE" },
        { source: "Monitor", target: "MIGRATE" },
        { source: "Configuration", target: "CONFIGURE" },
        { source: "Update management", target: "CONFIGURE" },
        { source: "Automation", target: "CONFIGURE" },
        { source: "Scripting", target: "CONFIGURE" },
        { source: "Security management", target: "SECURE" },
        { source: "Threat protection", target: "SECURE" },
        { source: "Backup", target: "PROTECT" },
        { source: "Disaster recovery", target: "PROTECT" }
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
        .attr("r", d => d.children ? 40 : 20)
        .attr("fill", d => d.children ? "#007bff" : "#6c757d")
        .call(drag(simulation));

    const text = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .selectAll("text")
        .data(data.children.concat(data.children.flatMap(d => d.children)))
        .join("text")
        .attr("text-anchor", "middle")
        .text(d => d.name);

    simulation.nodes(data.children.concat(data.children.flatMap(d => d.children))).on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr("x", d => d.x)
            .attr("y", d => d.y + 5);
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
