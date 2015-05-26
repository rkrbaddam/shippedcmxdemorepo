
function Validate()
{
    if(ValidateServer()) {
        user = document.getElementById("user").value;
        pass = document.getElementById("pass").value;
        if (user.match("learning")) {
            if (pass.match("learning")) {
                window.location.href = "home.html";
            }
            else {
                document.getElementById("label").innerHTML = "Invalid Password";
            }
        }
        else {
            document.getElementById("label").innerHTML = "Invalid Username";
        }
    }
    else
    {
        document.getElementById("label").innerHTML = "Invalid ServerName";
    }
}
function ValidateServer()
{
    server  = document.getElementById("server").value;
    if(server.match(""))
    {
        return true;
    }
    else
    {
        document.getElementById("label").innerHTML  = "Invalid Server Name";
        return false;
    }
}