const keys = require('./keys')
const axios = require('axios')

const baseUrl = 'http://api.steampowered.com/'

const logCode = (resp) => {
  console.log("whoops:", resp.status, resp.statusText)
}

const getImageUrl = (appId, imgHash) => {
  return `http://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${imgHash}.jpg`
} 


const getUserInfo = (userName) => {
  const userId = keys.users[userName]
  if (userId) {
    getUserInfoById(userId)
  }  else {
    console.log("invalid userName");
  }
}

const getUserInfoById = (userId) => {
  const url = baseUrl + '/ISteamUser/GetPlayerSummaries/v0002/?key=' + keys.apiKey + '&steamids=' + userId

  axios.get(url)
  .then((resp) => {
    if (resp.status != 200) {
      logCode(resp)
    }
    else {
      const responseObject = resp.data.response
      console.log(`Successfully retrieved information for ${responseObject.players[0].personaname}`)
    }
  })
  .catch((err) => {
    console.log("Oops, something went wrong: ", err)
  })
}

const getRecentlyPlayedGames = (userName) => {
  const userId = keys.users[userName]
  if (userId) {
    return getRecentlyPlayedGamesById(userId)
  }  else {
    console.log("invalid userName");
  }
}

const getRecentlyPlayedGamesById = (userId) => {
  const url = baseUrl + '/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+ keys.apiKey + '&steamid=' + userId + '&format=json'

  return axios.get(url)
    .then((resp) => {
      if (resp.status != 200) {
        logCode(resp)
      }
      else {
        const games = resp.data.response.games
        const total = resp.data.response.total_count
        const rtnStr = `In the past two weeks, they have played ${total} different games, with `
        if (games) {
          const { name, playtime_2weeks } = games.reduce((acc, cur) => {
            return acc.playtime_2weeks > cur.playtime_2weeks ? acc : cur
          })

          return `${rtnStr}${name} played the most at ${(parseInt(playtime_2weeks) / 60).toFixed(2)} hours.`
        }
      }
    })
    .catch((err) => {
      console.log("Oops, something went wrong: ", err)
    })
}

// getUserInfo("natenasty")

getRecentlyPlayedGames("natenasty").then(console.log)
