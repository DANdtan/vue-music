const _baseUrl2 = 'https://api.imjad.cn/cloudmusic/'
const localAddress='http://127.0.0.1:3001'
export default {
  getPlayListByWhere (cat, order, offset, total, limit) {
    return localAddress + '/playlist?cat=' + cat + '&offset=' + offset + '&limit=' + limit
  },
  getLrc (id) {
    return _baseUrl2 + '?type=lyric&id=' + id
  },
  getSong (id) {
    return _baseUrl2 + '?type=song&br=128000&id=' + id
  },
  getPlayListDetail (id) {
    return _baseUrl2 + '?type=playlist&id=' + id
  },
  getMv (id) {
    return _baseUrl2 + '?type=mv&id=' + id
  },
  search (words) {
    return _baseUrl2 + '?type=search&s=' + words
  }
}
