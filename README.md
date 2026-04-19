# 🤝 MiGestor — Tu gestor personal siempre disponible

Aplicación web para gestionar reclamaciones, citas médicas, ayudas a domicilio y trámites del día a día.

---

## 🚀 Cómo publicarlo en Vercel (paso a paso)

### Paso 1 — Consigue tu clave de Anthropic (gratis para empezar)
1. Ve a https://console.anthropic.com y crea una cuenta gratuita
2. En el menú lateral haz clic en **"API Keys"**
3. Pulsa **"Create Key"** y copia la clave (empieza por `sk-ant-...`)
4. Guárdala en un lugar seguro — la necesitarás en el Paso 3

### Paso 2 — Sube el código a GitHub
1. Ve a https://github.com y crea una cuenta si no tienes
2. Haz clic en **"New repository"** (botón verde)
3. Nombre: `migestor` · Público o Privado (ambos funcionan)
4. Haz clic en **"Create repository"**
5. En la página del repositorio vacío, haz clic en **"uploading an existing file"**
6. Arrastra TODOS los archivos de esta carpeta y pulsa **"Commit changes"**

### Paso 3 — Despliega en Vercel
1. Ve a https://vercel.com y crea una cuenta (gratis) con tu cuenta de GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio `migestor` que acabas de crear
4. En **"Environment Variables"** añade:
   - Nombre: `ANTHROPIC_API_KEY`
   - Valor: la clave que copiaste en el Paso 1
5. Pulsa **"Deploy"** y espera 2 minutos

✅ ¡Listo! Vercel te dará un enlace tipo `migestor.vercel.app`

---

## 📁 Estructura del proyecto

```
migestor/
├── src/
│   ├── main.jsx        # Punto de entrada React
│   └── App.jsx         # App principal
├── api/
│   └── chat.js         # Backend seguro (guarda la API key)
├── public/
│   └── favicon.svg     # Icono de la app
├── index.html          # HTML base
├── package.json        # Dependencias
├── vite.config.js      # Configuración del bundler
├── vercel.json         # Configuración de Vercel
└── .gitignore
```

---

## 🛠️ Para desarrollo local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo "ANTHROPIC_API_KEY=sk-ant-TU_CLAVE_AQUI" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

Abre http://localhost:5173 en tu navegador.

---

## 💡 Próximos pasos recomendados

- [ ] Añadir dominio personalizado (ej: migestor.es) — desde el panel de Vercel
- [ ] Añadir Google Analytics para ver visitas
- [ ] Añadir sistema de registro de usuarios
- [ ] Historial de gestiones por usuario
- [ ] Modo accesibilidad (letra grande para personas mayores)
