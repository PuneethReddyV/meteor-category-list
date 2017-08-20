import { Meteor } from 'meteor/meteor';

//var categoryTree = new Mongo.Collection("category-tree"); 

Meteor.startup(() => {

	if(categoryTree.find({}).count() == 0){
		categoryTree.insert({
			"desc" : "The root for all Categories.",
    		"value" : "Categories",
    		"isRoot" : true
		});
	}

  Meteor.publish('publishCategories', function() {
    return categoryTree.find();
  });
});

Meteor.methods({
	'moveWithInNode' : function(childId, isDown){
		var doc = categoryTree.findOne({"childern" : childId});
		if(doc != null){
			before = doc.childern;
			var currentIndex = doc.childern.indexOf(childId);
			if(isDown){
				doc.childern[currentIndex] = doc.childern[currentIndex+1];
				doc.childern[currentIndex+1] = childId ;
			}else{
				doc.childern[currentIndex] = doc.childern[currentIndex-1];
				doc.childern[currentIndex-1] = childId ;
			}
			categoryTree.update(doc._id,{ 
				$set: { "childern": doc.childern }
			});			

		}
	},
	'updateNode' : function(id, value, desc, kids){
		try {
			var node = categoryTree.update(
				new Mongo.ObjectID(id), 
				{$set: {"value": value,	"desc": desc, "childern" : kids}}
				);
			return node;
		} catch (e) {return e;}
	},

	'deleteNode' :function(childId, purge){
		var doc = categoryTree.findOne({"childern" : childId});
		if(doc != null){
			var index = doc.childern.indexOf(childId);
			if (index > -1) {
    			doc.childern.splice(index, 1);
			}
			if(doc.childern.length == 0){
				categoryTree.update(doc._id,{ $unset: { "childern": "" }});
			}else{
				categoryTree.update(doc._id,{ 
					$set: { "childern": doc.childern }
				});	
			}

			console.log(purge);
			if(purge){
				categoryTree.remove({"_id" : new Mongo.ObjectID(childId)});
			}

		}
	},

	'addNode' : function(id, value, desc){
		var parentNode = categoryTree.findOne({"_id": new Mongo.ObjectID(id)});
		var childId = categoryTree.insert({"value": value, "desc" : desc });
		var kids = [];
		if(parentNode.childern){
			kids = parentNode.childern;
		}
		kids.push(childId._str);
		categoryTree.update(parentNode._id,{ 
			$set: { "childern": kids }
		});
	}
});


//  "59942e42eaa068a98517f208", "59942e42eaa068a98517f202", "59942e42eaa068a98517f204", "59942e42eaa068a98517f205"
