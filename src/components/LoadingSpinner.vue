<template>
        <svg v-if="loading" class="spinner" viewBox="0 0 50 50">
            <circle class="path" :class="type" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>

</template>
<script>
    export  default {
        name: "loadingSpinner",
        props:['type','loading'],
        data(){
            return {
            }
        }
    }
</script>
<style lang="scss" scoped>

    .spinner {
        animation: rotate 2s linear infinite;
        width: 50px;
        height: 50px;
        & .path {
            stroke: hsl(210, 70, 75);
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
        }
        & .black{
            stroke: #151d40;
        }

    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
</style>