import React, { useState, useEffect, useRef } from 'react';
import { 
  Home as HomeIcon, 
  PlusCircle, 
  FileText, 
  Calendar as CalendarIcon, 
  StickyNote, 
  Bell, 
  Settings as SettingsIcon,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  Folder as FolderIcon,
  Image as ImageIcon,
  Upload,
  Clock,
  Save,
  Palette,
  Type,
  Cloud,
  RefreshCw,
  Database,
  HeartPulse,
  Pencil,
  Tag,
  Calendar,
  User,
  LogIn,
  LogOut,
  Mail,
  Lock,
  X,
  ChevronLeft,
  MoreVertical,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';
import { 
  Medicine, 
  Prescription, 
  Folder,
  CalendarEvent, 
  Note, 
  Alarm 
} from './types';

// --- Constants ---

const NOTIFICATION_SOUNDS = [
  { id: 'default', name: 'Padrão', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'bell', name: 'Sino', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
  { id: 'digital', name: 'Digital', url: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3' },
  { id: 'soft', name: 'Suave', url: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' },
];

// --- Components ---

const LoginScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          scopes: 'https://www.googleapis.com/auth/drive.file'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google');
    }
  };

  return (
    <div className="min-h-screen bg-bg-pastel flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-xl border border-pink-pastel/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-turquoise-pastel/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HeartPulse size={32} className="text-turquoise-pastel" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 italic">MedControl</h1>
          <p className="text-slate-500 text-sm">{isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-turquoise-pastel outline-none text-sm"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-turquoise-pastel outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-turquoise-pastel text-slate-800 font-bold py-4 rounded-2xl shadow-md hover:bg-turquoise-pastel/80 transition-all active:scale-95 mt-2 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-white px-4 text-slate-300">Ou continue com</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-slate-100 text-slate-600 font-bold py-3 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google
        </button>

        <p className="text-center mt-8 text-xs text-slate-400">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'} {' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-turquoise-pastel font-bold hover:underline"
          >
            {isSignUp ? 'Entrar' : 'Cadastrar-se'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const MedicineDetailModal = ({ medicine, onClose, onDelete }: { medicine: Medicine, onClose: () => void, onDelete: (id: string) => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
      >
        <div className="bg-turquoise-pastel p-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 rounded-full text-slate-800 hover:bg-white/40 transition-all"
          >
            <Plus size={20} className="rotate-45" />
          </button>
          <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <HeartPulse size={40} className="text-turquoise-pastel" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 italic">{medicine.name}</h2>
          <p className="text-slate-600 font-medium">Estoque: {medicine.quantity}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Entrega Receita</label>
              <p className="text-sm font-bold text-slate-700">{medicine.prescriptionDelivery || 'Não informado'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Retirada Remédio</label>
              <p className="text-sm font-bold text-slate-700">{medicine.medicinePickup || 'Não informado'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aquisição</label>
            <p className="text-sm font-bold text-slate-700">{medicine.acquisition || 'Não informado'}</p>
          </div>

          {medicine.observations && (
            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Observações</label>
              <p className="text-sm text-slate-600 italic leading-relaxed">{medicine.observations}</p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este remédio?')) {
                  onDelete(medicine.id);
                  onClose();
                }
              }}
              className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Excluir
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-800 rounded-2xl text-white font-bold shadow-lg active:scale-95 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NotificationModal = ({ event, onClose }: { event: CalendarEvent, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl border border-slate-100 text-center"
      >
        <div className="bg-pink-pastel/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell size={40} className="text-pink-pastel animate-bounce" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 italic mb-2">Lembrete!</h2>
        <p className="text-slate-500 mb-6">Está na hora de: <br /><span className="font-bold text-slate-800 text-lg">{event.title}</span></p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-turquoise-pastel rounded-2xl text-slate-800 font-bold shadow-lg shadow-turquoise-pastel/20 active:scale-95 transition-all"
        >
          Entendido
        </button>
      </motion.div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Início' },
    { id: 'prescriptions', icon: FileText, label: 'Receitas' },
    { id: 'calendar', icon: CalendarIcon, label: 'Agenda' },
    { id: 'notes', icon: StickyNote, label: 'Notas' },
    { id: 'alarms', icon: Bell, label: 'Alarmes' },
    { id: 'settings', icon: SettingsIcon, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300",
            activeTab === tab.id ? "text-turquoise-pastel scale-110" : "text-slate-300 hover:text-slate-400"
          )}
        >
          <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Screens ---

const HomeScreen = ({ medicines, onAddClick, onDelete }: any) => {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 italic">MedControl</h1>
          <p className="text-slate-500 text-sm">Seus medicamentos</p>
        </div>
        <button onClick={onAddClick} className="bg-turquoise-pastel p-3 rounded-2xl shadow-lg shadow-turquoise-pastel/20 text-slate-800 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {medicines.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <HeartPulse size={64} className="mx-auto mb-4" />
            <p>Nenhum remédio cadastrado</p>
          </div>
        ) : (
          medicines.map((m: Medicine) => (
            <motion.div 
              key={m.id} 
              layout
              onClick={() => setSelectedMedicine(m)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-turquoise-pastel/10 p-3 rounded-2xl text-turquoise-pastel">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{m.name}</h3>
                  <p className="text-xs text-slate-400">Estoque: {m.quantity}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-200" />
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedMedicine && (
          <MedicineDetailModal 
            medicine={selectedMedicine} 
            onClose={() => setSelectedMedicine(null)} 
            onDelete={onDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RegisterScreen = ({ onAdd }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    prescriptionDelivery: '',
    medicinePickup: '',
    acquisition: '',
    observations: ''
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold mb-6 italic">Novo Remédio</h2>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nome</label>
          <input 
            placeholder="Ex: Paracetamol" 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Quantidade</label>
          <input 
            placeholder="Ex: 20 comprimidos" 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none" 
            value={formData.quantity} 
            onChange={e => setFormData({...formData, quantity: e.target.value})} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Entrega Receita</label>
            <input 
              placeholder="Data/Local" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none" 
              value={formData.prescriptionDelivery} 
              onChange={e => setFormData({...formData, prescriptionDelivery: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Retirada</label>
            <input 
              placeholder="Data/Local" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none" 
              value={formData.medicinePickup} 
              onChange={e => setFormData({...formData, medicinePickup: e.target.value})} 
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Aquisição</label>
          <input 
            placeholder="Onde comprou?" 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none" 
            value={formData.acquisition} 
            onChange={e => setFormData({...formData, acquisition: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Observações</label>
          <textarea 
            placeholder="Notas adicionais..." 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-turquoise-pastel outline-none h-32 resize-none" 
            value={formData.observations} 
            onChange={e => setFormData({...formData, observations: e.target.value})} 
          />
        </div>
        <button 
          onClick={() => onAdd(formData)} 
          className="w-full py-4 bg-turquoise-pastel rounded-2xl font-bold shadow-lg shadow-turquoise-pastel/20 active:scale-95 transition-all mt-4"
        >
          Salvar Medicamento
        </button>
      </div>
    </div>
  );
};

const PrescriptionsScreen = ({ prescriptions, folders, onAddFolder, onAdd, onDelete, onDeleteFolder }: any) => {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold italic">Receitas</h2>
        <button onClick={() => setIsAddingFolder(true)} className="bg-pink-pastel/20 p-2 rounded-xl text-pink-pastel">
          <FolderIcon size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {folders.map((f: Folder) => (
          <div key={f.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 relative group">
            <div className="bg-pink-pastel/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-pink-pastel">
              <FolderIcon size={24} />
            </div>
            <h3 className="font-bold text-slate-800">{f.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              {prescriptions.filter((p: any) => p.folderId === f.id).length} itens
            </p>
            <button onClick={() => onDeleteFolder(f.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingFolder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xl font-serif font-bold mb-4 italic">Nova Pasta</h3>
              <input 
                placeholder="Nome da pasta" 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-pink-pastel mb-4"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingFolder(false)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                <button 
                  onClick={() => {
                    onAddFolder({ name: newFolderName });
                    setIsAddingFolder(false);
                    setNewFolderName('');
                  }} 
                  className="flex-1 py-3 bg-pink-pastel text-white rounded-2xl font-bold"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarScreen = ({ events, onAdd, onDelete }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'appointment', reminder: true });

  const days = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold italic">{format(selectedDate, 'MMMM yyyy', { locale: ptBR })}</h2>
        <div className="flex gap-2">
          <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))} className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft size={20} /></button>
          <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))} className="p-2 bg-white rounded-xl shadow-sm"><ChevronRight size={20} /></button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-300">{d}</div>
        ))}
        {days.map(day => (
          <button 
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
            className={cn(
              "aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all",
              isSameDay(day, selectedDate) ? "bg-turquoise-pastel text-slate-800 shadow-lg shadow-turquoise-pastel/20" : "hover:bg-white text-slate-600",
              !isSameMonth(day, selectedDate) && "opacity-20"
            )}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Eventos do dia</h3>
          <button onClick={() => setIsAddingEvent(true)} className="text-turquoise-pastel font-bold text-xs flex items-center gap-1">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        {events.filter((e: any) => e.date === format(selectedDate, 'yyyy-MM-dd')).map((e: any) => (
          <div key={e.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-turquoise-pastel" />
              <div>
                <p className="font-bold text-slate-800 text-sm">{e.title}</p>
                <p className="text-[10px] text-slate-400">{e.time}</p>
              </div>
            </div>
            <button onClick={() => onDelete(e.id)} className="text-red-200 hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xl font-serif font-bold mb-4 italic">Novo Evento</h3>
              <input 
                placeholder="Título" 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-3"
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              />
              <input 
                type="time"
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-4"
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingEvent(false)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                <button 
                  onClick={() => {
                    onAdd({...newEvent, date: format(selectedDate, 'yyyy-MM-dd')});
                    setIsAddingEvent(false);
                    setNewEvent({ title: '', time: '', type: 'appointment', reminder: true });
                  }} 
                  className="flex-1 py-3 bg-turquoise-pastel text-slate-800 rounded-2xl font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotesScreen = ({ notes, onAdd, onDelete }: any) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#E0F7F9' });

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold italic">Notas</h2>
        <button onClick={() => setIsAddingNote(true)} className="bg-turquoise-pastel p-3 rounded-2xl text-slate-800"><Plus size={24} /></button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {notes.map((n: Note) => (
          <div key={n.id} style={{ backgroundColor: n.color }} className="p-6 rounded-[32px] shadow-sm relative group">
            <h3 className="font-bold text-slate-800 mb-2">{n.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{n.content}</p>
            <button onClick={() => onDelete(n.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingNote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xl font-serif font-bold mb-4 italic">Nova Nota</h3>
              <input 
                placeholder="Título" 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-3"
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
              />
              <textarea 
                placeholder="Conteúdo..." 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-4 h-32 resize-none"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingNote(false)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                <button 
                  onClick={() => {
                    onAdd(newNote);
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', color: '#E0F7F9' });
                  }} 
                  className="flex-1 py-3 bg-turquoise-pastel text-slate-800 rounded-2xl font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AlarmsScreen = ({ alarms, onToggle, onDelete, onAdd }: any) => {
  const [isAddingAlarm, setIsAddingAlarm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: '', days: ['S', 'T', 'Q', 'Q', 'S'], active: true });

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold italic">Alarmes</h2>
        <button onClick={() => setIsAddingAlarm(true)} className="bg-pink-pastel/20 p-3 rounded-2xl text-pink-pastel"><Plus size={24} /></button>
      </header>

      <div className="space-y-4">
        {alarms.map((a: Alarm) => (
          <div key={a.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-800">{a.time}</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">{a.label || 'Alarme'}</p>
              <div className="flex gap-1 mt-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <span key={d} className={cn("text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center", a.days.includes(d) ? "bg-turquoise-pastel text-slate-800" : "bg-slate-50 text-slate-300")}>{d}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onToggle(a.id)}
                className={cn("w-12 h-6 rounded-full relative transition-all", a.active ? "bg-turquoise-pastel" : "bg-slate-200")}
              >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", a.active ? "left-7" : "left-1")} />
              </button>
              <button onClick={() => onDelete(a.id)} className="text-red-200 hover:text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingAlarm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xl font-serif font-bold mb-4 italic">Novo Alarme</h3>
              <input 
                type="time"
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-3 text-2xl font-bold text-center"
                value={newAlarm.time}
                onChange={e => setNewAlarm({...newAlarm, time: e.target.value})}
              />
              <input 
                placeholder="Etiqueta (opcional)" 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none mb-4"
                value={newAlarm.label}
                onChange={e => setNewAlarm({...newAlarm, label: e.target.value})}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingAlarm(false)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                <button 
                  onClick={() => {
                    onAdd(newAlarm);
                    setIsAddingAlarm(false);
                    setNewAlarm({ time: '08:00', label: '', days: ['S', 'T', 'Q', 'Q', 'S'], active: true });
                  }} 
                  className="flex-1 py-3 bg-turquoise-pastel text-slate-800 rounded-2xl font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsScreen = ({ defaultReminder, onToggleDefaultReminder, onGoogleDriveBackup, onLogout, isSyncing, isSyncingData, onSyncData }: any) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold mb-8 italic">Ajustes</h2>
      
      <div className="space-y-6">
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Lembretes</h3>
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="bg-pink-pastel/20 p-2 rounded-xl text-pink-pastel"><Bell size={20} /></div>
              <span className="font-medium text-slate-700">Lembretes Padrão</span>
            </div>
            <button 
              onClick={() => onToggleDefaultReminder(!defaultReminder)}
              className={cn("w-12 h-6 rounded-full relative transition-all", defaultReminder ? "bg-turquoise-pastel" : "bg-slate-200")}
            >
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", defaultReminder ? "left-7" : "left-1")} />
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Sincronização</h3>
          <button onClick={onGoogleDriveBackup} disabled={isSyncing} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-500"><Cloud size={20} /></div>
              <span className="font-medium text-slate-700">Google Drive</span>
            </div>
            <span className="text-[10px] text-slate-400">{isSyncing ? 'Sincronizando...' : 'Fazer Backup'}</span>
          </button>
          <button onClick={onSyncData} disabled={isSyncingData} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all mt-2 disabled:opacity-50">
            <div className="flex items-center gap-3">
              <div className="bg-turquoise-pastel/20 p-2 rounded-xl text-turquoise-pastel"><RefreshCw size={20} className={isSyncingData ? "animate-spin" : ""} /></div>
              <span className="font-medium text-slate-700">Sincronizar Agora</span>
            </div>
          </button>
        </section>

        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Conta</h3>
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-2xl transition-all text-red-400">
            <div className="bg-red-50 p-2 rounded-xl"><LogOut size={20} /></div>
            <span className="font-medium">Sair da Conta</span>
          </button>
        </section>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [defaultReminder, setDefaultReminder] = useState(true);
  const [notificationSound, setNotificationSound] = useState('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  const [activeNotification, setActiveNotification] = useState<CalendarEvent | null>(null);
  const [shownNotifications, setShownNotifications] = useState<string[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load user from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    if (!user) return;
    try {
      setIsSyncingData(true);
      const { data: medData } = await supabase.from('medicines').select('*').order('created_at', { ascending: false });
      if (medData) setMedicines(medData);

      const { data: folderData } = await supabase.from('folders').select('*').order('created_at', { ascending: false });
      if (folderData) setFolders(folderData);

      const { data: prescData } = await supabase.from('prescriptions').select('*').order('date_added', { ascending: false });
      if (prescData) setPrescriptions(prescData.map(p => ({
        ...p,
        medicineName: p.medicine_name,
        imageUrl: p.image_url,
        dateAdded: p.date_added,
        folderId: p.folder_id
      })));

      const { data: eventData } = await supabase.from('calendar_events').select('*').order('date', { ascending: true });
      if (eventData) setEvents(eventData);

      const { data: noteData } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      if (noteData) setNotes(noteData.map(n => ({
        ...n,
        fontFamily: n.font_family,
        fontSize: n.font_size,
        reminderDate: n.reminder_date,
        reminderTime: n.reminder_time
      })));

      const { data: alarmData } = await supabase.from('alarms').select('*').order('time', { ascending: true });
      if (alarmData) setAlarms(alarmData.map(a => ({
        ...a,
        soundUrl: a.sound_url
      })));

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsSyncingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Notification Checker
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDate = format(now, 'yyyy-MM-dd');

      events.forEach(event => {
        if (event.reminder && event.date === currentDate && event.time === currentTime && !shownNotifications.includes(event.id)) {
          setActiveNotification(event);
          setShownNotifications(prev => [...prev, event.id]);
          const audio = new Audio(notificationSound);
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      });

      notes.forEach(note => {
        if (note.reminderDate === currentDate && note.reminderTime === currentTime && !shownNotifications.includes(note.id)) {
          setActiveNotification({ id: note.id, title: `Nota: ${note.title}`, date: note.reminderDate, time: note.reminderTime, reminder: true, type: 'task' });
          setShownNotifications(prev => [...prev, note.id]);
          const audio = new Audio(notificationSound);
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      });

      const dayMap: { [key: string]: string } = { 'Sunday': 'D', 'Monday': 'S', 'Tuesday': 'T', 'Wednesday': 'Q', 'Thursday': 'Q', 'Friday': 'S', 'Saturday': 'S' };
      const todayShort = dayMap[format(now, 'EEEE')];

      alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTime && alarm.days.includes(todayShort) && !shownNotifications.includes(`${alarm.id}-${currentDate}`)) {
          setActiveNotification({ id: alarm.id, title: `Alarme: ${alarm.label}`, date: currentDate, time: alarm.time, reminder: true, type: 'task' });
          setShownNotifications(prev => [...prev, `${alarm.id}-${currentDate}`]);
          const audio = new Audio(alarm.soundUrl || notificationSound);
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      });
    };

    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [events, notes, shownNotifications, alarms, notificationSound]);

  const handleGoogleDriveBackup = async () => {
    try {
      setIsSyncing(true);
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;
      if (!providerToken) { alert('Por favor, faça login com Google novamente.'); return; }

      const backupData = { medicines, prescriptions, folders, events, notes, alarms, settings: { defaultReminder, notificationSound }, timestamp: new Date().toISOString() };
      const fileContent = JSON.stringify(backupData);
      const metadata = { name: `medcontrol_backup_${format(new Date(), 'yyyyMMdd_HHmm')}.json`, mimeType: 'application/json' };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${providerToken}` },
        body: form
      });

      if (response.ok) alert('Backup realizado com sucesso!');
      else { const err = await response.json(); throw new Error(err.error?.message || 'Erro no upload'); }
    } catch (err: any) { alert('Erro ao realizar backup: ' + err.message); } finally { setIsSyncing(false); }
  };

  const renderScreen = () => {
    if (!user) return <LoginScreen onLogin={setUser} />;

    switch (activeTab) {
      case 'home': return <HomeScreen medicines={medicines} onAddClick={() => setActiveTab('register')} onDelete={async (id: string) => { const { error } = await supabase.from('medicines').delete().eq('id', id); if (!error) setMedicines(medicines.filter(m => m.id !== id)); }} />;
      case 'register': return <RegisterScreen onAdd={async (m: any) => { const { data, error } = await supabase.from('medicines').insert([{ user_id: user.id, name: m.name, quantity: m.quantity, prescription_delivery: m.prescriptionDelivery, medicine_pickup: m.medicinePickup, acquisition: m.acquisition, observations: m.observations }]).select(); if (data) { setMedicines([...medicines, data[0]]); setActiveTab('home'); } }} />;
      case 'prescriptions': return <PrescriptionsScreen prescriptions={prescriptions} folders={folders} onAddFolder={async (f: any) => { const { data } = await supabase.from('folders').insert([{ user_id: user.id, name: f.name }]).select(); if (data) setFolders([...folders, data[0]]); }} onAdd={async (p: any) => { const { data } = await supabase.from('prescriptions').insert([{ user_id: user.id, folder_id: p.folderId, medicine_name: p.medicineName, image_url: p.imageUrl, year: p.year }]).select(); if (data) setPrescriptions([...prescriptions, { ...data[0], medicineName: data[0].medicine_name, imageUrl: data[0].image_url, dateAdded: data[0].date_added, folderId: data[0].folder_id }]); }} onDelete={async (id: string) => { const { error } = await supabase.from('prescriptions').delete().eq('id', id); if (!error) setPrescriptions(prescriptions.filter(p => p.id !== id)); }} onDeleteFolder={async (id: string) => { const { error } = await supabase.from('folders').delete().eq('id', id); if (!error) { setFolders(folders.filter(f => f.id !== id)); setPrescriptions(prescriptions.filter(p => p.folderId !== id)); } }} />;
      case 'calendar': return <CalendarScreen events={events} defaultReminder={defaultReminder} onAdd={async (e: any) => { const { data } = await supabase.from('calendar_events').insert([{ user_id: user.id, title: e.title, date: e.date, time: e.time, type: e.type, reminder: e.reminder }]).select(); if (data) setEvents([...events, data[0]]); }} onUpdate={async (id: string, updates: any) => { const { error } = await supabase.from('calendar_events').update(updates).eq('id', id); if (!error) setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e)); }} onDelete={async (id: string) => { const { error } = await supabase.from('calendar_events').delete().eq('id', id); if (!error) setEvents(events.filter(e => e.id !== id)); }} />;
      case 'notes': return <NotesScreen notes={notes} onAdd={async (n: any) => { const { data } = await supabase.from('notes').insert([{ user_id: user.id, title: n.title, content: n.content, tags: n.tags, color: n.color, font_family: n.fontFamily, font_size: n.fontSize, reminder_date: n.reminderDate, reminder_time: n.reminderTime }]).select(); if (data) setNotes([...notes, { ...data[0], fontFamily: data[0].font_family, fontSize: data[0].font_size, reminderDate: data[0].reminder_date, reminderTime: data[0].reminder_time }]); }} onDelete={async (id: string) => { const { error } = await supabase.from('notes').delete().eq('id', id); if (!error) setNotes(notes.filter(n => n.id !== id)); }} />;
      case 'alarms': return <AlarmsScreen alarms={alarms} onToggle={async (id: string) => { const alarm = alarms.find(a => a.id === id); if (alarm) { const { error } = await supabase.from('alarms').update({ active: !alarm.active }).eq('id', id); if (!error) setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a)); } }} onDelete={async (id: string) => { const { error } = await supabase.from('alarms').delete().eq('id', id); if (!error) setAlarms(alarms.filter(a => a.id !== id)); }} onAdd={async (a: any) => { const { data } = await supabase.from('alarms').insert([{ user_id: user.id, time: a.time, days: a.days, label: a.label, active: a.active, sound_url: a.soundUrl }]).select(); if (data) setAlarms([...alarms, { ...data[0], soundUrl: data[0].sound_url }]); }} />;
      case 'settings': return <SettingsScreen defaultReminder={defaultReminder} notificationSound={notificationSound} onSoundChange={setNotificationSound} onLogout={async () => { await supabase.auth.signOut(); setUser(null); }} onToggleDefaultReminder={(val: boolean) => { setDefaultReminder(val); setEvents(events.map(e => ({ ...e, reminder: val }))); }} onGoogleDriveBackup={handleGoogleDriveBackup} onSyncData={fetchData} isSyncing={isSyncing} isSyncingData={isSyncingData} />;
      default: return <HomeScreen medicines={medicines} onAddClick={() => setActiveTab('register')} onDelete={async (id: string) => { const { error } = await supabase.from('medicines').delete().eq('id', id); if (!error) setMedicines(medicines.filter(m => m.id !== id)); }} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-pastel max-w-md mx-auto relative overflow-x-hidden pb-24">
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      {user && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
      <AnimatePresence>
        {activeNotification && <NotificationModal event={activeNotification} onClose={() => setActiveNotification(null)} />}
      </AnimatePresence>
    </div>
  );
}
