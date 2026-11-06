
/* Checkout flow — validation pattern (commented as study code):
   1. Read the cart from localStorage (written by shop.js).
   2. Totals are DERIVED: subtotal from lines, promo GROOVE10 = 10%
      off the subtotal, shipping is free at $75 after discount
      (otherwise $5.95), tax is 7% on (discounted subtotal + shipping).
   3. On submit, validate every field and show inline errors;
      only a fully valid form generates a CG-XXXXXX reference,
      saves the order, clears the cart, and shows confirmation. */
const $ = s => document.querySelector(s);
const money = n => "$" + n.toFixed(2);
let cart = []; try { cart = JSON.parse(localStorage.getItem("cg_cart") || "[]"); } catch(e){ cart = []; }
let promoApplied = false;
function saveCart(){ localStorage.setItem("cg_cart", JSON.stringify(cart)); document.querySelectorAll(".cart-count").forEach(el=>el.textContent=cart.reduce((a,i)=>a+i.qty,0)); }
function totals(){
  const sub = cart.reduce((a,i)=>a+i.unit*i.qty,0);
  const disc = promoApplied ? sub*0.10 : 0;
  const ship = cart.length===0 ? 0 : ((sub-disc) >= 75 ? 0 : 5.95);
  const tax = (sub - disc + ship) * 0.07;
  return {sub, disc, ship, tax, total: sub - disc + ship + tax};
}
function renderCart(){
  const box = $("#cart-items");
  if(!cart.length){ box.innerHTML = "<p>Your crate is empty. <a href='index.html'>Browse the shelves</a> and add a record to check out.</p>"; }
  else box.innerHTML = cart.map(i=>`<div class="ditem"><div><b>${i.title}</b> — ${i.artist}<br>${i.cond} · ${money(i.unit)}<br>
    <button class="qtybtn" data-dec="${i.key}" type="button">−</button> ${i.qty} <button class="qtybtn" data-inc="${i.key}" type="button">+</button>
    <button data-rem="${i.key}" type="button" style="margin-left:8px;cursor:pointer">Remove</button></div><div><b>${money(i.unit*i.qty)}</b></div></div>`).join("");
  box.querySelectorAll("[data-inc]").forEach(b=>b.addEventListener("click",()=>{ cart.find(i=>i.key===b.dataset.inc).qty++; saveCart(); renderCart(); }));
  box.querySelectorAll("[data-dec]").forEach(b=>b.addEventListener("click",()=>{ const it=cart.find(i=>i.key===b.dataset.dec); it.qty--; if(it.qty<1) cart=cart.filter(i=>i.key!==b.dataset.dec); saveCart(); renderCart(); }));
  box.querySelectorAll("[data-rem]").forEach(b=>b.addEventListener("click",()=>{ cart=cart.filter(i=>i.key!==b.dataset.rem); saveCart(); renderCart(); }));
  const t = totals();
  $("#sum-sub").textContent = money(t.sub); $("#sum-disc").textContent = "−"+money(t.disc);
  $("#sum-ship").textContent = t.ship===0 && cart.length ? "Free" : money(t.ship);
  $("#sum-tax").textContent = money(t.tax); $("#sum-total").textContent = money(t.total);
}
$("#apply-promo").addEventListener("click",()=>{
  const code = $("#promo").value.trim().toUpperCase();
  if(code==="GROOVE10"){ promoApplied = true; $("#promo-msg").textContent = "GROOVE10 applied — 10% off your records."; }
  else { promoApplied = false; $("#promo-msg").textContent = "That code was not recognised. Try GROOVE10."; }
  renderCart();
});
function setErr(id,msg){ $("#err-"+id).textContent = msg; return !msg; }
$("#checkout-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){ alert("Your crate is empty — add a record before checking out."); return; }
  const name=$("#f-name").value.trim(), email=$("#f-email").value.trim(), addr=$("#f-address").value.trim(),
        city=$("#f-city").value.trim(), zip=$("#f-zip").value.trim(), card=$("#f-card").value.replace(/\s/g,""),
        exp=$("#f-exp").value.trim(), cvc=$("#f-cvc").value.trim();
  let ok = true;
  ok = setErr("name", name.length>=2 ? "" : "Please enter your full name.") && ok;
  ok = setErr("email", /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "" : "Please enter a valid email address.") && ok;
  ok = setErr("address", addr.length>=6 ? "" : "Please enter your street address.") && ok;
  ok = setErr("city", city.length>=2 ? "" : "Please enter your city.") && ok;
  ok = setErr("zip", /^\d{5}$/.test(zip) ? "" : "Please enter a 5-digit ZIP code.") && ok;
  ok = setErr("card", /^\d{16}$/.test(card) ? "" : "Please enter a 16-digit card number.") && ok;
  let expOk = false; const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if(m){ const d = new Date(2000+parseInt(m[2],10), parseInt(m[1],10)); expOk = d > new Date() && parseInt(m[1],10)>=1 && parseInt(m[1],10)<=12; }
  ok = setErr("exp", expOk ? "" : "Please enter a future expiry as MM/YY.") && ok;
  ok = setErr("cvc", /^\d{3,4}$/.test(cvc) ? "" : "Please enter the 3 or 4 digit CVC.") && ok;
  if(!ok) return;
  const t = totals();
  const ref = "CG-" + Math.random().toString(36).slice(2,8).toUpperCase();
  const order = {ref, total:t.total, items:cart, email, date:new Date().toISOString()};
  localStorage.setItem("cg_order", JSON.stringify(order));
  cart = []; promoApplied=false; saveCart(); renderCart();
  $("#checkout-wrap").style.display="none";
  $("#confirm").style.display="block";
  $("#confirm-ref").textContent = ref;
  $("#confirm-total").textContent = money(t.total);
  $("#confirm-email").textContent = email;
  window.scrollTo({top:0,behavior:"smooth"});
});
saveCart(); renderCart();

document.getElementById("open-cart").addEventListener("click",()=>{ window.scrollTo({top:0,behavior:"smooth"}); });
