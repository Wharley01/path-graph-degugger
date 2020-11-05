<template>
  <div>
    <template v-for="(service,index) in tree">
      <Service :service_name="service_name || service.name" :service_list="service_list" :request_method="request_method" :is_root="true" :index="index" :tree="tree" :service="service">
        <ServiceList
          :service_name="service.name"
          :service_list="service_list"
          :request_method="request_method"
          v-if="service.children.length"
          :tree="service.children">
        </ServiceList>
      </Service>
    </template>
  </div>
</template>

<script>
  import Service from './Service'
  export default {
    components: { Service },
    name: 'ServiceList',
    props:{
      tree:{
        type: Array,
        default(){
          return []
        }
      },
      service_list:{
        type: Object,
        default () {
          return {}
        }
      },
      request_method:{
        type: String,
        default:'GET'
      },
      service_name:{
        type: String,
        default:''
      }
    }
  }
</script>

<style scoped>

</style>
