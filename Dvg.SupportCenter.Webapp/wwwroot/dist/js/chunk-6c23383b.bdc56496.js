(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c23383b"],{"1f8b":function(e,t,s){e.exports=s.p+"img/login.d814adb7.png"},"8b48":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"h-screen flex w-full bg-img vx-row no-gutter items-center justify-center",attrs:{id:"page-login"}},[a("div",{staticClass:"vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4"},[a("vx-card",[a("div",{staticClass:"full-page-bg-color",attrs:{slot:"no-body"},slot:"no-body"},[a("div",{staticClass:"vx-row no-gutter justify-center items-center"},[a("div",{staticClass:"vx-col hidden lg:block lg:w-1/2"},[a("img",{staticClass:"mx-auto",attrs:{src:s("1f8b"),alt:"login"}})]),a("div",{staticClass:"vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg"},[a("div",{staticClass:"p-8"},[a("div",{staticClass:"vx-card__title mb-8"},[a("h4",{staticClass:"mb-4"},[e._v("Login")]),a("p",[e._v("Welcome back, please login to your account.")])]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|min:3",expression:"'required|min:3'"}],staticClass:"w-full no-icon-border",attrs:{"data-vv-validate-on":"blur",name:"username",icon:"icon icon-user","icon-pack":"feather","label-placeholder":"Username"},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}}),a("span",{staticClass:"text-danger text-sm"},[e._v(e._s(e.errors.first("username")))]),a("vs-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|min:6|max:10",expression:"'required|min:6|max:10'"}],staticClass:"w-full mt-6 no-icon-border",attrs:{"data-vv-validate-on":"blur",type:"password",name:"password",icon:"icon icon-lock","icon-pack":"feather","label-placeholder":"Password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),a("span",{staticClass:"text-danger text-sm"},[e._v(e._s(e.errors.first("password")))]),a("div",{staticClass:"flex flex-wrap justify-between my-5"},[a("vs-checkbox",{staticClass:"mb-3",model:{value:e.checkbox_remember_me,callback:function(t){e.checkbox_remember_me=t},expression:"checkbox_remember_me"}},[e._v("Remember Me")]),a("router-link",{attrs:{to:"/pages/forgot-password"}},[e._v("Forgot Password?")])],1),a("vs-button",{attrs:{type:"border",disabled:!e.validateForm},on:{click:e.login}},[e._v("Login")])],1)])])])])],1)])},r=[],i={data:function(){return{username:"",password:"",checkbox_remember_me:!1}},computed:{validateForm:function(){return!this.errors.any()&&""!=this.username&&""!=this.password}},methods:{login:function(){var e={checkbox_remember_me:this.checkbox_remember_me,userDetails:{username:this.username,password:this.password},notify:this.$vs.notify};this.$store.dispatch("auth/loginAttempt",e)},notifyAlreadyLogedIn:function(){this.$vs.notify({title:"Login Attempt",text:"You are already logged in!",iconPack:"feather",icon:"icon-alert-circle",color:"warning"})}}},o=i,n=(s("f499"),s("2877")),l=Object(n["a"])(o,a,r,!1,null,null,null);t["default"]=l.exports},f499:function(e,t,s){"use strict";var a=s("f7b5"),r=s.n(a);r.a},f7b5:function(e,t,s){}}]);
//# sourceMappingURL=chunk-6c23383b.bdc56496.js.map