// variable
const navList = document.querySelector(".nav-list");
const hamburger = document.querySelector(".hamburger");
const form = document.querySelector(".form");
const results = document.querySelector(".results");

// navigation
function openNav() {
  navList.classList.toggle("open");
}

// copy the shorted link on click of the copy button
function copy(e) {
  if (e.target.classList.contains("copy-btn")) {
    const copyText = document.querySelector(".shorted-link").textContent;
    const elem = document.createElement("textarea");
    elem.value = copyText;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    document.querySelector(".copy-btn").textContent = "Copied";
    //  alert(`${copyText}: link is copied`);

    setTimeout(() => {
      document.querySelector(".copy-btn").textContent = "Copy";
    }, 2000);
  }
}

hamburger.addEventListener("click", openNav);
results.addEventListener("click", copy);

const share = (e) => {
  const copyText = document.querySelector(".shorted-link").textContent;
  if (navigator.share) {
    navigator
      .share({
        title: "Share my blog",
        text: "Web development tutorial blogs",
        url: copyText,
      })
      .then(() => console.log("thanks for share"))
      .catch((error) => console.log("error", error));
  }
};
if (!navigator.share) {
  document.getElementById("tip").className = "show";
}
document.getElementById("share").addEventListener("click", share);
