/*
 * @Description: 文件描述
 * @Author: ljf
 * @Date: 2023-08-28 15:30:07
 * @LastEditors: ljf
 * @LastEditTime: 2023-08-28 15:32:18
 */
import RenderHotSpots from "../package/RenderHotSpots.vue"; 
import DrawHotSpots from "../package/DrawHotSpots.vue"; 
const coms = [RenderHotSpots,DrawHotSpots]; 
// 批量组件注册
const install = function (Vue) {
  coms.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install; // 这个方法以后再使用的时候可以被use调用