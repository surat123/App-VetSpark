import React, { useState, useEffect } from 'react';
import { UserRole, Pet, Medication, Appointment, OwnerProfile, SeverityLevel, AppointmentType, Notification } from './types';
import { MOCK_PETS, MOCK_MEDS, MOCK_APPOINTMENTS, MOCK_NEWS, MOCK_OWNER } from './constants';
import { PetCard } from './components/PetCard';
import { MedicationTracker } from './components/MedicationTracker';
import { ChatInterface } from './components/ChatInterface';
import { Button } from './components/Button';
import { AddPetModal } from './components/AddPetModal';
import { AppointmentModal } from './components/AppointmentModal';
import { HealthAssessment } from './components/HealthAssessment';
import { ProfileModal } from './components/ProfileModal';
import { NotificationPanel } from './components/NotificationPanel';
import { LoginPage } from './components/LoginPage';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { 
  Stethoscope, 
  Home, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  Settings, 
  Newspaper,
  UserCircle,
  Plus,
  Globe,
  ClipboardList,
  Users,
  Clock,
  Search,
  X,
  Activity,
  Edit2,
  LogOut,
  Bell,
  ShieldCheck,
  Siren,
  List,
  Loader2,
  RotateCcw
} from 'lucide-react';

const App: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'records' | 'news' | 'diagnostics'>('dashboard');
  const [chatMode, setChatMode] = useState<'AI' | 'CLINIC'>('AI');
  
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(MOCK_OWNER);
  const [meds, setMeds] = useState<Medication[]>(MOCK_MEDS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  
  // Update local profile state when auth user changes
  useEffect(() => {
    if (user) {
      setOwnerProfile(user);
    }
  }, [user]);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
      {
          id: 'n-welcome',
          title: 'Welcome to VetSpark',
          message: 'Your pet health dashboard is ready. Check out the AI Diagnostics tool!',
          type: 'info',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
          read: false
      }
  ]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [newHistoryNote, setNewHistoryNote] = useState<{petId: string, note: string}>({petId: '', note: ''});
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategory, setNewsCategory] = useState('All');

  const [chatInitialMessage, setChatInitialMessage] = useState<string>('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', actionLabel?: string) => {
    const newNotif: Notification = {
        id: `n-${Date.now()}`,
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
        actionLabel
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate Notifications and Reminders logic (Moved here for brevity, keep existing logic)
  /* ... (Existing logic for notifications) ... */

  const handleConfirmMedication = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, confirmed: true } : m));
    addNotification('Medication Confirmed', 'Great job keeping up with the schedule!', 'success');
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const newPet: Pet = { ...newPetData, id: `p${Date.now()}` };
    setPets(prev => [...prev, newPet]);
    setIsAddPetModalOpen(false);
    addNotification('Pet Added', `${newPet.name} has been added to your family profile.`, 'success');
  };

  const handleUpdateProfile = (updatedProfile: OwnerProfile) => {
      setOwnerProfile(updatedProfile);
      addNotification('Profile Updated', 'Your contact details have been successfully updated.', 'success');
  };

  const handleBookAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newAppt: Appointment = { 
        id: `a${Date.now()}`, 
        ...data, 
        status: 'CONFIRMED' 
    };
    
    setAppointments(prev => {
        const updated = [...prev, newAppt].sort((a,b) => {
            const severityWeight = { 'CRITICAL': 3, 'URGENT': 2, 'ROUTINE': 1 };
            const diffSeverity = severityWeight[b.severity] - severityWeight[a.severity];
            if (diffSeverity !== 0) return diffSeverity;
            return a.date.getTime() - b.date.getTime();
        });
        return updated;
    });
    addNotification('Booking Confirmed', `Appointment confirmed for ${new Date(newAppt.date).toLocaleDateString()}.`, 'success');
  };

  const handleWalkInTriage = (severity: SeverityLevel) => {
      const walkInAppt: Appointment = {
          id: `w${Date.now()}`,
          petId: pets[0].id,
          clinicName: 'Happy Paws Hospital',
          doctorName: 'Triage Vet',
          date: new Date(),
          reason: 'Walk-in Patient',
          type: severity === 'CRITICAL' ? 'EMERGENCY' : 'CHECKUP',
          severity: severity,
          status: 'CONFIRMED',
          isWalkIn: true
      };
      
      setAppointments(prev => {
          const newList = [walkInAppt, ...prev];
          return newList.sort((a,b) => {
             const severityWeight = { 'CRITICAL': 3, 'URGENT': 2, 'ROUTINE': 1 };
             const diffSeverity = severityWeight[b.severity] - severityWeight[a.severity];
             if (diffSeverity !== 0) return diffSeverity;
             return a.date.getTime() - b.date.getTime();
          });
      });
      alert(`Walk-in registered with ${severity} priority.`);
      addNotification('New Walk-in', `A ${severity} priority patient has been added to the queue.`, 'warning');
  };

  const handleAddHistory = (petId: string) => {
    if(!newHistoryNote.note.trim()) return;
    setPets(prev => prev.map(p => {
        if(p.id === petId) return { ...p, history: [...p.history, `[Vet Record] ${newHistoryNote.note}`] };
        return p;
    }));
    setNewHistoryNote({petId: '', note: ''});
    addNotification('Record Updated', 'Clinical note added to patient history.', 'success');
  };

  const handleNavigateToChat = (message: string) => {
      setChatInitialMessage(message);
      setChatMode('CLINIC');
      setActiveTab('chat');
  };

  const filteredNews = MOCK_NEWS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || item.summary.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory = newsCategory === 'All' || item.category === newsCategory;
    return matchesSearch && matchesCategory;
  });

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
        activeTab === id 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
          : 'text-slate-500 hover:bg-white hover:text-primary-600'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === id ? 'text-primary-100' : ''}`} />
      <span className="font-bold text-sm">{label}</span>
      {activeTab === id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20"></div>}
    </button>
  );

  const MobileNavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all ${
        activeTab === id ? 'text-primary-600' : 'text-slate-400'
      }`}
    >
      <div className={`p-1.5 rounded-xl mb-1 transition-all ${activeTab === id ? 'bg-primary-50 translate-y-[-2px]' : ''}`}>
        <Icon className={`w-6 h-6 ${activeTab === id ? 'fill-primary-200' : ''}`} strokeWidth={activeTab === id ? 2 : 2} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white shadow-lg shadow-primary-200 relative overflow-hidden group">
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <CalendarIcon className="w-6 h-6 text-primary-100" />
                  </div>
                  <span className="text-3xl font-heading font-extrabold">{appointments.filter(a => a.status === 'CONFIRMED').length}</span>
              </div>
              <h3 className="text-primary-50 font-bold mb-1">{t('stat.upcoming')}</h3>
              <p className="text-sm text-primary-200 opacity-90">
                 {appointments[0] ? `${t('stat.next')} ${new Date(appointments[0].date).toLocaleDateString()}` : t('med.no_meds')}
              </p>
          </div>
          <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-primary-400 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
        
        {/* Reliability Score Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft group hover:shadow-lg transition-all relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-2xl ${ownerProfile.reliabilityScore > 80 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <span className={`text-3xl font-heading font-extrabold ${ownerProfile.reliabilityScore > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                   {ownerProfile.reliabilityScore}%
               </span>
          </div>
          <h3 className="text-slate-500 font-bold mb-1">Reliability Score</h3>
          <p className="text-xs text-slate-400">Keep up appointments to maintain VIP status</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className={`h-full rounded-full ${ownerProfile.reliabilityScore > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${ownerProfile.reliabilityScore}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft group hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
              <div className="flex -space-x-3">
                {pets.slice(0,3).map(pet => (
                  <img key={pet.id} src={pet.image} alt={pet.name} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" />
                ))}
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-sm">+{pets.length}</div>
          </div>
          <h3 className="text-slate-500 font-bold mb-1">{t('stat.registered')}</h3>
          <p className="text-sm text-slate-400">Total Pets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
             <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-heading font-bold text-slate-800">{t('section.daily_care')}</h2>
             </div>
             <MedicationTracker medications={meds} pets={pets} onConfirm={handleConfirmMedication} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-slate-800">{t('section.my_pets')}</h2>
              <Button onClick={() => setIsAddPetModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" /> {t('btn.add_pet')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pets.map(pet => <PetCard key={pet.id} pet={pet} onViewDetails={() => setActiveTab('records')} />)}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                     <Activity className="w-6 h-6 text-primary-300" /> 
                 </div>
                 <h3 className="font-heading font-bold text-2xl mb-2">{t('diag.title_short')}</h3>
                 <p className="text-slate-300 mb-8 leading-relaxed text-sm">
                    {t('diag.promo_text')}
                 </p>
                 <Button className="w-full bg-primary-500 hover:bg-primary-400 text-white border-none shadow-lg shadow-primary-900/50" onClick={() => setActiveTab('diagnostics')}>
                    {t('diag.try_now')}
                 </Button>
             </div>
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-soft">
             <h3 className="font-heading font-bold text-slate-800 mb-4">{t('section.help')}</h3>
             <p className="text-sm text-slate-500 mb-6 leading-relaxed">{t('section.help_desc')}</p>
             <div className="space-y-3">
                <Button className="w-full justify-start pl-6" variant="outline" onClick={() => { setChatMode('AI'); setActiveTab('chat'); }}>
                   <Stethoscope className="w-5 h-5 mr-3 text-primary-500" /> {t('btn.ask_ai')}
                </Button>
                <Button className="w-full justify-start pl-6" variant="outline" onClick={() => { setChatMode('CLINIC'); setActiveTab('chat'); }}>
                   <MessageCircle className="w-5 h-5 mr-3 text-orange-500" /> {t('btn.chat_clinic')}
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVetDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <Clock className="w-6 h-6 text-primary-300" />
                  </div>
                  <span className="text-3xl font-heading font-extrabold">{appointments.length}</span>
              </div>
              <h3 className="text-slate-300 font-bold mb-1">{t('stat.patients_today')}</h3>
              <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold">
                 {appointments.filter(a => a.severity === 'CRITICAL').length} Emergencies
              </div>
          </div>
        </div>
        
        {/* Quick Triage Actions */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-soft flex items-center justify-between">
            <div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Quick Walk-in Triage</h3>
                <p className="text-slate-500 text-sm">Register patients immediately based on severity.</p>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => handleWalkInTriage('CRITICAL')} size="sm" className="bg-red-600 hover:bg-red-700 shadow-red-200">
                    <Siren className="w-4 h-4 mr-2" /> Critical (Red)
                </Button>
                <Button onClick={() => handleWalkInTriage('URGENT')} size="sm" className="bg-orange-500 hover:bg-orange-600 shadow-orange-200 text-white">
                    <Activity className="w-4 h-4 mr-2" /> Urgent (Orange)
                </Button>
                <Button onClick={() => handleWalkInTriage('ROUTINE')} size="sm" variant="outline">
                    <ClipboardList className="w-4 h-4 mr-2" /> Routine (Green)
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section>
             <h2 className="text-2xl font-heading font-bold text-slate-800 mb-6">{t('section.queue')}</h2>
             <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
               <div className="divide-y divide-slate-50">
                 {appointments.length > 0 ? appointments.map((appt, i) => (
                   <div key={appt.id} className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group ${
                       appt.severity === 'CRITICAL' ? 'bg-red-50/50' : appt.severity === 'URGENT' ? 'bg-orange-50/50' : ''
                   }`}>
                     <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                           appt.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                           appt.severity === 'URGENT' ? 'bg-orange-100 text-orange-600' :
                           'bg-primary-50 text-primary-600'
                       }`}>
                         {i + 1}
                       </div>
                       <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-slate-900 text-lg">
                                {pets.find(p => p.id === appt.petId)?.name || 'Unknown Pet'}
                            </h4>
                            {appt.severity === 'CRITICAL' && <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">EMERGENCY</span>}
                            {appt.isWalkIn && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">WALK-IN</span>}
                         </div>
                         <p className="text-sm text-slate-500 font-medium mt-1 flex items-center">
                             {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {appt.reason}
                         </p>
                       </div>
                     </div>
                     <Button 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setActiveTab('records')}
                     >
                        {t('btn.start_consult')}
                     </Button>
                   </div>
                 )) : (
                     <div className="p-8 text-center text-slate-400">No active queue.</div>
                 )}
               </div>
             </div>
           </section>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-soft">
              <h3 className="font-heading font-bold text-slate-800 mb-6">Clinic Overview</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-bold text-slate-600">Emergencies</span>
                     <span className="text-sm font-bold text-red-600">{appointments.filter(a => a.severity === 'CRITICAL').length}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-bold text-slate-600">Urgent Care</span>
                     <span className="text-sm font-bold text-orange-600">{appointments.filter(a => a.severity === 'URGENT').length}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-bold text-slate-600">Buffer Slots Left</span>
                     <span className="text-sm font-bold text-primary-600">4/10</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 fixed h-full hidden md:flex flex-col z-20 shadow-2xl shadow-slate-200/50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-heading font-extrabold text-xl shadow-lg shadow-primary-200">
               V
             </div>
             <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">VetSpark</span>
          </div>
        </div>
        
        <div className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Menu</p>
          <SidebarItem id="dashboard" icon={Home} label={t('nav.dashboard')} />
          <SidebarItem id="records" icon={role === UserRole.VET ? ClipboardList : UserCircle} label={t('nav.records')} />
          <SidebarItem id="diagnostics" icon={Activity} label={t('nav.diagnostics')} />
          <SidebarItem id="chat" icon={MessageCircle} label={t('nav.messages')} />
          <SidebarItem id="news" icon={Newspaper} label={t('nav.health')} />
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
           <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src={role === UserRole.OWNER ? "https://ui-avatars.com/api/?name=" + (ownerProfile.name || 'User').replace(' ', '+') + "&background=0D9488&color=fff" : "https://ui-avatars.com/api/?name=Sarah+Smith&background=4F46E5&color=fff"} className="w-12 h-12 rounded-2xl shadow-sm" alt="User" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-900 truncate">{role === UserRole.OWNER ? ownerProfile.name : 'Dr. Sarah Smith'}</p>
                 <button onClick={() => setIsProfileModalOpen(true)} className="text-xs text-slate-400 hover:text-primary-600 flex items-center gap-1 transition-colors">
                    Edit Profile <Edit2 className="w-3 h-3" />
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mb-2">
               <button onClick={toggleLanguage} className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                   <Globe className="w-3.5 h-3.5" /> {language === 'en' ? 'EN' : 'TH'}
               </button>
               <button onClick={() => setRole(role === UserRole.OWNER ? UserRole.VET : UserRole.OWNER)} className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                   {role === UserRole.OWNER ? 'Vet View' : 'Owner View'}
               </button>
           </div>
           <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Logout
           </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-72 min-h-screen pb-24 md:pb-12">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-30">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">V</div>
              <span className="font-heading font-bold text-lg text-slate-900">VetSpark</span>
           </div>
           <div className="flex items-center gap-2">
              <button onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)} className="p-2 bg-slate-50 rounded-full relative">
                 <Bell className="w-5 h-5 text-slate-600" />
                 {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>}
              </button>
              <button onClick={() => setIsProfileModalOpen(true)} className="p-2 bg-slate-50 rounded-full"><Settings className="w-5 h-5 text-slate-600" /></button>
           </div>
        </div>

        <div className="max-w-[1600px] mx-auto p-4 md:p-10 relative">
           {/* Desktop Header */}
           <div className="hidden md:flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' && (role === UserRole.VET ? t('header.vet_dashboard') : t('header.dashboard'))}
                  {activeTab === 'chat' && t('header.consult')}
                  {activeTab === 'records' && t('header.records')}
                  {activeTab === 'news' && t('header.knowledge')}
                  {activeTab === 'diagnostics' && t('header.diagnostics')}
                </h1>
                <p className="text-slate-500 font-medium mt-2 text-lg">
                  {role === UserRole.OWNER ? `${t('header.welcome').replace('Alice', ownerProfile.name)}` : t('header.welcome_vet')}
                </p>
              </div>
              <div className="flex gap-4 relative">
                  <button 
                    onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                    className="p-3 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm relative"
                  >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                      )}
                  </button>
                  <NotificationPanel 
                      notifications={notifications}
                      isOpen={isNotificationPanelOpen}
                      onClose={() => setIsNotificationPanelOpen(false)}
                      onMarkRead={markNotificationRead}
                      onMarkAllRead={markAllNotificationsRead}
                  />
                  <Button onClick={() => setIsAppointmentModalOpen(true)} className="shadow-lg shadow-primary-200">
                      {t('btn.book')}
                  </Button>
              </div>
           </div>
           
           {/* Mobile Notification Panel */}
           <div className="md:hidden">
              <NotificationPanel 
                 notifications={notifications}
                 isOpen={isNotificationPanelOpen}
                 onClose={() => setIsNotificationPanelOpen(false)}
                 onMarkRead={markNotificationRead}
                 onMarkAllRead={markAllNotificationsRead}
              />
           </div>

           {activeTab === 'dashboard' && (role === UserRole.OWNER ? renderDashboard() : renderVetDashboard())}
           {activeTab === 'diagnostics' && <HealthAssessment pets={pets} onNavigateToChat={handleNavigateToChat} />}
           {activeTab === 'chat' && (
             <div className="max-w-5xl mx-auto">
               <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 w-fit mx-auto">
                 {['AI', 'CLINIC'].map((m) => (
                    <button 
                        key={m}
                        onClick={() => setChatMode(m as any)}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                            chatMode === m 
                            ? 'bg-white text-primary-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {m === 'AI' ? t('chat.ai_title') : t('chat.clinic_title')}
                    </button>
                 ))}
               </div>
               <ChatInterface mode={chatMode} />
             </div>
           )}
           {activeTab === 'records' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {pets.map(pet => (
                    <div key={pet.id} className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100">
                        <div className="flex items-start gap-6 mb-8">
                            <img src={pet.image} className="w-24 h-24 rounded-3xl object-cover shadow-md" alt={pet.name} />
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-slate-900">{pet.name}</h2>
                                <p className="text-slate-500 font-medium text-lg">{pet.breed}</p>
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-sm font-bold text-slate-600 border border-slate-100">{pet.age} Years</span>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${pet.sex === 'Male' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>{pet.sex}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary-500" />
                                {t('pet.history')}
                            </h3>
                            <div className="bg-slate-50 rounded-2xl p-2 max-h-80 overflow-y-auto">
                                {pet.history.length > 0 ? pet.history.map((h, i) => (
                                <div key={i} className="flex items-start text-sm text-slate-600 p-4 border-b border-slate-100 last:border-0">
                                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-4 mt-1.5 shrink-0"></div>
                                    <span className="leading-relaxed">{h}</span>
                                </div>
                                )) : <p className="p-4 text-slate-400 text-sm italic">{t('pet.no_history')}</p>}
                            </div>
                            {role === UserRole.VET && (
                                <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                                    <input type="text" placeholder="Add clinical note..." className="flex-1 px-4 py-2 outline-none text-sm bg-transparent" value={newHistoryNote.petId === pet.id ? newHistoryNote.note : ''} onChange={(e) => setNewHistoryNote({petId: pet.id, note: e.target.value})} />
                                    <Button size="sm" onClick={() => handleAddHistory(pet.id)} disabled={newHistoryNote.petId !== pet.id || !newHistoryNote.note.trim()}>Add</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
             </div>
           )}
           {activeTab === 'news' && (
             <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
                  <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type="text" placeholder={t('news.search')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-200 outline-none transition-all" value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} />
                    {newsSearch && (
                        <button 
                            onClick={() => setNewsSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 p-1 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 px-1">
                    {(newsSearch || newsCategory !== 'All') && (
                        <button 
                            onClick={() => {setNewsSearch(''); setNewsCategory('All');}} 
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all animate-in fade-in slide-in-from-right-4"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset View</span>
                        </button>
                    )}
                    <div className="flex gap-2 shrink-0">
                        {['All', 'Disease', 'Nutrition', 'Wellness'].map(cat => (
                        <button key={cat} onClick={() => setNewsCategory(cat)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${newsCategory === cat ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>{cat === 'All' ? t('news.filter_all') : t(`news.filter_${cat.toLowerCase()}`)}</button>
                        ))}
                    </div>
                  </div>
                </div>
                {filteredNews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map(news => (
                      <div key={news.id} className="group bg-white rounded-[2rem] shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                          <div className="h-56 overflow-hidden relative">
                             <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                             <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30">{news.category}</span>
                          </div>
                          <div className="p-8">
                            <div className="flex items-center text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider"><Clock className="w-3 h-3 mr-2" /> {news.date}</div>
                            <h3 className="text-xl font-heading font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">{news.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{news.summary}</p>
                            <button className="text-primary-600 text-sm font-bold flex items-center hover:gap-2 transition-all">Read Article <span className="ml-2">&rarr;</span></button>
                          </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
                    <button onClick={() => {setNewsSearch(''); setNewsCategory('All');}} className="mt-4 text-primary-600 font-bold hover:underline">Clear filters</button>
                  </div>
                )}
             </div>
           )}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-4 z-50 flex justify-between items-center pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl">
          <MobileNavItem id="dashboard" icon={Home} label={t('nav.dashboard')} />
          <MobileNavItem id="records" icon={role === UserRole.VET ? ClipboardList : UserCircle} label={t('nav.records')} />
          <MobileNavItem id="diagnostics" icon={Activity} label="AI" />
          <MobileNavItem id="chat" icon={MessageCircle} label="Chat" />
          <MobileNavItem id="news" icon={Newspaper} label="News" />
          <button
             onClick={logout}
             className="flex flex-col items-center justify-center w-full py-2 transition-all text-red-500"
          >
             <div className="p-1.5 rounded-xl mb-1 transition-all">
                <LogOut className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[10px] font-bold">Log Out</span>
          </button>
      </div>
      
      <AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)} onSave={handleAddPet} />
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} pets={pets} onBook={handleBookAppointment} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profile={ownerProfile} onSave={handleUpdateProfile} />
    </div>
  );
};

export default App;