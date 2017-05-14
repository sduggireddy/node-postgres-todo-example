angular.module('nodeTodo', [])
    .controller('mainController', ($scope, $http) => {
        $scope.formData = {};
        $scope.todoData = {};
        //Get all todos
        $http.get('/api/v1/todos')
            .success((data) => {
                $scope.todoData = data;
                console.log(data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
        //create a new TODO
        $scope.createTodo = () => {
            $http.post('/api/v1/todos', $scope.formData)
            .success((data) => {
                $scope.formData = {};
                $scope.todoData = data;
                console.log(data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            })
        };
        //delete a TODO
         $scope.deleteTodo = (todoId) => {
            $http.delete('/api/v1/todos/' + todoId)
            .success((data) => {
                $scope.todoData = data;
                console.log(data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            })
         };            
    }            
)