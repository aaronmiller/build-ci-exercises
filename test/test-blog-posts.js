const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app,
  runServer,
  closeServer
} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog App', function() {
  // it('should be able to successfully return all methods.');
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  // Describe Blog App Request Methods
  describe('Blog GET Request', function() {
    it('should successfully retrieve all blog posts from /blog-posts URL.', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          res.should.have.status(200);
        });
    });
  });

  describe('Blog POST Request', function() {
    it('should successfully make a new blog post at /blog-posts URL.', function() {
      const newPost = {
        title: 'This is my new post',
        content: 'This is the content of my new post',
        author: 'aa'
      };

      const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

      return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.all.keys(expectedKeys);
          res.body.title.should.equal(newPost.title);
          res.body.author.should.equal(newPost.author);
          res.body.content.should.equal(newPost.content);
        });
    });

    it('should throw an error if post data is missing items.', function() {
      const badReqData = {};
      return chai.request(app)
        .post('/blog-posts')
        .send(badReqData)
        .catch(function(res) {
          res.should.have.status(400);
        });
    });
  });

  describe('Blog PUT Request', function() {
    it('should successfully amend a blog post at /blog-posts/:id URL.', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          const changedPost = Object.assign(res.body[0], {
            title: 'Changing the post title',
            author: 'Changing the author'
          });

          return chai.request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(changedPost)
            .then(function(res) {
              res.should.have.status(204);
            });
        });
    });
  });

  describe('Blog DELETE Request', function() {
    it('should successfully delete a blog post at /blog-posts/:id URL.', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res) {
              res.should.have.status(204);
            });
        });
    });
  });
});
