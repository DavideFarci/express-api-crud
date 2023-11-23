const { log } = require("console");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { slugControl } = require("../Utilities/functions");
// INDEX
async function index(req, res) {
  const data = await prisma.post.findMany();

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

  return res.json(data);
}

// STORE
async function store(req, res) {
  const postToCreate = req.body;
  const newPost = await prisma.post.create({
    data: {
      title: postToCreate.title,
      slug: postToCreate.title.toLowerCase().trim().replaceAll(" ", "-"),
      image: postToCreate.image,
      content: postToCreate.content,
    },
  });

  return res.json(newPost);
}

// UPDATE
async function update(req, res) {
  const { slug } = req.params;
  const postToUpdate = req.body;
  const list = await prisma.post.findMany();
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

  res.json({
    message: `Il post ${postToUpdate.title} è stato modificato:`,
    postUpdated,
  });
}

// DESTROY
function destroy(req, res) {}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
