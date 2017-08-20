import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.index.onCreated(function(){
		this.autorun(() => {
	  		this.subscribe('publishCategories');
	  	});
});	

Template.index.helpers({
	'root' : function(){
		var allNodes = categoryTree.find({"isRoot": { $exists: true }},{fields: {'_id': 1}}).fetch().map(function(document){
			return (document._id && document._id._str) ;
		});
		return allNodes;
	}
});

var getParentIds = function(){
	var parentsIds = categoryTree.find({ childern: { $exists: true, $not: {$size: 0} } }).map(function(node){
		if(node.childern){
			return node._id._str;
		}
	});
	return parentsIds;
};

var toggleParentState = function(value){
	var parentsId = getParentIds();
	Session.keys = {};
	for(parentId in parentsId){
		Session.set(parentsId[parentId], value);
	}
};

Template.index.events({
	'click #collapseAll' : function(){
		toggleParentState(false);
	},
	'click #expandAll' : function(){
		toggleParentState(true);
	},
	'click #info' : function(){
		FlowRouter.go('info');
	}

});
