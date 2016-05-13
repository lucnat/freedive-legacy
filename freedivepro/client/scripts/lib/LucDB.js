/*

 ------- API for singletons and collections -------

 LucDB(label) 	creates new DB with label
 set(obj)		sets entire DB to obj
 get() 			returns all in DB
 
 ------- API for collections only ------

 find(selector) 	find documents matching selector (not yet implemented, currently returns everything)
 findOne(id) 		find one document with id
 update(id, obj) 	updates document with id to obj
 insert(obj) 		inserts new obj to DB
 remove(id)		removes document with id

*/


LucDB = class {
	
	constructor(label){
		// constructs new LucDB. Needs a label passed
		if(! label){
			alert('You are a fool. You have not provided a label');
			return;
		}
		this.label = label;
		this.dependency = new Tracker.Dependency;
	}

	set(obj){
		// Sets entire collection to obj! Often used for singletons
		if(!obj._id){
			obj._id = Random.id();
		}
		if(obj.constructor == Array){
			obj.forEach(function(o){
				if(!o._id){
					o._id = Random.id();
				}
			});
		}
		localStorage[this.label] = JSON.stringify(obj);
		this.dependency.changed();
	}

	get(){
		// Returns everything in collection
		this.dependency.depend();
		if(localStorage[this.label]){
			return JSON.parse(localStorage[this.label]);
		}
	}

	find(selector){
		// Finds all that match selector. Foolish if it is a singleton
		this.dependency.depend();
		var everything = JSON.parse(localStorage[this.label]);
		var notEverything = [];

		// filter stuff

		notEverything = everything;

		return notEverything;
	}

	findOne(id){
		// takes id and returns one document. Foolish if it is a singleton
		this.dependency.depend();
		var everything = JSON.parse(localStorage[this.label]);
		var result;
		everything.forEach(function(obj){
			if(obj._id == id){
				result = obj;
			}
		});

		return result;
	}

	update(id, obj){
		// updates the one with id to new one. Foolish if singleton
		obj._id = id;
		var everything = JSON.parse(localStorage[this.label]);

		for(var i=0; i<everything.length; i++){
			if(everything[i]._id == id){
				everything[i] = obj;
			}
		}
		this.set(everything);
	}

	insert(obj){
		// Inserts something into collection. Foolish if collection is a singleton
		var before = this.get();
		if(! before.push){
			alert('You fool! This is a singleton! You cannot push objects into this');
			return;
		}
		obj._id = Random.id();
		before.push(obj);
		var after = before;
		this.set(after);
	}

	remove(id){
		var tables = this.get();
		for(var i=0; i<tables.length; i++){
			if(tables[i]._id == id){
				tables.splice(i,1);
			}
		}
		this.set(tables);
	}

	count(){
		this.dependency.changed();
		var everything = JSON.parse(localStorage[this.label]);
		return everything.length;
	}
}
