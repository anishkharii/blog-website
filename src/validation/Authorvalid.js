module.exports.firstNameValid = (Name)=>{
    const nameRegex = /^([a-zA-Z])+$/;
    return nameRegex.test(Name)
}

module.exports.lastNameValid = (Name)=>{
    const nameRegex = /^([a-zA-Z])+$/;
    return nameRegex.test(Name)
}

module.exports.ValidemailValid = (email)=>{
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email)
}

module.exports.ValidpassValid = (pass)=>{
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(pass)
}