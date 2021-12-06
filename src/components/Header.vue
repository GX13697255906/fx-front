<template>
  <div class="header">
    <h1>{{ this.title }}</h1>
  </div>
</template>

<script>
export default {
  name: "header",
  data(){
    return {
      title: "header"
    }
  }
}
</script>

<style scoped>
.header {
  color: aliceblue;
}


</style>