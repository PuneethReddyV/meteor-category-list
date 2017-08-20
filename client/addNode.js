Template.addNode.events({
	'submit .node-add' : function(event){
			event.preventDefault();
			event.stopPropagation();
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
				Meteor.call('addNode', nodeId, value, desc, function(error, objResult) {
					if(error){
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
