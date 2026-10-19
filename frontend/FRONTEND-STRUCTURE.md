Gyökérkönyvtár (frontend/)
--------------------------

- **app/**: A frontend alkalmazás teljes forráskódjának tárolója.

- **public/**: Közvetlenül, feldolgozás (build) nélkül kiszolgált statikus fájlok.

- **.nuxt/**: A Nuxt által automatikusan generált build fájlok és típusok, nem verziókövetett mappa.

- **nuxt.config.ts**: A Nuxt keretrendszer fő konfigurációs fájlja, amely tartalmazza a modulokat és az auto-import szabályokat.

- **tailwind.config.ts**: A TailwindCSS keretrendszer konfigurációja a design tokenekhez és a stílusokhoz.

- **eslint.config.mjs / .prettierrc**: Kódformázási és szintaktikai (linting) szabályok definíciói.

- **tsconfig.json**: A TypeScript fordító projekt-szintű beállításai.

- **package.json / package-lock.json**: A projekt függőségei és az npm futtatási szkriptek.

- **.env**: A környezeti változók helyi, titkosított tárolója.

Forráskód (app/ könyvtár)
-------------------------

- **assets/**: Fordításra kerülő statikus erőforrások, elsősorban a CSS fájlok (pl. main.css, a design tokenek és a segédosztályok).

- **components/**: A Vue komponensek tárolója, amely funkciók szerinti (feature-based) felosztást alkalmaz:

  - base/: Újrafelhasználható, alap UI elemek (gombok, inputok, alapmodálok).

  - shared/: Több különböző oldalon használt komplex elemek (headerek, térkép).

  - auth/, events/, groups/, stb.: Adott funkcióhoz tartozó specifikus nézetek (views/) és az oldalak modáljai (modals/).

- **composables/**: Globálisan auto-importált Vue kompozíciós függvények (pl. autentikáció vagy ablakméret kezelés).

- **layouts/**: Globális elrendezési sablonok, amelyekbe a specifikus oldaltartalmak renderelődnek.

- **locales/**: A többnyelvűségért (i18n) és a kiszervezett statikus szövegekért felelős szótárfájlok.

- **middleware/**: Útválasztási köztesrétegek az oldalakhoz való hozzáférés szabályozására.

- **pages/**: A Nuxt fájlrendszer-alapú útválasztója által kezelt nézetek, amelyekből az alkalmazás URL struktúrája generálódik.

- **queries/**: Adatbázis-műveletek kliensoldali API hívásainak (lekérdezések és mutációk) definíciói.

- **services/**: Az API végpontokkal közvetlenül kommunikáló szolgáltatásréteg.

- **stores/**: Pinia alapú globális állapotkezelők a megosztott adatok (pl. modálok láthatósága) kezelésére.

- **types/**: TypeScript interfészek és statikus típusdefiníciók.

- **utils/**: Globális segédfüggvények, Zod validációs sémák és globális konstansok.

- **app.config.ts**: Futásidejű, alkalmazásszintű konfigurációk tárolója.

- **app.vue**: A Vue alkalmazás fő gyökérkomponense.
