# EcoBocado Frontend

Plataforma colaborativa para la reducción del desperdicio de alimentos y el apoyo a comunidades vulnerables.

## ⚠️ Estado del Proyecto: Backend en Construcción

> [!IMPORTANT]
> Actualmente, gran parte de la funcionalidad y los datos que se muestran en la interfaz son **placeholders** (marcadores de posición) o datos estáticos (mock data). El **backend del proyecto se encuentra en fase de desarrollo**, por lo que la interacción con servidores reales es limitada o inexistente en esta etapa.

## 🏗️ Estructura del Proyecto

El proyecto está organizado siguiendo una arquitectura modular basada en características (features), lo que facilita la escalabilidad y el mantenimiento:

### `/src`
- **`/assets`**: Recursos estáticos como imágenes, iconos y estilos globales.
- **`/components`**: Componentes de interfaz de usuario reutilizables (Botones, Inputs, Layouts, etc.).
- **`/config`**: Archivos de configuración de la aplicación (variables de entorno, constantes).
- **`/contexts`**: Manejo del estado global mediante React Context (Autenticación, preferencias, etc.).
- **`/features`**: Contiene la lógica principal dividida por módulos funcionales:
    - **`auth`**: Gestión de inicio de sesión, registro y recuperación de cuenta.
    - **`donor`**: Interfaz y lógica para donantes (publicaciones, dashboard de impacto).
    - **`receptor`**: Interfaz y lógica para receptores (exploración de alimentos, solicitudes).
    - **`landing`**: Página de inicio informativa y secciones públicas.

## 🚀 Tecnologías Principales

- **React** + **Vite**: Para un desarrollo rápido y eficiente.
- **Tailwind CSS**: Para un diseño moderno y responsive.
- **Lucide React**: Biblioteca de iconos.

## 🛠️ Instalación y Desarrollo

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
