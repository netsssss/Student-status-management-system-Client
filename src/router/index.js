import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import LoginView from '@/views/LoginView';
import HomeView from '@/views/HomeView';
import FourZeroFour from '@/views/404';
import DataTable from '@/components/DataTable';

import MMGLView from '@/views/home/MMGLView';
import YHGLView from '@/views/home/YHGLView';
import YHGSView from '@/views/home/YHGSView';
import ZYKView from '@/views/home/ZYKView';
import ZYGLView from '@/views/home/ZYGLView';
import XSXXView from '@/views/home/XSXXView';
import XJZMView from '@/views/home/XJZMView';
import XJYDView from '@/views/home/XJYDView';
import XXTJView from '@/views/home/XXTJView';

export default new Router({
  mode: 'history', // history需后台配合使用
  routes: [
    {
        path: '/404',
        name: '404',
        component: FourZeroFour
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/home',
        alias: '/',
        component: HomeView,
        meta: {
            auth: true, // 用于判断是否为需要登录页面
           },
        children: [
            {
                path: 'yhgl',
                components: {
                    table:YHGLView
                }
            },
            {
                path: 'yhgs',
                components: {
                    table:YHGSView
                }
            },
            {
                path: 'zyk',
                components: {
                    table:ZYKView
                }
            },
            {
                path: 'zygl',
                components: {
                    table:ZYGLView
                }
            },
            {
                path: 'xsxx',
                components: {
                    table:XSXXView
                }
            },
            {
                path: 'xjzm',
                components: {
                    table:XJZMView
                }
            },
            {
                path: 'xjyd',
                components: {
                    table:XJYDView
                }
            },
            {
                path: 'xxtj',
                components: {
                    table:XXTJView
                }
            },
            {
                path: 'xxcx',
                components: {
                    table:DataTable
                }
            },
            {
                path: 'bysh',
                components: {
                    table:DataTable
                }
            },
            {
                path: 'bygl',
                components: {
                    table:DataTable
                }
            },
            {
                path: 'mmgl',
                components: {
                    table:MMGLView
                }
            }
        ]
    }
  ]
})
