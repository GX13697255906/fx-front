<template>
  <div class="login">
    <label>IP地址: </label>
    <input v-model="ip" name="ip" id="ip"/>
    <button v-on:click='getTokenByIp'>获取Token</button>
  </div>
</template>

<script>
import {get} from '@/utils/http'

export default {
  name: "login",
  data() {
    return {
      ip: "22F71DC6DB290DF2FB5E8C9201C95CB8"
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    getTokenByIp() {
      let componentName = this.$options.name;
      console.log(componentName);
      console.log("---------获取Token----------");
      localStorage.removeItem("Authorization");
      let url = "http://172.16.6.161:8888/admin/login/threeByIp";
      let ip = this.ip;
      let params = {
        "ip": ip
      }
      get(url, params).then((data) => {
        let token = 'bearer' + data.data.access_token;
        console.log("token = " + token);
        localStorage.setItem("Authorization", token);
        if (token != null) {
          console.log()
          this.$router.push("/layout");
        }
      });
    }
  },
  watch: {
    ip(newValue, oldValue) {
      console.log(newValue, oldValue);
    }
  }
}
</script>

<style scoped>
.login {
  color: #2c3e50;
}

#ip {
  width: 320px;
  height: 25px;
}
</style>