materialAdmin
    .controller("productAddCtrl", function ($scope, $timeout) {
        $scope.product = {
            name: "",
            desc: "",
            skus: [],
            priceType: "fixedUnitPrice",
            pricing: [],
            stepScopes: [],
            specifics: {
                carRent: {
                    carType: "",
                    supplier: ""
                },
                ticket: {
                    viewDestination: "",
                    viewType: "",
                },
                travel: {
                    agency: "",
                    travelType: ""
                },
                additonal: {
                    addtionServiceSupplier: "",
                    addtionServiceType: ""
                }
            },
            type: ""
        }

        //Mock
        $scope.product.skus[0] = {
            name: "sku1",
            determinPrice: true,
            values: ["v1", "v2", "v3", "v4", "v5"]
        }

        //$scope.product.skus[1] = {
        //    name: "sku2",
        //    determinPrice: true,
        //    values: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"]
        //


    })
    .controller("productAdditionBasic", function ($scope) {
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
        $scope.addStepScope = function () {
            var start = 0;
            var end = 0;
            if ($scope.product.stepScopes.length !== 0) {
                start = $scope.product.stepScopes[$scope.product.stepScopes.length - 1].end + 1;
                end = start;
            }
            $scope.product.stepScopes.push({
                start: start,
                end: end
            })
        }


        $scope.deleteStepScope = function (index) {
            $scope.product.stepScopes.splice(index, 1);
        }

        $scope.$watch("radioModel", function (val) {
            if (val === "ticket") {
                $scope.specifics.viewType = "ss";
            }
        })
    })
    .controller("setPriceTableCtrl", function ($scope, $timeout, ngTableParams, productService) {
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

        function formatCombinSku() {
            var res = [];
            for (var i in $scope.product.stepScopes) {
                res.push({
                    cny: 0,
                    thb: 0,
                    usd: 0
                });
            }
            if (res.length == 0) {
                res.push({
                    cny: 0,
                    thb: 0,
                    usd: 0
                });
            }
            return res;
        }


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
        $scope.product.pricing.length = 0;
        angular.forEach(combine, function (data, index) {
            var d = {
                name: data,
                price: formatCombinSku()
            };

            d.pricingTable = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: d.price.length, // length of data
                counts: [],
                getData: function ($defer, params) {
                    $defer.resolve(d.price.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.product.pricing.push(d);
        });

        $scope.submit = function () {
            var pricing = [];
            for (var i in $scope.product.pricing) {
                pricing.push({
                    name: $scope.product.pricing[i].name,
                    price: $scope.product.pricing[i].price
                })
            }

            var specifics = [];
            for (var key in $scope.product.specifics[$scope.product.type]) {
                specifics.push({
                    itemName: key,
                    value: $scope.product.specifics[$scope.product.type][key]
                })
            }

            var data = {
                name: $scope.product.name,
                desc: $scope.product.desc,
                skus: $scope.product.skus,
                type: $scope.product.type,
                priceType: $scope.product.priceType,
                pricing: pricing,
                stepScopes: $scope.product.stepScopes,
                specifics: specifics
            }
            productService.add(data);
        }
    })
    .controller("submitProductAddtion", function ($scope, $timeout, productService) {

    })
    .controller('productQueryCtrl', function($scope) {

    })
    .controller('productInfoCtrl', function($scope, $stateParams) {
        console.log($stateParams.id);
        $scope.ctrl = {
            editDescription: 0,
            editBasicInfo: 0,
            editSkus: 0
        };

        $scope.product = {
            name: "产品1",
            desc: "产品1描述",
            skus: [],
            priceType: "fixedUnitPrice",
            pricing: [],
            stepScopes: [],
            specifics: [{
                itemName: "汽车类型",
                value: "Toyota",
                editable: true
            },{
                itemName: "供应商",
                value: "Supplier1",
                editable: false
            }],
            type: "汽车租赁"
        }
    })
