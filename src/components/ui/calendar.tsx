'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  disabled?: boolean;
}

export default function Calendar({ selectedDate, onDateSelect, disabled = false }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isDateDisabled = (date: Date) => {
    return date < today;
  };
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const handleDateClick = (day: number) => {
    if (disabled) return;
    
    const selectedDateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    if (!isDateDisabled(selectedDateObj)) {
      onDateSelect(formatDate(selectedDateObj));
    }
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };
  
  const isDateSelected = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return formatDate(date) === selectedDate;
  };
  
  const isToday = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return formatDate(date) === formatDate(today);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="font-semibold text-slate-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );
            const disabled = isDateDisabled(date);
            const selected = isDateSelected(day);
            const today = isToday(day);
            
            return (
              <Button
                key={day}
                variant={selected ? "default" : "ghost"}
                size="sm"
                className={`h-10 w-10 p-0 text-sm ${
                  disabled 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'hover:bg-slate-100'
                } ${
                  selected 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                    : today 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : ''
                }`}
                onClick={() => handleDateClick(day)}
                disabled={disabled}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}