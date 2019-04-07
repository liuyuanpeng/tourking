import durex from '@gem-mine/durex'
import request from '@gem-mine/request'
const { example } = request

durex.model({
  name: 'example',
  state: {
    count: 7
  },
  reducers: {
    change(n) {
      return this.setField({
        count: prev => prev + n
      })
    }
  },
  effects: {
    corsGet() {
      example
        .get('/mock', {
          params: {
            q: 'hello'
          }
        })
        .then(data => {
          this.setField({
            data
          })
        })
    },
    corsPost() {
      example
        .post('/mock', {
          data: {
            name: 'tom'
          }
        })
        .then(data => {
          this.setField({ data })
        })
    }
  }
})
