module.exports = function(app,io) {
    app.put('/io/sendMessag',  function(req, res) {
        var message   = req.body.message;
        io.sockets.emit('tchat',{result: [{"message":message}]});
        return res.status(200).json({'message': 'ok'});
    });
}