
async function postJSON(url, data){
  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  return res.json();
}
document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(loginForm);
      const data = Object.fromEntries(fd.entries());
      const res = await postJSON('/api/login', data);
      if(res.ok){ if(res.role==='admin') location.href = '/admin'; else location.href = '/user'; }
      else document.getElementById('err').textContent = 'ឈ្មោះ/ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ';
    });
  }
  const submitForm = document.getElementById('submitForm');
  if(submitForm){
    submitForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(submitForm);
      const res = await fetch('/api/submit', { method:'POST', body: fd });
      const j = await res.json();
      if(j.ok){ document.getElementById('msg').textContent = 'ដាក់ស្នើដោយជោគជ័យ'; submitForm.reset(); }
      else document.getElementById('msg').textContent = 'មានបញ្ហា';
    });
  }
  window.loadRequests = async (period='all') => {
    const res = await fetch('/api/admin/requests?period='+period);
    const j = await res.json();
    if(!j.ok) return alert('Auth required');
    const el = document.getElementById('requests');
    el.innerHTML = '';
    j.rows.forEach(r=>{
      const d = document.createElement('div'); d.className='card'; d.style.margin='8px 0';
      d.innerHTML = `<strong>#${r.id} - ${r.title || ''}</strong><div class="muted">from ${r.username} • ${new Date(r.created_at).toLocaleString()}</div><p>${r.description||''}</p>
        <p>Status: ${r.status}</p><p><button onclick="approve(${r.id})">✅ អនុម័ត</button> <button onclick="delReq(${r.id})">❌ លុប</button> <button onclick="downloadFile('${r.drive_webview_link||''}')">បើកឯកសារ</button> <button onclick="downloadSingle(${r.id})">ទាញក្នុង Excel</button></p>`;
      el.appendChild(d);
    });
  };
  window.approve = async (id)=>{ await fetch('/api/admin/approve/'+id,{method:'POST'}); loadRequests(); };
  window.delReq = async (id)=>{ if(!confirm('Delete?')) return; await fetch('/api/admin/delete/'+id,{method:'POST'}); loadRequests(); };
  window.downloadSingle = async (id)=>{ const res = await fetch('/api/admin/report?period=single&id='+id); if(res.ok) location.href = '/api/admin/report?period=single&id='+id; };
  window.downloadReport = async (p)=>{ location.href = '/api/admin/report?period='+p; };
  window.downloadFile = (url)=>{ if(!url) return alert('No file'); window.open(url,'_blank'); };
  document.querySelectorAll('#emBtn').forEach(b=> b.addEventListener('click', ()=>{ const popup = document.getElementById('emPopup'); popup.classList.toggle('hidden'); }));
  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn) themeBtn.addEventListener('click', ()=>{ document.body.classList.toggle('dark'); });
  document.querySelectorAll('#langBtn').forEach(b=> b.addEventListener('click', ()=>{ alert('Switch language (EN) - TODO'); }));
});
