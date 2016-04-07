import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {

    return Ember.RSVP.hash({
      orders: this.store.findAll('order' ,{reload :true}),
    });

  },

  setupController: function(controller,model) {
    controller.set('orders',model.orders);
  },

});
