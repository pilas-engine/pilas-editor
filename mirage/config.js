export default function() {
  this.urlPrefix = '/';

  this.get('/projects');
  this.get('/projects/:id', 'project');
  this.put('/projects/:id', 'project');
  this.patch('/projects/:id', 'project');
  this.delete('/projects/:id', 'project');
  this.post('/projects');


  this.passthrough("data/sprites.json");
  this.passthrough("ejemplos/**");
  this.passthrough("https://api.keen.io/**");

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');
  */
}
