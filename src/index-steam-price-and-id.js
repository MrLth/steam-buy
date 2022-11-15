const fs = require('fs')
const path = require('path')
const buffListFiltered = require('./buff-list-filtered-more.json')
const getSteamSoldInfo = require('./get-steam-sold-info')
const getSteamItemId = require('./get-steam-item-id')
const getSteamPriceInfo = require('./get-steam-price-info')

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

const main = async () => {

  try {

    for (const buff of buffListFiltered) {
      if (buff.steamSellPrice) continue
      console.log(buff.name)
      const steamItemId = await getSteamItemId(buff.steam_market_url)
      console.log(steamItemId)
      const steamPriceInfo = await getSteamPriceInfo(steamItemId, buff.steam_market_url)
      console.log(steamPriceInfo)

      Object.assign(buff, {
        steamItemId,
      }, steamPriceInfo)


      fs.writeFileSync(
        path.resolve(__dirname, 'buff-list-filtered-more.json'),
        JSON.stringify(buffListFiltered, undefined, 2))

      await sleep(15000)
    }
  } catch (e) {
    console.log(e.message)
  }
}

main()