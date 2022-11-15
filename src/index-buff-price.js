const fs = require('fs')
const path = require('path')
const buffListFiltered = require('./buff-list-filtered-more.json')
const getSteamSoldInfo = require('./get-steam-sold-info')
const getSteamItemId = require('./get-steam-item-id')
const getSteamPriceInfo = require('./get-steam-price-info')
const getBuffPrice = require('./get-buff-price')

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

const main = async () => {

  try {
    for (const buff of buffListFiltered) {
      if (buff.buffPriceList) continue
      console.log(buff.name)
      const buffPriceList = await getBuffPrice(buff.id)
      console.log(buffPriceList)

      Object.assign(buff, {
        buffPriceList,
      })

      fs.writeFileSync(
        path.resolve(__dirname, 'buff-list-filtered-more.json'),
        JSON.stringify(buffListFiltered, undefined, 2))
      await sleep(5000)
    }
  } catch (e) {
    console.log(e.message)
  }
}

main()