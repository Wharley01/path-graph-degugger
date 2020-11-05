<template>
  <div class="">
    <form @submit="saveConfig">
      <div class="bg-pry-tint-3 p-x4 flex space-between">
        <span class="txt-s-x6 txt-s-x8 m-t-auto m-b-auto txt-bold"> Configuration</span><button class="button txt-c-white" style="font-weight: lighter!important;">Save and continue</button>
      </div>

      <div class="container" style="max-width: 500px">
        <div>
          <label class="m-b-x1">
            PathGraph endpoint
          </label>
          <input required v-model="config.endpoint" class="input w-full" type="text" placeholder="i.e: http://192.168.0.128:8080/graph-path"/>
        </div>
        <div class="m-t-x10">
          <label class="m-b-x1">
            Services
          </label>
          <div class="flex column m-t-x5">
            <div v-if="config.services">
              <div v-for="(columns,service) in config.services" class="bg-grey p-x5">
                <div class="flex bg-grey-shade-1 p-x6">
                  <b class="m-t-auto m-b-auto">{{service}}</b><button type="button" @click="removeService(service)" class="bg-none bd-none m-l-auto txt-s-x8 p-x1"><i class="fa fa-trash"></i></button>
                </div>

                <div  class="flex p-l-x6 p-r-x6 column">
                  <div v-if="columns.length" v-for="(column,index) in columns" class="bg-pry-shade-3 m-t-x5 flex txt-c-white bd-round-x2 p-x3">
                    <span class="m-t-auto m-b-auto">{{column}}</span> <button type="button" @click="removeColumn(service,index)" class="bg-none bd-none txt-c-white m-l-auto txt-s-x8 p-x1">&times;</button>
                  </div>
                  <div class="flex m-t-x4">
                    <input @keypress.enter.prevent="addColumn(service)" v-model="column_name" placeholder="Column name" class="input">
                    <button type="button" @click="addColumn(service)" class="button bg-pry txt-c-white">
                      + Add column
                    </button>
                  </div>

                </div>

              </div>
            </div>
            <div class="flex m-t-x10">
              <input @keypress.enter.prevent="addNewService" v-model="service_name" placeholder="Service name" class="input">
              <button type="button" @click="addNewService" class="button txt-c-white">
                + Add new service
              </button>
            </div>

          </div>
        </div>
      </div>


    </form>
    <br>
    <br>
    <br>

  </div>
</template>
<script>
  export default {
      name:"Config",
      data(){
          return {
            service_name: null,
            column_name: null,
              config: {
                  endpoint: "",
                  services: {},
              }
          }
      },
      created(){

          let config = localStorage.getItem("config");
          if(config){
              this.config = JSON.parse(config);
          }
      },
      methods:{
        save(){
          localStorage.setItem("config",JSON.stringify(this.config))
        },
          saveConfig(e){
              e.preventDefault();

              localStorage.setItem("config",JSON.stringify(this.config))
              this.$router.push("/debugger")
          },
        addNewService(){
            if(this.service_name){
              let services  = {
                ...this.config.services
              };
              services[this.service_name] = [];
              this.config = {
                ...this.config,
                ...{services}
              };
              this.save()
            }else{
              alert('Enter service name')
            }
          this.service_name = ""
        },
        addColumn(service){
          if(!this.column_name || !this.column_name.length)
            return;

          let services  = {
            ...this.config.services
          };
          services[service].push(this.column_name);
          this.config = {
            ...this.config,
            ...{services}
          };
          this.column_name = ""
          this.save()

        },
        removeColumn(service,index){
          let services  = {
            ...this.config.services
          };
          services[service].splice(index,1);
          this.config = {
            ...this.config,
            ...{services}
          };
          this.save()

        },
        removeService(service){
          let services  = {
            ...this.config.services
          };
          delete services[service];
          this.config = {
            ...this.config,
            ...{services}
          };
          this.save()

        }
      }
  }
</script>
<style>

</style>
