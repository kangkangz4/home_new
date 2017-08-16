<template>
  <el-form :model="loginForm" :rules="loginFormRule" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { requestLogin, getMenusWithPermission } from '../api/api';
import { mapGetters, mapActions } from 'vuex';
import NProgress from 'nprogress'

export default {
  data() {
    return {
      logining: false,
      loginForm: {
        username: '13395140855',
        password: '123456'
      },
      loginFormRule: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    };
  },
  computed: {  
    ...mapGetters([  
      'menuitems',  
      'isLoadRoutes'
    ])  
  },
  methods: {
    ...mapActions([  
      'setSession',
      'setMenu',
      'loadRoutes'
    ]),
    handleReset2() {
      this.$refs.loginForm.resetFields();
    },
    handleSubmit2(ev) {
      this.$refs.loginForm.validate((valid) => {
        if(!valid){
          this.$message.error('请输入必填项');
          return;
        }
        this.logining = true;
        const para = Object.assign({}, this.loginForm);
        requestLogin(para).then(res => {
          this.logining = false;
          const result = res.result;
          this.setSession(result);
          //获取菜单
          getMenusWithPermission().then((res) =>{
            this.setMenu(res.result);
            // if(!this.isLoadRoutes){
            this.$router.addRoutes(this.menuitems);
              // this.loadRoutes();
            // }
            this.$router.push({ path: '/'});
          });
            // let { access_token, account } = res;
            // if (!access_token) {
            //   this.$message({
            //     message: message,
            //     type: 'error'
            //   });
            //   // this.$notify({  
            //   //   title: '错误',
            //   //   message: message,  
            //   //   type: 'error'  
            //   // })
            // } else {
            //   this.setToken(access_token.token);
            //   this.setAccount(account);
            //   // this.$store.commit('setToken', access_token.token);
            //   // this.$store.commit('setAccount', account);
            //   // sessionStorage.setItem('token', JSON.stringify(access_token));
            //   //获取菜单
            //   getMenus().then(res => {
            //     this.addMenu(res);
            //     if (!this.isLoadRoutes){
            //       this.$router.addRoutes(this.menuitems)
            //       this.loadRoutes()
            //     }
            //     this.$router.push({ path: '/dashboard' });
            //   })
            // }
        }, (error) =>{
          this.logining = false;
          this.$message.error(error)
        });
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>