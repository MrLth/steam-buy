const axios = require('axios')

const getBuffPrice = async (buffId) => {
  const rst = await axios({
    url: `https://buff.163.com/api/market/goods/sell_order`,
    method: 'get',
    params: {
      game: 'csgo',
      goods_id: buffId,
      page_num: 1,
      sort_by: 'default',
      allow_tradable_cooldown: 1,
      _: 1668481137015,
    },
    headers: {
      "referer": `https://buff.163.com/goods/${buffId}?from=market`,
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35",
      "Cookie": '_ntes_nnid=f0414b7b0abc4a7e2e1a04dc1ee815bb,1627914409499; _ntes_nuid=f0414b7b0abc4a7e2e1a04dc1ee815bb; timing_user_id=time_73aX2wf7pW; Device-Id=iouEuJGFPtKtBTjZ8h0R; Locale-Supported=zh-Hans; unbind_steam_result=; NTES_YD_SESS=DLUT7MVExPJcEZBjK6wBadQuEi6y9njxK5MrTDs9RwilybvYyrnuZzjTTX1FlRwzYmO7Rdv9I47THGYYlO8bm2BF1mvBYXwjztKsNALKm1pOwZCI_JVutdVbRQxqNLUD4WvYi4PFVdzYvLGgjKuP.qgvSF3hMSQ1AuWq6ZQxt5wixRCtlyvnoha4gQgxKT9lZSf95uK3Iu1SMPEkQqFCqOAsxA1ZjWn5iOCeHLQEwx7lc; S_INFO=1668410512|0|0&60##|17751725520; P_INFO=17751725520|1668410512|1|netease_buff|00&99|null&null&null#jis&320100#10#0|&0||17751725520; session=1-M5qmcSaKZqOxxZ0U29NP25wHDqzFSHWCNL8pxYQQyPyd2035971235; steam_info_to_bind=; game=csgo; csrf_token=IjJjYzA5NTQ1MWQ4OWQxMWNiMGMxMDY3YzEyMWZiYTM1YjRiNTE2N2Yi.FlSR8A.opzwjPLJCcFN1vXEPsflEG8HB3o'
    },
  })

  return rst.data.data.items.map(v => Number(v.price)).slice(0, 5)
}

module.exports = getBuffPrice