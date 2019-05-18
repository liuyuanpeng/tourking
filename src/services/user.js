import request from '@/utils/request';
import { async } from 'q';

export async function queryUser() {
  return request(`/server/user/get?user_id=${localStorage.getItem('user-id')}`)
}

export async function queryAuthority() {
  return request(`/server/rbac/user/role/get?user_id=${localStorage.getItem('user-id')}`)
}

export async function queryUserList(params) {
  return request('/server/console/user/page', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function searchUser(username) {
  return request(`/server/console/user/list?username=${username}`, {
    method: 'POST'
  })
}

export async function checkUser(params) {
  return request(`/server/console/user/check?username=${params.mobile}`)
}

export async function createUser(params) {
  return request('/server/console/user/create', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function addUserRole(params) {
  return request(`/server/rbac/user/role/save?user_id=${params.user_id}&role_id=${params.role_id}`, {
    method: 'POST'
  })
}

export async function updateUser(params) {
  return request('/server/console/user/update', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function killUser(user_id) {
  return request(`/server/console/user/delete?user_id=${user_id}`, {
    method: 'POST'
  })
}