App = Ember.Application.create(
		{
		  LOG_TRANSITIONS: true
		}
	);

App.Router.map(function() {
  // put your routes here
  this.route("location", { 
  	path: "/location",
  	setupController: function(controller) {
	    // Set the IndexController's `title`
	    controller.set('title', "Hello World Location");
	  }
  });
});

App.Router.reopen({
  rootURL: '/ember/'
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {title: 'hello location'};
  },
  setupController: function(controller) {
    // Set the IndexController's `title`
    controller.set('title', "Hello World");
  }
});
