import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'address', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/address.js').default) });
app.model({ namespace: 'car_type', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/car_type.js').default) });
app.model({ namespace: 'car', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/car.js').default) });
app.model({ namespace: 'consume', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/consume.js').default) });
app.model({ namespace: 'driver', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/driver.js').default) });
app.model({ namespace: 'employee', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/employee.js').default) });
app.model({ namespace: 'global', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/menu.js').default) });
app.model({ namespace: 'order', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/order.js').default) });
app.model({ namespace: 'price', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/price.js').default) });
app.model({ namespace: 'project', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/project.js').default) });
app.model({ namespace: 'role', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/setting.js').default) });
app.model({ namespace: 'shop', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/shop.js').default) });
app.model({ namespace: 'user', ...(require('/Users/liuyuanpeng/Documents/tourking/src/models/user.js').default) });
