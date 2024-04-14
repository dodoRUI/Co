const ClubService = require('../../services/admin/ClubService')

const ClubController = {
    // 获取所有社团信息
    clubListGet: async (req, res) => {
        const result = await ClubService.clubListGet()
        res.send(result)
    },
    // 搜索社团
    clubSearch: async (req, res) => {
        const result = await ClubService.clubSearch(req.query)
        res.send(result)
    },
    // 新增社团分配社长，查看该用户是否存在以及是其他社团社长
    checkMinister: async (req, res) => {
        const result = await ClubService.checkMinister(req.params.userid)
        res.send(result)
    },
    // 新增社团
    clubAdd: async (req, res) => {
        req.body.club_avatar = req.file ? `/clubAvatarUploads/${req.file.filename}` : ""
        const result = await ClubService.clubAdd(req.body)
        res.send(result)
    },
    // 删除社团
    clubDelete: async (req, res) => {
        console.log(req.query)
        const result = await ClubService.clubDelete(req.query)
        res.send(result)
    },
    // 获取社团信息
    getClubsData: async (req, res) => {
        const result = await ClubService.getClubsData()
        res.send(result)
    },
    // 获取社团成员数据
    clubsMembersGet: async (req, res) => {
        const result = await ClubService.clubsMembersGet()
        res.send(result)
    },
    // 获取社团活动数据
    clubsActvtsGet: async (req, res) => {
        const result = await ClubService.clubsActvtsGet()
        res.send(result)
    },
    // 获取社团点赞数据
    clubStarsGet: async (req, res) => {
        const result = await ClubService.clubStarsGet()
        res.send(result)
    },
    // 获取社团详细信息
    clubInfoGet: async (req, res) => {
        const result = await ClubService.clubInfoGet(req.params.club_id)
        res.send(result)
    },
    // 移除社团中的社员
    memberDelete: async (req, res) => {
        const result = await ClubService.memberDelete(req.params)
        res.send(result)
    },
    // 更换社长
    ministerChange: async (req, res) => {
        const result = await ClubService.ministerChange(req.body)
        res.send(result)
    },
    // 修改社团信息
    clubUpdate: async (req, res) => {
        req.body.club_avatar = req.file ? `/clubAvatarUploads/${req.file.filename}` : `${req.body.club_avatar}`
        const result = await ClubService.clubUpdate(req.body)
        res.send(result)
    },


    // 申请审批
    // 获取申请信息
    clubApplyGet: async (req, res) => {
        const result = await ClubService.clubApplyGet(req.query)
        res.send(result)
    },
    // 同意申请
    clubApplyAccept:async(req,res)=>{
        const result = await ClubService.clubApplyAccept(req.body)
        res.send(result)
    },
    // 拒绝申请
    clubApplyRefuse:async(req,res)=>{
        const result = await ClubService.clubApplyRefuse(req.body)
        res.send(result)
    },
    // 首页展示申请数量获取
    applyNumGet: async (req, res) => {
        const result = await ClubService.applyNumGet(req.query)
        res.send(result)
    },


    // 社团新闻资讯
    // 添加新闻
    clubNewsAdd:async(req,res)=>{
        const result = await ClubService.clubNewsAdd(req.body)
        res.send(result)
    },
    // 获取新闻
    clubNewsGet:async(req,res)=>{
        const result = await ClubService.clubNewsGet(req.query)
        res.send(result)
    },
    // 筛选新闻
    clubNewsFilter:async(req,res)=>{
        const result = await ClubService.clubNewsFilter(req.query)
        res.send(result)
    },
    // 修改新闻
    clubNewsUpdate:async (req,res)=>{
        const result = await ClubService.clubNewsUpdate(req.body)
        res.send(result)
    },
    // 删除新闻
    clubNewsDelete:async(req,res)=>{
        const result = await ClubService.clubNewsDelete(req.params.id)
        res.send(result)
    },
    // 批量删除
    clubNewsMultipleDelete:async(req,res)=>{
        const result = await ClubService.clubNewsMultipleDelete(req.query)
        res.send(result)
    }
}

module.exports = ClubController