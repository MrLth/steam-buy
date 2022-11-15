const axios = require('axios')

const getList = async (page = 1) => {
  const rst = await axios({
    url: 'https://buff.163.com/api/market/goods',
    method: 'get',
    params: {
      game: "csgo",
      page_num: page,
      min_price: 5,
      max_price: 1000,
      use_suggestion: 0,
      trigger: "undefined_trigger",
      _: Date.now(),

    },
    headers: {
      Cookie: '_ntes_nnid=f0414b7b0abc4a7e2e1a04dc1ee815bb,1627914409499; _ntes_nuid=f0414b7b0abc4a7e2e1a04dc1ee815bb; timing_user_id=time_73aX2wf7pW; Device-Id=iouEuJGFPtKtBTjZ8h0R; Locale-Supported=zh-Hans; unbind_steam_result=; NTES_YD_SESS=DLUT7MVExPJcEZBjK6wBadQuEi6y9njxK5MrTDs9RwilybvYyrnuZzjTTX1FlRwzYmO7Rdv9I47THGYYlO8bm2BF1mvBYXwjztKsNALKm1pOwZCI_JVutdVbRQxqNLUD4WvYi4PFVdzYvLGgjKuP.qgvSF3hMSQ1AuWq6ZQxt5wixRCtlyvnoha4gQgxKT9lZSf95uK3Iu1SMPEkQqFCqOAsxA1ZjWn5iOCeHLQEwx7lc; S_INFO=1668410512|0|0&60##|17751725520; P_INFO=17751725520|1668410512|1|netease_buff|00&99|null&null&null#jis&320100#10#0|&0||17751725520; session=1-M5qmcSaKZqOxxZ0U29NP25wHDqzFSHWCNL8pxYQQyPyd2035971235; steam_info_to_bind=; game=csgo; csrf_token=IjJjYzA5NTQ1MWQ4OWQxMWNiMGMxMDY3YzEyMWZiYTM1YjRiNTE2N2Yi.FlS-0A.MbN3bQoKcnFKKcjTSsz61C1ToSE'
    }
  })

  if (rst.data.code === 'OK') {
    return rst.data.data.items
  } else {
    throw new Error(rst.data.msg || '发生未知错误')
  }
}


module.exports = getList