async function drawChart(){
    // 1. Access the data
    // 2. Create the chart dimensions
    // 3. Draw the canvas
    // 4. Create the scales
    // 5. Draw the data
    // 6. Draw peripherals
    // 7.

    const barkleyStats = await d3.json("./players/Charles-Barkley.json");
    const curryStats = await d3.json("./players/Stephen Curry.json");
    const jamesStats = await d3.json("./players/Lebron-James.json");
    const roseStats = await d3.json("./players/Derrick-Rose.json");

    const yAccessor = d => d.stat;
    const barkleyXAccessor = d => d.ratio;

    const barkleyColor = "rgba(184, 10, 30, 0.6)";
    const compColor = "rgba(10, 114, 184, 0.6)";
    const curryData = [
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

    const jamesData = [
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

    const roseData = [
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

    const curryComp = populateComps(curryData, curryStats, barkleyStats, "Stephen Curry");
    const jamesComp = populateComps(jamesData, jamesStats, barkleyStats, "Lebron James");
    const roseComp = populateComps(roseData, roseStats, barkleyStats, "Derrick Rose");

    const comps = [
        curryComp,
        jamesComp,
        roseComp
    ]
    const current = curryComp;

    const dimensions = {
        width:900,
        height:500,
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
        .domain([0, 1])
        .range([0, dimensions.boundedWidth]);

    const yScale = d3.scaleBand()
        .domain(current.map(stat => stat.stat))
        .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0])
        .round(.3);

    const barkleyTip = d3.tip()
        .offset([-10, 0])
        .html(function(d) {
            return formatToolTip("Charles Barkley", d.stat, d.barkleyValue)
        })

    const compTip = d3.tip()
        .offset([-10, 0])
        .html(function(d){
            return formatToolTip(d.playerComp, d.stat, d.compValue)
        })

    wrapper.call(barkleyTip);
    wrapper.call(compTip);

    const bars = bounds.selectAll("rect")
        .data(comps[comps.length-1])
        .enter()
        // .append("g");

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

    bounds.append("line")
        .style("stroke", "black")
        .attr("x1", dimensions.width/2 )
        .attr("y1", dimensions.height)
        .attr("x2", dimensions.width/2)
        .attr("y2", 0)

    bounds.call(d3.axisLeft(yScale).tickSize(0));

    d3.select("body").append("button")
        .text("Next")
        .on("click", function(){
        //https://bost.ocks.org/mike/join/
        //http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
            const prev = comps.pop();
            comps.unshift(prev);

            let newBars = bounds.selectAll("rect");

            newBars = newBars.data(comps[comps.length-1]);
            const enterBars = newBars.enter();
            //
            const exitBars = newBars.exit().remove();
            console.log(newBars)
            console.log(enterBars)
            console.log(exitBars)
            //
            // //THE TRICK HAS SOMETHING TO DO WITH THIS MERGE.  READ UP ON THIS MERGE!!!!!
            // //https://observablehq.com/@d3/general-update-pattern
            // //https://observablehq.com/@d3/selection-join
            // //https://github.com/d3/d3-selection#selection_data
            //
            // enterBars.append("rect").merge(newBars)
            //     .attr("x", 0)
            //     .attr("y", d => yScale(yAccessor(d)))
            //     .attr("height", 30)
            //     .attr("width", d => xScale(barkleyXAccessor(d)))
            //     .attr("fill", barkleyColor)
            //     .on('mouseover', function(d){
            //         d3.select(this).attr("fill", "#b80a1e");
            //         barkleyTip.show(d);
            //     })
            //     .on('mouseout', function(){
            //         d3.select(this).attr("fill", barkleyColor)
            //         barkleyTip.hide();
            //     })

            // enterBars.append("rect").merge(newBars)
            //     .attr("x", d => xScale(barkleyXAccessor(d)))
            //     .attr("y", d => yScale(yAccessor(d)))
            //     .attr("width", d => dimensions.boundedWidth - xScale(barkleyXAccessor(d)))
            //     .attr("height", 30)
            //     .attr("fill", compColor)
            //     .on('mouseover', function(d){
            //         compTip.show(d);
            //         d3.select(this).attr("fill", "#0a72b8");
            //     })
            //     .on('mouseout', function(){
            //         compTip.hide();
            //         d3.select(this).attr("fill", compColor);
            //     })



        })
}

//http://bl.ocks.org/alansmithy/e984477a741bc56db5a5

function populateComps(playerArray, playerData, barkleyData, playerName) {
    const formattedPlayerArray = playerArray.map(statCategory => {
        statCategory.length = 1;
        statCategory.playerComp = playerName;
        const key = statCategory.stat
            .toLowerCase()
            .split(" ")
            .join("")
            .replace("%", "Pct");

        statCategory.ratio = (barkleyData[key] / (playerData[key] + barkleyData[key]));
        statCategory.barkleyValue = barkleyData[key];
        statCategory.compValue = playerData[key];
        return statCategory;
    })
    return formattedPlayerArray;
}

drawChart();