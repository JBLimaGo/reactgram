const {body, validationResult} = require('express-validator');

const photoInsertValidation = () => {
  return [
    body('title')
      .isString()
      .withMessage('O título é obrigatório.')
      .isLength({min: 3})
      .withMessage('O título precisa ter no mínimo 3 caracteres.'),
    body('description')
      .optional()
      .isString()
      .withMessage('A descrição deve ser uma string.'),
    body('image')
      .custom((value, {req}) => {
        if (!req.file) {
          throw new Error('A imagem é obrigatória.');
        }
        return true;
      }),
  ];
}

const photoUpdateValidation = () => {
  return [  
    body("title")      
      .isString()
      .withMessage('O título é obrigatório.')
      .isLength({ min: 3 })
      .withMessage('O título precisa ter no mínimo 3 caracteres.'),
  ];
};

const commentValidation = () => {
  return [
    body('comment')
      .isString()
      .withMessage('O comentário é obrigatório.')
      .isLength({min: 1})
      .withMessage('O comentário não pode ser vazio.'),
  ];
}

module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
};