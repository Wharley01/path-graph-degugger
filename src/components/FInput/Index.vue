<template>
        <div class="relative">
                <slot></slot>
                <Input
                        @updateInput="receiveInput"
                        :_value="data.value"
                        :type="_type"
                        :placeholder="placeholder"
                        :list="list"
                        :class="className"
                        class="default"
                        :errors="data.errors"/>
                <a @click="show_password = !show_password" v-if="type == 'password'" class="absolute pswd-eye txt-c-black-shade-1 txt-s-md">
                        <span v-show="show_password"><span  data-icon="ion-md-eye" class="simple-svg"></span></span>
                        <span v-show="!show_password"><span  data-icon="mdi-eye-off-outline" class="simple-svg"></span></span>

                </a>
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
        import Input from "./Input.vue";
    export default {
        inheritAttrs: true,
        data(){
          return {
              show_password: false
          }
        },
        name:"FInput",
        props:[
            "loading",
            "data",
            "placeholder",
            "label",
            "className",
            "type",
            "list"
        ],
        components:{
            Input
        },
        methods:{
            receiveInput(e){
                this.data.value = e;
            }
        },
        created(){
            console.log(this.$attrs)
        },
        computed:{
            _type(){
                return this.show_password ? 'text':this.type;
            }
        }

    }

</script>
<style lang="scss" scoped>
        .pswd-eye{
                bottom: 12px;
                right: 20px;
        }
</style>