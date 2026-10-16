import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  User,
  Users,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Eye,
  X,
  Activity,
  ShieldCheck,
  Search,
  Medal,
  Sparkles
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

const TEACHER_STATUS_UNITS: { name: string; count: number }[] = [{"name": "บก.ตชด.ภาค 1", "count": 2}, {"name": "กก.ตชด.11", "count": 16}, {"name": "กก.ตชด.12", "count": 10}, {"name": "กก.ตชด.13", "count": 11}, {"name": "กก.ตชด.14", "count": 11}, {"name": "บก.ตชด.ภาค 2", "count": 3}, {"name": "กก.ตชด.21", "count": 14}, {"name": "กก.ตชด.22", "count": 11}, {"name": "กก.ตชด.23", "count": 11}, {"name": "กก.ตชด.24", "count": 15}, {"name": "บก.ตชด.ภาค 3", "count": 4}, {"name": "กก.ตชด.31", "count": 8}, {"name": "กก.ตชด.32", "count": 14}, {"name": "กก.ตชด.33", "count": 19}, {"name": "กก.ตชด.34", "count": 17}, {"name": "บก.ตชด.ภาค 4", "count": 2}, {"name": "กก.ตชด.41", "count": 14}, {"name": "กก.ตชด.42", "count": 15}, {"name": "กก.ตชด.43", "count": 12}, {"name": "กก.ตชด.44", "count": 12}, {"name": "บก.สอ.บช.ตชด.", "count": 1}, {"name": "กก.1 บก.กฝ.บช.ตชด.", "count": 3}, {"name": "กก.2 บก.กฝ.บช.ตชด.", "count": 1}, {"name": "กก.3 บก.กฝ.บช.ตชด.", "count": 2}, {"name": "กก.4 บก.กฝ.บช.ตชด.", "count": 4}, {"name": "กก.5 บก.กฝ.บช.ตชด.", "count": 2}, {"name": "กก.6 บก.กฝ.บช.ตชด.", "count": 2}, {"name": "กก.7 บก.กฝ.บช.ตชด.", "count": 3}, {"name": "กก.8 บก.กฝ.บช.ตชด.", "count": 6}, {"name": "กก.9 บก.กฝ.บช.ตชด.", "count": 2}, {"name": "ฝอ.1 บก.อก.บช.ตชด.", "count": 1}, {"name": "ฝอ.5 บก.อก.บช.ตชด.", "count": 1}, {"name": "ฝสสน.5 บก.สสน.บช.ตชด.", "count": 1}];
const TEACHER_STATUS_LEVELS = [
  { label: 'ระดับทอง / เข็มทอง', count: 162, color: '#8B5CF6' },
  { label: 'ระดับเงิน / เข็มเงิน', count: 18, color: '#64748B' },
  { label: 'ระดับทองแดง / เข็มทองแดง', count: 13, color: '#C17A45' },
  { label: 'ระดับต้น / เริ่มต้น', count: 51, color: '#0EA5E9' },
  { label: 'อื่น ๆ / รอตรวจสอบ', count: 6, color: '#F59E0B' },
];

interface DareNewDashboardProps {
  onNavigateHub: (hubId: string) => void;
}

