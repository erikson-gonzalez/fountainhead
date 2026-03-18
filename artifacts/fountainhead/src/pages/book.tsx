import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { BookingServiceType, useGetAvailability } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: BookingServiceType.lesson, name: "Guitar Lesson", price: 45, desc: "1-on-1 advanced fretless or standard guitar instruction." },
  { id: BookingServiceType.coaching, name: "Creative Coaching", price: 50, desc: "Production, composition, and career guidance." },
  { id: BookingServiceType.studio, name: "Studio Time", price: 200, desc: "8 hours of attended tracking/mixing in Berlin." },
];

export default function Book() {
  const [selectedService, setSelectedService] = useState<BookingServiceType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const addItem = useCartStore(state => state.addItem);

  const monthQuery = format(currentMonth, 'yyyy-MM');
  
  const { data: availability, isLoading: loadingAvail } = useGetAvailability(
    { serviceType: selectedService!, month: monthQuery },
    { query: { enabled: !!selectedService } }
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handleAddToCart = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    const serviceDef = SERVICES.find(s => s.id === selectedService)!;
    
    addItem({
      type: 'booking',
      id: Math.random(), // generate temp id until checkout
      name: `${serviceDef.name} on ${format(selectedDate, 'MMM do, yyyy')} at ${selectedTime}`,
      priceEur: serviceDef.price,
      quantity: 1,
    });
    
    // Reset selection to show success or let them continue
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">Book a Session</h1>
        <p className="text-muted-foreground">Schedule your 1-on-1 session or studio time.</p>
      </div>

      <div className="space-y-12">
        {/* Step 1: Select Service */}
        <section>
          <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
            Select Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <div 
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className={cn(
                  "p-6 border rounded-sm cursor-pointer transition-all",
                  selectedService === service.id 
                    ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(225,29,72,0.1)]" 
                    : "border-white/10 bg-card hover:border-white/30"
                )}
              >
                <h3 className="font-display font-bold text-lg text-white mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                <p className="text-secondary font-bold">€{service.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2: Calendar */}
        {selectedService && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
              Select Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6 md:p-8 rounded-sm">
              {/* Fake Calendar UI for aesthetics */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 border border-white/10 hover:bg-white/5">&larr;</button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border border-white/10 hover:bg-white/5">&rarr;</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-muted-foreground">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Offset for first day */}
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
                  
                  {daysInMonth.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    // Mock availability: assume some days have slots
                    const hasSlots = true; // In real app, check availability.slots
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        disabled={!hasSlots}
                        onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                        className={cn(
                          "aspect-square flex items-center justify-center text-sm transition-colors rounded-sm",
                          !hasSlots ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10",
                          isSelected ? "bg-primary text-white font-bold" : "text-gray-300"
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {selectedDate ? format(selectedDate, 'MMMM do') : 'Select a date'}
                </h3>
                
                {!selectedDate ? (
                  <p className="text-muted-foreground text-sm text-center py-12 border border-dashed border-white/10">Please select a date from the calendar to view available times.</p>
                ) : loadingAvail ? (
                  <div className="animate-pulse flex flex-col gap-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-sm" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Mock slots for UI since real backend might be empty */}
                    {['10:00', '12:00', '15:00', '17:00'].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "p-3 border rounded-sm text-center transition-all text-sm",
                          selectedTime === time 
                            ? "border-secondary bg-secondary/10 text-secondary font-bold" 
                            : "border-white/10 text-white hover:border-white/30"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Step 3: Add to Cart */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-end pt-8"
          >
            <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto">
              Add to Booking Cart <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
