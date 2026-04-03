"use client";

import { useState, useRef } from "react";
import { User as UserIcon, Mail, Calendar, ShieldCheck, Award, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { updateProfileName, updateAvatarUrl } from "@/actions/profile";
import { toast } from "sonner";

export default function ProfileCardClient({ profile, user, joinDate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop");
  
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAvatar = user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
       toast.error("File harus berupa format gambar.");
       return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
       const img = new Image();
       img.src = event.target?.result as string;
       img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 150;
          let width = img.width;
          let height = img.height;

          // Maintain Aspect Ratio crop
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to Base64 (approx 3KB - 8KB)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setAvatarUrl(dataUrl); 
       }
    };
  };

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setIsSaving(true);
    
    // Save Name
    if (fullName !== profile?.full_name) {
      const formData = new FormData();
      formData.append("fullName", fullName);
      const resName = await updateProfileName(null, formData);
      if (resName.error) toast.error(resName.error);
    }

    // Save Avatar Base64
    if (avatarUrl !== user?.user_metadata?.avatar_url) {
      const resAvatar = await updateAvatarUrl(avatarUrl);
      if (resAvatar.error) toast.error(resAvatar.error);
    }
    
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Profil berhasil diperbarui!");
  };

  return (
    <div className="relative z-10 w-full">
      <div className="bg-[#181c1d] rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#899295]/10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 transition-all">
        
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <img 
            src={isEditing ? avatarUrl : activeAvatar} 
            alt="User Profile" 
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop" }}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl ring-4 ring-[#181c1d] transition-all ${isEditing ? 'opacity-80' : ''}`}
          />
          {!isEditing && (
             <div className="absolute bottom-0 right-0 md:bottom-2 md:right-2 z-10">
               {profile?.is_premium ? (
                 <div className="bg-gradient-to-r from-[#ffb870] to-[#ff9838] p-2 md:p-2.5 rounded-full border-4 border-[#181c1d] shadow-lg" title="Pengguna Premium">
                   <Award size={18} className="text-[#101415]" />
                 </div>
               ) : (
                 <div className="bg-gradient-to-r from-[#86d2e5] to-[#006778] p-2 md:p-2.5 rounded-full border-4 border-[#181c1d] shadow-lg" title="Pengguna Standard">
                   <UserIcon size={18} className="text-white" />
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left mt-0 md:mt-2 w-full">
          {!isEditing ? (
            // VIEW MODE
            <>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-headline tracking-tighter text-[#e0e3e4]">
                  {profile?.full_name || 'Pengguna Zenith'}
                </h2>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-[#323537]/50 hover:bg-[#86d2e5]/20 text-[#899295] hover:text-[#86d2e5] px-6 py-3 rounded-2xl text-xs font-bold transition-all shrink-0"
                >
                  Edit Profil
                </button>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-3 text-xs md:text-sm text-[#899295] font-medium mt-4">
                <span className="flex items-center gap-2"><Mail size={16} className="text-[#86d2e5]" /> {user.email}</span>
                <span className="hidden md:inline text-white/5">•</span>
                <span className="flex items-center gap-2 text-[#bec8cb]"><Calendar size={16} /> Bergabung Sejak <span className="font-bold">{joinDate}</span></span>
                <span className="hidden md:inline text-white/5">•</span>
                <span className="flex items-center gap-1.5 text-[#101415] bg-[#78dc77] px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest leading-none"><ShieldCheck size={14} /> Terverifikasi</span>
              </div>
            </>
          ) : (
            // EDIT MODE
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full text-left">
               <div>
                  <label className="text-[10px] text-[#86d2e5] uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-2"><UserIcon size={12}/> Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#323537]/50 text-[#e0e3e4] border border-[#899295]/20 rounded-xl p-3 text-xl font-black font-headline focus:outline-none focus:border-[#86d2e5] transition-all"
                  />
               </div>
               <div>
                  <label className="text-[10px] text-[#86d2e5] uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-2"><ImageIcon size={12}/> Foto Profil</label>
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="bg-[#323537]/50 hover:bg-[#86d2e5]/20 text-[#e0e3e4] hover:text-[#86d2e5] border border-[#899295]/20 px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                     >
                       <ImageIcon size={16} /> Pilih Gambar Lokal
                     </button>
                     {avatarUrl !== activeAvatar && avatarUrl.startsWith("data:image") && (
                       <span className="text-xs text-[#78dc77] font-bold">Foto Terkompresi (Siap Disimpan)</span>
                     )}
                  </div>
                  <p className="text-[10px] text-[#899295] mt-2">Gambar akan dikompresi otomatis tanpa membebani perangkat.</p>
               </div>
               <div className="flex items-center gap-3 pt-2">
                 <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#86d2e5] text-[#003842] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Simpan
                 </button>
                 <button 
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile?.full_name || "");
                      setAvatarUrl(activeAvatar);
                    }}
                    disabled={isSaving}
                    className="bg-transparent border border-[#899295]/20 hover:bg-[#323537] text-[#899295] px-6 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                 >
                    Batal
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