export const DareNewDashboard: React.FC<DareNewDashboardProps> = ({ onNavigateHub }) => {
  const { 
    schools, 
    personnel, 
    activities, 
    news,
    exportActivitiesToGoogleSheets
  } = useApp();

  const totalStudentsReached = activities.reduce((sum, activity) => sum + (activity.studentCount || 0), 0);
  const yearlyStudentStats = Object.entries(activities.reduce<Record<string, number>>((totals, activity) => {
    const year = activity.fiscalYear || 'ไม่ระบุ';
    totals[year] = (totals[year] || 0) + (activity.studentCount || 0);
    return totals;
  }, {})).filter(([year]) => year !== 'ไม่ระบุ').sort(([a], [b]) => a.localeCompare(b, 'th')).slice(-5);
  const maxYearlyStudents = Math.max(1, ...yearlyStudentStats.map(([, count]) => count));

  // Carousel slide state for featured activities
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [teacherUnitFilter, setTeacherUnitFilter] = useState('ทั้งหมด');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [showAllTeacherUnits, setShowAllTeacherUnits] = useState(false);

  // Google Sheets Export State
  const [showSheetsConfirm, setShowSheetsConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<{ url?: string; message: string } | null>(null);

  // Media Modal Detail
  const [selectedMedia, setSelectedMedia] = useState<{ title: string; views: string; category: string; desc: string } | null>(null);

  // Featured Carousel items
  const featuredSlides = [
    {
      id: 'slide-1',
      title: 'กิจกรรม D.A.R.E. สัญจร โรงเรียนตำรวจตระเวนชายแดน',
      date: '12 ต.ค. 2569',
      location: 'จ.เชียงราย',
      imageUrl: '/dare-classroom-hero.png',
      badge: 'NEW',
      description: 'โครงการสัญจรอบรมทักษะชีวิต ปลูกฝังการปฏิเสธยาเสพติดให้กับนักเรียนบนดอยสูงในพื้นที่รับผิดชอบของ กก.ตชด.32'
    },
    {
      id: 'slide-2',
      title: 'ค่ายเยาวชนพิทักษ์ชายแดนปลอดภัย D.A.R.E. Camp',
      date: '15 ต.ค. 2569',
      location: 'จ.อุบลราชธานี',
      imageUrl: '/images/dare-elephant-mascot.png',
      badge: 'POPULAR',
      description: 'ฝึกอบรมทักษะการเป็นผู้นำเยาวชน การตระหนักรู้เกี่ยวกับโทษของสารเสพติด และทักษะการตัดสินใจแบบ D.D.M.M.'
    },
    {
      id: 'slide-3',
      title: 'พิธีมอบประกาศนียบัตรนักเรียนสำเร็จหลักสูตร D.A.R.E. 10 สัปดาห์',
      date: '18 ต.ค. 2569',
      location: 'จ.กาญจนบุรี',
      imageUrl: '/images/media-เพื่อนดี.png',
      badge: 'GRADUATION',
      description: 'นักเรียนชั้น ป.5 สำเร็จการศึกษาตามหลักสูตรมาตรฐานสากล พร้อมปฏิญาณตนไม่ยุ่งเกี่ยวกับยาเสพติด'
    }
  ];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredSlides.length);
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const handleExportSheets = async () => {
    setShowSheetsConfirm(false);
    setIsExporting(true);
    setExportNotice(null);
    try {
      const res = await exportActivitiesToGoogleSheets();
      if (res.success && res.url) {
        setExportNotice({
          url: res.url,
          message: 'ส่งออกข้อมูลแดชบอร์ด D.A.R.E. สู่ Google Sheets เรียบร้อยแล้ว'
        });
      } else {
        setExportNotice({ message: res.message });
      }
    } catch {
      setExportNotice({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="dare-dashboard mx-auto w-full max-w-[1720px] min-w-0 space-y-5 px-4 pb-10 pt-4 font-sans text-[#211936] sm:space-y-6 sm:px-5 sm:pt-5 2xl:px-7">
      <style>{`
        @keyframes dare-float-in { from { opacity: 0; transform: translateY(14px) scale(.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dare-bar-grow { from { width: 0; } }
        @keyframes dare-glow { 0%,100% { box-shadow: 0 18px 50px rgba(37,14,66,.14); } 50% { box-shadow: 0 22px 58px rgba(124,58,237,.22); } }
        .dare-hero { animation: dare-float-in .65s ease-out both, dare-glow 8s ease-in-out 1s infinite; }
        .dare-stat-card { animation: dare-float-in .55s ease-out both; }
        .dare-stat-card:nth-child(2) { animation-delay: 70ms; }
        .dare-stat-card:nth-child(3) { animation-delay: 140ms; }
        .dare-stat-card:nth-child(4) { animation-delay: 210ms; }
        .dare-reveal { animation: dare-float-in .65s ease-out both; }
        .dare-level-row { animation: dare-float-in .5s ease-out both; }
        .dare-level-bar { animation: dare-bar-grow .9s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .dare-hero, .dare-stat-card, .dare-reveal, .dare-level-row, .dare-level-bar { animation: none !important; transition: none !important; } }
      `}</style>
      {/* Google Sheets Export Alert Banner if exported */}
      {exportNotice && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#168A62]" />
            <span>{exportNotice.message}</span>
          </div>
          {exportNotice.url && (
            <a
              href={exportNotice.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#7C3AED] font-bold underline ml-4 hover:text-[#5B2A86]"
            >
              เปิดดู Google Sheets
            </a>
          )}
        </div>
      )}

      {/* 1. HERO BANNER — use the exact user-provided D.A.R.E. classroom artwork */}
      <section className="dare-hero relative isolate min-h-[360px] overflow-hidden rounded-[28px] border border-white/80 bg-[#eaf4ff] shadow-[0_18px_50px_rgba(37,14,66,0.12)] sm:min-h-[390px] xl:min-h-[410px]">
        <img
          src="/dare-classroom-hero.png"
          alt="ครูช้าง D.A.R.E. กำลังสอนนักเรียนในห้องเรียน"
          className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-[66%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5FC]/92 via-[#F8F5FC]/60 to-[#F8F5FC]/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#250E42]/28 via-transparent to-transparent" />
        
        
        
        <div className="relative z-10 flex min-h-[360px] items-center px-5 py-9 sm:min-h-[390px] sm:px-10 xl:min-h-[410px] xl:px-12">
          <div className="max-w-[94%] sm:max-w-[54%] lg:max-w-[51%]">
            <h1 className="max-w-3xl text-3xl font-black leading-[1.12] tracking-tight text-[#250E42] [text-shadow:0_1px_0_rgba(255,255,255,0.9)] sm:text-[46px] xl:text-[54px]">
              สร้างภูมิคุ้มกันให้เด็กไทย
            </h1>
            <div className="mt-2 inline-block">
              <span className="text-3xl font-black leading-tight tracking-tight text-[#6D28D9] [text-shadow:0_1px_0_rgba(255,255,255,0.8)] sm:text-[46px] xl:text-[54px]">ห่างไกลยาเสพติด</span>
              <div className="mt-3 h-[5px] max-w-[320px] rounded-full bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D6B15E]" />
            </div>
            <p className="mt-4 max-w-xl text-sm font-bold leading-6 text-[#14265D] [text-shadow:0_1px_2px_rgba(255,255,255,0.9)] sm:text-base">
              “รู้คิด รู้เท่าทัน เลือกสิ่งที่ดี เพื่ออนาคตที่สดใสของเยาวชนไทย”
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => onNavigateHub('hub-overview')} className="inline-flex items-center gap-2 rounded-xl bg-[#32145C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/20 transition hover:-translate-y-0.5 hover:bg-[#4E2174] hover:shadow-xl">
                ดูข้อมูลโครงการ <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => onNavigateHub('hub-operations')} className="inline-flex items-center gap-2 rounded-xl border border-[#D8CDE7] bg-white/95 px-5 py-3 text-sm font-bold text-[#32145C] shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
                <BookOpen className="h-4 w-4" /> สื่อการเรียนรู้
              </button>
              <button
                type="button"
                onClick={() => setShowSheetsConfirm(true)}
                disabled={isExporting}
                title="ส่งออก Google Sheets"
                aria-label="ส่งออก Google Sheets"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/90 bg-white/85 text-[#5B2A86] shadow-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. TOP 4 METRIC CARDS (Exact match to Mockup) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: โรงเรียนที่เข้าร่วมโครงการ */}
        <div 
          onClick={() => onNavigateHub('hub-registry')}
          className="dare-stat-card flex cursor-pointer items-center justify-between rounded-2xl border border-[#EAE5F2] bg-white p-4 shadow-[0_8px_26px_rgba(37,14,66,0.05)] transition-all hover:border-purple-300 hover:shadow-lg group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#8B5CF6] text-white shadow-xs sm:h-[72px] sm:w-[72px]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">โรงเรียนที่เข้าร่วมโครงการ</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172F81] sm:text-[28px]">{schools.length.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-normal">แห่ง ทั่วประเทศ</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-purple-100 group-hover:text-[#7C3AED] flex items-center justify-center text-gray-400 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: ครู D.A.R.E. */}
        <div 
          onClick={() => onNavigateHub('hub-registry')}
          className="dare-stat-card flex cursor-pointer items-center justify-between rounded-2xl border border-[#EAE5F2] bg-white p-4 shadow-[0_8px_26px_rgba(37,14,66,0.05)] transition-all hover:border-rose-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EF4444] text-white shadow-xs sm:h-[72px] sm:w-[72px]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">ครู D.A.R.E.</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172F81] sm:text-[28px]">{personnel.length.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-normal">นาย / นาง / คน</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-rose-100 group-hover:text-[#EF4444] flex items-center justify-center text-gray-400 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: นักเรียนที่ได้รับความรู้ */}
        <div 
          onClick={() => onNavigateHub('hub-operations')}
          className="dare-stat-card flex cursor-pointer items-center justify-between rounded-[20px] border border-[#E7E0EF] bg-white p-3 shadow-2xs transition-all hover:border-blue-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6] text-white shadow-xs sm:h-[72px] sm:w-[72px]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">นักเรียนที่ได้รับความรู้</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172F81] sm:text-[28px]">{totalStudentsReached.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-normal">คน</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-blue-100 group-hover:text-[#3B82F6] flex items-center justify-center text-gray-400 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: สื่อการเรียนรู้ */}
        <div 
          onClick={() => onNavigateHub('hub-operations')}
          className="dare-stat-card flex cursor-pointer items-center justify-between rounded-[20px] border border-[#E7E0EF] bg-white p-3 shadow-2xs transition-all hover:border-amber-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B] text-white shadow-xs sm:h-[72px] sm:w-[72px]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">ข่าวและสื่อ</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172F81] sm:text-[28px]">{news.length.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-normal">รายการข่าวและสื่อ</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-amber-100 group-hover:text-[#F59E0B] flex items-center justify-center text-gray-400 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* 4. MIDDLE SECTION: กิจกรรมล่าสุด & สื่อการเรียนรู้ยอดนิยม */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left Column: กิจกรรมล่าสุด (8 cols) */}
        <div className="rounded-2xl border border-[#EAE5F2] bg-white p-5 shadow-[0_10px_30px_rgba(37,14,66,0.05)] sm:p-4 xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E7E0EF] pb-3">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <span className="text-amber-500">⭐️</span>
              <span>กิจกรรมล่าสุด</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">ตัวอย่าง UI</span>
            </h2>
            <button 
              onClick={() => onNavigateHub('hub-operations')}
              className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Featured Activity Carousel (7 cols) */}
            <div className="relative group flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl bg-slate-800 lg:col-span-7">
              <img
                src={featuredSlides[carouselIndex].imageUrl}
                alt={featuredSlides[carouselIndex].title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d25]/95 via-[#080d25]/35 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#EF4444] text-white uppercase tracking-wider shadow-sm">
                  {featuredSlides[carouselIndex].badge}
                </span>
              </div>

              {/* Prev / Next Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                title="ก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                title="ถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Content overlay */}
              <div className="relative z-10 p-4 text-white space-y-1">
                <h3 className="text-xs sm:text-sm font-bold line-clamp-1 leading-snug">
                  {featuredSlides[carouselIndex].title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredSlides[carouselIndex].date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{featuredSlides[carouselIndex].location}</span>
                  </span>
                </div>

                {/* Carousel indicator dots */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {featuredSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === carouselIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* List of 3 Activity items (5 cols) */}
            <div className="flex flex-col gap-2.5 lg:col-span-5">
              {[
                {
                  id: 'item-1',
                  title: 'ครู D.A.R.E. จัดกิจกรรม "คิดดี เลือกได้ ชีวิตสดใส"',
                  date: '10 ต.ค. 2569',
                  location: 'จ.ขอนแก่น',
                  img: '/images/dare-elephant-mascot.png'
                },
                {
                  id: 'item-2',
                  title: 'อบรมครู D.A.R.E. รุ่นที่ 3/2569 เสริมศักยภาพการสอน',
                  date: '8 ต.ค. 2569',
                  location: 'กรุงเทพฯ',
                  img: '/dare-classroom-hero.png'
                },
                {
                  id: 'item-3',
                  title: 'มอบสื่อการเรียนรู้ให้โรงเรียนในพื้นที่ชายแดน',
                  date: '5 ต.ค. 2569',
                  location: 'จ.ตาก',
                  img: '/images/media-รู้จักยาเสพติด.png'
                }
              ].map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigateHub('hub-operations')}
                  className="group flex min-h-[68px] items-center gap-3 rounded-xl border border-[#EAECF5] p-2 text-left transition hover:border-purple-200 hover:bg-purple-50/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={act.img} alt={act.title} className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14" />
                    <div className="min-w-0">
                      <div className="line-clamp-2 block text-xs font-bold leading-snug text-[#172554] transition group-hover:text-purple-700 sm:text-sm">
                        {act.title}
                      </div>
                      <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span>{act.date}</span>
                        <span>·</span>
                        <span>{act.location}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7C3AED] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: สื่อการเรียนรู้ยอดนิยม (4 cols) */}
        <div className="space-y-3 rounded-[22px] border border-white bg-white p-4 shadow-[0_9px_30px_rgba(40,55,105,0.07)] sm:p-4 xl:col-span-4">
          <div className="flex items-center justify-between border-b border-[#E7E0EF] pb-3">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <span className="text-[#8B5CF6]">📢</span>
              <span>สื่อการเรียนรู้ยอดนิยม</span>
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200">ตัวอย่างยอดรับชม</span>
            </h2>
            <button 
              onClick={() => onNavigateHub('hub-governance')}
              className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Media 1: รู้จักยาเสพติด */}
            <div 
              onClick={() => setSelectedMedia({
                title: 'รู้จักยาเสพติดและโทษภัย',
                views: '12.4K',
                category: 'บทเรียนที่ 1',
                desc: 'วิดีโอแอนิเมชันสำหรับเด็กนักเรียน อธิบายประเภทของสารเสพติดและผลกระทบต่อร่างกายอย่างเข้าใจง่าย'
              })}
              className="relative aspect-[3/5] min-h-[190px] overflow-hidden rounded-2xl border border-purple-100 bg-[#6D28D9] text-white p-0 flex flex-col justify-end cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group"
            >
              <img
                src="/images/media-รู้จักยาเสพติด.png"
                alt="รู้จักยาเสพติด เรียนรู้ร่วมกัน"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13072b]/75 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between text-[10px] border-t border-white/25 bg-black/20 px-2 py-2 backdrop-blur-[2px]">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  <span>12.4K</span>
                </span>
                <Play className="w-3 h-3 fill-white" />
              </div>
            </div>

            {/* Media 2: ทักษะการปฏิเสธ (บอก NO) */}
            <div 
              onClick={() => setSelectedMedia({
                title: 'ทักษะการปฏิเสธอย่างมั่นใจ (Say NO)',
                views: '9.8K',
                category: 'บทเรียนที่ 5',
                desc: 'แบบฝึกหัดสถานการณ์จำลอง 5 รูปแบบการปฏิเสธคำชักชวนของเพื่อนอย่างสุภาพแต่มั่นคง'
              })}
              className="relative aspect-[3/5] min-h-[190px] overflow-hidden rounded-2xl border border-rose-100 bg-[#B91C1C] text-white p-0 flex flex-col justify-end cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group"
            >
              <img
                src="/images/media-ทักษะการปฏิเสธ.png"
                alt="ทักษะการปฏิเสธ บอก NO"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25070b]/75 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between text-[10px] border-t border-white/25 bg-black/20 px-2 py-2 backdrop-blur-[2px]">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  <span>9.8K</span>
                </span>
                <Play className="w-3 h-3 fill-white" />
              </div>
            </div>

            {/* Media 3: เพื่อนดี มีได้เยอะ */}
            <div 
              onClick={() => setSelectedMedia({
                title: 'เพื่อนดี มีได้เยอะ: การสร้างมิตรภาพสร้างสรรค์',
                views: '8.6K',
                category: 'บทเรียนที่ 8',
                desc: 'การเลือกคบเพื่อน การจัดการความกดดันจากกลุ่มเพื่อน และการสร้างพลังบวกในกลุ่มวัยรุ่น'
              })}
              className="relative aspect-[3/5] min-h-[190px] overflow-hidden rounded-2xl border border-blue-100 bg-[#1D4ED8] text-white p-0 flex flex-col justify-end cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group"
            >
              <img
                src="/images/media-เพื่อนดี.png"
                alt="เพื่อนดี มีได้เยอะ"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07162e]/75 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between text-[10px] border-t border-white/25 bg-black/20 px-2 py-2 backdrop-blur-[2px]">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  <span>8.6K</span>
                </span>
                <Play className="w-3 h-3 fill-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ANALYTICS & CALENDAR STRIP (3 Boxes) */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Box 1: แผนที่โรงเรียนที่เข้าร่วม (4 cols) */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-[0_9px_30px_rgba(40,55,105,0.07)] sm:p-4 xl:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#E7E0EF] pb-3">
              <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                <span className="text-[#8B5CF6]">🗺️</span>
                <span>แผนที่โรงเรียนที่เข้าร่วม</span>
              </h3>
              <button 
                onClick={() => onNavigateHub('hub-registry')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
              >
                <span>ดูแผนที่ทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 pt-2">
              {/* Thailand map stylized graphic (5 cols) */}
              <div className="col-span-4 flex justify-center">
                <svg viewBox="0 0 100 160" className="h-auto w-full max-w-[105px] drop-shadow-sm">
                  {/* Thailand Map Silhouette */}
                  <path
                    d="M 40 10 C 55 12, 70 20, 65 35 C 75 40, 85 50, 75 65 C 65 75, 55 70, 50 85 C 45 95, 42 120, 40 145 C 38 155, 34 158, 32 150 C 30 135, 36 100, 32 80 C 25 70, 20 50, 25 35 C 30 20, 35 15, 40 10 Z"
                    fill="#C7D2FE"
                    stroke="#818CF8"
                    strokeWidth="1.5"
                  />
                  {/* Regional pinpoint markers */}
                  <circle cx="48" cy="28" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="68" cy="48" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="45" cy="65" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="36" cy="125" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="58" cy="72" r="3.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="32" cy="55" r="3.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Regional breakdown table (7 cols) */}
              <div className="col-span-8 space-y-2">
                {[
                  { region: 'ภาคเหนือ', count: '620' },
                  { region: 'ภาคตะวันออกเฉียงเหนือ', count: '980' },
                  { region: 'ภาคกลาง', count: '730' },
                  { region: 'ภาคใต้', count: '420' },
                  { region: 'ภาคตะวันออก', count: '310' },
                  { region: 'ภาคตะวันตก', count: '190' },
                ].map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 border-b border-slate-50 pb-1.5 text-[10px] sm:text-xs">
                    <span className="font-medium truncate">{r.region}</span>
                    <span className="font-bold text-[#1E293B] tabular-nums whitespace-nowrap">{r.count} โรงเรียน</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: สถิตินักเรียนรายปี (4 cols) */}
        <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-[#EAE5F2] bg-white p-5 shadow-[0_10px_30px_rgba(37,14,66,0.05)] sm:p-4 xl:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#E7E0EF] pb-3">
              <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                <span className="text-[#8B5CF6]">📊</span>
                <span>สถิตินักเรียนรายปี</span>
              </h3>
              <button 
                onClick={() => onNavigateHub('hub-governance')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
              >
                <span>ดูรายละเอียด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Peak Count Badge */}
            <div className="text-right pt-2">
              <span className="text-sm font-black text-[#1E293B] tabular-nums">{totalStudentsReached.toLocaleString()}</span>
              <span className="text-[10px] text-gray-500 block">ยอดนักเรียนจากกิจกรรมที่บันทึก</span>
            </div>

            {/* Bar Chart */}
            <div className="flex h-[152px] items-end justify-between gap-2 border-b border-slate-200 px-2 pt-2">
              {yearlyStudentStats.length > 0 ? yearlyStudentStats.map(([year, count], idx) => (
                <div key={year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 transition group-hover:opacity-100">
                    {count.toLocaleString()}
                  </span>
                  <div
                    style={{ height: `${Math.max(8, (count / maxYearlyStudents) * 100)}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all ${idx === yearlyStudentStats.length - 1 ? 'bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6]' : 'bg-gradient-to-t from-[#9698FA] to-[#7367F0]'}`}
                    title={`${year}: ${count.toLocaleString()} คน`}
                  />
                  <span className="pb-2 text-[10px] font-semibold text-slate-500 sm:text-xs">{year}</span>
                </div>
              )) : <div className="w-full flex items-center justify-center text-xs text-[#94A3B8]">ยังไม่มีข้อมูลกิจกรรมสำหรับสถิติรายปี</div>}
            </div>
          </div>
        </div>

        {/* Box 3: ปฏิทินกิจกรรม (4 cols) */}
        <div className="rounded-2xl border border-[#EAE5F2] bg-white p-5 shadow-[0_10px_30px_rgba(37,14,66,0.05)] sm:p-4 xl:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#E7E0EF] pb-3">
              <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                <span className="text-[#EF4444]">📅</span>
                <span>ปฏิทินกิจกรรม</span>
              </h3>
              <button 
                onClick={() => onNavigateHub('hub-operations')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1 sm:space-y-3.5">
              {[
                {
                  day: '17',
                  month: 'ต.ค.',
                  title: 'อบรมครู D.A.R.E. รุ่นที่ 4/2569',
                  location: 'กรุงเทพมหานคร'
                },
                {
                  day: '21',
                  month: 'ต.ค.',
                  title: 'กิจกรรม D.A.R.E. ในโรงเรียน',
                  location: 'จ.นครราชสีมา'
                },
                {
                  day: '29',
                  month: 'ต.ค.',
                  title: 'ประชุมผู้ประสานงานโครงการ',
                  location: 'รูปแบบออนไลน์'
                }
              ].map((ev, idx) => (
                <div 
                  key={idx}
                  onClick={() => onNavigateHub('hub-operations')}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Date badge */}
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-purple-100 bg-purple-50">
                    <span className="text-base font-black leading-none text-purple-700">{ev.day}</span>
                    <span className="mt-1 text-[9px] font-medium text-slate-500">{ev.month}</span>
                  </div>
                  <div>
                    <div className="block text-xs font-bold leading-snug text-[#172554] sm:text-sm">
                      • {ev.title}
                    </div>
                    <div className="mt-1 block text-[10px] text-slate-400 sm:text-xs">
                      {ev.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEACHER STATUS — summarized from uploaded workbook */}
      <section className="dare-reveal overflow-hidden rounded-[24px] border border-violet-100 bg-white shadow-[0_10px_30px_rgba(56,32,100,0.06)]">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#24134E] via-[#48217B] to-[#7550DB] px-5 py-4 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-8 -top-14 h-48 w-48 rounded-full border-[22px] border-white/10" />
          <div className="pointer-events-none absolute right-24 -bottom-20 h-44 w-44 rounded-full bg-fuchsia-400/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><ShieldCheck className="h-6 w-6 text-amber-200" /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-black sm:text-xl">สถานภาพครูตำรวจ D.A.R.E.</h2><span className="rounded-full bg-emerald-300/15 px-2.5 py-1 text-[10px] font-bold text-emerald-100 ring-1 ring-emerald-200/25">ข้อมูลสรุป</span></div>
                <p className="mt-1 text-xs text-violet-100 sm:text-sm">อ้างอิงบัญชีสถานภาพครูตำรวจ D.A.R.E. ณ 30 ก.ย. 2569</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15"><Activity className="h-3.5 w-3.5 text-emerald-200" /> ครูในบัญชี 250 นาย</span><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15"><Building2 className="h-3.5 w-3.5 text-amber-200" /> 33 หน่วยในสรุป</span></div>
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-extrabold text-[#24134E]"><Medal className="h-4 w-4 text-violet-600" /> ภาพรวมระดับเข็ม</h3><span className="text-[10px] text-slate-400">สรุปจากบัญชีรายชื่อ</span></div>
            <div className="space-y-2.5">
              {TEACHER_STATUS_LEVELS.map((level, index) => <div key={level.label} className="dare-level-row" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-600">{level.label}</span><span className="font-black tabular-nums text-[#24134E]">{level.count} <span className="font-medium text-slate-400">นาย</span></span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="dare-level-bar h-full rounded-full" style={{ width: `${(level.count / 250) * 100}%`, background: level.color, animationDelay: `${index * 100}ms` }} /></div>
              </div>)}
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800"><Sparkles className="mr-1 inline h-3.5 w-3.5" /> ตัวเลขระดับเข็มเป็นการจัดกลุ่มเบื้องต้นจากข้อมูลต้นทาง ควรตรวจทานก่อนใช้เป็นรายงานทางการ</p>
          </div>
          <div className="xl:col-span-7">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#24134E]"><Users className="h-4 w-4 text-violet-600" /> จำนวนครูแยกตามหน่วย</h3>
              <div className="flex flex-wrap gap-2">
                <label className="relative block min-w-0 flex-1 sm:w-48 sm:flex-none"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" /><input value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} placeholder="ค้นหาหน่วย..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none transition focus:border-violet-400 focus:bg-white" /></label>
                <select value={teacherUnitFilter} onChange={e => setTeacherUnitFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-violet-400"><option>ทั้งหมด</option><option>บก.ตชด.ภาค</option><option>กก.ตชด.</option><option>หน่วยอื่น</option></select>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TEACHER_STATUS_UNITS.filter(unit => unit.name.toLowerCase().includes(teacherSearch.trim().toLowerCase())).filter(unit => teacherUnitFilter === 'ทั้งหมด' || (teacherUnitFilter === 'บก.ตชด.ภาค' ? unit.name.startsWith('บก.ตชด.ภาค') : teacherUnitFilter === 'กก.ตชด.' ? unit.name.startsWith('กก.ตชด.') : !unit.name.startsWith('บก.ตชด.ภาค') && !unit.name.startsWith('กก.ตชด.'))).sort((a,b) => b.count-a.count).slice(0, showAllTeacherUnits ? 33 : 8).map((unit,index) => <div key={unit.name} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/70">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[10px] font-black text-violet-600 shadow-sm ring-1 ring-violet-100">{index+1}</div>
                <div className="min-w-0 flex-1"><div className="truncate text-[11px] font-bold text-slate-700">{unit.name}</div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-700" style={{width:`${(unit.count/19)*100}%`}} /></div></div>
                <div className="text-sm font-black tabular-nums text-[#24134E]">{unit.count}<span className="ml-1 text-[9px] font-medium text-slate-400">นาย</span></div>
              </div>)}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2"><span className="text-[10px] text-slate-400">รวมตามบัญชีสรุป 250 นาย</span><button onClick={() => setShowAllTeacherUnits(v => !v)} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-violet-700 transition hover:bg-violet-50">{showAllTeacherUnits ? 'แสดงน้อยลง' : 'ดูทุกหน่วย'} <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showAllTeacherUnits ? 'rotate-90' : ''}`} /></button></div>
          </div>
        </div>
      </section>


      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide">
                {selectedMedia.category}
              </span>
              <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#1E293B]">{selectedMedia.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{selectedMedia.desc}</p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>ยอดรับชมสะสม {selectedMedia.views} ครั้งในสถานศึกษา</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMedia(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  setSelectedMedia(null);
                  onNavigateHub('hub-operations');
                }}
                className="px-5 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold shadow-xs hover:bg-[#5B21B6]"
              >
                เปิดสื่อการสอนเต็มรูปแบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Modal */}
      <ConfirmationModal
        isOpen={showSheetsConfirm}
        title="ส่งออกรายงานสถิติ D.A.R.E. สู่ Google Sheets"
        description="ระบบจะสร้างเอกสาร Google Spreadsheet ใหม่ใน Google Drive ของท่าน พร้อมส่งออกสถิติ 3,250 โรงเรียน, 5,840 ครู ตชด. และ 412,600 นักเรียนอย่างครบถ้วน"
        type="sheets"
        confirmLabel="ส่งออกข้อมูลทันที"
        cancelLabel="ยกเลิก"
        onConfirm={handleExportSheets}
        onCancel={() => setShowSheetsConfirm(false)}
      />
    </div>
  );
};
