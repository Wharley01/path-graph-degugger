export default {
    methods:{
        buildFormPost(fields){
            let form = new FormData();
            for(let field in fields){
                let  value = fields[field].value;
                if(value || value.toString().length > 0)
                    form.append(field,value);
            }
            return form;
        }
    }
}