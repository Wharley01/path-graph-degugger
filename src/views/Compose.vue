<template>
    <div class="flex column" style="min-height: 100vh">
        <form @submit="sendMail" v-show="!is_loading">
        <div class="bg-c-pry-shade-2 p-a-sm flex space-between">
            <router-link class=" txt-s-md m-t-auto m-b-auto" to="/config" style="cursor: pointer"><i class="fas fa-cogs txt-c-white" ></i></router-link>
            <span class="txt-s-xsm txt-s-md m-t-auto m-b-auto txt-bold">Compose</span><button class="btn pry bg-c-pry dsb txt-s-sm p-a-md" style="font-weight: lighter!important;">Send</button>
        </div>


                <div class="m-t-lg container" >


                        <div >
                            <div class="grid grid-1x1">
                                <div class="p-a-sm">
                                    <label class="txt-bold m-b-xxxsm inline-block">Sender Name </label>
                                    <input type="text" v-model="name" id="name" class="default" required>
                                </div>

                                <div class="p-a-sm">
                                    <label class="txt-bold m-b-xxxsm inline-block">Sender Email </label>
                                    <input type="email" v-model="email" id="email" class="default" required>
                                </div>
                                <!--TAB STARTS HERE-->

                                <div class="p-a-sm">
                                    <label class="inline-block txt-bold m-b-xxxsm">Recipients </label>
                                    <ul class="nav nav-tabs m-b-xsm">
                                        <li @click="switchTab('file')" :class="{'active': curr_tab === 'file'}"><a >From File {{curr_tab}}</a></li>
                                        <li @click="switchTab('text')" :class="{'active': curr_tab === 'text'}"><a >Paste as text {{curr_tab}}</a></li>
                                    </ul>
                                    <!-- add recipients from file -->
                                    <div class="tab-content border m-t-sm">
                                        <div v-if="curr_tab == 'file'" class="tab-pane fade in active">
                                            <FFileDragDrop
                                                    @fileDropped="fileDropped"
                                                    class="bg-c-grey-shade-3 flex bd-round-a-xxxxxxsm" style="height: 200px">
                                                <label class="m-a-auto">Drag mail-list file here</label>
                                            </FFileDragDrop>
                                        </div>
                                        <!-- Add recipients from text -->
                                        <div v-else-if="curr_tab == 'text'" class="tab-pane fade">
                                            <textarea rows="3" v-model="recipients" id="recipent_via_text" class="default"></textarea>
                                            <label class="grey-text margin-top-sm">Emails should be separated with new line</label>

                                        </div>

                                    </div>
                                </div>
<!--STATS HERE-->
                                <div class="p-a-sm" style="overflow: hidden">
                                    <label class="inline-block txt-bold m-b-xxxsm">Analytics</label>
                                    <div v-if="recipients_compiled.length > 0 || this.bad_email_count > 0" id="chart" class="flex center">
                                        <PieChart :width="250" :height="250" :data="chart"></PieChart>
                                    </div>

                                    <div class=" full-width flex" style="height: 100%"  v-show="recipients_compiled.length < 1 && this.bad_email_count < 1">
                                        <span class="m-a-auto">No Stats Available yet, import of type emails</span>
                                    </div>
                                </div>
                            </div>




                            <div class="p-a-sm">
                            <label class="txt-bold m-b-xxxsm inline-block">Title</label>
                            <input type="text" v-model="title"  class="default" required>
                              <label class="inline-block m-t-xxsm" v-html="'You can mention user\'s email with <strong>{{email}}</strong>, base64 encoded email with <strong>{{base64}}</strong> and name with <strong>{{name}}</strong>'"></label>
                        </div>
                            <div class="p-a-sm">
                            <label class="txt-bold m-b-xxxsm inline-block">Body</label>
                            <textarea rows="8" v-model="body"  class="default"></textarea>
                              <label class="inline-block m-t-xxsm" v-html="'You can mention user\'s email with <strong>{{email}}</strong>, base64 encoded email with <strong>{{base64}}</strong> and name with <strong>{{name}}</strong>'"></label>
                        </div>
                        <div class="p-a-sm">
                            <label class="txt-bold m-b-xxxsm inline-block m-r-sm">Attachment </label> <span class="txt-c-black-shade-1">Multiple selection is allowed</span>
                            <FFileDragDrop
                                    @fileDropped="AttachmentfileDropped"
                                    class="bg-c-grey-shade-3 flex bd-round-a-xxxxxxsm" style="height: 200px">
                                <label class="m-a-auto">Drag attachment file(s) here</label>
                            </FFileDragDrop>

                            <div class="m-t-md">
                                <template v-for="(v,i) in selected_files">
                                    <div :key="i" class="bg-c-grey-shade-2 p-a-sm flex space-between m-b-xsm"><span class="m-t-auto m-b-auto txt-s-md"><b>{{v.filename}}</b> <span class="txt-c-black-shade-2" v-show="v.type.length > 0"> &middot; ({{v.type}})</span></span><a style="cursor: pointer" @click="deleteFile(i)" class="txt-c-error txt-s-xlg">&times;</a></div>
                                </template>
                            </div>
                        </div>

                        </div>
                </div>
        </form>
      <div v-if="is_loading" class="m-a-auto shadow-normal full-width container bg-c-white p-a-sm bd-round-a-xxsm txt-center">
        <p class="txt-s-sm ">
          Sending Batch
        </p>
        <h1>
          {{current_batch}} of {{Math.round(recipients_compiled.length/total_mail_per_batch)}}
        </h1>

        <div class="full-width flex center txt-center m-a-auto" style="max-width: 300px">
          <button @click="cancelOperation()" class="btn pry m-a-auto">Cancel</button>
        </div>

      </div>

    </div>
