<template>
    <div>
        <ConferenceOverview1920 v-if="windowWidth >= 1600" />
        <ConferenceOverview1600 v-else />
    </div>
</template>

<script>
import ConferenceOverview1920 from './components/conferenceOverview1920'
import ConferenceOverview1600 from './components/conferenceOverview1600'
export default {
    name: 'ConferenceOverview',
    components: {
        ConferenceOverview1920,
        ConferenceOverview1600
    },
    data() {
        return {
            windowWidth: window.innerWidth
        }
    },
    methods: {
    }
}
</script>
