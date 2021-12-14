<template>
  <div class="header">
    <div class="login">
      <router-link to="/login" class="login_link">登录</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "header",
  data() {
    return {
      title: "header"
    }
  }
}
</script>

<style scoped>
.header {
  color: aliceblue;
  position: absolute;
  top: 0%;
  left: 0%;
  right: 0%;
  line-height: 25px;
  height: 65px;
  background-color: #2d3a4b;
  display: flex;
  align-items: center;
}

.login {
  float: right;
  width: 50px;
  margin-left: 95%;
}


.login_link {
  font-size: 20px;
  color: aliceblue;
  text-decoration: none;
}


</style>