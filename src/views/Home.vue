<template>
  <div class="home flex column bg-pry">
    <div class="m-auto flex column txt-center">
      <i class="fas fa-code-branch txt-s-x14 txt-c-white"></i>
      <b class="m-t-x12 txt-s-x8 txt-c-white">PathGraph Debugger</b>
    </div>
    <div class="txt-s-sm txt-center m-b-lg txt-c-pry-tint-3">
      &copy; By Sulaiman adewale
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  components: {

  },
    created(){
      setTimeout(() => {
          this.$router.push("/config");
      },4000)
    }
}
</script>
<style lang="scss">
  .home{
    height: 100vh;
    width: 100%;
  }
</style>
