
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

const main = async () => {

  const finallyList = buffListFiltered.map(buff => ({
    appid: buff.appid,
    game: buff.game,
    buffId: buff.id,
    name: buff.name,
    steamMarketUrl: buff.steam_market_url,
    steam24hSoldCount: Number(buff.steamSoldInfo.volume),
    steamId: Number(buff.steamItemId),
    steamBuyPriceMax: buff.steamBuyPriceMax,
    steamBuyPrice: buff.steamBuyPrice,
    steamSellPriceMin: buff.steamSellPriceMin,
    steamSellPrice: buff.steamSellPrice,
    buffPriceList: buff.buffPriceList,
    discountMax: Number((buff.buffPriceList[0] / buff.steamSellPriceMin * 1.15).toFixed(2)),
    discountMin: Number((buff.buffPriceList[0] / buff.steamBuyPriceMax * 1.15).toFixed(2)),
  }))

  const map = new Map()
  for (const buff of finallyList) {
    map.set(buff.name, buff)
  }



  const rst = Array.from(map.values()).sort((a, b) => a.discountMax - b.discountMax)

  fs.writeFileSync(
    path.resolve(__dirname, 'buff-list-finally-less.json'),
    JSON.stringify(rst, undefined, 2))


}

main()


