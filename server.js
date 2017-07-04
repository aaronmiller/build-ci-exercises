'use-strict';

const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./routes/blogPostsRouter');

// Test data for blog post
const { BlogPosts } = require('./models');

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 1337;

let server;

// Create blog posts for test data
BlogPosts.create(1, 2, 3, 4);
BlogPosts.create(5, 6, 7, 8);
BlogPosts.create(9, 10, 11, 12);

app.use(morgan('common'));
app.use('/blog-posts', blogPostsRouter);

function runServer() {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Listening at ${host}:${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server...');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
    });
    resolve();
  });
}

// Only run if called via node.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {
  app,
  runServer,
  closeServer
};
