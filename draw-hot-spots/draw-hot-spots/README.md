<!--
 * @Description: 文件描述
 * @Author: ljf
 * @Date: 2023-08-28 17:26:31
 * @LastEditors: ljf
 * @LastEditTime: 2023-08-28 17:39:29
-->

# 安装
```
npm i draw-hot-spots
```
# 注册
```JS
import DrawHotSpots from "draw-hot-spots";

import "draw-hot-spots/draw-hot-spots.css";

Vue.use(DrawHotSpots);
```

# 使用画热区组件
```Vue
 <draw-hot-spots  v-model="mapAreaDatas"></draw-hot-Spots>
 ```

 ###### draw-hot-spots属性
|  属性   | 必须  | 类型 |描述|
|  ----  | ----  |----|----|
| v-model  | 否 |Array |获取热区的信息 |
| img  | 否 |String |热区背景图 |

# 使用渲染热区组件
```Vue
  <render-hot-spots  :mapAreaDatas="mapAreaDatas" :showHotSpot="true" @hot-spots-event="handleHotSpotsEvent"></render-hot-spots>
 ```

 ###### draw-hot-spots属性
|  属性   | 必须  | 类型 |描述|
|  ----  | ----  |----|----|
| mapAreaDatas  | 否 |Array |热区的信息 |
| img  | 否 |String |热区背景图 |
| showHotSpot  | 否 |Boolean | 是否显示热区|
| unit  | 否 |String | 像素单位默认px|
| defaultFontSize  | 否 |Number | 像素单位为rem时设置|

## 最终上线效果

![1693215551593](image/README/1693215551593.png)




