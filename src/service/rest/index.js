'use strict';
import { Notification } from 'element-ui';
import router from '@/router'

const Axios = require('axios');
const config = {
    baseURL: '//127.0.0.1:8088/api'
};
const User = JSON.parse(localStorage.getItem('user'));
const instance = Axios.create(config);
let _self = this;

if(User)
    instance.defaults.headers.common['access_token'] = User.token;

let service = {
    //登录
    login: (username, password) => instance.get('/retrieve', {params:{"from":"login", username, password}}),
    //文件上传
    avatarUpload: (url, file) => instance.post(url, file),
    //头像--删除
    avatarDelete: (filename) => instance.delete('/delete', {params:{"from":"avatar", filename}}),
    //省份--查询
    provinceQuery: () => instance.get('/retrieve', {params:{"from":"province"}}),
    //城市--查询
    cityQuery: (provname) => instance.get('/retrieve', {params:{"from":"city", provname}}),
    //学校--查询
    schoolQuery: (cityname) => instance.get('/retrieve', {params:{"from":"school", cityname}}),
    //身份名-用户名--查询
    roleUserQuery: (role, username) => instance.get('/retrieve', {params:{"from":"roleuser", role, username}}),
    //专业-学校--查询
    majorSchoolQuery: (schoolname) => instance.get('/retrieve', {params:{"from":"majorschool", schoolname}}),
    //用户管理--查询
    yhglQuery: (username, role) => instance.get('/retrieve', {params:{"from":"yhgl", username, role}}),
    //用户管理--添加
    yhglInsert: (username, password, role, provname, cityname, schoolname) => instance.post('/create', {"from":"yhgl", username, password, role, provname, cityname, schoolname}),
    //用户管理--编辑
    yhglUpdate: (username, role, provname, cityname, schoolname) => instance.put('/update', {"from":"yhgl", username, role, provname, cityname, schoolname}),
    //用户管理--删除
    yhglDelete: (username) => instance.delete('/delete', {params:{"from":"yhgl", username}}),
    //用户归属--查询
    yhgsQuery: (username, role, provname) => instance.get('/retrieve', {params:{"from":"yhgs", username, role, provname}}),
    //专业库--查询
    zykQuery: (majorid, majorname) => instance.get('/retrieve', {params:{"from":"zyk", majorid, majorname}}),
    //专业库--添加
    zykInsert: (majorid, majorname) => instance.post('/create', {"from":"zyk", majorid, majorname}),
    //专业管理--查询
    zyglQuery: (username) => instance.get('/retrieve', {params:{"from":"zygl", username}}),
    //专业管理--添加
    zyglInsert: (majorid, username) => instance.post('/create', {"from":"zygl", majorid, username}),
    //学生基本信息维护--查询
    xsxxQuery: (rolename, role, id_card, name) => instance.get('/retrieve', {params:{"from":"xsxx", rolename, role, id_card, name}}),
    //学生基本信息维护--添加
    xsxxInsert: (name,sex,imageUrl,id_card,birth,school,major,birthplace,birthplace_detail,regist,unusual_action) => instance.post('create', {"from":"xsxx", name,sex,imageUrl,id_card,birth,school,major,birthplace,birthplace_detail,regist,unusual_action}),
    //学籍证明--修改
    xjzmUpdate: (role, id_card) => instance.put('/update', {"from":"xjzm", role, id_card}),
    //学籍异动--添加
    xjydInsert: (ua_id_card, ua_type, ua_date ,ua_state, ua_describe, ua_oldmajor, ua_newmajor) => instance.post('/create', {"from":"xjyd", ua_id_card, ua_type, ua_date ,ua_state, ua_describe, ua_oldmajor, ua_newmajor}),
    //学籍异动--修改
    xjydUpdate: (role, id, ua_id_card, ua_type, ua_oldmajor, ua_newmajor) => instance.put('/update', {"from":"xjyd", role, id, ua_id_card, ua_type, ua_oldmajor, ua_newmajor}),
    //学籍异动--查询
    xjydQuery: (id, id_card) => instance.get('/retrieve', {params:{"from":"xjyd", id, id_card}}),
};

//拦截
/**
 * 2018/10/27
 * 1.ES6新增了“...”，读作扩展运算符或rest运算符或剩余参数，用处是将数组展开或将展开的字符串变成数组，或者当做剩余参数使用，例如：
 *   let demo = (a,...args) => args; console.log(demo(1,2,3)); 输出的结果为“[2, 3]”。
 * 2.ES6新增了“ => ”, 读作箭头函数，如上例，并且在箭头函数中的 “ this ”,指向的不再是运行时所在的对象，而是定义时所在的对象。
 *   并且箭头函数将不再支持arguments,而是使用“...”作为代替。箭头函数也不可以作为构造函数使用。
 * 3.ES6允许了参数的最后一个值最后可以带逗号“,”。
 * 4.ES6允许函数定义书写参数时带有默认值，写法如：
 *   let demo = (a=5,b=6) => a + b; console.log(demo()); 输出结果为“11”。
 *   需要注意的是，参数中定义的默认参数相当于在函数中真实定义的变量，不可以在函数中使用“let”，“const”再次定义。
 * 5.值得一提的是，在不使用箭头函数的函数中使用的“this”，指向的为其运行时所在的对象，如setTimeout()函数中使用的this指向的是windows，因为setTimeout()最终调用的是windows函数。
 */
for (let name in service){
    let fnc = service[name];
    service[name] = (...arg) => fnc(...arg).then(res => new Promise((resolve, reject) => {
        if(res.data.status === 200){
            resolve(res.data);
        }else {
            switch(res.data.status){
                case 403:
                    Notification.error(`登录超时，请刷新页面`);
                    break;
                case 203:
                    Notification.error(`用户名或密码错误`);
                    break;
                case 204:
                    instance.defaults.headers.common['access_token'] = null;
                    localStorage.removeItem('user');
                    Notification.error(`身份已过期`);
                    router.push('/login');
                    break;
                case 205:
                    Notification.error(`添加信息重复`);
                    break;
                case 206:
                    Notification.error(`输入值为空或含有非法字符`);
                    break;
                case 500:
                    Notification.error(`服务器错误`);
                    break;
                case 503:
                    //503 is sql_error
                    break;
                default: reject(res);
            }
            reject(res);
        }
    }));
}

export default { instance, service };