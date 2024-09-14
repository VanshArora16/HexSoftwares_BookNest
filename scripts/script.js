// search bar
searchForm = document.querySelector(".search-form");
document.querySelector("#search-btn").onclick = () =>{
        searchForm.classList.toggle("active");
        document.querySelector(".container").style.display ="none";
}


// login form 
let loginForm = document.querySelector(".login-form-container ");
document.getElementById("login-btn").addEventListener("click", () => {
        loginForm.classList.toggle("active");
        });
document.getElementById("close-login-btn").addEventListener("click", () =>{
        loginForm.classList.remove("active");
});

//loader functions

let loader = ()=>{
        document.querySelector(".loader-container").classList.remove("active");
}

let fadeOut = ()=>{
        setTimeout(loader, 4000);
}

// debounce function
const debounce = (func, delay) => {
        let debounceTimer;
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    };


// on scrolling
window.onscroll = debounce(() => {
        if (window.scrollY > 80) {
            searchForm.classList.remove("active");
            document.querySelector(".header-2").classList.add("active");
        } else {
            document.querySelector(".header-2").classList.remove("active");
        }
    }, 100);




// on reloading page
window.onload  =  () =>{
        if(window.scrollY> 80){
                document.querySelector(".header-2").classList.add("active");
        }
        else{
                document.querySelector(".header-2").classList.remove("active");
        }

        fadeOut();
}


document.addEventListener("DOMContentLoaded", () => {
        document.querySelector(".loader-container").classList.add("hidden");
    });