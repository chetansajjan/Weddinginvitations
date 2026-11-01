import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, MapPin, Music2, Pause, Play, Heart, Clock3, Share2, ArrowDown, Sparkles } from 'lucide-react';
import { wedding } from './weddingData';
import './styles.css';

function GaneshaEmblem() {
  return <img
    className="ganesha-image"
    src="/images/ganesha-reference.png"
    alt="ಶ್ರೀ ಗಣೇಶನ ಸಾಂಪ್ರದಾಯಿಕ ಚಿತ್ರ"
    loading="eager"
    decoding="async"
  />;
}

function MangoTorana() {
  return <svg className="mango-torana" viewBox="0 0 520 112" aria-hidden="true">
    <defs>
      <linearGradient id="toranaGold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e8c66f"/><stop offset="1" stopColor="#98702a"/></linearGradient>
      <g id="mangoLeaf"><path d="M0 0 Q-17 -18 -7 -34 Q8 -22 0 0Z" fill="#668044" stroke="#405d31" strokeWidth="1.2"/><path d="M0 -2 L-6 -28" stroke="#d8d99a" strokeWidth="1" fill="none"/></g>
      <g id="marigold"><circle r="7" fill="#e9a52d"/><circle r="4" fill="#f7cf63"/><circle r="1.5" fill="#a95e21"/></g>
    </defs>
    <path d="M8 8 Q260 130 512 8" fill="none" stroke="url(#toranaGold)" strokeWidth="3"/>
    {Array.from({length:19},(_,i)=><g key={i} transform={`translate(${15+i*27.2} ${13+Math.sin(i/18*Math.PI)*55}) rotate(${(i-9)*5})`}><use href="#mangoLeaf"/><use href="#mangoLeaf" transform="rotate(55)"/><use href="#mangoLeaf" transform="rotate(-55)"/></g>)}
    {[22,76,130,184,238,282,336,390,444,498].map((x,i)=><g key={x} transform={`translate(${x} ${19+Math.sin(i/9*Math.PI)*52})`}><path d="M0 0 v13" stroke="#b88632" strokeWidth="1.5"/><use href="#marigold" transform="translate(0 18)"/></g>)}
    <path d="M0 7 Q260 129 520 7" fill="none" stroke="#d7b35e" strokeWidth="1" strokeDasharray="2 5"/>
  </svg>;
}

