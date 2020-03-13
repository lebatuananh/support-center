import Vue from 'vue'
import Router from 'vue-router'
import authenticationRepository from './repositories/AuthenticationRepository'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            children: [
                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('./views/chat/Chat.vue'),
                    meta: {
                      //rule: 'admin'
                      //rule: null
                    }
                }
            ]
        },
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
                {
                    path: '/login',
                    name: 'pageLogin',
                    component: () => import('@/views/pages/Login.vue'),
                    meta: {
                        //rule: 'admin'
                        //rule: null
                    }
                }
            ]
        }
    ]
})

router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

router.beforeEach(async (to, from, next) => {
  var currentUser = null;
  if (router.app.$store) {
    currentUser = router.app.$store.state.auth.currentUser;
  }
  else {
    currentUser = await authenticationRepository.getCurrentUser();
  }
  console.log(currentUser);
     if (
         to.path === "/login" ||
         to.path === "/pages/forgot-password" ||
         to.path === "/pages/error-404" ||
         to.path === "/pages/error-500" ||
         to.path === "/pages/register" ||
         to.path === "/callback" ||
         to.path === "/pages/comingsoon" ||
         currentUser
     ) {
         return next();
     }

    //console.log(router);
     router.push({ path: '/login', query: { to: to.path } })

 });

export default router
