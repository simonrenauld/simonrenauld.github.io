document.addEventListener("DOMContentLoaded", function () {
    // Data for the timeline
    const data = [
        {
            date: "2014-2016",
            title: "M.Sc. Candidate and Research Assistant",
            company: "Laval University, Canada",
            description: "Pioneered customer spatial analysis for marketing insights, aiding location selection and campaign strategies."
        },
        // Add more data entries for other career milestones...
    ];

    // D3.js code to generate the timeline
    const container = d3.select("#timeline-container");

    const events = container.selectAll(".event")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "event")
        // Add hover effect
        .on("mouseover", function () {
            d3.select(this)
                .style("background-color", "lightgray");
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("background-color", "white");
        });

    events.append("div")
        .attr("class", "date")
        .text(d => d.date);

    events.append("div")
        .attr("class", "title")
        .text(d => d.title);

    events.append("div")
        .attr("class", "company")
        .text(d => d.company);

    events.append("div")
        .attr("class", "description")
        .text(d => d.description);
});