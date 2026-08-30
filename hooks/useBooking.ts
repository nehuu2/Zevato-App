import { useState, useEffect } from 'react';
import { bookingStore, BookingDraft } from '../store/bookingStore';

export function useBooking() {
  const [draft, setDraft] = useState<BookingDraft>(bookingStore.getState());

  useEffect(() => {
    const unsubscribe = bookingStore.subscribe(setDraft);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    draft,
    setCategory: bookingStore.setCategory,
    setBrand: bookingStore.setBrand,
    setProduct: bookingStore.setProduct,
    setService: bookingStore.setService,
    setSchedule: bookingStore.setSchedule,
    setAddress: bookingStore.setAddress,
    setPaymentMethod: bookingStore.setPaymentMethod,
    setNotes: bookingStore.setNotes,
    resetBooking: bookingStore.resetBooking,
  };
}

export default useBooking;
