<!--
 * @Description: 渲染热区组件
 * @Author: ljf
 * @Date: 2023-08-28 14:53:22
 * @LastEditors: ljf
 * @LastEditTime: 2023-08-28 15:27:39
-->
 <template>
    <div class="render-hot-spots">
        <img :src="img?img:require('@/assets/multiseriate_ico.png')" />
        <ul :class="{'show-hot-spot':showHotSpot}">
            <li
                v-for="(item, index) in mapAreaDatas"
                :key="index"
                @click="handleClick(item)"
                :style="{
              top: `${parseInt(item.top) / defaultFontSize}${unit}`,
              left: `${parseInt(item.left) / defaultFontSize}${unit}`,
              width: `${parseInt(item.width) / defaultFontSize}${unit}`,
              height: `${parseInt(item.height) / defaultFontSize}${unit}`,
            }"></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'RenderHotSpots',
    props: {
        mapAreaDatas: {
            type: Array,
            default: () => []
        },
        img: {
            type: String,
            default: ''
        },
        unit: {
            type: String,
            default: 'px'
        },
        defaultFontSize: {
            type: Number,
            default: 1
        },
        showHotSpot: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(item) {
            this.$emit('hot-spots-event', item);
        }
    }
};
</script>

<style lang="scss" scoped>
.render-hot-spots {
    position: relative;
    img {
        width: 100%;
    }
    ul {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        li {
            position: absolute;
            display: block;
        }
    }
    .show-hot-spot {
        li {
            background: rgb(0, 0, 0);
            filter: opacity(50%);
            border: 2px dashed #f7f7f7;
        }
    }
}
</style>