<template>
    <div id="app">
        <div>
            <h2>划热区组件：</h2>
            <draw-hot-spots class="draw" v-model="mapAreaDatas"></draw-hot-Spots>
        </div>
        <div>
            <h2>渲染热区组件：</h2>
            <render-hot-spots class="render" :mapAreaDatas="mapAreaDatas" :showHotSpot="true"
                              @hot-spots-event="handleHotSpotsEvent"></render-hot-spots>
        </div>
    </div>
</template>

<script>
import DrawHotSpots from './package/DrawHotSpots.vue';
import RenderHotSpots from './package/RenderHotSpots.vue';

export default {
    name: 'App',
    components: {
        DrawHotSpots,
        RenderHotSpots
    },
    data() {
        return {
            mapAreaDatas: []
        };
    },
    methods: {
        handleHotSpotsEvent(val) {
            alert(JSON.stringify(val));
        }
    }
};
</script>

<style lang="scss" scoped>
#app {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    .draw {
        width: 400px;
        border: 1px solid;
    }
    .render {
        width: 400px;
        border: 1px solid;
    }
}
</style>
