function checkLogin() {
    let u = document.getElementById("user").value.trim();
    let p = document.getElementById("pass").value.trim();
    let msg = document.getElementById("msg");

    if(u!=="" && p!=="") {
        // allow anything and go to dashboard
        window.location.href = "../Dashboard_page/My_Dashboard.html";

    } else {
        msg.textContent = "enter username and password";
    }

}
