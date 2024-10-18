document.addEventListener("DOMContentLoaded", function() {
    // Define data structure
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

    // Define color map
    const colorMap = {
        "GOVERN": "#4A148C",    // Deep Purple
        "MIGRATE": "#0D47A1",   // Dark Blue
        "CONFIGURE": "#1B5E20", // Dark Green
        "SECURE": "#B71C1C",    // Dark Red
        "PROTECT": "#E65100",   // Dark Orange
        "Policy": "#7E57C2",    // Lighter Purple
        "Cost": "#9575CD",      // Even Lighter Purple
        "Migrate": "#42A5F5",   // Light Blue
        "Automate": "#64B5F6",  // Lighter Blue
        "Monitor": "#90CAF9",   // Even Lighter Blue
        "Configuration": "#66BB6A", // Light Green
        "Update": "#81C784",    // Lighter Green
        "Automation": "#A5D6A7",// Even Lighter Green
        "Scripting": "#C8E6C9", // Lightest Green
        "Security": "#EF5350",  // Light Red
        "Threat": "#E57373",    // Lighter Red
        "Backup": "#FFA726",    // Light Orange
        "Recovery": "#FFB74D"   // Lighter Orange
    };

    // Set dimensions
    const width = 500;
    const height = 550;
    const radius = Math.min(width, height) / 6;

    const format = d3.format(",d");

    // Define arc
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    // Create partition layout
    const partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.children ? 0 : 1)
            .sort((a, b) => b.value - a.value);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
    };

    const root = partition(data);
    root.each(d => d.current = d);

    // Create SVG
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "10px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create paths
    const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => colorMap[d.data.name] || "#999999")
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    // Create labels
    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("class", "label-sunburst")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    // Create center circle
    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    // Click handler
    function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function(d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function(d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    // Helper functions
    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
});