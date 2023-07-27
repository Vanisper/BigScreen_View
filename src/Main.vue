<template>
    <n-message-provider>
        <router-view>
            <!-- 缓存处理 -->
            <template #default="{ Component, route }">
                <component v-if='!route.meta.keepAlive' :is="Component" :key="route.fullPath"></component>
                <keep-alive v-else>
                    <component :is="Component" :key="route.fullPath"></component>
                </keep-alive>
            </template>
        </router-view>
    </n-message-provider>
</template>

<script lang="ts" setup>
import { NMessageProvider } from "naive-ui";
</script>

