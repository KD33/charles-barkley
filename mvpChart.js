async function drawChart(){
    console.log("Drawing the chart");
    const charlesBarkley = await d3.json("./players/Charles-Barkley.json");
    const stephenCurry = await d3.json("./players/Stephen Curry.json");
    const derrickRose = await d3.json("./players/Derrick-Rose.json");
    const lebronJames = await d3.json("./players/Lebron-James.json");

    console.log(charlesBarkley);
    console.log(stephenCurry);
    console.log(derrickRose);
    console.log(lebronJames);

    // 1.  Access the data
    // 2.  Create chart dimensions
    // 3.  Draw canvas
    // 4.  Create scales
    // 5.  Draw data
    // 6.  Draw peripherals

    const statAccessor = (d, stat) => d[stat];

    const dimensions = {
        width:500,
        height:30,
        margin:{
            top:30,
            right:0,
            bottom:0,
            left:50
        }
    };

    dimensions.boundedWidth =
        dimensions.width - dimensions.margin.right - dimensions.margin.left


    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)



    // Get the data from Barkley and the player in question
    // For each metric, combine Barkley's set of MVP Season stats with that of the player in question
    // Each bar will be of the same length.  The bars will be split however, based on percentages.  Ex: a bar that is
    // 1000px long, if barkley makes up 60% of the scoring between he and the player, his color will shade 600px of the
    // bar.
    //

}


drawChart();