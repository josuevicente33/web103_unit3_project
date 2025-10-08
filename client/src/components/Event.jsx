import React, { useState, useEffect } from 'react'
import '../css/Event.css'
import EventsAPI from '../services/EventsAPI'

// dates.js (or wherever these live)
export const dates = {
  formatTime(time, isoFallback) {
    // prefer explicit "HH:mm" or "h:mm AM/PM" string if provided
    if (typeof time === 'string' && time.includes(':')) {
      // tolerate both "18:00" and "6:00 PM"
      if (/am|pm/i.test(time)) return time; // already pretty
      const [h, m] = time.split(':').map(Number);
      if (Number.isFinite(h) && Number.isFinite(m)) {
        const period = h >= 12 ? 'PM' : 'AM';
        const hh = (h % 12) || 12;
        return `${hh}:${String(m).padStart(2,'0')} ${period}`;
      }
    }
    // otherwise, derive from ISO timestamp (start date/time)
    if (isoFallback) {
      const d = new Date(isoFallback);
      if (!Number.isNaN(d)) {
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const hh = (hours % 12) || 12;
        return `${hh}:${String(minutes).padStart(2,'0')} ${period}`;
      }
    }
    return 'TBD';
  },

  formatRemainingTime({ startsAt, endsAt, now = new Date() }) {
    if (!startsAt) return 'TBD';
    const startMs = new Date(startsAt).getTime();
    const endMs   = endsAt ? new Date(endsAt).getTime() : null;
    const nowMs   = now.getTime();

    const human = (ms) => {
      const s = Math.max(0, Math.floor(ms / 1000));
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const parts = [];
      if (d) parts.push(`${d} day${d!==1?'s':''}`);
      if (h) parts.push(`${h} hour${h!==1?'s':''}`);
      if (m) parts.push(`${m} minute${m!==1?'s':''}`);
      if (sec || parts.length===0) parts.push(`${sec} second${sec!==1?'s':''}`);
      return parts.join(', ');
    };

    if (startMs > nowMs) return `Starts in ${human(startMs - nowMs)}`;
    if (endMs && endMs > nowMs) return `In progress — ends in ${human(endMs - nowMs)}`;
    return 'Event ended';
  },

  formatNegativeTimeRemaining(remainingText, id) {
    if (typeof document === 'undefined') return;
    if (typeof remainingText !== 'string') return;
    if (remainingText.startsWith('In progress') || remainingText.startsWith('Event ended')) {
      const el = document.getElementById(`remaining-${id}`);
      if (el) {
        el.classList.add('event-started');
        el.innerHTML = `<i class="fa-solid fa-circle-check fa-bounce"></i> ${remainingText}`;
      }
    }
  }
};


const Event = (props) => {

    const [event, setEvent] = useState([])
    const [time, setTime] = useState([])
    const [remaining, setRemaining] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const eventData = await EventsAPI.getEventById(props.id)
                setEvent(eventData)
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const result = dates.formatTime(event.time, event.start_date)
                setTime(result)
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [event])

    useEffect(() => {
        (async () => {
            try {
                const timeRemaining = dates.formatRemainingTime({ startsAt: event.start_date, endsAt: event.end_date })
                setRemaining(timeRemaining)
                dates.formatNegativeTimeRemaining(timeRemaining, event.id)
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [event])

    return (
        <article className='event-information'>
            <img src={event.image} />

            <div className='event-information-overlay'>
                <div className='text'>
                    <h3>{event.title}</h3>
                    <p><i className="fa-regular fa-calendar fa-bounce"></i> {event.date} <br /> {time}</p>
                    <p id={`remaining-${event.id}`}>{remaining}</p>
                </div>
            </div>
        </article>
    )
}

export default Event