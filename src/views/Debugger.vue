<template>
    <div class="flex column" style="min-height: 100vh">
      <div class="bg-pry-tint-3 p-x4 flex space-between">
        <span class="txt-s-x6 txt-s-x8 m-t-auto m-b-auto txt-bold">Debugger</span><router-link to="/config" class="button txt-c-white" style="font-weight: lighter!important;">Goto configuration</router-link>
      </div>
      <div class="grid grid-2x1 p-x10  grid-gap-x5">
        <div>
          <div class="card m-b-x5">
            <h3 class="m-b-x2 m-t-none">Configuration</h3>
            <div class="flex space-between">
              <div class="flex column">
                <label>Method</label>
                <select class="input m-r-auto" v-model="request_method">
                  <option>POST</option>
                  <option>GET</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                  <option></option>
                </select>
              </div>
              <p>
                <input id="test1" type="checkbox" v-model="auto_link" />
                <label for="test1">Auto link?</label>
              </p>
            </div>
            <div v-if="request_method === 'POST' || request_method === 'PATCH'" class="m-t-x5">
              <b>Post parameters</b>
              <br>
              <template >
                <div v-if="Object.keys(post_params).length" v-for="(post_value,post_key) in post_params" class="flex m-t-x3">
                  <span class="m-t-auto m-b-auto inline-block m-r-x6" style="white-space: nowrap">{{post_key}}:</span><input class="input-x1 m-r-auto" v-model="post_params[post_key]"><button type="button"  class="txt-s-x5 button-x1 bg-error p-x2 m-l-x3" @click="removePost(post_key)"><i class="fa fa-trash"></i></button>
                </div>
              </template>
              <div class="bg-grey-shade-3 p-x4 flex m-t-x7">
                <input @keypress.enter="addPost" class="input-x1" v-model="new_post_key"><b class="m-t-auto m-b-auto txt-s-x6">:</b><input @keypress.enter="addPost" class="input-x1" v-model="new_post_val"><button type="button" class="txt-s-x5  button-x1 p-x2 m-l-x3" @click="addPost"><i class="fa fa-check"></i></button>
              </div>
            </div>
          </div>
          <form @submit.prevent="executeCode" v-show="!is_loading">
            <div class="m-b-x10">
              <ServiceList :service_list="config.services" :request_method="request_method"  :tree="service_tree"></ServiceList>
            </div>
            <div class="sticky p-t-x5 p-b-x5 w-full bg-white b-x1">
              <button class="button txt-c-white">
                Run query
              </button>
            </div>

          </form>
        </div>
        <div >
          <div class="sticky t-x5">
            <h2 class="m-t-none m-b-none">Result</h2>
            <div style="min-height: 400px; height: 80vh; overflow-y: auto" class="card flex column">
              <h3 v-if="!response" class="m-auto txt-c-grey-shade-3">
                Query result shows here
              </h3>
              <pre v-else>{{response}}</pre>
              <div v-if="error_msg" class="txt-c-error m-t-auto">
                <h4 class="m-b-none"><b>{{error_code}}:</b> {{error_msg}}</h4>
                <p>{{error_response}}</p>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
</template>
<script>
  import {mapState} from "vuex"
  import ServiceList from '../components/ServiceList'
  import Graph from '@__path/graph'
    export default {
        name:"Debugger",
      components:{
        ServiceList

      },
        data(){
            return {
              auto_link: false,
              error_msg: null,
              error_code: null,
              error_response: null,
              post_params: {},
              request_method: "GET",
              new_post_key: null,
              new_post_val: null,
                service_tree:[
                   {
                    name: "",
                    as: null,
                    type: 'service',
                    func: 'getAll',
                    page: 1,
                    params:{},
                    filters:{},
                    children:[]
                  }
                ],
                response: null,
                bad_email_count:0,
                is_loading: false,
                selected_files: [],
                raw_selected_files:[],
                is_sent: false,
                total_mail_per_batch: 1,
                current_batch: 0,
                is_done: false,
                errors: [],
                curr_tab: 'file',
                config: null,
              cancel: false,
            }
        },
      created(){
        if(localStorage.getItem("config")){
          this.config = JSON.parse(localStorage.getItem("config"));
        }
      },
        methods:{
            switchTab(tab){
                this.curr_tab = tab;
            },
            deleteFile(i){
                this.selected_files.splice(i,1);
                this.raw_selected_files.splice(i,1);
            },
            fileDropped(files){
                for(let x = 0; x < files.length;x ++){
                    let file = files[x];
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => {
                        let result = reader.result;
                        this.recipients = this.recipients +'\n'+result;
                    };
                }
            },
            AttachmentfileDropped(files){
                for(let x = 0; x < files.length;x ++){
                    let file = files[x];
                    let reader = new FileReader();
                    reader.readAsBinaryString(file);
                    reader.onload = () => {
                        let file_name = file.name;
                        let file_type = file.type;
                        let result = reader.result;
                        let file_obj = {
                            type: file_type,
                            filename: file_name,
                        };
                        console.log({result});
                        this.selected_files.push(file_obj);
                        this.raw_selected_files.push(file);
                    };
                }
            },
          generateCode(){

          },
            async executeCode(){
              this.error_msg = null;
              // this.response = ;
              Graph.endpoint = this.config.endpoint;
              let graph = new Graph();
              console.log({auto_link: this.auto_link})
              if(this.auto_link){
                graph.AutoLink();
              }
            //  loop through this.service_tree
              let fetch = this.treeToService(this.service_tree,graph)


              try{
                let m = 'get';
                if(this.request_method === "POST")
                  m = 'set';
                if(this.request_method === "PATCH")
                  m = 'update';
                if(this.request_method === "DELETE")
                  m = 'delete';

                let result  = await fetch[m](this.post_params);
                this.response =  result.getData();

              }catch (e) {
                this.error_msg = e.getNetworkErrorMsg();
                this.error_code = e.getStatus();
                this.error_response = e.getMsg();
                // console.log({e},'catch');
              }
            },

            treeToService(tree = [],graph){

              for (let i = 0; i < tree.length;i++){
                let column = tree[i];
                let name = column['name'];
                let page = column['page'];
                let func = column['func'];
                let filters = column['filters'];
                let params = column['params'];
                let children = column['children'];

                graph
                  .service(name)
                  .page(page)
                  .params(params)
                  .where(filters)
                  .func(func)
                  .fetch(...this.childrenToArgs(children))
                return graph;

              }
            },
            columnToService(column){
              let name = column['name'];
              let alias = column['as'];
              let filters = column['filters'];
              let page = column['page'];

              let params = column['params'];
              let func = column['func'];
              let children = column['children'];
              let r = new Graph().SetParams(params).service(name).page(page).where(filters);
              r.Func(func).Fetch(...this.childrenToArgs(children))
              if(alias)
                return r.As(alias)
              else
                return r.As(name.toLowerCase())
            },
            childrenToArgs(children){
              let args = []
              for (let i = 0; i < children.length; i ++){
                let child = children[i];
                if(child['type'] === "column"){
                  args.push(Graph.Column(child.name))
                }else if (child['type'] === "service"){
                  args.push(this.columnToService(child))
                }
              }
              return args;
            },
          removePost(key){
            let params = JSON.parse(JSON.stringify(this.post_params));
            delete params[key];
            this.post_params = params;
          },
          addPost(){
            this.$set(this.post_params,this.new_post_key,this.new_post_val);
            this.new_post_key = null;
            this.new_post_val = null;
          }
        },
        computed: {
          ...mapState([
            'server'
          ]),
        }

    }
</script>
