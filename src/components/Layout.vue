<template>
  <div>
    <div class="header">
      <Header></Header>
    </div>
    <div class="navbar">
      <Navbar></Navbar>
    </div>
    <div class="main">
      <Main></Main>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Main from "@/components/Main";

export default {
  name: "layout",
  components: {
    Navbar,
    Header,
    Main
  }
}
</script>

<style scoped>

.header {
  position: absolute;
  top: 0%;
  left: 0%;
  right: 0%;
  line-height: 25px;
  background-color: #2d3a4b;
}

.navbar {
  position: absolute;
  top: 70px; /* 距离上面50像素 */
  left: 0%;
  bottom: 5%;
  width: 15%;
  background-color: #545c64;
}

.main {
  position: absolute;
  top: 70px;
  left: 15%;
  bottom: 5%;
  right: 0px; /* 距离右边0像素 */
  padding-left: 5px;
  /*padding: 10px;*/
  /*overflow-y: auto; !* 当内容过多时y轴出现滚动条 *!*/
  /* background-color: red; */
}


</style>