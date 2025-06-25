const UserModel = require('../models/user.model');

function removeWords(str) {
  return str.replace(/\b(de|da|do|dos|das)\b/gi, '').trim();
}

function splitCleanName(nome) {
  return removeWords(nome)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .split(' ')
    .filter(Boolean) // remove espaços internos;
}

async function generateUniqueEmail(firstName, lastName) {
  // Divide e limpa os nomes, transformando strings em arrays
  const names = splitCleanName(firstName);
  const lastNames = splitCleanName(lastName);

  // Pegando as posições dos nomes
  const first = names[0];
  const middleNames = names.slice(1); // pega tudo a partir dessa posição
  const last = lastNames[lastNames.length - 1];

  const baseEmails = [];

  // nome.ultimosobrenome
  baseEmails.push(`${first}.${last}`);

  // nome.nomedomeio (para cada nome do meio)
  for (const middle of middleNames) {
    baseEmails.push(`${first}.${middle}`);
  }

  // ultimosobrenome.nome
  baseEmails.push(`${last}.${first}`);

  let email // guardando um email por vez

  // Testa todas as combinações base
  for (const base of baseEmails) {
    email = `${base}@contoso.com`;
    if (!(await UserModel.findOne({ email }))) return email; // consultando o banco para ver se já existe o email
  }

  // Se todos já existirem, incrementa com número
  const count = 1;
  while (await UserModel.findOne({ email: `${first}.${last}${count}@contoso.com` })) {
    count++;
  }

  return email;
}


module.exports = { generateUniqueEmail };
