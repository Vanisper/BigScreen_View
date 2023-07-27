<script setup lang="ts">
import HistoricalPrices from './components/HistoricalPrices/index.vue'
import MyInfos from "./components/Infos/index.vue";
import MyMap from "./components/Map/index.vue";
import AllPage from "./components/All/index.vue"
import { IGeoJSON } from "./types";
import { NTabs, NTabPane, NMessageProvider } from "naive-ui";
import { onActivated, onMounted, ref, watch } from "vue";


</script>

<template>
  <n-message-provider>
    <!-- <n-tabs type="segment" class="tabs" size="small">
      <n-tab-pane class="tab-pane" name="index" tab="首页">
        <all-page></all-page>
      </n-tab-pane>
      <n-tab-pane class="tab-pane-map tab-pane" name="map" tab="地图">
        <my-map class="tab-pane-map-item" :MapGeojson="GaoChunGeoJson" :Value="MapData" :Title="`高淳区`"
          :SubTitle="`GaoChun`" />
        <my-map class="tab-pane-map-item" :MapGeojson="LiShuiGeoJson" :Value="MapData" :Title="`溧水区`"
          :SubTitle="`LiShui`" />
      </n-tab-pane>
      <n-tab-pane class="tab-pane" name="infos" tab="养殖信息">
        <my-infos class="tab-pane-common-item" :FarmerData="farmerData"></my-infos>
      </n-tab-pane>
      <n-tab-pane class="tab-pane" name="historical-prices" tab="价格指数">
        <historical-prices class="tab-pane-common-item"></historical-prices>
      </n-tab-pane>
    </n-tabs> -->
  </n-message-provider>
</template>

<style scoped lang="less">
.tabs {
  height: 100%;
}

.tab-pane {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow-x: hidden;

  .tab-pane-common-item {
    flex-grow: 1;
  }
}

.tab-pane-map {
  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }

  .tab-pane-map-item {
    @media screen and (min-width: 1024px) {
      width: 50%;
    }
  }
}
</style>