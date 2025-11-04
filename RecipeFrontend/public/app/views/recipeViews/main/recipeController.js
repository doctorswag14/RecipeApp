app.controller('recipeController', function($scope, $routeParams, $location, $window, recipeService, notificationService, loaderService, userpostService) {
    $scope.feed = [];
    $scope.page = 0;
    $scope.pageSize = 20;
    $scope.loading = false;
    $scope.allLoaded = false;

    $scope.newComment = {};
    $scope.showCommentBox = {};
    $scope.newReply = {};
    $scope.showReplyBox = {};

    function initLoad(){
        loaderService.showLoader();
        _loadMore();
        SetShowPost(false);
    }

    function SetShowPost(a){
        $scope.ShowPost = a;
    }

    function GetUserPost(){
        return $scope.UserPost;
    }

    function SetUserPost(a){
        $scope.UserPost = a;
    }

    $scope.toggleCommentBox = function(item) {
        $scope.showCommentBox[item.id] = !$scope.showCommentBox[item.id];
    };

    $scope.toggleReplyBox = function(comment) {
        $scope.showReplyBox[comment.commentId] = !$scope.showReplyBox[comment.commentId];
    };

    // Post a top-level comment
    $scope.postComment = function(item) {
        var userComment = $scope.newComment[item.id];
        if (!userComment || userComment.trim() === "") return;

        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        var tmpObj = {
            Username: user.Username,
            PostID: item.id,
            Content: userComment,
            PostType: item.type === "recipe" ? "Recipe" : "UserPost",
            ParentCommentId: null
        };

        userpostService.AddUserPostComments(tmpObj).then(function(response) {
            if (!item.comments) item.comments = [];
            item.comments.unshift(response); // add new comment
            $scope.newComment[item.id] = "";
            $scope.showCommentBox[item.id] = false;
        });
    };

    // Post a reply to a comment
    $scope.postReply = function(item, parentComment) {
        if (!parentComment || !parentComment.commentId) return;
        var replyText = $scope.newReply[parentComment.commentId];
        if (!replyText || replyText.trim() === "") return;

        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        var replyObj = {
            Username: user.Username,
            PostID: item.id,
            Content: replyText,
            PostType: item.type === "recipe" ? "Recipe" : "UserPost",
            ParentCommentId: parentComment.commentId
        };

        userpostService.AddUserPostComments(replyObj)
        .then(function(response) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.unshift(response);
            $scope.newReply[parentComment.id] = "";
            $scope.showReplyBox[parentComment.id] = false;
        });
    };

        $scope.toggleLike = _toggleLike;

        function _toggleLike(data) {
            // Flip the local liked state immediately for instant UI feedback
            data.likedByUser = !data.likedByUser;
            console.log("Updated data:", data);

            // Determine whether this action is a Like (true) or Unlike (false)
            var isLiked = data.likedByUser;

            var userdata = $window.localStorage.getItem('thomastechuser');
            var user = JSON.parse(userdata);

            // Build payload for API
            var tmpObj = {
                ItemId: data.id,
                ItemType: data.type,
                Username: user.Username,
                IsLiking: isLiked  // true = Like, false = Unlike
            };

            console.log("Sending Like/Unlike:", tmpObj);

            // Call backend service
            recipeService.likeItem(tmpObj)
                .then(function (response) {
                    console.log("API response:", response);

                    // Optionally update like count if API returns it
                    if (response.data && response.data.likeCount !== undefined) {
                        data.likeCount = response.data.likeCount;
                    }
                })
                .catch(function (error) {
                    console.error("Error liking item:", error);
                    // Roll back UI if the request fails
                    data.likedByUser = !data.likedByUser;
                });
        }

    $scope.ShowUserPost = function(){ SetShowPost(true); };
    $scope.HideUserPost = function(){ SetShowPost(false); };

    $scope.PostUserPost = function(){
        var userPost = GetUserPost();
        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        var tmpObj = {
            Post: userPost,
            Username: user.Username
        };

        userpostService.AddUserPost(tmpObj).then(function(response) {
            // maybe prepend post to feed
        });
    };

    $scope.loadMore = _loadMore;
    function _loadMore() {
        if ($scope.loading || $scope.allLoaded) return;
        $scope.loading = true;

        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        recipeService.getPage($scope.page, $scope.pageSize, user)
            .then(function (response) {
                console.log(response);
                var existingKeys = new Set($scope.feed.map(f => f.type + "-" + f.id));
                var newItems = response.items.filter(f => !existingKeys.has(f.type + "-" + f.id));

                if (newItems.length > 0) {
                    $scope.feed = $scope.feed.concat(newItems);
                    $scope.page++;
                } else {
                    $scope.allLoaded = true;
                }
            })
            .catch((error) => {
                console.error(error);
                notificationService.fail("Could not load feed");
            })
            .finally(() => {
                loaderService.hideLoader();
                $scope.loading = false;
            });
    }

    initLoad();
});