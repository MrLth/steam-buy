const fs = require('fs')
const path = require('path')
const getSteamSoldInfo = require('./get-steam-sold-info')
const getSteamItemId = require('./get-steam-item-id')
const getSteamPriceInfo = require('./get-steam-price-info')
const getBuffPrice = require('./get-buff-price')
const express = require('express')
const chalk = require('chalk')
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
const w = (a) => {
  if (a.steam24hSoldCount < 5) return a.discountMin

  return (a.discountMin + a.discountMax) / 2 * Math.max(1 - a.steam24hSoldCount / 5, 0.9)
}

const sortFn = (a, b) => w(a) - w(b)


const list = require('./buff-list-full')
const updateIdList = []

const uniqueList = Array.from(list.reduce((acc, cur) => {
  acc.set(cur.id, cur)
  return acc
}, new Map()).values())

let sortedList = uniqueList.sort(sortFn).slice(0, 1000)
const otherList = uniqueList.slice(500)

const update = async () => {
  let buff

  if (updateIdList.length) {
    const id = updateIdList.shift()
    buff = sortedList.find((v) => v.id === id)
  }
  if (!buff) {
    buff = sortedList.sort((a, b) => a.updateTime - b.updateTime)[0]
  }

  try {
    const rst = await trans(buff)
    if (rst.discountMin && rst.discountMax) {
      Object.assign(buff, rst)
      if (w(buff) <= 0.8) {
        console.log(chalk.green(new Date(), buff.id, buff.name, buff.discountMin, buff.discountMax))
      } else {
        console.log(new Date(), buff.id, buff.name, buff.discountMin, buff.discountMax)
      }

      fs.writeFileSync(
        path.resolve(__dirname, 'buff-list-full.json'),
        JSON.stringify([...sortedList, ...otherList], undefined, 2))
    }
  } catch (error) {
    console.log(chalk.red(new Date(), buff.id, buff.name, error.message))
  }

  await sleep(10000)
}

const main = async () => {
  while (true) {
    await update()
  }
}

main()


app.get('/', (req, res) => {




  res.send(`
<html>
  <head>
    <meta http-equiv="Refresh" content="10" />
  </head>
  <body>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>24</th>
            <th>buy-max</th>
            <th>buy-avg</th>
            <th>sell-min</th>
            <th>sell-avg</th>
            <th>buff-price</th>
            <th>discountMin</th>
            <th>discountMax</th>
            <th>buff</th>
            <th>steam</th>
            <th>sort</th>
          </tr>
        </thead>
        <tbody>
        ${sortedList.sort(sortFn).map(v => `
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
          <th><a href="https://buff.163.com/goods/${v.id}" target="_blank">buff</a></th>
          <th><a href="${v.steam_market_url}" target="_blank">steam</a></th>
          <th>${updateIdList.includes(v.id) ? '' : `<button onClick="fetch('./update?id=${v.id}').then(()=>location.reload())">${((Date.now() - v.updateTime) / 1000 / 60 / 60 | 0).toString().padStart(2, '0')}:${(((Date.now() - v.updateTime) / 1000 / 60 | 0) % 60).toString().padStart(2, '0')}</button>`}</th>
          <th>${w(v).toFixed(2)}</th>
        </tr>
        `).join('')}
        </tbody>
      </table>
  </body>
</html>
`)
})

app.get('/update', (req, res) => {
  const { id } = req.query
  if (id && !updateIdList.includes(id)) {
    updateIdList.push(Number(id))
  }
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port http:127.0.0.1:${port}`)
})