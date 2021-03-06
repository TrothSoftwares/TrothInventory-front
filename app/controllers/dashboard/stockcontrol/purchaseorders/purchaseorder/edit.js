import Ember from 'ember';

export default Ember.Controller.extend({

ajax: Ember.inject.service(),

  actions:{



        selectPurchaseOrderitem( purchaseorderitem , selected){
          purchaseorderitem.set('isSearchBarOpen',false);
          return this.store.findRecord('product', selected.id).then(product => purchaseorderitem.set('product', product));

        },


        searchProduct( purchaseorderitem , term ) {

          purchaseorderitem.set('isSearchBarOpen',true);

          if (Ember.isBlank(term)) { return []; }

          const url = `/products?direction=asc&page=1&productname=${term}`;
          return this.get('ajax').request(url).then(json=>json.data);
        },


    deletePurchaseorderitem:function(purchaseorderitem){
       purchaseorderitem.destroyRecord();
    },


    cancelPurchaseOrder:function(purchaseorder){
      this.transitionToRoute('dashboard.stockcontrol.purchaseorders.purchaseorder.view' , purchaseorder);
    },


    deletePurchaseOrder:function(purchaseorder){

      var controller = this;
      var confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        purchaseorder.destroyRecord().then(function(){
          controller.transitionToRoute('dashboard.stockcontrol.purchaseorders.index');
          controller.notifications.addNotification({
            message: 'Purchaseorder deleted successfully' ,
            type: 'success',
            autoClear: true
          });
        }).catch(function(){
          controller.notifications.addNotification({
            message: 'Sorry some thing went wrong!' ,
            type: 'error',
            autoClear: true
          });
        });
      }

    },



    draftPurchaseOrder: function(){
      var controller = this;

      var purchaseorder = this.get('purchaseorder');

      var purchaseorderitems = purchaseorder.get('purchaseorderitems');

      purchaseorderitems.forEach(function(purchaseorderitem){
        purchaseorderitem.set('total',purchaseorderitem.get('computedtotal'));
        purchaseorderitem.save();
      });

      purchaseorder.set('totalunits' , purchaseorder.get('computedtotalunits'));
      purchaseorder.set('totalcost' , purchaseorder.get('computedtotalcosts'));


      purchaseorder.save().then(function(){
        controller.notifications.addNotification({
          message: 'Saved' ,
          type: 'success',
          autoClear: true
        });

        controller.transitionToRoute('dashboard.stockcontrol.purchaseorders.purchaseorder.view', purchaseorder);

      });

    },



      openSupplierModal: function(){
        Ember.$('.ui.newsupplier.modal')
        .modal('show')
        ;
      },

      createSupplier: function(){

        var controller = this;
        var newsupplier = this.store.createRecord('supplier', {
          companyname :this.get('companyname'),
          email :this.get('email'),
          address1 :this.get('address1'),
          address2 :this.get('address2'),
          suburb :this.get('suburb'),
          city :this.get('city'),
          state :this.get('state'),
          country : this.get('country'),
          zipcode :this.get('zipcode')
        });

        newsupplier.save().then(function(){
          controller.set('companyname','');
          controller.set('email','');
          controller.set('address1','');
          controller.set('address2','');
          controller.set('suburb','');
          controller.set('city','');
          controller.set('state','');
          controller.set('country','');
          controller.set('zipcode','');
          controller.set('phone','');

          controller.get('suppliers').pushObject(newsupplier._internalModel);
          controller.set('supplier',newsupplier);
          Ember.$('.ui.newsupplier.modal')
          .modal('hide')
          ;
        }).catch(function(){
          controller.notifications.addNotification({
            message: 'Sorry, cant save at the moment !' ,
            type: 'error',
            autoClear: true
          });
        });
      },




      addNewPurchaseOrderItem:function(){
        var controller = this;
        var purchaseorderitem = controller.store.createRecord('purchaseorderitem', {
          quantity :1,
          total :'',
          poitemstatus :'',
          recieveddate :'',
          product :controller.get('products').get('firstObject'),
          purchaseorder : controller.get('purchaseorder'),
        });

        purchaseorderitem.save().then(function(){

        });

      },

  }






});
