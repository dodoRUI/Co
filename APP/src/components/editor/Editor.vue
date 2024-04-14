<template>
    <div style="border: 1px solid #ccc;z-index: 20;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor :style="{ height: height + 'px', overflowY: 'scroll' }" v-model="valueHtml"
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted, defineEmits, defineProps, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 用于子传父
const emit = defineEmits('text')

const editorRef = shallowRef()

// 监听是否清除内容属性
const props = defineProps({
    clear: {
        type:Boolean,
        default: false
    },
    height: Number,
    message:{
        default:'',
        type:String
    }
})

// 内容 HTML
const valueHtml = ref(props.message)

watch(() => props.clear, (newValue, oldValue) => {
    if (newValue) {
        valueHtml.value = ''
    }
})
watch(() => props.message, (newValue) => {
    valueHtml.value = newValue;
})


// 模拟 ajax 异步获取内容
onMounted(() => {

})

const toolbarConfig = {}
const editorConfig = {}
editorConfig.placeholder = '请输入内容'

// 当编辑器内容变化时，更新到父组件中
const handleChange = (editor) => {
    emit('text', valueHtml.value,editor.getText().replace(/[\n\t\s]/g, ''))
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
</script>
