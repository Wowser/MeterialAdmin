materialAdmin
    .controller("productAddCtrl", function ($scope, $timeout) {
        $scope.product = {
            name: "",
            desc: "",
            skus: []
        }

        //Mock
        $scope.product.skus[0] = {
            name: "sku1",
            determinPrice: true,
            values: ["v1", "v2", "v3", "v4", "v5"]
        }

        $scope.product.skus[1] = {
            name: "sku2",
            determinPrice: true,
            values: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"]
        }

        $scope.product.skus[2] = {
            name: "sku2",
            determinPrice: true,
            values: ["k1", "k2", "k3", "k4", "k5", "k6", "k7"]
        }

        $scope.addSku = function () {
            var name = $scope.skuNameInput;
            $scope.product.skus.push({
                name: name,
                determinPrice: true,
                values: [],
                add: function () {
                    if (this.values.indexOf(this.newValue) < 0) {
                        this.values.push(this.newValue);
                    }
                },
                delete: function () {
                    $scope.product.skus.splice($scope.product.skus.indexOf(this), 1);
                },
                deleteAttr: function (index) {
                    this.values.splice(index, 1);
                }
            });
            $scope.skuNameInput = '';
        }

        $scope.stepScopes = [];

        $scope.addStepScope = function () {
            var start = 0;
            var end = 0;
            if ($scope.stepScopes.length !== 0) {
                start = $scope.stepScopes[$scope.stepScopes.length - 1].end + 1;
                end = start;
            }
            $scope.stepScopes.push({
                start: start,
                end: end
            })
        }


        $scope.deleteStepScope = function (index) {
            $scope.stepScopes.splice(index, 1);
        }

        $scope.nextStep = function (stepIndex) {
            if (stepIndex < $scope.maxStep) {
                $scope.stepIndex++;
                showPreloader();
            }
        }

        function showPreloader() {
            $scope.preLoaderShow = true;
        }

        function hiedePreloader() {
            $scope.preLoaderShow = false;
        }

        $scope.preStep = function (stepIndex) {
            if (stepIndex > 1) {
                $scope.stepIndex--;
                showPreloader();
            }
        }

        var initStep1 = function () {
            hiedePreloader();
        }

        $scope.skuCombination = [];

        function combineSku(source, level, combine) {
            if (level === source.length) {
                return;
            }
            var sku = source[level];
            var scopeLength = combine.length / sku.values.length;
            for (var i = 0; i < sku.values.length; i++) {
                var scopeCombine = [];
                var scopeStart = i * scopeLength;
                var scopeEnd = (i + 1) * scopeLength;
                var value = sku.values[i];
                for (var j = scopeStart; j < scopeEnd; j++) {
                    if (combine[j] === undefined) {
                        combine[j] = [];
                    }
                    combine[j].push(value);
                    scopeCombine.push(combine[j]);
                }
                combineSku(source, level + 1, scopeCombine);
            }
        }

        var initStep2 = function () {
            var combine = [];
            var total = 1;
            var skus = [];
            for (var i = 0; i < $scope.product.skus.length; i++) {
                var sku = $scope.product.skus[i];
                if (sku.determinPrice) {
                    total *= sku.values.length;
                    skus.push(sku);
                }
            }
            combine.length = total;
            combineSku(skus, 0, combine);
            $scope.skuCombination = combine;
            hiedePreloader();

        }


        var initStep3 = function () {
            hiedePreloader();
        }

        var stepInits = [initStep1, initStep2, initStep3]

        $scope.$watch("stepIndex", function (value) {
            stepInits[value - 1]();
        });
    });