'use-strict';

const express = require('express');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const router = express.Router();
const { BlogPosts } = require('../models');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredParams = [
    'title',
    'author',
    'content',
  ];

  for (let i = 0; i < requiredParams.length; i += 1) {
    const fields = requiredParams[i];
    if (!(fields in req.body)) {
      const message = `Your post is missing ${fields}.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const post = BlogPosts.create(
    req.body.title,
    req.body.content,
    req.body.author,
    req.publishDate
  );

  res.status(201).json(post);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredParams = 'id';

  if (!(requiredParams in req.body)) {
    const message = 'You need to provide an ID for the post.';
    console.log(message);
    return res.status(400).send(message);
  }

  if (req.body.id !== req.params.id) {
    const message = 'Error! Your ID must match the post ID.';
    console.log(message);
    return res.status(400).send(message);
  }

  BlogPosts.update(req.body);
  res.status(204).end();
});

router.delete('/:id', jsonParser, (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post with ID ${req.params.id}.`);
  res.status(204).end();
});

module.exports = router;
