<template>
  <div class="char2">
    <div>
      <h1>{{ div_name }}</h1>
    </div>
    <div>
      <button :style="{width: '50px', color: 'red'}" v-on:click='showInfo'>点击</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyChartTwo",
  data() {
    return {
      div_name: 'char2'
    }
  },
  mounted() {
  },
  methods: {
    showInfo(event) {
      console.log(event.target.innerText);
    }
  }
}
</script>

<style scoped>

.char2 {
  color: #f0f2f5;
  height: 100%;
  width: 100%;
  background-color: #2d3a4b;
}

</style>