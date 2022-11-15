const axios = require('axios')

const getSteamSoldInfo = async (appid, market_hash_name) => {
  const rst = await axios({
    url: `https://steamcommunity.com/market/priceoverview`,
    method: 'get',
    params: {
      appid,
      currency: 'CNY',
      market_hash_name,
    }
  })

  return Number(rst.data.volume.replace(',', ''))
}

module.exports = getSteamSoldInfo