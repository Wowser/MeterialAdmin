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
                add: function () {
                    if (this.values.indexOf(this.newValue) < 0) {
                        this.values.push(this.newValue);
                    }
                },
                delete: function() {
                    $scope.product.skus.splice($scope.product.skus.indexOf(this), 1);
                },
                deleteAttr: function(index) {
                    this.values.splice(index, 1);
                }
            });
            $scope.skuNameInput = '';
        }

        $scope.nextStep = function(stepIndex) {
            if (stepIndex < $scope.maxStep) {
                $scope.stepIndex++;
            }
        }

        $scope.preStep = function(stepIndex) {
            if (stepIndex > 1) {
                $scope.stepIndex--;
            }
        }

        $scope.skuCombin = [];

        $scope.$watch("stepIndex", function(value) {
            if (value === 2) {
                for (var i in $scope.product.skus) {
                    var sku = $scope.product.skus[i]
                    for (var j in sku .values) {
                        console.log(sku.values[j]);
                    }
                }
            }
        });
    });