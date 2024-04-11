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

    data.children.forEach(parent => {
        parent.children.forEach(child => {
            greyBlueLinks.push({ source: child.name, target: parent.name });
        });
    });

    const width = 800;
    const height = 600;

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.name))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));

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
        .attr("r", d => d.children ? 80 : 50)
        .attr("fill", d => d.children ? "#007bff" : "#6c757d")
        .call(drag(simulation));

    const text = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .selectAll("text")
        .data(data.children.concat(data.children.flatMap(d => d.children)))
        .join("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 5)
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

    simulation.force("link").links(link.data());

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
