<template></template>
<script>
export default {
  name: 'entry',
  created () {
    if (!localStorage.getItem('config')) {
      localStorage.setItem('config', JSON.stringify({
        'endpoint': ''
      }))
    }

    this.$router.push('/splash')
  }
}
</script>
