const todolist = angular.module('todolist', ['ngResource']);

const getData = function (key) {
    return function (data, header) {
        const parsed = angular.fromJson(data);
        if (parsed.status === "success") {
            return parsed.data[key];
        }
        console.log(parsed);
    }
}

todolist.factory('Todo', ['$resource', function ($resource) {
    const Todo = $resource('/api/todos/:todoId', {
        todoId: '@_id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: getData('todos')
        },
        get: {
            method: 'GET',
            params: {
                todoId: '@id'
            },
            transformResponse: getData('todo')
        },
        save: {
            method: 'POST',
            transformResponse: getData('todo')
        },
        update: {
            method: 'PUT',
            transformResponse: getData('todo')
        },
        delete: {
            method: 'DELETE'
        },
        cleanup: {
            method: 'DELETE',
            params: {cleanup: true},
            isArray: true,
            transformResponse: function () { return [] }
        }
    });
    return Todo;
}]);

todolist.controller('TodoController', ['$scope', 'Todo', function TodoController($scope, Todo) {
    const updateTodos = function () {
        Todo.query(function (results) {
            $scope.todos = results;
        });
    }

    $scope.update = function (todo) {
        todo.$update();
    }

    $scope.create = function (todoData) {
        const todo = new Todo(todoData);
        todo.$save(updateTodos);
        $scope.todo = {};
    }

    $scope.cleanup = function () {
        Todo.cleanup(updateTodos);
    }

    updateTodos();
}]);
