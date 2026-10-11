const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let selectedNetwork = "MTN", balanceVisible = true, deferredInstall = null;
const money = n => "₦" + Number(n || 0).toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2});
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),3600)}
function go(view){$$(".view").forEach(v=>v.hidden=v.id!=="view-"+view);$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));const titles={home:"Good day 👋",data:"Data bundles",airtime:"Airtime recharge",bills:"Bills & subscriptions",education:"Education pins",wallet:"Your wallet",transactions:"Transaction history"};$("#pageTitle").textContent=titles[view]||"HAFIZ DATA & BILLS";$(".sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("#menuToggle").addEventListener("click",()=>$(".sidebar").classList.toggle("open"));
$$(".network").forEach(b=>b.addEventListener("click",()=>{selectedNetwork=b.dataset.network;$$(".network").forEach(n=>n.classList.toggle("selected",n===b))}));
$("#toggleBalance").addEventListener("click",()=>{balanceVisible=!balanceVisible;$("#balance").textContent=balanceVisible?"₦0.00":"••••••";$("#toggleBalance").textContent=balanceVisible?"◉":"○"});
$$("[data-bill]").forEach(b=>b.addEventListener("click",()=>{$("#billTitle").textContent=b.dataset.bill;$("#billProvider").value=b.dataset.bill==="DStv / GOtv"?"DStv":b.dataset.bill==="Electricity"?"IKEDC":"Water utility (if supported)";$("#billForm").scrollIntoView({behavior:"smooth",block:"center"})}));
function recordDemo(item,amount){const row=document.createElement("div");row.className="transaction-row";row.innerHTML=`<span class="service-icon green">↻</span><div><b></b><small></small></div><strong></strong>`;row.querySelector("b").textContent=item;row.querySelector("small").textContent="Demo request · not sent to a provider";row.querySelector("strong").textContent=money(amount);row.style.cssText="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);width:100%;text-align:left";const target=$("#recentList");if(target.classList.contains("empty-state")){target.className="panel";target.innerHTML="";}target.prepend(row.cloneNode(true));const all=$("#allTransactions");if(all.classList.contains("empty-state")){all.className="panel";all.innerHTML=""}all.prepend(row);go("transactions")}
$$("[data-purchase]").forEach(btn=>btn.addEventListener("click",()=>{
 const type=btn.dataset.purchase;let item="",amount=0;
 if(type==="data"){const phone=$("#dataPhone").value.trim(),plan=$("#dataPlan").value;if(!/^0\d{10}$/.test(phone))return toast("Enter a valid 11-digit Nigerian phone number.");if(!plan)return toast("Please select a data plan.");const p=plan.split("|");item=`${selectedNetwork} ${p[0]} data · ${phone}`;amount=Number(p[1])}
 if(type==="airtime"){const phone=$("#airPhone").value.trim();amount=Number($("#airAmount").value);if(!/^0\d{10}$/.test(phone))return toast("Enter a valid 11-digit Nigerian phone number.");if(!Number.isFinite(amount)||amount<50)return toast("Enter an airtime amount of at least ₦50.");item=`${$("#airNetwork").value} airtime · ${phone}`}
 if(type==="bill"){item=`${$("#billTitle").textContent} · ${$("#billAccount").value.trim()}`;amount=Number($("#billAmount").value);if(!$("#billAccount").value.trim())return toast("Enter the relevant meter, smartcard or account number.");if(!amount||amount<1)return toast("Enter a valid amount. Provider validation is not connected yet.")}
 if(type==="exam"){const qty=Number($("#pinQuantity").value);if(!Number.isInteger(qty)||qty<1||qty>20)return toast("Choose a quantity between 1 and 20.");return toast("Demo only: connect an authorized exam-pin supplier before selling pins.")}
 toast("Demo mode: no payment was taken and no service was delivered.");recordDemo(item,amount);
}));
$("#fundBtn").addEventListener("click",()=>toast("Payment provider not connected. No money has been charged."));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("#installBtn").hidden=false});
$("#installBtn").addEventListener("click",async()=>{if(!deferredInstall)return toast("On your phone, use your browser menu and choose Add to Home screen.");deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("#installBtn").hidden=true});
$("#year").textContent=new Date().getFullYear();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("/sw.js").catch(()=>{});
