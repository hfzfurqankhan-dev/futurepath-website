/* FuturePath — site interactions
   Preserves the original menu toggle and newsletter behaviour, and adds:
   - mobile menu auto-close on navigation
   - contact form (honest "not connected yet" handling)
   - scroll reveal (IntersectionObserver, with reduced-motion + no-JS fallbacks) */
(function(){
  "use strict";
  var nav=document.getElementById("nav"),btn=document.querySelector(".menu-btn");

  if(btn&&nav){
    btn.addEventListener("click",function(){
      var open=nav.classList.toggle("open");
      btn.setAttribute("aria-expanded",open?"true":"false");
    });
    // Close the mobile menu when a link inside it is clicked.
    nav.addEventListener("click",function(e){
      if(e.target.tagName==="A"){
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded","false");
      }
    });
  }

  // Newsletter (Phase 5 — not wired up yet, by design).
  var news=document.getElementById("news");
  if(news) news.addEventListener("submit",function(e){
    e.preventDefault();
    var em=document.getElementById("em"),msg=document.getElementById("msg");
    msg.textContent=(em.checkValidity()&&em.value)
      ? "Thanks! Signup isn't connected yet (it arrives with Phase 5), so your email wasn't saved."
      : "Enter a valid email address, like name@example.com.";
  });

  // Contact form (Phase 5 — not wired up yet, by design).
  var contact=document.getElementById("contact");
  if(contact) contact.addEventListener("submit",function(e){
    e.preventDefault();
    var ce=document.getElementById("ce"),cm=document.getElementById("cmsg");
    cm.textContent=(ce&&ce.checkValidity()&&ce.value)
      ? "Thanks for reaching out! This form isn't connected yet (it arrives with Phase 5), so your message wasn't sent."
      : "Please add a valid email so we know where to reply.";
  });

  // Scroll reveal — progressive enhancement.
  var reveals=document.querySelectorAll(".reveal");
  if(reveals.length){
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce||!("IntersectionObserver" in window)){
      for(var i=0;i<reveals.length;i++) reveals[i].classList.add("in");
    }else{
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },{threshold:0.12,rootMargin:"0px 0px -8% 0px"});
      for(var j=0;j<reveals.length;j++) io.observe(reveals[j]);
    }
  }
})();
