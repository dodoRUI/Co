import axios from 'axios'

// 封装的文件上传axios请求
function upload(path, userForm) {
    const params = new FormData()
    console.log(userForm)
    for (let i in userForm) {
        params.append(i, userForm[i])
    }
    console.log(params)

    return axios.post(path, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res=>res.data)
}

export default upload