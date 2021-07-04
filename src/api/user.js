import http from '@/http/index'

const userapi = {
    login(params) {
        return http.post('/api/login', params, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
    },

    regist(params) {
        return http.post('/api/regist/u', params);
    },
    logout() {
        return http.get('/api/logout');
    },
    getCurrUser() {
        return http.get('/api/user/curruser');
    },
    updateUserInfo(userInfo) {
        return http.post('/api/user/user', userInfo);
    },
    uploadAvatar(file) {
        return http.post('/api/user/avatar', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    checkBetaCode(params) {
        return http.get('/api/regist/beta_code', {params: params});
    }
}
export default userapi
