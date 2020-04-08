async function drawChart(){
    // 1. Access the data
    // 2. Create the chart dimensions
    // 3. Draw the canvas
    // 4. Create the scales
    // 5. Draw the data
    // 6. Draw peripherals
    // 7.

    const barkleyStats = await d3.json("./players/Charles-Barkley.json");
    const stephStats = await d3.json("./players/Stephen Curry.json");
    const lebronStats = await d3.json("./players/Lebron-James.json");
    const dRoseStats = await d3.json("./players/Derrick-Rose.json");

    const yAccessor = d => d.stat;
    const barkleyXAccessor = d => d.roseRatio;

    const barkleyColor = "rgba(184, 10, 30, 0.6)";
    const compColor = "rgba(10, 114, 184, 0.6)";
    const data = [
        {stat:'MIN'},
        {stat:'FGM'},
        {stat:'FGA'},
        {stat:'FG %'},
        {stat:'FG 3M'},
        {stat:'FG 3A'},
        {stat:'FG 3%'},
        {stat:'FTM'},
        {stat:'FTA'},
        {stat:'FT %'},
        {stat:'REB'},
        {stat:'AST'},
        {stat:'STL'},
        {stat:'BLK'},
        {stat:'TOV'},
        {stat:'PTS'}
    ]

    data.forEach(stat => stat.value = 1);
    data.forEach(statCategory => {
        const key = statCategory.stat
            .toLowerCase()
            .split(" ")
            .join("")
            .replace("%", "Pct");

        statCategory['barkley'] = barkleyStats[key];

        statCategory['curry'] = stephStats[key];
        statCategory['curryRatio'] =
            (statCategory['barkley']/(statCategory['barkley'] + statCategory['curry']));

        statCategory['rose'] = dRoseStats[key];
        statCategory['roseRatio'] =
            (statCategory['barkley']/(statCategory['barkley'] + statCategory['rose']));

        statCategory['james'] = lebronStats[key];
        statCategory['jamesRatio'] =
            (statCategory['barkley']/(statCategory['barkley'] + statCategory['james']));

    });

    console.log(data)
    const dimensions = {
        width:1200,
        height:700,
        margin:{
            top:30,
            right:0,
            bottom:0,
            left:60
        }
    };

    dimensions.boundedWidth =
        dimensions.width - dimensions.margin.right - dimensions.margin.left;

    dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("height", dimensions.height)
        .attr("width", dimensions.width);

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(o => o.value))])
        .range([0, dimensions.boundedWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(stat => stat.stat))
        .range([dimensions.height, 0])
        .round(.3);

    const barkleyTip = d3.tip()
        .offset([-10, 0])
        .html(function(d) {
            return formatToolTip("Barkley", d.barkley)
            // return "<strong>Barkley:" + d.barkley + "</strong>";
        })

    const compTip = d3.tip()
        .offset([-10, 0])
        .html(function(d){
            return "<strong>Rose:" + d.rose + "</strong>";
        })

    wrapper.call(barkleyTip);
    wrapper.call(compTip);

    const bars = bounds.selectAll("bar")
        .data(data)
        .enter()
        .append("g");

    bars.append("rect")
        .attr("x", 0)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("height", 30)
        .attr("width", d => xScale(barkleyXAccessor(d)))
        .attr("fill", barkleyColor)
        .on('mouseover', function(d){
            d3.select(this).attr("fill", "#b80a1e");
            barkleyTip.show(d);
        })
        .on('mouseout', function(){
            d3.select(this).attr("fill", barkleyColor)
            barkleyTip.hide();
        })

    bars.append("rect")
        .attr("x", d => xScale(barkleyXAccessor(d)))
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => dimensions.boundedWidth - xScale(barkleyXAccessor(d)))
        .attr("height", 30)
        .attr("fill", compColor)
        .on('mouseover', function(d){
            compTip.show(d);
            d3.select(this).attr("fill", "#0a72b8");
        })
        .on('mouseout', function(){
            compTip.hide();
            d3.select(this).attr("fill", compColor);
        })

    bars.append("line")
        .style("stroke", "black")
        .attr("x1", dimensions.width/2 )
        .attr("y1", dimensions.height)
        .attr("x2", dimensions.width/2)
        .attr("y2", 0)

    bounds.call(d3.axisLeft(yScale).tickSize(0));

}

drawChart();