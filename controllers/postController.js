const { log } = require("console");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PrismaExeption = require("../exeptions/prismaExeption");
const { slugControl } = require("../Utilities/functions");
const { threadId } = require("worker_threads");

// INDEX
async function index(req, res) {
  const data = await prisma.post.findMany();
  if (!data) {
    throw new PrismaExeption("Qualcosa è andato storto, riprova", 500);
  }

  return res.json(data);
}

// SHOW (SLUG)
async function show(req, res) {
  const { slug } = req.params;
  const data = await prisma.post.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!data) {
    throw new PrismaExeption("Qualcosa è andato storto, riprova", 500);
  }

  return res.json(data);
}

// STORE
async function store(req, res) {
  const postToCreate = req.body;
  const list = await prisma.post.findMany();
  if (!list) {
    throw new PrismaExeption(
      "Non è stato possibile verificare i duplicati",
      500
    );
  }
  const newPost = await prisma.post.create({
    data: {
      title: postToCreate.title,
      slug: slugControl(postToCreate.title, list),
      image: postToCreate.image,
      content: postToCreate.content,
    },
  });

  if (!newPost) {
    throw new PrismaExeption("Errore nella creazione del post", 500);
  }

  return res.json(newPost);
}

// UPDATE (SLUG)
async function update(req, res) {
  const { slug } = req.params;
  const postToUpdate = req.body;
  const list = await prisma.post.findMany();
  if (!list) {
    throw new PrismaExeption(
      "Non è stato possibile verificare i duplicati",
      500
    );
  }
  const postUpdated = await prisma.post.update({
    where: {
      slug: slug,
    },
    data: {
      title: postToUpdate.title,
      slug: slugControl(postToUpdate.title, list),
      image: postToUpdate.image,
      content: postToUpdate.content,
    },
  });

  if (!postUpdated) {
    throw new PrismaExeption("Errore nella modifica del post", 500);
  }

  res.json({
    message: `Il post ${postToUpdate.title} è stato modificato:`,
    postUpdated,
  });
}

// DESTROY
async function destroy(req, res) {
  const { slug } = req.params;
  const postToDestroy = await prisma.post.delete({
    where: {
      slug: slug,
    },
  });

  if (!postToDestroy) {
    throw new PrismaExeption("Errore nella cancellazione del post", 500);
  }

  res.json({ message: "Post eliminato correttamente!" });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
