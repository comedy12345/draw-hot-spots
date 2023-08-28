<!--
 * @Description: 画热区组件
 * @Author: ljf
 * @Date: 2022-08-01 17:24:19
 * @LastEditors: ljf
 * @LastEditTime: 2023-08-28 14:45:12
-->
<template>
    <div class="draw-hot-spots">
        <img :src="img?img:require('@/assets/multiseriate_ico.png')" />
        <ul class="hz-m-area" @mousedown="handleDrawMap" ref="mapArea">
            <li v-for="({left,top,width,height,key},index)  in mapAreaDatas" :key="key"
                class="hz-m-item"
                :style="{left,top,width,height}"
                @mousedown="handleMoveItem(key,parseInt(left),parseInt(top),parseInt(width),parseInt(height),$event)"
                @mousemove="handleIsBorder">
                <span>{{ index+1 }}</span>
                <div v-if="parseInt(width)>=15&&parseInt(height)>=15" @click="handleremove(key)">
                    +
                </div>
            </li>
        </ul>
    </div>

</template>

<script>
import { nanoid } from 'nanoid';
export default {
    name: 'drawHotSpots',
    model: {
        prop: 'mapAreaDatas'
    },
    props: {
        img: {
            type: String,
            default: ''
        },
        /* eslint-disable */
        mapAreaDatas: {
            type: Array,
            default: () => []
        }
    },

    methods: {
        handleremove(key) {
            this.mapAreaDatas.splice(
                this.mapAreaDatas.findIndex(filterItem => filterItem.key == key),
                1
            );
        },

        // 画热区
        handleDrawMap(e) {
            e.preventDefault();

            let createFalg = false;

            // 鼠标按下时的位置，用于计算热区需要画多大
            const initOffsetX = e.pageX;
            const initOffsetY = e.pageY;

            // 父容器高宽
            const parentNodeH = e.target.parentNode.offsetHeight;
            const parentNodeW = e.target.parentNode.offsetWidth;

            // 鼠标在父容器内的位置，这个用于确定热区画在哪里
            const offsetX = e.offsetX;
            const offsetY = e.offsetY;

            const index = e.target.children.length;

            const mapArea = {
                key: nanoid()
            };

            const move = mouse => {
                mouse.stopPropagation();
                // 鼠标当前位置减去初始位置，得到拖了多少距离，这个距离就算热区的大小
                const moveX = mouse.pageX - initOffsetX;
                const moveY = mouse.pageY - initOffsetY;
                const moveXAbs = Math.abs(mouse.pageX - initOffsetX);
                const moveYAbs = Math.abs(mouse.pageY - initOffsetY);

                // 拖动距离大于0就可以创建热区，createFalg用于控制只创建一次
                if (!createFalg) {
                    // 设置热区位置
                    mapArea.left = offsetX + 'px';
                    mapArea.top = offsetY + 'px';
                    this.$set(this.mapAreaDatas, index, mapArea);
                    createFalg = true;
                }
                // 实时计算热区大小，这里有个边界判断
                if (offsetX + moveX <= parentNodeW && offsetX + moveX >= 0) {
                    mapArea.width = moveXAbs + 'px';
                    if (moveX <= 0) {
                        mapArea.left = offsetX + moveX + 'px';
                    } else {
                        mapArea.left = offsetX + 'px';
                    }
                    this.$set(this.mapAreaDatas, index, mapArea);
                }
                // 实时计算热区大小，这里有个边界判断
                if (offsetY + moveY <= parentNodeH && offsetY + moveY >= 0) {
                    mapArea.height = moveYAbs + 'px';
                    if (moveY <= 0) {
                        mapArea.top = offsetY + moveY + 'px';
                    } else {
                        mapArea.top = offsetY + 'px';
                    }
                    this.$set(this.mapAreaDatas, index, mapArea);
                }
                // 优化拖拉
                this.optimizedDrag(offsetX, offsetY, moveX, moveY, mapArea.width, mapArea.height, parentNodeH, parentNodeW, index);
            };

            const mouseup = () => {
                if (parseInt(mapArea.width) < 20 || parseInt(mapArea.height) < 20) {
                    this.$delete(this.mapAreaDatas, index);
                }
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', mouseup);
            };

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', mouseup);
        },
        /**
         * 拖拉的速度大于mousemove事件触发频率就会出现问题，
         * 用这个方法来解决
         * @param {*} offsetX 鼠标按下时在容器中的x坐标
         * @param {*} offsetY 鼠标按下时在容器中的Y坐标
         * @param {*} moveX 鼠标x轴移动了多少
         * @param {*} moveY 鼠标Y轴移动了多少
         * @param {*} width 热区实时宽
         * @param {*} height 热区实时高
         * @param {*} parentNodeH 父容器高
         * @param {*} parentNodeW 父容器宽
         * @param {*} index 热区下标
         */
        optimizedDrag(offsetX, offsetY, moveX, moveY, width, height, parentNodeH, parentNodeW, index) {
            const topY = offsetY + moveY < 0 && offsetY - parseInt(height) > 0;
            const bootomY = offsetY + moveY >= parentNodeH && offsetY + parseInt(height) < parentNodeH;
            const leftX = offsetX + moveX < 0 && offsetX - parseInt(width) > 0;
            const rightX = offsetX + moveX >= parentNodeW && offsetX + parseInt(width) < parentNodeW;

            if (topY) {
                this.mapAreaDatas[index].top = 0;
                this.mapAreaDatas[index].height = offsetY + 'px';
                this.$forceUpdate();
            }
            if (bootomY) {
                this.mapAreaDatas[index].height = parentNodeH - offsetY + 'px';
                this.mapAreaDatas[index].top = offsetY + 'px';
                this.$forceUpdate();
            }

            if (leftX) {
                this.mapAreaDatas[index].left = 0;
                this.mapAreaDatas[index].width = offsetX + 'px';
                this.$forceUpdate();
            }
            if (rightX) {
                this.mapAreaDatas[index].width = parentNodeW - offsetX + 'px';
                this.mapAreaDatas[index].left = offsetX + 'px';
                this.$forceUpdate();
            }
        },

        // 鼠标触碰边框
        handleIsBorder(e) {
            const target = e.target;

            // 给点模糊值太精确了不好触碰到
            const exceed = 10;
            const interior = 10;

            // 热区宽高
            const rightBorder = target.offsetWidth;
            const bootomBorder = target.offsetHeight;

            // 设置鼠标样式
            const setCursor = (cursor, location) => {
                target.style.cursor = cursor;
                if (location) return target.setAttribute('hvSize', location);
                target.removeAttribute('hvSize');
            };

            const topB = e.offsetY > -exceed && e.offsetY < interior;
            const bootomB = e.offsetY > bootomBorder - interior && e.offsetY < bootomBorder + exceed;
            const leftB = e.offsetX > -exceed && e.offsetX < interior;
            const rightB = e.offsetX > rightBorder - interior && e.offsetX < rightBorder + exceed;

            // 左上
            if (leftB && topB) setCursor('nw-resize', 'LEFT-TOP');
            // 右上
            else if (rightB && topB) setCursor('ne-resize', 'RIGHT-TOP');
            // 右下
            else if (rightB && bootomB) setCursor('se-resize', 'RIGHT-BOOTOM');
            // 左下
            else if (leftB && bootomB) setCursor('sw-resize', 'LEFT-BOOTOM');
            // 上边框
            else if (topB) setCursor('s-resize', 'TOP');
            // 下边框
            else if (bootomB) setCursor('s-resize', 'BOOTOM');
            // 左边框
            else if (leftB) setCursor('w-resize', 'LEFT');
            // 右边框
            else if (rightB) setCursor('e-resize', 'RIGHT');
            // 在热区内部但是不在边框上
            else if (e.offsetY > interior && e.offsetY < bootomBorder - interior) setCursor('move');
            // 出界
            else setCursor('crosshair');
        },

        // 移动热区/缩放热区
        handleMoveItem(key, offsetLeft, offsetTop, currNodeW, currNodeH, e) {
            e.stopPropagation();
            e.preventDefault();

            // 是否缩放
            const hvSize = e.target.getAttribute('hvSize');

            // 父容器高宽
            const parentNodeH = this.$refs.mapArea.offsetHeight;
            const parentNodeW = this.$refs.mapArea.offsetWidth;

            // 要移动多少距离
            let moveX = 0;
            let moveY = 0;

            // 鼠标第一次按下位置
            const initOffsetX = e.pageX;
            const initOffsetY = e.pageY;

            // 当前操作热区
            const mapArea = this.mapAreaDatas.find(item => item.key == key);

            const mousemove = mouse => {
                mouse.stopPropagation();
                mouse.preventDefault();

                // 热区初始位置+鼠标当前位置-鼠标初始位置=热区最终位置
                moveX = offsetLeft + mouse.pageX - initOffsetX;

                moveY = offsetTop + mouse.pageY - initOffsetY;

                // 移动
                if (!hvSize) {
                    // 设置边界
                    if (moveX < 0) moveX = 0;
                    if (moveX > parentNodeW - currNodeW) moveX = parentNodeW - currNodeW;
                    if (moveY < 0) moveY = 0;
                    if (moveY > parentNodeH - currNodeH) moveY = parentNodeH - currNodeH;
                    mapArea.left = moveX + 'px';
                    mapArea.top = moveY + 'px';
                    this.$forceUpdate();
                    return;
                }

                // 改变热区大小对象
                const executeDrag = {
                    BOOTOM() {
                        let sizeH = currNodeH + mouse.pageY - initOffsetY;
                        if (parseInt(mapArea.top) + sizeH >= parentNodeH) sizeH = parentNodeH - parseInt(mapArea.top);
                        if (sizeH < 20) return;
                        mapArea.height = sizeH + 'px';
                    },
                    RIGHT() {
                        let sizeW = currNodeW + mouse.pageX - initOffsetX;
                        if (parseInt(mapArea.left) + sizeW >= parentNodeW) sizeW = parentNodeW - parseInt(mapArea.left);
                        if (sizeW < 20) return;
                        mapArea.width = sizeW + 'px';
                    },
                    TOP() {
                        let sizeH = currNodeH + initOffsetY - mouse.pageY;
                        if (sizeH < 20) return;
                        if (moveY < 0) {
                            mapArea.height = currNodeH + offsetTop + 'px';
                            mapArea.top = 0;
                        } else {
                            mapArea.height = sizeH + 'px';
                            mapArea.top = moveY + 'px';
                        }
                    },
                    LEFT() {
                        let sizeW = currNodeW + initOffsetX - mouse.pageX;
                        if (sizeW < 20) return;
                        if (moveX < 0) {
                            mapArea.left = 0;
                            mapArea.width = currNodeW + offsetLeft + 'px';
                        } else {
                            mapArea.width = sizeW + 'px';
                            mapArea.left = moveX + 'px';
                        }
                    },
                    'LEFT-TOP'() {
                        this.LEFT();
                        this.TOP();
                    },
                    'LEFT-BOOTOM'() {
                        this.LEFT();
                        this.BOOTOM();
                    },
                    'RIGHT-TOP'() {
                        this.RIGHT();
                        this.TOP();
                    },
                    'RIGHT-BOOTOM'() {
                        this.RIGHT();
                        this.BOOTOM();
                    }
                };
                executeDrag[hvSize]();
                this.$forceUpdate();
            };

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', () => window.removeEventListener('mousemove', mousemove));
        }
    }
};
</script>
<style lang="scss" scoped>
.draw-hot-spots {
    width: 100%;
    position: relative;
    cursor: crosshair;
    margin: auto;
    text-align: center;
    img {
        display: block;
        width: 100%;
        object-fit: cover;
    }
    .hz-m-area {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: absolute;
        left: 0;
        top: 0;
        ::v-deep .hz-m-item {
            box-sizing: border-box;
            position: absolute;
            background: rgb(0, 0, 0);
            filter: opacity(50%);
            border: 2px dashed #f7f7f7;
            display: inline-block;
            cursor: move;
            &:hover {
                background: rgb(17, 0, 255);
                filter: opacity(50%);
            }
            span {
                position: absolute;
                left: 0;
                top: 0;
                padding: 0px 4px;
                color: white;
            }
            div {
                transform: rotate(45deg);
                color: white;
                float: right;
                height: 15px;
                width: 15px;
                border-radius: 50%;
                line-height: 15px;
                text-align: center;
                z-index: 999;
                font-size: 30px;
                margin-right: 5px;
                margin-top: 5px;
                &:hover {
                    cursor: pointer !important;
                }
            }
        }
    }
}
</style>


