const getHealthStatus = ((req,res) => {
    res.send("taskflow Backend running")
})

module.exports = {
    getHealthStatus
}