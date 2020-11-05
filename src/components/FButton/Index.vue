<template>
    <button :disabled="loading" class="flex"><slot class="m-t-auto m-b-auto" v-if="!loading"></slot><Spinner class="m-t-auto m-b-auto" width="20px" height="20px" v-if="loading"></Spinner></button>
</template>
<script>
    import Spinner from "../Spinner/Index.vue";
    export default {
        inheritAttrs: true,
        name:"FButton",
        props:["loading","data","click"],
        components:{
            Spinner
        }
//    {{is_loading ? 'Loading...':'Login to Dashboard'}}
    }

</script>