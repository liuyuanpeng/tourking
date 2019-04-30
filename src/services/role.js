import request from '@/utils/request';

export async function queryRoles() {
  return request('/server/rbac/role/list', {
    method: 'POST'
  })
}

export async function deleteRole(id) {
  return request(`/server/rbac/role/delete?role_id=${id}`)
}

export async function saveRole(params) {
  return request('/server/rbac/role/save', {
    method: 'POST',
    data: {
      ...params
    }
  })
}