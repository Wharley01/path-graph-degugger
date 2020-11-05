<template>
    <div class="bg-grey p-x2">
      <div class="bg-grey-shade-1">
      <div class="flex bg-grey-shade-3 p-x4">
        <input :list="rand_elem_id" autofocus class="input-x1 m-t-auto m-b-auto" title="Service class name" v-model="service.name" placeholder="Service name" style="max-width: 150px">
        <datalist :id="rand_elem_id">
          <option v-for="s in suggestions" :value="s"></option>
        </datalist>
        <input v-if="service.as !== null && service.type === 'service'" class="input-x1 m-t-auto m-b-auto"  v-model="service.as" placeholder="Alias" style="max-width: 100px">
        <div class="flex m-t-auto m-b-auto" v-if="service.type === 'service'">
          <button type="button" class="txt-s-x7 bg-pry-shade-3 button-x1 p-x2 m-l-x3  txt-c-white" @click="addChild('column')">
            <i class="fa fa-columns"></i>
          </button>
          <button type="button" class="txt-s-x7 bg-pry button-x1 p-x2 m-l-x3 txt-c-white" @click="addChild('service')">
            <i class="fas fa-folder-plus"></i>
          </button>
        </div>
        <button type="button" v-if="service.as !== null" class="txt-s-x7 button-x1 bg-error m-t-auto m-b-auto p-x2 m-r-x2 m-l-x3" @click="removeChild"><i class="fa fa-trash"></i></button>
        <div v-if="service.type === 'service'" class="flex m-l-auto">
          <div>
            <label>Function</label><br>
            <input  title="Function" class="input-x1" v-model="service.func" placeholder="function" style="max-width: 100px">
          </div>
          <div>
            <label>Page</label><br>
            <input  class="input-x1"  v-model="service.page" placeholder="Alias" style="max-width: 50px">
          </div>
        </div>

      </div>
        <div v-if="service.type === 'service'" class="bg-grey-shade-3 p-x7">
          <div class="grid-1x1 grid grid-col-gap-x6">
            <div>
              <div class="bd-b-x1 flex bd-c-grey m-b-x4">
                <b class="m-t-none m-b-x2">Params:</b>
              </div>
              <template >
                <div v-if="Object.keys(service.params).length" v-for="(param_value,param_key) in service.params" class="flex m-t-x3">
                  <span class="m-t-auto m-b-auto m-r-x2 inline-block m-r-x6" style="white-space: nowrap">{{param_key}}:</span>
                  <input class="input-x1" v-model="service.params[param_key]"><button type="button"  class="txt-s-x5 button-x1 bg-error p-x2 m-l-x3" @click="removeParam(param_key)"><i class="fa fa-trash"></i></button>
                </div>
              </template>
              <div class="bg-grey-shade-3 p-x4 flex m-t-x7">
                <input @keypress.enter="addParam" class="input-x1" v-model="new_param_key"><b class="m-t-auto m-b-auto txt-s-x6">:</b><input @keypress.enter="addParam" class="input-x1" v-model="new_param_val"><button type="button" class="txt-s-x5  button-x1 p-x2 m-l-x3" @click="addParam"><i class="fa fa-check"></i></button>
              </div>
            </div>
            <div>
              <div class="bd-b-x1 flex bd-c-grey m-b-x4">
                <b class="m-t-none m-b-x2">Filters:</b>
              </div>
              <template>
                <div v-if="Object.keys(service.filters).length" v-for="(post_value,post_key) in service.filters" class="flex m-t-x3">
                  <span class="m-t-auto m-b-auto inline-block m-r-x6" style="white-space: nowrap">{{post_key}}:</span><input class="input-x1 m-r-auto" v-model="service.filters[post_key]"><button type="button"  class="txt-s-x5 button-x1 bg-error p-x2 m-l-x3" @click="removeFilter(post_key)"><i class="fa fa-trash"></i></button>
                </div>
              </template>
              <div class="bg-grey-shade-3 p-x4 flex m-t-x7">
                <input @keypress.enter="addFilter" class="input-x1" v-model="new_filter_key"><b class="m-t-auto m-b-auto txt-s-x6">:</b><input @keypress.enter="addFilter" class="input-x1" v-model="new_filter_val"><button type="button" class="txt-s-x5  button-x1 p-x2 m-l-x3" @click="addFilter"><i class="fa fa-check"></i></button>
              </div>
            </div>
          </div>

        </div>
        <div v-if="service.children.length" class="m-x3 p-x5">
          <slot></slot>
        </div>
      </div>



    </div>
</template>

<script>

  import ServiceList from './ServiceList'

  export default {
    name: 'Service',
    components: {
      ServiceLister: ServiceList
    },
    props:{
      service:{
        type: Object
      },
      service_name:{
        type: String
      },
      service_list:{
        type: Object,
        default(){
          return {}
        }
      },
      tree:{
        type: Array
      },
      index:{
        type: Number
      },
      is_root: {
        type: Boolean,
        default: false
      },
      request_method: {
        type: String,
        default: "request_method"
      }
    },
    updated(){

    },
    data:() => ({
      new_param_key: null,
      new_param_val: null,
      new_filter_key: null,
      new_filter_val: null,
      func: null
    }),
    created(){
      this.bindProperFunc();
    },
    methods:{
      bindProperFunc(){
        if(!this.func)
          this.func = this.service.func;

        if(this.request_method === "POST")
          this.service.func = "set"
        if(this.request_method === "PATCH")
          this.service.func = "update"
        if(this.request_method === "GET")
          this.service.func = this.func

      },
      addChild(type){
        let name = type === "service" ? "SubService":"column"
        let children = this.service.children
        children.push({
          name:'',
          type,
          as: '',
          page: 1,
          func:'getOne',
          params:{},
          filters:{},
          children:[]
        });
        this.$set(this.service,'children',children);
      },
      removeChild(){
        this.tree.splice(this.index,1);
      },
      addFilter(){
        this.$set(this.service.filters,this.new_filter_key,this.new_filter_val);
        this.new_filter_val = null;
        this.new_filter_key = null;
      },
      removeFilter(key){
        let filters = JSON.parse(JSON.stringify(this.service.filters));
        delete filters[key];
        this.$set(this.service,'filters',filters);
      },
      addParam(){
        this.$set(this.service.params,this.new_param_key,this.new_param_val);
        this.new_param_val = null;
        this.new_param_key = null;
      },
      removeParam(key){
        let params = JSON.parse(JSON.stringify(this.service.params));
        delete params[key];
        this.$set(this.service,'params',params);
      }
    },
    watch:{
      request_method(){
        this.bindProperFunc();
      }
    },
    computed:{
      rand_id(){
        return Math.floor(Math.random() * 10) + 1;
      },
      suggestions(){
        let res = Object.keys(this.service_list);

        if(typeof this.service_list[this.service_name] !== 'undefined'){
          res = [
            ...this.service_list[this.service_name],
            ...res
          ]
        }
        return res;
      },
      rand_elem_id(){
        return 'html_input_tag_'+this.rand_id+this.rand_id+this.rand_id;
      }
    }
  }
</script>

<style scoped>

</style>
