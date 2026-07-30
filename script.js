/*==========================
    CONFIG
==========================*/

// Link Web App Google Apps Script (đã lưu form vào Google Sheet)
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyIkKrQwL3frev2NSXuxjaRQI6paHsT1YQOGtqcPpaXtbj4gYfdfGhwFcV330WIAtuf/exec";

// Link tải bộ tài liệu (Google Drive, Dropbox...) sẽ hiện ra
// cho khách ngay sau khi họ đăng ký thành công.
const DOCUMENT_DOWNLOAD_URL = "https://drive.google.com/file/d/1Nw77Ad9Gi6gqcch8rFzNPpk9ajDudCQl/view?usp=drive_link";


/*==========================
    HEADER SCROLL
==========================*/

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("active");

    } else {

        header.classList.remove("active");

    }

});


/*==========================
    BACK TO TOP
==========================*/

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        backToTop.style.display = "block";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/*==========================
    FORM -> GOOGLE SHEETS
==========================*/

const form = document.getElementById("registerForm");

const message = document.getElementById("message");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = form.name.value.trim();

    const phone = form.phone.value.trim();

    if (name === "") {

        message.style.color = "red";

        message.innerHTML = "Vui lòng nhập họ tên.";

        return;

    }

    if (phone === "") {

        message.style.color = "red";

        message.innerHTML = "Vui lòng nhập số điện thoại.";

        return;

    }

    if (!/^0\d{9}$/.test(phone)) {

        message.style.color = "red";

        message.innerHTML = "Số điện thoại không hợp lệ.";

        return;

    }

    const submitBtn = form.querySelector("button[type='submit']");

    submitBtn.disabled = true;

    message.style.color = "#0d6efd";

    message.innerHTML = "Đang gửi thông tin...";

    const payload = new FormData();

    payload.append("name", name);

    payload.append("phone", phone);

    payload.append("source", "GitHub Pages - LADO Capital");

    /*
        Apps Script Web Apps deployed as "Anyone" don't return
        readable CORS headers for a normal fetch, so this uses
        mode: "no-cors". The request still reaches the Sheet;
        we just can't read the JSON response back. That's why
        success is assumed once the request doesn't throw.
    */

    fetch(GOOGLE_SHEET_WEBAPP_URL, {

        method: "POST",

        mode: "no-cors",

        body: payload

    })

    .then(() => {

        message.style.color = "#198754";

        message.innerHTML =
            "✅ Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.<br>" +
            "<a href=\"" + DOCUMENT_DOWNLOAD_URL + "\" target=\"_blank\" rel=\"noopener\" class=\"download-link\">" +
            "📥 Bấm vào đây để tải bộ tài liệu" +
            "</a>";

        form.reset();

    })

    .catch((err) => {

        console.error("Gửi thất bại:", err);

        message.style.color = "red";

        message.innerHTML = "❌ Có lỗi xảy ra, vui lòng thử lại.";

    })

    .finally(() => {

        submitBtn.disabled = false;

    });

});


/*==========================
    FADE ANIMATION
==========================*/

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

document.querySelectorAll(".card,.gallery img,.register-box").forEach(el => {

    observer.observe(el);

});


/*==========================
    IMAGE CLICK
==========================*/

document.querySelectorAll(".gallery img").forEach(img => {

    img.addEventListener("click", () => {

        window.open(img.src);

    });

});
