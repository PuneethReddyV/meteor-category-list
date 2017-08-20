import myCollection from './list.js';
Template.editNode.onCreated(function() {
		var self = this;
		self.autorun(() => {
			var id = FlowRouter.getParam('_id');
	  		self.subscribe('publishCategories');
	  	});
});

Template.editNode.helpers({
	'node' : function(){
		var id = FlowRouter.getParam('_id');
		return categoryTree.findOne({"_id":new Mongo.ObjectID(id)});
	},
	'getValue' : function(id){
		return categoryTree.findOne({"_id":new Mongo.ObjectID(id)}).value;
	},
	'haveChildern' : function(){
		var id = FlowRouter.getParam('_id');
		var node = categoryTree.findOne({"_id":new Mongo.ObjectID(id)});
		return node.childern && node.childern.length > 0;
	},
	'zombieNodes' : function(){
		var returnValue = new Array();
		//get nodes which is not root and have childern
		var allNodes = categoryTree.find({"isRoot": { $exists: false }},{fields: {'_id': 1}}).fetch().map(function(document){
			return (document._id && document._id._str) ;
		});
		for (var i = 0; i < allNodes.length ; i++) {
			var zombieNode=false;
			categoryTree.find( { "childern": { $exists: true } } ).map(function(doc){
				if(doc.childern.indexOf(allNodes[i]) > -1){
					zombieNode=true;
				}
			});
			if(!zombieNode){
				returnValue.push(allNodes[i]);
			}
		}
		return returnValue;
	}
});

Template.editNode.events({
			'submit .node-edit' : function(event){
			event.preventDefault();
			event.stopPropagation();
			var kids = [];
			$('input[type=checkbox]:checked').each(function(index){
				var childRef = $(this).val();
				if(childRef != null && childRef.length > 0){
  					kids.push(childRef);
				}
			});        		
			var trimInput = function (id) {
				var element = document.getElementById(id);
			  	if (!element)
			    	return null;
			  	else
			    	return element.value.replace(/^\s*|\s*$/g, "");
        	}
			var nodeId = FlowRouter.getParam('_id');
			var value = trimInput('value');
			var desc = trimInput('desc');
			if(!_.isEmpty(value) && !_.isEmpty(desc)) {
				console.log(kids);
				Meteor.call('updateNode', nodeId, value, desc, kids, function(error, objResult) {
					if (error) {
		        		alert(error);
		      		}else{
	      				FlowRouter.go('/');
	   				}
		    	});
			} else {
            	alert("Node Value or Description field is empty");
            	return false;
        	}
		},
		'click #btnCancel': function(event){
			event.preventDefault();
			event.stopPropagation();
			FlowRouter.go('/');
		},
});
