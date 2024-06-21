$(document).ready(function () {

    // Login form validation
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var username = $('#Username').val().trim();
        var password = $('#Password').val();

        if (username != "") {
            if (username.length > 255) {
                toastr.error('Username length should not be more than 255', "Error");
                return;
            }
        } else {
            toastr.error('Please enter valid username',"Error");
            return;
        }
        

        if (password.length < 6) {
            toastr.error('Password must be at least 6 characters long', "Error");
            return;
        }
        LoginExistingUser();
    });

    // Sign up form validation
    $('#signupForm').submit(function (event) {
        event.preventDefault();

        var username = $('#newUsername').val().trim();
        var email = $('#newUserEmail').val().trim();
        var password = $('#newUserPassword').val();
        var confirmPassword = $('#newUserConfirmPassword').val();

        if (username.length > 255) {
            toastr.error("Username length cannot exceed 255 characters.", "Error");
            return;
        }

        if (email.length > 255) {
            toastr.error("Email length cannot exceed 255 characters.", "Error");
            return;
        }

        if (password.length < 6) {
            toastr.error("Password must be at least 6 characters long.", "Error");
            return;
        }

        if (password !== confirmPassword) {
            toastr.error("Password and Confirm Password must match.", "Error");
            return;
        }
        RegisterNewUser();
    });

});
function toggleForm() {
    var loginCard = document.getElementById('loginCard');
    var signupCard = document.getElementById('signupCard');

    loginCard.classList.toggle('hidden');
    signupCard.classList.toggle('hidden');
    clearForm();
}

function LoginExistingUser() {
    var data = {
        Username: $("#Username").val().trim(),
        Password: $("#Password").val()
    }
	$(".loader").show();
    $.ajax({
        type: "POST",
        url: "/User/LoginExistingUser",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (result) {
			$(".loader").hide();
            localStorage.removeItem('cart');
            if (result.isSuccess) {
                toastr.success(result.message, "Success");
                window.location.href = "/Product";
            } else {
                toastr.error(result.message, "Error");
            }
        },
        error: function (result) {
			$(".loader").hide();
        }
    });
}
function RegisterNewUser() {
    var data = {
        Username: $('#newUsername').val().trim(),
        Email: $('#newUserEmail').val().trim(),
        Password: $('#newUserPassword').val()
    }
	$(".loader").show();
    $.ajax({
        type: "POST",
        url: "/User/RegisterNewUser",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (result) {
			$(".loader").hide();
            if (result.isSuccess) {
                toastr.success(result.message, "Success");
                toggleForm();
            } else {
                toastr.error(result.message, "Error");
            }

        },
        error: function (result) {
			$(".loader").hide();
        }
    });
}
function clearForm() {
    $("#Password").val("");
    $("#Username").val("");
    $('#newUsername').val("");
    $('#newUserEmail').val("");
    $('#newUserPassword').val("");
    $('#newUserConfirmPassword').val("");
}