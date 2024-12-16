exports.errorHandle = (error, res) => {
   
    if (error.name == "TypeError" || error.name == "ValidationError" || error.name == "CastError") {
        return res.status(400).send({ status: false, msg: "Something went wrong. Please try again", error: error.message });
    }
    
    if (error.code == 11000) {
        return res.status(400).send({
            status: false,
            msg: `Duplicate value provided at ${Object.keys( error.keyValue)} ${Object.values(error.keyValue)}`});
    }
    res.status(500).send({status:false,msg:error.message});
}