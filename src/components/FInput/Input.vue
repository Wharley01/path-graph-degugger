<template>
    <input @input="updateInput()" v-model="input"  :class="{'error':(errors.length > 0)}"
    />
</template>
<script>
    export default {
        inheritAttrs: true,
        name:"FInput",
        props:["loading","_value","errors"],
        data(){
          return {
              input:""
          }
        },
        created(){
            this.input = this._value;
        },
        methods:{
            updateInput(e){
                this.$emit("updateInput",this.input)
            }
        }
    }

</script>