<template>
    <div>
        <el-page-header icon="" title="活动中心" content="创建活动"></el-page-header>

        <el-card>
            <div>
                <el-form ref="actvtFormRef" :model="actvtForm" label-width="auto" class="demo-ruleForm" status-icon
                    :rules="actvtAddRules">
                    <div class="left">
                        <el-form-item label="活动名称" prop="name">
                            <el-input v-model="actvtForm.name" />
                        </el-form-item>
                        <el-form-item label="承办社团" prop="club">
                            <el-select v-model="actvtForm.club" filterable placeholder="请选择社团">
                                <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                                    :value="item.club_id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="活动时间" prop="period">
                            <el-date-picker v-model="actvtForm.period" type="datetimerange" start-placeholder="开始时间"
                                end-placeholder="结束时间" />
                        </el-form-item>
                        <el-form-item label="活动地点" prop="place">
                            <el-input v-model="actvtForm.place" />
                        </el-form-item>
                        <div style="display: flex;width: 100%;justify-content: space-between;">

                        </div>
                        <el-form-item label="活动海报" prop="poster">
                            <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                                :on-change="posterChange">
                                <img v-show="actvtForm.posterUrl" :src="actvtForm.posterUrl" class="avatar" />
                                <el-icon class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="相关文件" prop="detailFile">
                            <el-upload ref="uploadfile" class="upload-demo" multiple :on-remove="handleRemove"
                                :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                                :on-change="fileChange" :auto-upload="false">
                                <el-button type="primary" round plain>点击上传相关文件</el-button>
                            </el-upload>
                        </el-form-item>
                        <div class="button">
                            <el-button type="primary" round :icon="Promotion"
                                @click="submitForm(actvtFormRef)">提交</el-button>
                            <el-button round @click="resetForm">重置</el-button>
                        </div>
                    </div>
                    <div class="right">
                        <el-form-item label="活动介绍" prop="content">
                            <div class="editor">
                                <editor @text="handleChange" :clear="clear" :height="460" />
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import editor from '@/components/editor/Editor.vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { genFileId } from 'element-plus'
import { Promotion, Plus } from '@element-plus/icons-vue'
import upload from '@/utils/upload'
import formatDateTime from '@/utils/formatDateTime'

const clubs = ref([])
onMounted(async () => {
    await axios.get('/adminapi/activities/clubnames').then(res => {
        clubs.value = res.data.data
    })
})

// 添加活动
const actvtFormRef = ref()
const actvtForm = reactive({
    period: [],
    name: '',
    content: '',
    club: '',
    place: '',
    posterUrl: '',
    poster: null,
    file: null,
})
// 校验规则
const actvtAddRules = reactive({
    name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    club: [
        { required: true, message: '请选择社团', trigger: 'blur' },
    ],
    period: [
        { required: true, message: '请选择活动时间', trigger: 'blur' },
    ],
    place: [
        { required: true, message: '请输入活动地点', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],
})

// 获取富文本编辑器内容改变
const handleChange = (content) => {
    actvtForm.content = content
    clear.value = false
}

// 海报上传显示
const posterChange = (file) => {
    actvtForm.posterUrl = URL.createObjectURL(file.raw)
    actvtForm.poster = file.raw
}

// 文件上传
const fileChange = (file) => {
    actvtForm.file = file.raw
}
const handleRemove = () => {
    actvtForm.file = null
}
const uploadfile = ref()
const handleExceed = (files) => {
    ElMessage.success(
        `文件已更新，您最多只能选择1个文件`
    )
    uploadfile.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadfile.value.handleStart(file)
    actvtForm.file = file
}
const beforeRemove = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `您是否要删除文件: ${uploadFile.name} ?`
    ).then(
        () => true,
        () => false
    )
}

// 提交活动信息
const submitForm = async (form) => {
    await form.validate(async (valid) => {
        if (valid) {
            actvtForm.period[0] = formatDateTime.dateTime(actvtForm.period[0])
            actvtForm.period[1] = formatDateTime.dateTime(actvtForm.period[1])
            upload('/adminapi/activities/addactivity', actvtForm).then(res => {
                ElMessage({
                    message: res.message,
                    type: res.success ? 'success' : 'error',
                    duration: 2000,
                })
                resetForm()
            })
        }else{
            ElMessage.error('必填项不能为空！')
        }
    })
}
// 重置表单
const clear = ref(false)
const resetForm = () => {
    actvtForm.period = []
    actvtForm.name = ''
    actvtForm.content = ''
    actvtForm.club = ''
    actvtForm.place = ''
    actvtForm.posterUrl = ''
    actvtForm.poster = null
    actvtForm.file = null
    uploadfile.value.clearFiles()
    clear.value = true
}
</script>

<style scoped lang="scss">
.el-card {
    border-radius: 10px;
    box-shadow: 0 0 10px 1px rgba(169, 222, 255, 0.8) !important;
    margin-top: 10px;
}

.el-form {
    display: flex;
    height: 590px;
    overflow-y: scroll;

    .left {
        width: 600px;
        position: relative;
        margin-right: 20px;

        .button {
            position: absolute;
            bottom: 0;
            left: 160px;
        }
    }
}

/* 头像上传 */
.avatar-uploader .avatar {
    width: 180px;
    height: 240px;
    display: block;
    position: absolute;
    z-index: 2;
}

:deep(.avatar-uploader .el-upload) {
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 240px;
    text-align: center;
}
</style>