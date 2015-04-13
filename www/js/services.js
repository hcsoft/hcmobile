angular.module('starter.services', ['ionic'])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

    }).service('auth', function ($ionicModal, $rootScope, $q, $state, $http) {
        function assignCurrentUser(_username) {
            $rootScope.currentUser = _username;
        }

        return {
            login: function (_username, _password) {
                var deferred = $q.defer();
                //进行http请求查询结果
                console.log(_username, _password);
                $http.jsonp(window.localStorage['loginurl'],
                    {
                        params: {
                            userid: _username,
                            password: CryptoJS.MD5(_password).toString()
                        }
                    }).then(function (data) {
                        console.log(data);
                        if (data.data.Status == 200) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data);
                        }
                    }).catch(function (data) {
                        console.log(data);
                        deferred.reject(data);
                    });
                //deferred.resolve();
                return deferred.promise.then(assignCurrentUser);
            },
            logindlg: function () {
                var deferred = $q.defer();
                var child = $rootScope.$new();
                child.cancel = function () {
                    //取消登录时,啥也不干
                    this.modal.hide();
                    deferred.reject();
                };
                child.login = function (_username, _password) {
                    this.modal.hide();
                    deferred.resolve(_username);
                };
                var instance = $ionicModal.fromTemplateUrl('tpl/logindialog.html', {
                    scope: child,
                    animation: 'slide-in-up',
                    focusFirstInput: true,
                    backdropClickToClose: false
                }).then(function (modal) {
                    child.modal = modal;
                    modal.show();
                });

                return deferred.promise.then(assignCurrentUser);
            },
            logout: function () {
                $rootScope.currentUser = undefined;
                $state.go("login")
            }
        };

    });
