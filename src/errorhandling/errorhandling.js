exports.errorHandle = (error, res) => {
   
    if (error.name == "TypeError" || error.name == "ValidationError" || error.name == "CastError") {
        return res.status(400).send({ status: false, message: error.message });
    }
    
    if (error.code == 11000) {
        return res.status(400).send({
            status: false,
            message: `Duplicate value provided at ${Object.keys( error.keyValue)} ${Object.values(error.keyValue)}`});
    }
    res.status(500).send(error.message);
}