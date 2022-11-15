const axios = require('axios')

const getSteamItemId = async (steam_market_url) => {
  const rst = await axios({
    url: steam_market_url,
    method: 'get'
  })

  const itemId = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(rst.data)[1]
  if (itemId) return Number(itemId)
  throw new Error(`无法获取 steam-item-id ${steam_market_url}`)
}

module.exports = getSteamItemId