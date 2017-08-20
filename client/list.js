Template.list.onCreated(function(){
		this.autorun(() => {
	  		this.subscribe('publishCategories');
	  	});
	});		

Template.list.helpers({

	'getChildern' : function(id){
		if(id != null && id.length>0){
			return categoryTree.findOne({"_id" : new Mongo.ObjectID(id)}).childern;
		}
	},
	'haveKid' : function(id){
		var node = categoryTree.findOne({"_id" : new Mongo.ObjectID(id)});	
		return node.childern && node.childern.length > 0;
	},
	'getValue' : function(id){
		return categoryTree.findOne({"_id" : new Mongo.ObjectID(id)}).value;
	},
	'getDesc' : function(id){
		return categoryTree.findOne({"_id" : new Mongo.ObjectID(id)}).desc;
	},
	'first' : function(id){ 
		var doc = categoryTree.findOne({"childern" : id});
		return (doc != null) ? 
			(doc.childern.indexOf(id) === 0 ? true : false)
					: false;
	},
	'last' : function(id){
		var doc = categoryTree.findOne({"childern" : id});
		return (doc != null) ? 
			(doc.childern.indexOf(id) === (doc.childern.length-1) ? true : false)
					: false;
	},
	'haveChildern' : function(id){
		var doc = categoryTree.findOne({"childern" : id});
		return (doc != null && doc.childern) ? 
			(doc.childern.length > 1 ? true : false)
					: false;
	},
	'isCollapsed' : function(id){
		var parentsIds = categoryTree.find({ childern: { $exists: true, $not: {$size: 0} } }).map(function(node){
			if(node.childern){
				return node._id._str;
			}
		});
		if(Session.get(id) == null && parentsIds.indexOf(id) > -1){
				Session.set(id,true);
		}		
		return Session.get(id);
	},
	'oridinaryNode' : function(id){
		return categoryTree.findOne({"_id" : new Mongo.ObjectID(id)}).isRoot ? false : true;
	}

});

Template.list.events({
	'click #moveDown' : function(event, instance) {
		event.stopPropagation();
		event.preventDefault();
		var id = this.valueOf();
		Meteor.call('moveWithInNode', id, true, function(error, result) {
      		if (error) {
        		alert(error);
      		}
      	});
	},

	'click #moveUp' : function(event, instance) {
	 	event.stopPropagation();
		event.preventDefault();
		var id = this.valueOf();
		Meteor.call('moveWithInNode', id, false, function(error, result) {
      		if (error) {
        		alert(error);
      		}
      	});
	},
	'click #edit' : function(event, instance) {
		 	event.stopPropagation();
			event.preventDefault();
			var id = this.valueOf();
			FlowRouter.go('/NodeEdit/' + id);
	},
	'click #delete' : function(event, instance) {
	 	event.stopPropagation();
		event.preventDefault();
		var id = this.valueOf();
		var $dialog = $('<div></div>')
    	.html('<form id="myform" action=""><input type="checkbox"   id="deleteCompletely" name="deleteCompletely" value="" />Do you want to delete it for ever?<br /></form>')
    	.dialog({
	        autoOpen: true,
	        title: 'Are you sure about unlink this node?',
	        buttons: {
	        "Submit Form": function() {  $('form#myform').submit();},
	        "Cancel": function() {$(this).dialog("close");}
        	}
    	});

		$('#createNew').click(function() {
    		$dialog.dialog('open');
	    	return false;
		});

		var purgePermanently = false;
		$('form#myform').submit(function(event1){
      		event1.preventDefault();
      		event1.stopPropagation();
  			$dialog.dialog('close');
   			console.log(purgePermanently);
			Meteor.call('deleteNode', id, $('#deleteCompletely').is(':checked'), function(error, result) {
	      		if (error) {
	        		alert(error);
	      		}
      		});
		});        

	},

	'click #addElement' : function(event, instance){
		event.stopPropagation();
		event.preventDefault();
		var id = this.valueOf();
		FlowRouter.go('/NodeAdd/' + id);
	},
	'click #collapse' : function(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		var id = this.valueOf();
		Session.set(id,!Session.get(id));
	} 	
});