function Countdown() {
  const target = useMemo(() => new Date(wedding.date).getTime(), []);
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));
  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [target]);
  const units = [
    ['Days', Math.floor(remaining / 86400000)],
    ['Hours', Math.floor((remaining / 3600000) % 24)],
    ['Minutes', Math.floor((remaining / 60000) % 60)],
    ['Seconds', Math.floor((remaining / 1000) % 60)]
  ];
  return <div className="countdown">{units.map(([label, value]) => <div className="time-unit" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

function App() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const audioRef = useRef(null);
  const [musicError, setMusicError] = useState(false);
  const fullNames = `${wedding.groom} & ${wedding.bride}`;
  useEffect(() => { document.title = `${fullNames} — Wedding Invitation`; }, [fullNames]);
  const inviteText = `You're invited to the wedding of ${fullNames}! ${wedding.dateLabel} at ${wedding.venue}, ${wedding.address}. View invitation: ${window.location.href}`;

  const startInvitation = () => {
    if (opening || opened) return;
    setOpening(true);
    setMusicError(false);
    // Call play() immediately inside the click handler so mobile browsers recognise
    // the tap as the user's playback gesture. Do not wait for the audio before opening.
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.42;
      const playback = audio.play();
      playback.then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
        setMusicError(true);
      });
    }
    // The visual reveal runs independently; music begins as soon as the stream buffers.
    window.setTimeout(() => { setOpened(true); setOpening(false); }, 1350);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setMusicError(false);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.volume = 0.42;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setMusicError(true);
      }
    }
  };

  return <>
    {!opened && <div className={`cover-screen ${opening ? 'is-opening' : ''}`}><div className="cover-card"><div className="cover-corner corner-tl">❀</div><div className="cover-corner corner-tr">❀</div><div className="cover-corner corner-bl">❀</div><div className="cover-corner corner-br">❀</div><MangoTorana/><GaneshaEmblem/><p className="invocation">{wedding.invocation}</p><div className="ornament">✺ ❧ ✺</div><p className="eyebrow">With the blessings of Lord Ganesha</p><h1>{wedding.groom}<span>&</span>{wedding.bride}</h1><p className="cover-copy">Cordially invite you to grace the occasion<br/>and bless their sacred union.</p><div className="cover-date">{wedding.dateLabel}</div><button className="primary-button open-invitation-button" onClick={startInvitation} disabled={opening}>{opening ? "ಆಮಂತ್ರಣ ತೆರೆಯಲಾಗುತ್ತಿದೆ…" : "ಆಮಂತ್ರಣವನ್ನು ತೆರೆಯಿರಿ"} <Music2 size={16}/></button><p className="music-hint">Tap to open the invitation and begin the Nadaswaram</p><div className="ornament bottom">✺ ❧ ✺</div><div className="cover-foot">ಶುಭ ವಿವಾಹ · ಮಂಗಳಮಯ ದಾಂಪತ್ಯ</div></div></div>}

    <main className="page-shell">
      <header className="topbar"><a className="brand" href="#home">{wedding.groom} <span>&</span> {wedding.bride}</a><span className="topbar-note">॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥</span></header>
      <section className="hero" id="home">
        <div className="hero-image" role="img" aria-label="Wedding celebration"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content"><p className="invocation hero-invocation">{wedding.invocation}</p><p className="eyebrow light">A sacred celebration of love</p><h1>{wedding.groom}<span>&</span>{wedding.bride}</h1><p className="hero-date">{wedding.dateLabel}</p><a className="text-link" href="#story">Discover our invitation <ArrowDown size={15}/></a></div>
        <div className="hero-stamp">॥<br/>ಶುಭ<br/>ವಿವಾಹ<br/>॥</div>
      </section>

      <section className="intro section" id="story"><p className="eyebrow">A union blessed by the divine</p><div className="flourish">❀</div><h2>Two souls, one sacred journey</h2><p className="body-copy">{wedding.message}</p><div className="name-pair"><div><span className="small-label">The groom</span><strong>{wedding.groom}</strong></div><span className="ampersand">&</span><div><span className="small-label">The bride</span><strong>{wedding.bride}</strong></div></div><div className="name-pair kannada-name-pair" lang="kn"><div><span className="small-label">ವರ</span><strong>{wedding.groomKannada}</strong></div><span className="ampersand">ಮತ್ತು</span><div><span className="small-label">ವಧು</span><strong>{wedding.brideKannada}</strong></div></div></section>

      <section className="countdown-section section"><p className="eyebrow">The auspicious day approaches</p><div className="section-symbol">॥ ಓಂ ॥</div><h2>Counting down to our Muhurtham</h2><Countdown/><p className="muted">We can't wait to celebrate with you</p></section>

      <section className="events-section section"><p className="eyebrow">ತಮಗೆ ಆತ್ಮೀಯ ಸ್ವಾಗತ</p><h2>Wedding ceremonies</h2><p className="body-copy">Join our families for the rituals, blessings and celebrations that make this union special.</p><div className="event-grid">{wedding.events.map((event, index) => <article className="event-card" key={event.name}><div className="event-number">0{index + 1}</div><div className="event-icon"><span>✺</span></div><h3>{event.name}</h3><p className="event-date"><CalendarDays size={15}/>{event.date}</p><p className="event-date"><Clock3 size={15}/>{event.time}</p><p className="event-place"><MapPin size={15}/>{event.place}</p><p className="event-note">{event.note}</p></article>)}</div></section>

      <section className="gallery-section section"><p className="eyebrow">Our cherished moments</p><h2>A little glimpse of our story</h2><div className="gallery">{wedding.photos.map((photo, i) => <button className={`gallery-photo photo-${i + 1}`} key={photo} onClick={() => setActivePhoto(photo)} aria-label={`Open photo ${i + 1}`}><img src={photo} alt={`Wedding gallery ${i + 1}`} loading="lazy"/></button>)}</div><p className="photo-note">Replace these sample photographs with the couple's pictures.</p></section>

      <section className="venue-section section"><div className="venue-card"><div className="venue-icon"><MapPin size={22}/></div><p className="eyebrow">Wedding venue</p><h2>{wedding.venue}</h2><p>{wedding.address}</p><p className="venue-date">{wedding.dateLabel}</p><a className="primary-button map-button" href={wedding.mapUrl} target="_blank" rel="noreferrer">Get directions <MapPin size={16}/></a></div></section>

      <section className="closing section"><div className="flourish">❀</div><p className="invocation">{wedding.invocation}</p><h2>Your presence and blessings mean the world to us</h2><p className="body-copy">May this auspicious occasion be made brighter by your presence. We look forward to celebrating with you.</p><button className="primary-button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(inviteText)}`, '_blank', 'noopener,noreferrer')}>Share invitation <Share2 size={16}/></button><p className="signature">With love, {wedding.groom} & {wedding.bride}</p></section>
      <footer><span>॥ ಶುಭಮಸ್ತು ॥</span><Heart size={13} fill="currentColor"/><span>With love and blessings</span><a className="audio-credit" href="https://commons.wikimedia.org/wiki/File:Thakil_%26_Nadaswaram_during_temple_Deeparadhana.ogg" target="_blank" rel="noreferrer">Nadaswaram & Thavil: Vis M · CC BY 4.0</a></footer>
    </main>

    <audio ref={audioRef} src={wedding.musicUrl} preload="auto" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setMusicError(true); }} />
    {opened && <button className={`floating-music ${playing ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label={playing ? 'Pause wedding music' : 'Play wedding music'} title={musicError ? 'Could not load music — tap to retry' : (playing ? 'Pause music' : 'Play music')}>{playing ? <Pause size={18}/> : <Music2 size={18}/>}<span>{musicError ? 'Retry music' : (playing ? 'Pause music' : 'Play music')}</span></button>}
    {activePhoto && <div className="lightbox" onClick={() => setActivePhoto(null)}><button aria-label="Close photo">×</button><img src={activePhoto} alt="Expanded wedding moment"/></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
