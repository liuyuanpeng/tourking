import request from '@/utils/request';

export async function queryUser() {
  return request(`/server/user/get?user_id=${localStorage.getItem('user-id')}`)
}

export async function queryAuthority() {
  return request(`/server/rbac/user/role/get?user_id=${localStorage.getItem('user-id')}`)
}
