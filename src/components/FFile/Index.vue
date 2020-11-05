<template>
    <div>
        <input type="file" @change="fetchFile" class="default" placeholder="" :class="{'error':(data.errors.length > 0)}"/>
        <div v-if="data.errors.length > 0" class="error-list">
            <ul>
                <template v-for="(error,index) in data.errors">
                    <li>{{error.msg}}</li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        inheritAttrs: true,
        name:"FFile",
        props:["is_loading","data"],
        methods:{
            fetchFile(elem){
                this.data.value = elem.target.files[0];
            }
        }
    }

</script>