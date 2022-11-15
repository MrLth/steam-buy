const fs = require('fs')
const path = require('path')
const buffListSorted = require('./buff-list-sorted.json')
const getSteamSoldInfo = require('./get-steam-sold-info')
const getSteamItemId = require('./get-steam-item-id')
const getSteamPriceInfo = require('./get-steam-price-info')
const getBuffPrice = require('./get-buff-price')
const list = require('./buff-list-1000')
const express = require('express')
const app = express()
const port = 3999

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))


const trans = async (buff) => {
  const { appid, market_hash_name, steam_market_url, id, game, name } = buff
  const steam24hSoldCount = await getSteamSoldInfo(appid, market_hash_name)

  const steamId = await getSteamItemId(steam_market_url)
  const {
    steamBuyPriceMax,
    steamBuyPrice,
    steamSellPriceMin,
    steamSellPrice,
  } = await getSteamPriceInfo(steamId, steam_market_url)
  const buffPriceList = await getBuffPrice(id)

  const discountMax = Number((buffPriceList[0] / steamSellPriceMin * 1.15).toFixed(2))
  const discountMin = Number((buffPriceList[0] / steamBuyPriceMax * 1.15).toFixed(2))

  return {
    appid, market_hash_name, steam_market_url, id, game, name,
    steam24hSoldCount,
    steamId,
    steamBuyPriceMax,
    steamBuyPrice,
    steamSellPriceMin,
    steamSellPrice,
    buffPriceList,
    discountMin,
    discountMax,
    updateTime: Date.now(),
  }
}


const main = async () => {




  const buffList = buffListSorted.slice(0, 1000)

  for (let i = list.length; i < buffList.length;) {
    const buff = buffList[i]
    try {
      list.push(await trans(buff))
    } catch (error) {
      console.log(error.message)
      await sleep(60000)
      continue
    }

    console.log(i)

    fs.writeFileSync(
      path.resolve(__dirname, 'buff-list-1000.json'),
      JSON.stringify(list, undefined, 2))

    await sleep(20000)
    i++
  }

}

main()


app.get('/', (req, res) => {
  res.send(`
<table>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>steam24hSoldCount</th>
      <th>steamBuyPriceMax</th>
      <th>steamBuyPrice</th>
      <th>steamSellPriceMin</th>
      <th>steamSellPrice</th>
      <th>buffPriceList</th>
      <th>discountMin</th>
      <th>discountMax</th>
    </tr>
  </thead>
  <tbody>
  ${list.sort((a, b) => a.discountMax - b.discountMax).map(v => `
  <tr>
    <th>${v.id}</th>
    <th>${v.name}</th>
    <th>${v.steam24hSoldCount}</th>
    <th>${v.steamBuyPriceMax}</th>
    <th>${v.steamBuyPrice}</th>
    <th>${v.steamSellPriceMin}</th>
    <th>${v.steamSellPrice}</th>
    <th>${v.buffPriceList}</th>
    <th>${v.discountMin}</th>
    <th>${v.discountMax}</th>
  </tr>
  `).join('')}
  </tbody>
</table>
`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})