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

app.model({ namespace: 'address', ...(require('/Volumes/Storage_T5/tourking/src/models/address.js').default) });
app.model({ namespace: 'car_type', ...(require('/Volumes/Storage_T5/tourking/src/models/car_type.js').default) });
app.model({ namespace: 'car', ...(require('/Volumes/Storage_T5/tourking/src/models/car.js').default) });
app.model({ namespace: 'city', ...(require('/Volumes/Storage_T5/tourking/src/models/city.js').default) });
app.model({ namespace: 'consume', ...(require('/Volumes/Storage_T5/tourking/src/models/consume.js').default) });
app.model({ namespace: 'coupon', ...(require('/Volumes/Storage_T5/tourking/src/models/coupon.js').default) });
app.model({ namespace: 'discovery', ...(require('/Volumes/Storage_T5/tourking/src/models/discovery.js').default) });
app.model({ namespace: 'driver', ...(require('/Volumes/Storage_T5/tourking/src/models/driver.js').default) });
app.model({ namespace: 'employee', ...(require('/Volumes/Storage_T5/tourking/src/models/employee.js').default) });
app.model({ namespace: 'global', ...(require('/Volumes/Storage_T5/tourking/src/models/global.js').default) });
app.model({ namespace: 'hotsearch', ...(require('/Volumes/Storage_T5/tourking/src/models/hotsearch.js').default) });
app.model({ namespace: 'list', ...(require('/Volumes/Storage_T5/tourking/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Volumes/Storage_T5/tourking/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Volumes/Storage_T5/tourking/src/models/menu.js').default) });
app.model({ namespace: 'order', ...(require('/Volumes/Storage_T5/tourking/src/models/order.js').default) });
app.model({ namespace: 'price', ...(require('/Volumes/Storage_T5/tourking/src/models/price.js').default) });
app.model({ namespace: 'product', ...(require('/Volumes/Storage_T5/tourking/src/models/product.js').default) });
app.model({ namespace: 'project', ...(require('/Volumes/Storage_T5/tourking/src/models/project.js').default) });
app.model({ namespace: 'role', ...(require('/Volumes/Storage_T5/tourking/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('/Volumes/Storage_T5/tourking/src/models/setting.js').default) });
app.model({ namespace: 'shop', ...(require('/Volumes/Storage_T5/tourking/src/models/shop.js').default) });
app.model({ namespace: 'sit', ...(require('/Volumes/Storage_T5/tourking/src/models/sit.js').default) });
app.model({ namespace: 'user', ...(require('/Volumes/Storage_T5/tourking/src/models/user.js').default) });
