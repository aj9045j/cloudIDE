const { activeContainers } = require('./reactContainer');

async function findPort(req,res) {
    console.log("request");
    const { containerId } = req.params;
    console.log(containerId);
    console.log(activeContainers);
    const port = activeContainers[containerId];

    if (port) {
        res.status(200).json({ containerId, port });
    } else {
        res.status(404).json({ message: 'Container not found' });
    }
}

module.exports = {
    findPort,
}