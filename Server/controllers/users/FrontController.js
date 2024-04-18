const FrontService = require('../../services/users/FrontService');

const FrontController = {
    clubNewsGet: async (req, res) => {
        const result = await FrontService.clubNewsGet(req.params.page);
        res.send(result)
    },
    clubNewsSearch: async (req, res) => {
        const result = await FrontService.clubNewsSearch(req.params.page, req.params.keyword);
        res.send(result)
    },
    userInfoGet: async (req, res) => {
        const result = await FrontService.userInfoGet(req.body);
        res.send(result)
    },
    userUpdate: async (req, res) => {
        const result = await FrontService.userUpdate(req.body, req.file);
        res.send(result)
    },
    userPasswordUpdate: async (req, res) => {
        const result = await FrontService.userPasswordUpdate(req.body);
        res.send(result)
    },

    // 获取活动信息
    activitiesGet: async (req, res) => {
        const result = await FrontService.activitiesGet();
        res.send(result)
    },
    // 获取用户社团信息
    userClubGet: async (req, res) => {
        const result = await FrontService.userClubGet(req.params.userid);
        res.send(result)
    },
    // 活动评分
    activitiesRate: async (req, res) => {
        const result = await FrontService.activitiesRate(req.body);
        res.send(result)
    },
    // 下载文件
    downloadFile: async (req, res) => {
        const data = await FrontService.downloadFile(req.query.filepath)
        res.send(data)
    },

    // 获取十佳社团
    votesRankGet:async(req,res)=>{
        const result = await FrontService.top10ClubsGet();
        res.send(result)
    },

    // 获取社团信息
    clubInfoGet:async(req,res)=>{
        const result = await FrontService.clubInfoGet(req.params.clubid,req.params.userid);
        res.send(result)
    },
    // 申请加入社团
    applyClub:async(req,res)=>{
        const result = await FrontService.applyClub(req.body);
        res.send(result)
    },
    // 退出社团
    quitClub:async(req,res)=>{
        const result = await FrontService.quitClub(req.body);
        res.send(result)
    },
    // 社团投票
    clubVote:async(req,res)=>{
        const result = await FrontService.clubVote(req.body);
        res.send(result)
    },
}


module.exports = FrontController