import Vue from 'vue'

let websocket: WebSocket
export const getWebsocket = () => {
  if (websocket !== undefined) {
    console.log('ws not undefined')
    return websocket
  } else {
    console.log('ws is undefined')
    Vue.prototype.websocket = new WebSocket('ws://localhost:8600/ws/h264')
    Vue.prototype.websocket.onopen = (e: any) => {
      console.log('connection established')
    }
    Vue.prototype.websocket.onmessage = (e: any) => {
      console.log(e.data)
    }
    Vue.prototype.websocket.onerror = (e: any) => {
      console.log('connection error')
    }
    websocket = Vue.prototype.websocket
    return websocket
  }
}

export const setWebsocket = (ws: WebSocket) => {
  Vue.prototype.websocket = ws
  websocket = Vue.prototype.websocket
}
