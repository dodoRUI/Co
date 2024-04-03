const ClubService = require('../../services/admin/ClubService')

const ClubController = {
    // 获取所有社团信息
    clubListGet: async (req, res) => {
        const result = await ClubService.clubListGet()
        res.send({
            data: result,
            ActionType: "OK"
        })
    },
    // 搜索社团
    clubSearch: async (req, res) => {
        const result = await ClubService.clubSearch(req.query)
        res.send({
            data: result,
            ActionType: "OK"
        })
    },
    // 新增社团分配社长，查看该用户是否存在以及是其他社团社长
    checkMinister: async (req, res) => {
        const result = await ClubService.checkMinister(req.params.userid)
        res.send({
            data: result
        })
    },
    // 新增社团
    clubAdd: async (req, res) => {
        req.body.club_avatar = req.file ? `/clubAvatarUploads/${req.file.filename}` : ""
        const result = await ClubService.clubAdd(req.body)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    // 删除社团
    clubDelete: async (req, res) => {
        const result = await ClubService.clubDelete(req.query)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
}

module.exports = ClubController