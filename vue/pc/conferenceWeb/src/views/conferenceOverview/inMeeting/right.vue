<template>
    <div style="height:100%">
        <div class="tianqiyubao" style="height:15%">
            <WeatherForecast />
        </div>
        <div class="riqi" style="height:85%">
            <DateAndTimeLineForOverview />
        </div>
    </div>
</template>

<script>
import DateAndTimeLineForOverview from '@/views/common/dateAndTimeLineForOverview'
import WeatherForecast from '@/views/common/weatherForecast'
export default {
    name: 'InMeetingRight',
    components: {
        DateAndTimeLineForOverview,
        WeatherForecast
    }
}
</script>

<style scoped>
    .tianqiyubao {
        background-color: #ffffff;
        padding-top:10px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
