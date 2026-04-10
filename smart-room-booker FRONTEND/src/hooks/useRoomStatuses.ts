import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '@/services/api';
import { getRoomStatus, RoomStatus } from '@/components/RoomStatusBadge';

const POLL_INTERVAL = 30_000; // 30 seconds

export function useRoomStatuses(roomIds: number[]) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<number, RoomStatus>>({});

  const fetchReservations = useCallback(async () => {
    try {
      const res = await reservationService.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setReservations(list);
    } catch {
      // silently fail – statuses will default to 'available'
    }
  }, []);

  // Fetch on mount and poll
  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchReservations]);

  // Recompute statuses when reservations or roomIds change
  useEffect(() => {
    const map: Record<number, RoomStatus> = {};
    for (const id of roomIds) {
      map[id] = getRoomStatus(id, reservations);
    }
    setStatuses(map);
  }, [roomIds, reservations]);

  return statuses;
}
