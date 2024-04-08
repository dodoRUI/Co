import axios from 'axios'

// 封装的文件上传axios请求

async function upload(path, Form) {
    // console.log(Form)
    const params = new FormData()
    for (let i in Form) {
        params.append(i, Form[i])
    }

    return axios.post(path, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res=>res.data)
}

export default upload