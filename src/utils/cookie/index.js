//保存token
const token = 'admin-token'
export function setToken(value){
  sessionStorage.setItem(token, value)
}

