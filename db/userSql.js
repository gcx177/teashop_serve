const jwt = require('jsonwebtoken');

// 验证数据库中的用户相关信息
const User = {
    // 查询用户手机号
    queryUserTel(option) {
        return 'select * from user where tel =' + option.username
    },
    // 查询用户密码
    queryUserPwd(option) {
        return 'select * from user where (tel = "' + option.username + '") and (pwd = "' + option.password + '")'
    },
    // 新增用户(短信新增)
    inserData(option) {

        // 用户信息
        let userload = {tel: option.username}
        // 口令
        let secret = 'chaqi'
        // 生成token
        let token = jwt.sign(userload, secret)

        return 'insert into user (tel,pwd,imgUrl,nickname,token) values ("'+ option.username +'",null,"../images/touxiang.webp","'+ option.username +'","'+ token +'")'
    },
    // 新增用户(注册)
    inserDataForPwd(option) {

        // 用户信息
        let userload = {tel: option.username}
        // 口令
        let secret = 'chaqi'
        // 生成token
        let token = jwt.sign(userload, secret)

        return 'insert into user (tel,pwd,imgUrl,nickname,token) values ("'+ option.username +'","'+ option.password +'","../images/touxiang.webp","'+ option.username +'","'+ token +'")'
    }
}

module.exports = User