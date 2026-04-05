import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon, Zap, CheckCircle2, Lock, LayoutDashboard, ArrowLeft, Wifi, Coffee } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Rooms() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await API.get("/api/rooms");
      const filteredRooms = id ? res.data.filter(r => r.hostel === id || r.hostelId === id) : res.data;
      setRooms(filteredRooms);
    } catch (err) {
      toast.error("Inventory sync failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) { navigate("/login"); return; }
    setUser(storedUser);
    fetchRooms();
  }, [navigate, fetchRooms]);

  const calculatePrice = (basePrice) => {
    const role = user?.role?.toLowerCase();
    if (role === "principal") return basePrice * 0.7;
    if (role === "hod") return basePrice * 0.8;
    if (role === "professor") return basePrice * 0.9;
    return basePrice + 200; // Guest pays more
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-orange-900">Loading Premium Suites...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12 font-['Inter']">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <div>
          <button onClick={() => navigate("/home")} className="text-orange-600 font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-tighter hover:underline">
            <ArrowLeft size={14}/> Back to Hostels
          </button>
          <h1 className="text-4xl font-black text-gray-900 uppercase">Available <span className="text-orange-500 italic font-light text-3xl">Suites</span></h1>
        </div>
        <div className="hidden md:block bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase">Allocated Category</p>
          <p className="font-bold text-orange-600 uppercase tracking-widest">{user?.gender} STAFF</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {rooms.map((room) => {
          const finalPrice = calculatePrice(room.price || 1000);
          return (
            <motion.div key={room._id} whileHover={{ y: -10 }} className="group bg-white rounded-[45px] overflow-hidden border border-gray-100 shadow-xl shadow-orange-900/5 transition-all">
              <div className="relative h-56 bg-gray-100">
                <img src={room.type === 'AC' ? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=500" : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500"} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="room"/>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-orange-600 text-xs shadow-xl">
                  {room.availableRooms} UNITS LEFT
                </div>
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800">{room.type} Suite</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">24H Executive Stay</p>
                  </div>
                  <div className="text-right text-orange-500 font-black text-2xl">₹{finalPrice}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl"><Wifi size={14}/> HIGHSPEED WIFI</div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl"><Coffee size={14}/> MESS INCLUDED</div>
                </div>

                <button 
                  onClick={() => window.location.href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm"}
                  className="w-full bg-gray-900 text-white py-5 rounded-[25px] font-black shadow-2xl hover:bg-orange-500 transition-all transform active:scale-95"
                >
                  Confirm & Pay
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}