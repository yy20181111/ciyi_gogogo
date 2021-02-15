import {
  Button,
  Input,
  Message
} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Message)
  }
}

export default element