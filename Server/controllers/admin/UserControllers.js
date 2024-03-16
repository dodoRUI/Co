const UserServices = require('../../services/admin/UserServices')

const UserController = {
    login:async (req,res)=>{
        // req.body
        var result = await UserServices.login(req.body)
        if(result.length === 0){
            res.send({
                ok:0,
                error:"用户不存在或密码错误"
            })
        }else{
            console.log(result)
            res.send({
                ok:1,
                data:result[0]
            })
        }
    }
}

module.exports = UserController