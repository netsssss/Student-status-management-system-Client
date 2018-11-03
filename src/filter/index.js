import router from '@/router'

export default router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.auth)){
        if(to.path === '/'){
            next({
                path: '/home/mmgl'
            });
            
            return;
        }
        if(localStorage.getItem('user') != null) {
            next();
        }else {
            if(to.name === 'login') {
                next();
                return;
            }
            next({
                path: '/login'
            })
        }
    }else {
        if(to.name === '404' || to.name === 'login'){
            next();
            return;
        }
        next({
            path: '/404'
        })
        
    }
});