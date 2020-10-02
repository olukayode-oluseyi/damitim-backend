const Joi = require('@hapi/joi')


const handleRegistrationValidation = (data) => {

    const registerSchema = Joi.object({
      first_name: Joi.string().min(2).required(),
      last_name: Joi.string().min(2).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      phone: Joi.string().required(),
    })

    return registerSchema.validate(data)
}

const handleAccountUpdateValidation = (data) => {
  const registerSchema = Joi.object({
    email: Joi.string().required().email(),
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    state: Joi.string().required(),
    lga: Joi.string().required(),
  });

  return registerSchema.validate(data);
};

const handleLoginValidation = (data) => {

    const loginSchema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    })
    return loginSchema.validate(data)
    
}


module.exports.handleRegistrationValidation = handleRegistrationValidation
module.exports.handleLoginValidation = handleLoginValidation
module.exports.handleAccountUpdateValidation = handleAccountUpdateValidation

