const express = require("express");
const cors = require("cors")
const UserModel = require("../src/models/user.model");

const app = express();
const { generateUniqueEmail } = require("../src/utils/generateEmail");

app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use((req, res, next) => {
  console.log(`Request Type: ${req.method}`);
  console.log(`Content Type: ${req.headers["content-type"]}`);
  console.log(`Date: ${new Date()}`);

  next();
});

// Método para gerar email automático no input antes de salvar
app.post("/generate-email", async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).send("Nome e sobrenome são obrigatórios");
  }

  try {
    const email = await generateUniqueEmail(firstName, lastName); // acessando props
    return res.json({ email });
  } catch (error) {
    console.error("Erro ao gerar email automático", error);
    return res.status(500).send("Erro ao gerar e-mail");
  }
});

// Lista de usuários cadastrados
app.get("/views/users", async (req, res) => {
  const users = await UserModel.find({});
  res.render("index", { users });
});

// Envia os dados brutos em JSON para consumir no front como API
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});


// Procurando usuário específico
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Criar usuário
// Método para gerar email automático e salvar no banco
app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    // const { generateUniqueEmail } = require("../src/utils/generateEmail");

    if (!firstName || !lastName || !password) {
      return res.status(400).send("Nome, sobrenome e senha são obrigatórios");
    }

    const email = await generateUniqueEmail(firstName, lastName);
    const user = await UserModel.create({ firstName, lastName, email, password });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro no POST /users:", error);
    res.status(500).send(error.message);
  }
});

// Editar usuário
app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Deletar usuário
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndRemove(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));