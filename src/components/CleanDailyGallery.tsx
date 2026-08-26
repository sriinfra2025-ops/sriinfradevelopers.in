import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Camera, ChevronLeft, ChevronRight, ImagePlus, Loader2, Trash2, Upload, X } from 'lucide-react';
import { DailyUpdate } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import { deletePhotoFromCloud, getStoredPhotos, savePhotoToCloud, subscribeToPhotoUpdates } from '../utils/photoStorage';
import { checkIsAdmin, getStoredAdminPin, loginAdmin, setCustomAdminPin } from '../utils/adminAuth';

const CATEGORIES = ['All', 'Roads', 'Entrance', 'Drainage', 'Plots', 'Guest House', 'Site Visit', 'Other'];

function niceDate(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const CleanDailyGallery: React.FC = () => {
  const [photos, setPhotos] = useState<DailyUpdate[]>([]);
  const [category, setCategory] = useState('All');
  const [admin, setAdmin] = useState(checkIsAdmin());
  const [loginOpen, setLoginOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Roads');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getStoredPhotos().then(setPhotos);
    return subscribeToPhotoUpdates(setPhotos);
  }, []);

  const visible = useMemo(() => category === 'All' ? photos : photos.filter((p) => p.category === category), [photos, category]);

  const selectFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setBusy(true); setMessage('Preparing photos...');
    try {
      const result = await Promise.all(Array.from(list).map((f) => compressImageFile(f)));
      setFiles((prev) => [...prev, ...result]);
      if (!title) setTitle(`Site Update – ${niceDate(new Date().toISOString())}`);
    } catch (e: any) { setMessage(e?.message || 'Could not read the selected photo.'); }
    finally { setBusy(false); setMessage(''); }
  };

  const upload = async () => {
    if (!files.length) return setMessage('Please choose at least one photo.');
    setBusy(true); setMessage('Publishing photos...');
    try {
      for (let i = 0; i < files.length; i++) {
        await savePhotoToCloud({
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
          title: title || 'Sri Infra Daily Site Update',
          date: new Date().toISOString(),
          category: uploadCategory,
          projectTitle: 'Sri Infra Highway County (Pindiprolu)',
          description: description || 'Latest on-ground development update from Sri Infra Developers & Constructions.',
          imageUrl: files[i],
          author: 'Sri Infra Official',
          createdAt: new Date().toISOString(),
        });
      }
      setFiles([]); setTitle(''); setDescription(''); setUploadOpen(false); setMessage('Photos are live on the website.');
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) { setMessage(e?.message || 'Upload failed. Please check Firebase configuration.'); }
    finally { setBusy(false); }
  };

  const openAdmin = () => { if (admin) setUploadOpen(true); else setLoginOpen(true); };
  const doLogin = () => { if (loginAdmin(pin)) { setAdmin(true); setPin(''); setLoginOpen(false); setUploadOpen(true); } else setMessage('Incorrect admin PIN.'); };

  const remove = async (p: DailyUpdate) => {
    if (!confirm('Delete this photo from the live gallery?')) return;
    try { await deletePhotoFromCloud(p.id); } catch { setMessage('Could not delete the photo.'); }
  };

  const moveLightbox = (dir: number) => setLightbox((i) => i === null ? null : (i + dir + visible.length) % visible.length);

  return <section id="daily-updates" className="bg-white text-slate-900 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">Live development diary</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Daily Site Photos</h2>
          <p className="mt-3 max-w-2xl text-slate-500">Real progress from the venture, published directly by Sri Infra. Newest photos always appear first.</p>
        </div>
        <button onClick={openAdmin} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-lg hover:bg-slate-800">
          <ImagePlus className="h-4 w-4" /> {admin ? 'Upload Daily Photos' : 'Admin Upload'}
        </button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${category === c ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>{c}</button>)}
      </div>

      {message && <div className="my-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{message}</div>}

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p, i) => <article key={p.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <button className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left" onClick={() => setLightbox(i)}>
            <img src={p.imageUrl} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow">{p.category}</span>
          </button>
          <div className="p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400"><CalendarDays className="h-3.5 w-3.5" /> {niceDate(p.createdAt || p.date)}</div>
            <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.description}</p>
            {admin && p.id.startsWith('photo-') && <button onClick={() => remove(p)} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" /> Delete</button>}
          </div>
        </article>)}
      </div>

      {!visible.length && <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center text-slate-500">No photos in this category yet.</div>}
    </div>

    {uploadOpen && admin && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-amber-600">Private admin area</p><h3 className="mt-1 text-2xl font-black">Publish today’s site photos</h3></div><button onClick={() => setUploadOpen(false)}><X /></button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Photo title" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
          <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none"><option>Roads</option><option>Entrance</option><option>Drainage</option><option>Plots</option><option>Guest House</option><option>Site Visit</option><option>Other</option></select>
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short progress note (optional)" rows={3} className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
        <input ref={inputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => selectFiles(e.target.files)} />
        <button onClick={() => inputRef.current?.click()} className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-amber-500 hover:bg-amber-50"><Upload className="h-7 w-7" /><span className="mt-2 font-extrabold">Choose photos / camera</span><span className="text-xs">You can select multiple photos at once</span></button>
        {files.length > 0 && <div className="mt-4 grid grid-cols-4 gap-2">{files.map((src, i) => <div key={i} className="relative aspect-square overflow-hidden rounded-xl"><img src={src} className="h-full w-full object-cover" /><button onClick={() => setFiles((f) => f.filter((_, n) => n !== i))} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3" /></button></div>)}</div>}
        <button disabled={busy || !files.length} onClick={upload} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />} Publish {files.length || ''} Photo{files.length === 1 ? '' : 's'}</button>
        <button onClick={() => { sessionStorage.removeItem('sri_infra_admin_session'); setAdmin(false); setUploadOpen(false); }} className="mt-3 w-full text-xs font-bold text-slate-400 hover:text-red-600">Log out of admin</button>
      </div>
    </div>}

    {loginOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"><div className="flex justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-amber-600">Sri Infra</p><h3 className="mt-1 text-2xl font-black">Admin access</h3></div><button onClick={() => setLoginOpen(false)}><X /></button></div><input autoFocus type="password" value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && doLogin()} placeholder="Admin PIN" className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-center tracking-[0.3em] outline-none focus:border-amber-500" /><button onClick={doLogin} className="mt-3 w-full rounded-xl bg-slate-950 py-3 font-black text-white">Unlock</button><p className="mt-3 text-center text-[11px] text-slate-400">Default PIN: {getStoredAdminPin()}</p><div className="mt-5 border-t pt-4"><p className="text-xs font-bold text-slate-500">Change PIN on this browser</p><div className="mt-2 flex gap-2"><input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="New PIN" className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm" /><button onClick={() => { if (setCustomAdminPin(newPin)) { setNewPin(''); setMessage('PIN changed on this browser.'); } }} className="rounded-lg border px-3 py-2 text-xs font-bold">Save</button></div></div></div></div>}

    {lightbox !== null && visible[lightbox] && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-3" onClick={() => setLightbox(null)}><button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white"><X /></button><button onClick={(e) => { e.stopPropagation(); moveLightbox(-1); }} className="absolute left-3 rounded-full bg-white/10 p-3 text-white"><ChevronLeft /></button><img src={visible[lightbox].imageUrl} alt={visible[lightbox].title} className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} /><button onClick={(e) => { e.stopPropagation(); moveLightbox(1); }} className="absolute right-3 rounded-full bg-white/10 p-3 text-white"><ChevronRight /></button></div>}
  </section>;
};