</template>
<script>
  import {mapState} from "vuex"
    export default {
        name:"Compose",
        data(){
            return {
                name:"",
                email:"",
                recipients:"",
                title:"",
                body:"",
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
          this.total_mail_per_batch = parseInt(this.config['mails_per_batch']);
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
          cancelOperation(){
            this.is_loading = false;
            this.is_done = true;

            this.cancel = true;


          },
            sendMail(e){
                e.preventDefault();
                // this.is_loading = true;
                let rem = this.recipients_compiled.length % this.total_mail_per_batch;//remaining
                let total_i = parseInt(this.recipients_compiled.length/this.total_mail_per_batch);
                if(this.recipients_compiled.length < 1){
                    alert("Add at list one recipient");
                    this.is_loading = false;
                    return;
                }
                if(this.total_mail_per_batch > this.recipients_compiled.length || this.total_mail_per_batch >= 1000){
                    alert("Total emails per page number exceeds the limit")
                    this.is_loading = false;
                    return;
                }
                let mail_sender =  async (i) => {

                    if(i >= total_i && !rem){
                        alert("Mail successfully sent");
                        this.is_done = true;
                        return;
                    }
                    let recipient_copy = this.recipients_compiled.slice();
                    let this_batch;
                    if(i >= total_i && rem > 0){
                        let offset = total_i * this.total_mail_per_batch;
                        this_batch = recipient_copy.splice(offset,rem);
                        rem = false;
                    }else{
                        let offset = i * this.total_mail_per_batch;
                        this_batch = recipient_copy.splice(i,this.total_mail_per_batch);
                    }

                    console.log({this_batch});
                    this.current_batch = i+1;

                    let form = new FormData();

                    form.append('name',this.name);
                    form.append('email',this.email);
                    form.append('title',this.title);
                    form.append('body',this.body);
                    form.append('config',JSON.stringify(this.config));
                    form.append('recipients',JSON.stringify(this_batch));

                    //append files now

                  for(let x = 0; x < this.raw_selected_files.length;x++){
                    let file = this.raw_selected_files[x];
                    form.append(`files[${x}]`,file);
                  }
                  this.is_loading = true;
                  let has_error = false;
                  try{
                    //perform server request
                    let response =  await this.$http.post(`${this.config.server}/mailer/send`,form);

                    // alert(response.data.msg ? response.data.msg:'Unknown Error, contact Admin');

                    this.errors.push(response.data.errors);

                  }catch (e) {
                    console.log(e)
                    alert(e.response.data.error_msg || 'unknown error')
                    this.cancelOperation();
                  }
                  if(this.cancel || has_error){
                    this.cancel = false;
                    return;
                  }else{
                    mail_sender(i + 1);
                  }

                }
                mail_sender(0);


            },
        },
        computed: {
          ...mapState([
            'server'
          ]),
            recipients_compiled:function(){
                if(this.recipients.length > 0){
                    let gotten_emails = this.recipients.split(/[\s\n]+/);
                    let $valid_emails = gotten_emails.filter((email) => {
                        let r = /\S+@\S+\.\S+/;
                        return r.test(email);
                    })
                    this.bad_email_count = gotten_emails.length - $valid_emails.length;
                    return $valid_emails.map((v) => {
                        return {"email":v};
                    });
                }

                return [];

            },
            chart(){
                return {
                    labels: ["Valid Emails", "Invalid Emails"],
                        datasets: [
                        {
                            label: "Data One",
                            backgroundColor: ["#41B883", "#E46651"],
                            data: [(this.recipients_compiled.length - this.bad_email_count) > 0 ? (this.recipients_compiled.length - this.bad_email_count):0, this.bad_email_count]
                        }
                    ]
                }
            }
        }

    }
</script>
