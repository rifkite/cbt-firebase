const db = firebase.database();
const auth = firebase.auth();
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};

$('a.btn-danger').on('click', function () {
    if($("input[name='agreeterms']").is(':checked')){
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result){
            var db_user = db.ref("users");
            var lastKey = 0;
            var email = result.user.email;

            db_user.orderByKey().limitToLast(1).once("child_added", function(snapshot) {
                lastKey = parseInt(snapshot.key);
                console.log("Get lastKey = "+lastKey);
                db_user.child(String(lastKey+1)).set({
                    admin : false,
                    email : email,
                }).then(function () {
                    return db_user.child(String(lastKey+1)).once("value");
                }).then(function (snapshot) {
                    localStorage.user = JSON.stringify(snapshot.val());
                });
            });
        });
    } else {
        var notice = new PNotify({
            title: 'ERROR',
            text: 'Check The Terms to Create Account',
            type: 'error',
            addclass: 'stack-bar-top',
            stack: stack_bar_top,
            width: "100%",
            nonblock: {
                nonblock: true,
                nonblock_opacity: .2
            }
        });
    }
});