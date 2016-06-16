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
                }
            });
            $scope.skuNameInput = '';
        }
    });