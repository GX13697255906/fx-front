<template>
  <div class="navbar">
    <h1>{{ this.title }}</h1>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      title: 'navbar'
    }
  }
}
</script>

<style scoped>

.navbar {
  color: aliceblue;
}

</style>