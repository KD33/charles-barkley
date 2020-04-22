const fetch = require('node-fetch');
const fs = require('fs');


const charlesBarkley = {
    playerId:'787',
    mvpSeason:'1992-93'
};

const derrickRose = {
    playerId:'201565',
    mvpSeason:'2010-11'
};

const lebronJames = {
    playerId:'2544',
    mvpSeason:'2012-13'
};

const stephenCurry = {
    playerId:'201939',
    mvpSeason:'2015-16'
}

const giannisAntetokounmpo = {
    playerId:'203507',
    mvpSeason:'2018-19'
}

const russellWestbrook = {
    playerId:'201566',
    mvpSeason:'2016-16'
}

const jamesHarden = {
    playerId:'201935',
    mvpSeason:'2017-18'
}

const kobeBryant = {
    playerId:'977',
    mvpSeason:'2007-08'
}


//const generateQueryLink = player => `https://stats.nba.com/stats/playergamelog?PlayerID=${player.playerId}&Season=${player.season}&SeasonType=Regular Season`;

const generateQueryLink = player => `https://stats.nba.com/stats/playercareerstats?PlayerID=${player.playerId}&PerMode=PerGame`

const makeQuery = endpoint => {
    return fetch(endpoint, {
        method:'GET',
        headers:{
            'Host': 'stats.nba.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://stats.nba.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'x-nba-stats-origin': 'stats',
            'x-nba-stats-token': 'true'
        }
    })
};

const sendQuery = () => {
    const barkleyQueryLink = generateQueryLink(charlesBarkley);
    const roseQueryLink = generateQueryLink(derrickRose);
    const jamesQueryLink = generateQueryLink(lebronJames);
    const curryQueryLink = generateQueryLink(stephenCurry);
    const kobeQueryLink = generateQueryLink(kobeBryant);
    const hardenQueryLink = generateQueryLink(jamesHarden);
    const westbrookQueryLink = generateQueryLink(russellWestbrook);
    const giannisQueryLink = generateQueryLink(giannisAntetokounmpo);

    Promise.all([
        makeQuery(barkleyQueryLink),
        makeQuery(roseQueryLink),
        makeQuery(jamesQueryLink),
        makeQuery(curryQueryLink),
        makeQuery(kobeQueryLink),
        makeQuery(hardenQueryLink),
        makeQuery(westbrookQueryLink),
        makeQuery(giannisQueryLink)
    ])
        .then(values => values.map(value => value.json()))
        .then(values => Promise.all(values))
        .then(values => {
            values.forEach((value, i) => {
                console.log(i)
                const playerMvpData = getMvpSeasonData(value);
                // writeToFile(playerMvpData)
            })
        })
        .catch(e => console.error(e))
}

const getMvpSeasonData = seasons => {
    const playerId = seasons['parameters']['PlayerID'];
    let mvpSeason;
    if (playerId === 787) mvpSeason = charlesBarkley['mvpSeason'];
    if (playerId === 201565) mvpSeason = derrickRose['mvpSeason'];
    if (playerId === 2544) mvpSeason = lebronJames['mvpSeason'];
    if (playerId === 201939) mvpSeason = stephenCurry['mvpSeason'];
    if (playerId === 203507) mvpSeason = giannisAntetokounmpo['mvpSeason'];
    if (playerId === 201566) mvpSeason = russellWestbrook['mvpSeason'];
    if (playerId === 201935) mvpSeason = jamesHarden['mvpSeason'];
    if (playerId === 977) mvpSeason = kobeBryant['mvpSeason'];

    seasons['resultSets'][0]['rowSet'].forEach((season, i) => {
        if (season[1] === mvpSeason) {
            const mvpSeasonData = seasons['resultSets'][0]['rowSet'][i];
            formatMvpSeasonData(mvpSeasonData);
        }
    })
}

const formatMvpSeasonData = mvpSeasonData => {
    writeToFile({
        playerId:mvpSeasonData[0],
        seasonId:mvpSeasonData[1],
        leagueId:mvpSeasonData[2],
        teamId:mvpSeasonData[3],
        teamAbbreviation:mvpSeasonData[4],
        playerAge:mvpSeasonData[5],
        gamesPlayed:mvpSeasonData[6],
        gamesStarted:mvpSeasonData[7],
        minutes:mvpSeasonData[8],
        fgm:mvpSeasonData[9],
        fga:mvpSeasonData[10],
        fgPct:mvpSeasonData[11],
        fg3m:mvpSeasonData[12],
        fg3a:mvpSeasonData[13],
        fg3Pct:mvpSeasonData[14],
        ftm:mvpSeasonData[15],
        fta:mvpSeasonData[16],
        ftPct:mvpSeasonData[17],
        oReb:mvpSeasonData[18],
        dReb:mvpSeasonData[19],
        reb:mvpSeasonData[20],
        ast:mvpSeasonData[21],
        stl:mvpSeasonData[22],
        blk:mvpSeasonData[23],
        tov:mvpSeasonData[24],
        pf:mvpSeasonData[25],
        pts:mvpSeasonData[26]
    })
}


const writeToFile = playerData => {
    const idToNameMapping = {
        '787': 'Charles-Barkley.json',
        '201565': 'Derrick-Rose.json',
        '2544':'Lebron-James.json',
        '201939':'Stephen-Curry.json',
        '203507':'Giannis-Antetokounmpo.json',
        '201566':'Russell-Westbrook.json',
        '201935':'James-Harden.json',
        '977':'Kobe-Bryant.json'
    }

    const name = idToNameMapping[playerData['playerId']];

    fs.writeFileSync('./players/' + name, JSON.stringify(playerData))

}

sendQuery()