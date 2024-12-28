const {
    firstNameValid,
    lastNameValid,
    ValidemailValid,
    ValidpassValid,
  } = require("../validation/userValid");
  
  

exports.userValidation = (req, res, next) => {
    try{
        const data = req.body;
        const { fname:firstName, lname:lastName, email, password } = data;
        console.log(req.body);
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "All fields are required." });
        
        if (!firstName) return res.status(400).send({ status: false, msg: "First name is required." });
        if (!(firstNameValid(firstName))) return res.status(400).send({ status: false, msg: "First name is Invalid." });

        if(!lastName) return res.status(400).send({ status: false, msg: "Last name is required." });
        if (!(lastNameValid(lastName))) return res.status(400).send({ status: false, msg: "Last name is Invalid." });

        if(!email) return res.status(400).send({ status: false, msg: "Email is required." });
        if (!(ValidemailValid(email))) return res.status(400).send({ status: false, msg: "Email is Invalid." });

        if(!password) return res.status(400).send({ status: false, msg: "Password is required." });
        if (!(ValidpassValid(password))) return res.status(400).send({ status: false, msg: "Password is Invalid." });
        next();

    }
    catch(err){
        console.log(err.message);
    }
};