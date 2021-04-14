import request from "@/utils/request";
import queryString from "querystring";

// 订单历史
export async function queryOrderHistory(params) {
  return request(`/server/travel/order/get_history?${queryString.stringify(params)}`);
}

// 导出订单
export async function exportOrder(params) {
  return request(
    `/server/travel/order/export_order_page?${queryString.stringify(params)}`,
    {
      responseType: "blob"
    }
  );
}

// 导出结算
export async function exportSettled(params) {
  return request(
    `/server/travel/order/export_settled_page?${queryString.stringify(params)}`,
    {
      responseType: "blob"
    }
  );
}

// 导出结算
export async function exportWarning(params) {
  return request(
    `/server/travel/order/export_warning_page?${queryString.stringify(params)}`,
    {
      responseType: "blob"
    }
  );
}

// 编辑订单
export async function updateOrder(params) {
  return request("/server/travel/order/update", {
    method: "POST",
    data: {
      ...params
    }
  });
}

// 获取订单分页
export async function queryOrderPage(params) {
  const { page, size, onSuccess, onFailure, ...others } = params;
  const {order_status_list, ...otherParams} = others
  const querys = otherParams
  if (order_status_list === 'WAIT_APPROVAL_OR_PAY') {
    querys.has_pay = false
  } else if (order_status_list) {
    querys.order_status_list = order_status_list
  }
  return request(
    `/server/travel/order/order_page?${queryString.stringify(querys)}`,
    {
      method: "POST",
      data: {
        page,
        size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
    }
  );
}
// 后台取消订单
export async function cancelOrder(id) {
  return request(`/server/travel/order/console_cancel?order_id=${id}`, {
    method: "POST"
  });
}

// 商家取消订单
export async function cancelOrderShop(id) {
  return request(`/server/travel/order/shop_cancel?order_id=${id}`, {
    method: "POST"
  });
}

// 创建订单
export async function createOrder(params) {
  return request("/server/travel/order/create", {
    method: "POST",
    data: {
      ...params
    }
  });
}

// 商家审核完成
export async function shopApproval(id) {
  return request(`/server/travel/order/shop_approval?order_id=${id}`, {
    method: "POST"
  });
}

// 商家批量审核
export async function batchShopApproval(order_ids) {
  return request("/server/travel/order/batch_shop_approval", {
    method: "POST",
    data: { order_ids: [order_ids] }
  });
}

// 商家取消订单
export async function shopCancel(id) {
  return request(`/server/travel/order/shop_cancel?order_id=${id}`, {
    method: "POST"
  });
}

// 删除派单策略
export async function deleteStrategy(id) {
  return request(`/server/travel/order/strategy/delete?id=${id}`, {
    method: "DELETE"
  });
}

// 获取派单策略列表
export async function queryStrategyList() {
  return request("/server/travel/order/strategy/list", {
    method: "POST",
    data: []
  });
}

// 新增/编辑派单策略
export async function saveStrategy(params) {
  return request("/server/travel/order/strategy/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

/* 退款 */

// 退款分页
export async function queryRefundPage(params) {
  const { page, size, onSuccess, onFailure, ...others } = params;
  return request(
    `/server/travel/refund/page?${queryString.stringify(others)}`,
    {
      method: "POST",
      data: {
        page,
        size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
    }
  );
}
// 手动退款
export async function refund(id) {
  return request(`/server/travel/order/refund?order_id=${id}`, {
    method: "POST"
  });
}

// 退款配置
export async function getRefundConfig() {
  return request("/server/travel/refund/config/get");
}

// 新增/修改退款配置
export async function saveRefundConfig(params) {
  return request("/server/travel/refund/config/save", {
    method: "POST",
    data: {
      ...params,
      code: 'order'
    }
  });
}

// 退款配置
export async function getRefundCharteredConfig() {
  return request("/server/travel/refund/config/get_private");
}

// 新增/修改退款配置
export async function saveRefundCharteredConfig(params) {
  return request("/server/travel/refund/config/save", {
    method: "POST",
    data: {
      ...params,
      code: 'private'
    }
  });
}

/* 结算 */

// 结算
export async function settled(id) {
  return request(`/server/travel/order/settled?order_id=${id}`, {
    method: "POST"
  });
}

// 批量结算
export async function batchSettled(order_ids) {
  return request("/server/travel/order/batch_settled", {
    method: "POST",
    data: { order_ids: [order_ids] }
  });
}

// 结算分页
export async function querySettledPage(params) {
  const { page, size, onSuccess, onFailure, ...others } = params;
  return request(
    `/server/travel/order/settled_page?${queryString.stringify(others)}`,
    {
      method: "POST",
      data: {
        page,
        size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
    }
  );
}


// 改变订单状态
export async function changeOrderStatus(params) {
  return request(`/server/travel/order/change_status?${queryString.stringify(params)}`,
  {
    method: "POST"
  })
}

// 改变订单状态
export async function changeExpressNumber(params) {
  return request(`/server/travel/order/change_express_number?${queryString.stringify(params)}`,
  {
    method: "POST"
  })
}