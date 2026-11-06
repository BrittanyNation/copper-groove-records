
/* Visit page — accordion + newsletter (validated, duplicate-aware).
   Subscribers are stored in localStorage; signing up twice with the
   same email is recognised kindly instead of duplicated. */
document.querySelectorAll(".faq button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const item = btn.parentElement, wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq").forEach(f=>f.classList.remove("open"));
    if(!wasOpen) item.classList.add("open");
  });
});
const form = document.getElementById("news-form");
form.addEventListener("submit",e=>{
  e.preventDefault();
  const email = document.getElementById("news-email").value.trim();
  const msg = document.getElementById("news-msg"), err = document.getElementById("news-err");
  err.textContent=""; msg.textContent="";
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ err.textContent="Please enter a valid email address."; return; }
  let subs=[]; try{ subs=JSON.parse(localStorage.getItem("cg_news")||"[]"); }catch(_){ subs=[]; }
  if(subs.includes(email.toLowerCase())){ msg.textContent="You are already on the Needle Drop list — welcome back."; return; }
  subs.push(email.toLowerCase()); localStorage.setItem("cg_news", JSON.stringify(subs));
  msg.textContent="You are on the list. The next Needle Drop lands on Friday.";
  form.reset();
});
/* Listening-night RSVP — small validated form ending in confirmation */
const rsvp = document.getElementById("rsvp-form");
rsvp.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("rsvp-name").value.trim(), email=document.getElementById("rsvp-email").value.trim(), seats=parseInt(document.getElementById("rsvp-seats").value,10);
  const err=document.getElementById("rsvp-err"), done=document.getElementById("rsvp-done");
  err.textContent="";
  if(name.length<2){ err.textContent="Please enter your name."; return; }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ err.textContent="Please enter a valid email address."; return; }
  if(!(seats>=1 && seats<=6)){ err.textContent="Seats must be between 1 and 6."; return; }
  const ref="CG-R-"+Math.random().toString(36).slice(2,7).toUpperCase();
  let all=[]; try{ all=JSON.parse(localStorage.getItem("cg_rsvps")||"[]"); }catch(_){ all=[]; }
  all.push({ref,name,email,seats,event:document.getElementById("rsvp-event").value});
  localStorage.setItem("cg_rsvps", JSON.stringify(all));
  done.textContent="You are booked in. Your listening-night reference is "+ref+" — show it at the counter.";
  rsvp.reset();
});

/* Header crate count reflects the crate saved by the shop pages */
try{ const c=JSON.parse(localStorage.getItem("cg_cart")||"[]"); document.querySelectorAll(".cart-count").forEach(el=>el.textContent=c.reduce((a,i)=>a+i.qty,0)); }catch(_){}
document.getElementById("open-cart").addEventListener("click",()=>{ window.location.href="cart.html"; });
