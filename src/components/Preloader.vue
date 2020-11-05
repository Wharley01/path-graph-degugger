<template>
<div class="preloader" v-if="loading">
    <div class="loader-wrap-global" :class="{'load-global': loading}">
    </div>
</div>
</template>
<script>

    export default {
        name:"Preloader",
        props:['loading'],
        components:{

        }
    }
</script>
<style lang="scss" scoped>
    .preloader{
        height: 100vh;
        width: 100%;
        position: fixed;
        left:0;
        top:0;
        display: flex;
        justify-content: center;
        >.loader{
            margin: auto;
        }
        background: rgba(255, 255, 255, 0.59);
        z-index: 214748364793434;
    }


    .loader-wrap-global{
        height: 4px;
        width: 0%;
        position: fixed;
        left:1%;
        top: 0;
    }
    .loader-wrap-global.load-global{
        animation: loading-anim 1s infinite;
        background: -webkit-linear-gradient(90deg, rgb(237, 74, 22), rgb(34, 117, 200));
        background: linear-gradient(90deg, rgb(237, 74, 22), rgb(34, 117, 200));
        height: 8px;

    }

    @keyframes loading-anim {
        0% {
            left:1%;
            width: 40%;
        }
        20% {
            left:60%;
            width: 40%;

        }
        40% {
            left:30%;
            width: 30%;
        }

        60% {
            left:20%;
            width: 50%;
        }

        70% {
            left:10%;
            width: 60%;
        }

        90% {
            left:40%;
            width: 50%;
        }

        100% {
            left:1%;
            width: 40%;
        }
    }

</style>