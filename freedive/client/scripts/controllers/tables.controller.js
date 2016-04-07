
angular.module('freedive').controller('TablesController', function($scope, $reactive, $ionicModal){
	$reactive(this).attach($scope);
	var self = this;

	self.helpers({
		'tables': function(){
			return Tables.get();
		}
	});

	self.addTable = function(){
		// open modal
		$ionicModal.fromTemplateUrl('client/templates/modals/addTable.html', {
			scope: 						$scope,
			backdropClickToClose: 		false,
			hardwareBackButtonClose: 	false,
			animation: 					'slide-in-up'
		}).then(function (modal){
			$scope.modal = modal;
			modal.show();
		});

		$scope.save = function(tableName){

			if(tableName.length == 0){
				console.log(tableName);
				alert('Plase enter a name for your table');
				return;
			}

			var durationElements = $('.duration');
			var durations = [];
			for(var i=0; i<durationElements.length; i++){
				var duration = $(durationElements[i]).val()/1.0;
				if(duration <= 0){
					console.log(duration);
					alert('Enter all durations');
					return;
				}
				durations.push(duration);
			}

			var table = {
				'name': tableName,
				'description': 'Custom table',
				'durations': durations
			};
			Tables.insert(table);

			$scope.modal.remove();
		};

		$scope.tableName = '';
		$scope.amountOfRows = 4;

		$scope.getNumber = function(num) {
			return new Array(num);   
		}

		$scope.addRow = function(){
			$scope.amountOfRows = $scope.amountOfRows + 1;
		}

		$scope.closeModal = function(){
			$scope.modal.remove();
		}
	}


});

