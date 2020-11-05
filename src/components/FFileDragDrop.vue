<template>
    <div
            :class="{'drop-active': !dropped && file_on_it}"
            @dragover="fileDraggedOver"
            @drop="fileDropped"
            @dragleave="fileDragLeft"

    >
        <slot v-if="!dropped && !file_on_it"></slot>
        <label v-if="dropped" class="m-a-auto">File uploaded</label>
        <label v-if="!dropped && file_on_it" class="m-a-auto">Drop File here</label>

    </div>
</template>
<script>
    export default {
        name:"FFileDragDrop",
        props:['placeholder'],
        inheritAttrs: true,
        data(){
            return {
                dropped: false,
                files:[],
                file_on_it: false,
                is_loading: false,

            }
        },
        methods:{
            fileDraggedOver(e){
                e.preventDefault();
                e.stopPropagation();
                this.file_on_it = true;
            },
            fileDragLeft(e){
                e.preventDefault();
                e.stopPropagation();
                this.file_on_it = false;
            },

            async fileDropped(e){
                e.preventDefault();
                e.stopPropagation();
                this.is_loading = true;
                this.dropped = true;
                this.$emit("fileDropped",e.dataTransfer.files)
            }
        }

    }
</script>

