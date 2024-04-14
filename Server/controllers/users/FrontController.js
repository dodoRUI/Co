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
}


module.exports = FrontController