// WEBSOCKET CLIENT SIDE
const ws = (() => {
    // private
    // singleton instance
    let ws = undefined;
    // let lazyUpdate = {};

    // public
    function createConnection(userId, callback) {
        destroyConnection();
        ws = new WebSocket("ws://localhost:3001?userId=" + userId);
        ws.addEventListener("message", ({ data: message }) => {
            let topicName = message.split(">>>")[0];
            // if (lazyUpdate[topicName] > 0)
            //     lazyUpdate[topicName] -= 1;
            // else
            callback(topicName);
        });
    }

    function destroyConnection() {
        if (ws)
            ws.close();
        ws = undefined;
    }

    function notifyChange(topicName) {
        ws.send(`${topicName}>>>changed`);
        // lazyUpdate[topicName] = (lazyUpdate[topicName] | 0) + 1;
    }

    function subscribeTopic(topicName){
        let msg=`${topicName}>>>subscribe`;
        try {
            ws.send(msg);
        } catch (e){
            // before connection create
            setTimeout(()=>ws.send(msg),1000);
        }
    }

    return {
        createConnection,
        destroyConnection,
        notifyChange,
        subscribeTopic
    }
})();

export default ws;