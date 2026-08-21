document.querySelector('.menu-btn').addEventListener('click',()=>document.querySelector('.nav').classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav').classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
function sendEnquiry(e){
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const interest=document.getElementById('interest').value;
  const message=document.getElementById('message').value.trim();
  const text=`Hello Sri Infra Developers,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AInterest: ${encodeURIComponent(interest)}%0AMessage: ${encodeURIComponent(message)}`;
  alert("Thank you, "+name+"! The enquiry form is ready, but the business WhatsApp/email destination still needs to be configured.");
  // Replace the alert above with a WhatsApp URL after adding your verified business number.
}