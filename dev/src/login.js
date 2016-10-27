$(document).ready(function() {
	$('#form-login').submit(function(e) {
        e.preventDefault();

        var $account = $('#account');
        var $password = $('#password');

        if(!$account.val() || !$password.val()) {
        	$(".login-content").removeClass('shake_effect');  
			setTimeout(function()
			{
			 $(".login-content").addClass('shake_effect')
			},1); 
		}
    });
});

function rememberMe(e) {
	e.stopPropagation();
	if(e.target.tagName == 'A') {	
		var check = document.getElementById('rememberMe');
		if(check.checked) {
			check.checked = false;
		} else {
			check.checked = true;
		}
	}
}