# Wizualizator Siatek Graniastosłupów Prostych 3D

Interaktywna aplikacja internetowa renderująca trójwymiarowe modele i animacje składania oraz rozkładania siatek graniastosłupów prostych w czasie rzeczywistym.

Zaprojektowana jako nowoczesne narzędzie edukacyjne ułatwiające zrozumienie przejścia między dwuwymiarową siatką (2D) a gotową bryłą przestrzenną (3D).

---

## 🚀 Technologie

- **Framework:** React 18 + TypeScript 5.7
- **Grafika 3D:** Three.js, @react-three/fiber, @react-three/drei
- **Stylizacja:** Tailwind CSS 3.4
- **Narzędzie budujące:** Vite 6
- **Testy:** Vitest + React Testing Library + jsdom

---

## 📐 Obsługiwane Bryły

1. **Graniastosłup trójkątny** (podstawa: trójkąt równoboczny, 3 ściany boczne)
2. **Graniastosłup czworokątny** (podstawa: kwadrat, 4 ściany boczne)
3. **Graniastosłup pięciokątny** (podstawa: pięciokąt foremny, 5 ścian bocznych)
4. **Graniastosłup sześciokątny** (podstawa: sześciokąt foremny, 6 ścian bocznych)

Dla każdej bryły automatycznie wyliczana jest charakterystyka topologiczna Eulera ($V - E + F = 2$), pole podstawy ($P_p$), pole boczne ($P_b$), pole całkowite ($P_c$) oraz objętość ($V$).

---

## ⌨️ Skróty Klawiszowe

- <kbd>Spacja</kbd> – Odtwarzanie / Wstrzymanie płynnej animacji składania
- <kbd>←</kbd> / <kbd>→</kbd> – Krokowy obrót ścian (±1%)
- <kbd>R</kbd> – Reset widoku kamery do pozycji domyślnej

---

## 🖱️ Sterowanie Myszą i Dotykiem

- **Obrót bryły (Rotate):** Lewy przycisk myszy (LPM) + przeciąganie / przeciąganie jednym palcem
- **Przesuwanie (Pan):** Prawy przycisk myszy (PPM) lub LPM z klawiszem <kbd>Shift</kbd> / przeciąganie dwoma palcami
- **Przybliżanie / Oddalanie (Zoom):** Kółko myszy (scroll) / gest uszczypnięcia (pinch-to-zoom)

---

## 📦 Uruchomienie Projektu

### Wymagania wstępne
- Node.js $\ge 20$ LTS
- npm $\ge 10$

### Instalacja i start w trybie deweloperskim
```bash
# 1. Instalacja zależności
npm install

# 2. Uruchomienie lokalnego serwera Vite
npm run dev
```
Aplikacja będzie dostępna pod adresem: `http://localhost:5173/`

### Uruchomienie testów
```bash
npm run test:run
```

### Budowanie wersji produkcyjnej
```bash
npm run build
npm run preview
```

---

## 📂 Struktura Projektu

```text
src/
├── components/
│   ├── 3D/             # Komponenty Three.js (SceneContainer, PrismNet, PolygonFace, HingeGroup)
│   └── UI/             # Komponenty interfejsu (Header, PrismSelector, FoldSlider, PrismInfo, ViewSettings)
├── hooks/              # Custom hooki (usePrismState)
├── math/               # Kinematyka, geometria, wyliczanie wierzchołków i metryk
├── styles/             # Style Tailwind CSS
└── types/              # Definicje typów TypeScript
```
