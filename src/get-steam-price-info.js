const axios = require('axios')

const getPrice = (graph) => {

  let list = []
  for (const info of graph) {
    const [price, count] = info
    const arr = Array.from({ length: count }).map(() => price)
    list = [...list, ...arr]
    if (list.length > 3) {
      list = list.slice(0, 3)
    }
  }
  const price = list.reduce((acc, cur) => acc + cur, 0) / list.length

  return Number(price.toFixed(2))
}

const getSteamPriceInfo = async (steamItemId, steam_market_url) => {
  const rst = await axios({
    url: `https://steamcommunity.com/market/itemordershistogram`,
    method: 'get',
    params: {
      country: 'CN',
      language: 'schinese',
      currency: 23,
      item_nameid: steamItemId,
      two_factor: 0
    },
    headers: {
      "referer": steam_market_url,
      "X-Requested-With": "XMLHttpRequest",
      "Host": "steamcommunity.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35",
      "Cookie": 'timezoneOffset=28800,0; browserid=2690364358196164533; recentlyVisitedAppHubs=377160%2C1091500; sessionid=ef01bea10ade359d7353f51f; steamMachineAuth76561198400557517=DE2FF317BBB2827416660660C393CD6CCCDBD9A9; steamMachineAuth76561199122713792=75C9B820CE25C943331578234A1E9A902C8FE7F8; webTradeEligibility=%7B%22allowed%22%3A1%2C%22allowed_at_time%22%3A0%2C%22steamguard_required_days%22%3A15%2C%22new_device_cooldown_days%22%3A0%2C%22time_checked%22%3A1668410563%7D; strInventoryLastContext=753_6; steamCountry=HK%7C81ca616addc675caf3a2a801cb6f6ad2'
    },
  })

  return {
    steamBuyPriceMax: rst.data.buy_order_graph[0][0],
    steamBuyPrice: getPrice(rst.data.buy_order_graph),
    steamSellPriceMin: rst.data.sell_order_graph[0][0],
    steamSellPrice: getPrice(rst.data.sell_order_graph)
  }
}

module.exports = getSteamPriceInfo