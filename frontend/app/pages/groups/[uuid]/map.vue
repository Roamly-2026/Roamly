<!-- frontend/app/pages/groups/[uuid]/map.vue -->   
<template>
    <div>
        <ClientOnly>
            <template #fallback>
                <div class="fixed inset-0 flex items-center justify-center z-0">
                    <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
                </div>
            </template>
            <div class="fixed inset-0 z-0 bg-surface-500/20">
                <MapDesktop
                    v-if="!isLoading && mapCoordinates"
                    :latitude="mapCoordinates.latitude"
                    :longitude="mapCoordinates.longitude"
                />

                <div v-else-if="error">
                    <span :class="appConfig.typography.statusError">{{ UI_TEXT.common.error }}</span>
                </div>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
    /* --- IMPORTS --- */
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useAppConfig } from '#imports';
    import { useProtectedPage } from '~/composables/useProtectedPage';
    import { useEventsQuery } from '~/queries/events.query';

    /* --- PAGE CONFIGURATION --- */
    definePageMeta({ layout: 'general', middleware: ['auth'] });

    /* --- COMPOSABLES & STORES --- */
    useProtectedPage();
    const route = useRoute();
    const appConfig = useAppConfig();

    /* --- STATE & COMPUTED --- */
    const groupUuid = computed(() => route.params.uuid as string);

    /* --- API QUERIES --- */
    // const { data: groupInfos, isLoading, error } = useGroupInfosQuery(groupUuid);
    const { data: events, isLoading, error } = useEventsQuery(groupUuid);

    /* --- MAP LOGIC --- */
    // wants to get the lat-lng feom the group 
    // (needs to be rewritten, lat-lng is stored at the events)
    const mapCoordinates = computed(() => {
        // if (groupInfos.value?.latitude && groupInfos.value?.longitude) {
        //     return {
        //         latitude: Number(groupInfos.value.latitude),
        //         longitude: Number(groupInfos.value.longitude)
        //     };
        // }

        return {
            latitude: 44.111979,
            longitude: 24.347248
        };
    });
</script>