import http from '@/http/index'

const userapi = {
    login(params) {
        return http.post('/api/login', params);
    },

    regist(params) {
        return http.post('/api/regist', params);
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
    }
}
export default userapi