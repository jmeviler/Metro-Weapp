import regeneratorRuntime from './utils/regeneratorRuntime'
import WxCloud from './WxCloud'
import Engine from './Engine'

export default class Map {
  static getNearStations = async (params = {}) => {
    const query = {
      key: '672c7cfd4b15ea6c1136e43b7e3e721b',
      platform: 'WXJS',
      appname: 'metro-lite',
      sdkversion: '1.2.0',
      logversion: '2.0',
      types: '150500',
      keywords: '地铁',
      radius: '3000',
      extensions: 'base',
      ...params,
    }

    const { data } = await WxCloud.request(`https://restapi.amap.com/v3/place/around?${Engine.formatQuery(query)}`)
    return data
  }
}
