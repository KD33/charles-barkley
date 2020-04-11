console.log("Utility");

function formatToolTip(player, stat, value){
    return `<div class="tool-tip"` +
        "<h2 style=''>"+ player + "</h2>" +
        "<span>Stat: "+ statMapping[stat] + "</span>" +
        "<span style=''>Value: " + value + "</span>"
        "</div>";
}

function previous(current){
    console.log(current)
}

function next(current){
    console.log(current)
}

const statMapping = {
    'PTS':'Points',
    'TOV':'Turnovers',
    'BLK':'Blocks',
    'STL':'Steals',
    'AST':'Assists',
    'REB':'Rebounds',
    'FT %':'Free Throw Percentage',
    'FTA':'Free Throws Attempted',
    'FTM':'Free Throws Made',
    'FG 3%':'3 Point Percentage',
    'FG 3A':'3 Pointers Attempted',
    'FG 3M':'3 Pointers Made',
    'FG %':'Field Goal Percentage',
    'FGA':'Field Goals Attempted',
    'FGM':'Field Goals Made',
    'MIN':'Minutes'
}