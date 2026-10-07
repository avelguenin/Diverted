"""The trailer's soundtrack, synthesised in the game's palette. python3 make_audio.py -> trailer.wav"""
import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; DUR=44.0; N=int(SR*DUR)
rng=np.random.default_rng(7); out=np.zeros(N)
def env(start, dur, attack=0.01, release=0.3):
    e=np.zeros(N); i0=int(start*SR); i1=min(N,int((start+dur)*SR))
    if i1<=i0: return e
    seg=np.ones(i1-i0); a=int(attack*SR); r=int(release*SR)
    if a>0: seg[:a]=np.linspace(0,1,min(a,len(seg)))
    if 0<r<len(seg): seg[-r:]*=np.linspace(1,0,r)
    e[i0:i1]=seg; return e
def brown(n):
    b=np.cumsum(rng.standard_normal(n)); b-=np.convolve(b, np.ones(2000)/2000, 'same'); return b/(np.abs(b).max()+1e-9)
def bandpass(x, fc, q=1.0):
    lo=max(20, fc/(1+1/q)); hi=min(SR/2-100, fc*(1+1/q)); b,a=butter(2,[lo/(SR/2),hi/(SR/2)],btype='band'); return lfilter(b,a,x)
def tone(start, freq, dur, vol, f1=None, release=None):
    i0=int(start*SR); i1=min(N,int((start+dur)*SR)); n=i1-i0
    if n<=0: return
    tt=np.arange(n)/SR
    if f1: f=freq*(f1/freq)**(tt/dur); ph=2*np.pi*np.cumsum(f)/SR
    else: ph=2*np.pi*freq*tt
    e=np.exp(-tt/(release or dur/3)); a=int(0.005*SR); e[:a]*=np.linspace(0,1,a)
    out[i0:i1]+=vol*np.sin(ph)*e
def thud(start, freq=90, dur=0.18, vol=0.5): tone(start, freq, dur, vol, f1=freq*0.5, release=dur/3)
def burst(start, dur, fc, vol, colour='white'):
    i0=int(start*SR); i1=min(N,int((start+dur)*SR)); n=i1-i0
    if n<=0: return
    x=rng.standard_normal(n) if colour=='white' else brown(n); x=bandpass(x, fc, 1.5)
    out[i0:i1]+=vol*x/(np.abs(x).max()+1e-9)*np.exp(-np.arange(n)/SR/(dur/3))
def hum(start, end, freq, vol):
    i0=int(start*SR); i1=int(end*SR); tt=np.arange(i1-i0)/SR
    w=np.sign(np.sin(2*np.pi*freq*tt))*0.4+np.sin(2*np.pi*freq*tt)*0.6
    out[i0:i1]+=vol*w*env(start, end-start, 0.6, 0.6)[i0:i1]
def noisebed(start, end, fc, vol, colour='brown', lfo=0.0):
    i0=int(start*SR); i1=int(end*SR); n=i1-i0
    x=brown(n) if colour=='brown' else rng.standard_normal(n); x=bandpass(x, fc, 0.8); x=x/(np.abs(x).max()+1e-9)
    tt=np.arange(n)/SR; mod=1+lfo*np.sin(2*np.pi*0.2*tt)
    out[i0:i1]+=vol*x*env(start, end-start, 0.8, 0.8)[i0:i1]*mod
def clang(start, vol=0.4):
    burst(start, 0.03, 5600, vol*1.3); burst(start+0.004, 0.09, 2200, vol*0.9); thud(start, 110, 0.12, vol)
    for k,r_ in enumerate([1,1.47,2.09,3.3]): tone(start, 1400*r_, 0.35-k*0.05, vol*0.3/(1+k), release=0.12)
def bell(start, f, vol=0.12, dur=5.0):
    for k,r_ in enumerate([1,2.0,2.4,3.0,4.2,5.4]): tone(start, f*r_*(1+(rng.random()-0.5)*0.006), dur*(1-k*0.1), vol/(1+k*1.3), release=dur*(1-k*0.1)/3)
    burst(start, 0.06, 2400, vol*0.4, 'brown')
def chains(start, n=6, vol=0.12):
    t=start
    for k in range(n):
        burst(t, 0.012, 6000+rng.random()*2500, vol*(1-k/(n+1))); t+=0.025+rng.random()*0.05
