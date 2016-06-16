materialAdmin
    .controller("productAddCtrl", function ($scope) {
        $scope.product = {
            name: "",
            desc: "",
            skus: []
        }

        $scope.addSku = function () {
            var name = $scope.skuNameInput;
            $scope.product.skus.push({
                name: name,
                values: [],
                add: function() {
                    this.values.push(this.newValue);
                }
            });
            $scope.skuNameInput = '';
        }

        $scope.add = function(event) {
            console.log(angular.element(event.target).siblings("input").val());
        }
    });