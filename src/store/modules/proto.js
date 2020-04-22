export default {
  state: {
    errorCode: null,
  },
  mutations: {
    setProto(state, payload) {
      if (payload.errorCode)
      {
        state.errorCode = payload.errorCode
      }else{
        if (payload.cmd == 1001)
        {
          state.user = payload.data
            
        }
        else if (payload.cmd == 2001)
        {
          state.player = payload.data
        }
      }
    }
  },
  actions: {

  },
  getters: {

  }
}