def tick(start, vol=0.06): burst(start, 0.008, 2000, vol)
# 0–6.5 the board: fluorescent hum, the flaps, the chime as the title rises
hum(0, 6.6, 50, 0.05); hum(0, 6.6, 100, 0.02)
tick(1.2, 0.08)
for k in range(14): burst(3.2+k*0.08, 0.015, 2400, 0.25)
tone(5.35, 660, 0.35, 0.14); tone(5.7, 880, 0.8, 0.16)
# 6.5–12 the cabin: engine, cabin air, the seatbelt chime, a second one later
hum(6.5, 12.1, 55, 0.08); noisebed(6.5, 12.1, 220, 0.22)
tone(6.9, 880, 0.5, 0.15); tone(10.2, 880, 0.5, 0.12)
# 12–15.5 arrivals: fluorescent buzz, a hall, the tube above the counter ticking
hum(12.0, 15.6, 50, 0.07); hum(12.0, 15.6, 100, 0.03); noisebed(12.0, 15.6, 900, 0.05, 'white')
tick(12.9); tick(14.1); tick(14.25); tick(15.2)
# 15.5–22.5 the stand: wind, diesel idle, rain, the phone buzzing twice when the text arrives
noisebed(15.5, 22.6, 380, 0.3, 'brown', lfo=0.6); hum(15.5, 22.6, 32, 0.08); noisebed(15.5, 22.6, 5000, 0.03, 'white')
for k in range(2): burst(19.6+k*0.13, 0.07, 180, 0.35, 'brown')
# 22.5–28 the room: heating, the dread drone coming up, a heartbeat, the buzz, five knocks
hum(22.5, 28.1, 60, 0.03)
i0=int(22.5*SR); i1=int(34.2*SR); tt=np.arange(i1-i0)/SR
out[i0:i1]+=0.10*(np.sin(2*np.pi*38*tt)+0.6*np.sin(2*np.pi*38.7*tt))*np.linspace(0.15,1,i1-i0)
for k in range(2): burst(24.0+k*0.13, 0.07, 180, 0.3, 'brown')
for k in range(5): thud(25.7+k*0.55, 120, 0.14, 0.45); burst(25.7+k*0.55, 0.05, 900, 0.2)
bpm=66; tb=22.5
while tb<34.0:
    thud(tb, 62, 0.12, 0.22); thud(tb+0.17, 52, 0.11, 0.15); tb+=60/bpm; bpm=min(100, bpm+1.0)
# 28–34 the phone dies: a tone falling, a click, then the bar on the rail, the chains, two bells
tone(28.95, 1800, 0.9, 0.12, f1=40, release=0.35); burst(29.9, 0.02, 1200, 0.3)
bell(29.3, 73.4)
clang(30.6); chains(30.63, 7); clang(30.74, 0.3)
clang(31.7); chains(31.73, 5, 0.1)
bell(31.4, 103.8, 0.1)
clang(32.6, 0.45); chains(32.63, 8, 0.14); clang(32.72, 0.3); clang(32.84, 0.25)
bell(33.2, 77.8, 0.09)
# 34–38.5 the springs: water and air, the drone thinning, a warm third that swells and does not resolve, the heartbeat slowing to a stop
noisebed(34.0, 38.6, 700, 0.12, 'white', lfo=0.5); noisebed(34.0, 38.6, 180, 0.14, 'brown', lfo=0.3)
i0=int(34.0*SR); i1=int(38.6*SR); tt=np.arange(i1-i0)/SR; sw=np.sin(np.pi*tt/4.6)**2
out[i0:i1]+=0.07*(np.sin(2*np.pi*110*tt)+0.8*np.sin(2*np.pi*138.6*tt)+0.3*np.sin(2*np.pi*220*tt))*sw
out[i0:i1]+=0.05*(np.sin(2*np.pi*38*tt)+0.6*np.sin(2*np.pi*38.7*tt))*np.linspace(1,0.3,i1-i0)
bpm=78; tb=34.0
while tb<37.6 and bpm>44:
    thud(tb, 62, 0.12, 0.2); thud(tb+0.17, 52, 0.11, 0.13); tb+=60/bpm; bpm-=4.5
# 38.5–44 the title: the flaps, a low thud, a dying 55 Hz, the drone fading under the fade
for k in range(8): burst(38.5+k*0.03, 0.015, 2400, 0.22)
thud(38.55, 70, 0.9, 0.3); tone(38.65, 55, 3.0, 0.08)
fade=np.ones(N); i0=int(42.4*SR); fade[i0:]=np.linspace(1,0,N-i0)
y=np.tanh(out*1.6)*0.9*fade
with wave.open('trailer.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([y,y],axis=1)*32767).astype(np.int16).tobytes())
print('wav ok, peak', round(float(np.abs(y).max()),3))
