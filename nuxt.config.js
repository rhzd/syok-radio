export default {
  // target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "SYOK",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Everything Got!" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    "@nuxtjs/fontawesome",
    "@nuxtjs/google-fonts"
    // '@nuxtjs/google-analytics'
  ],
  // googleAnalytics: {
  //   id: process.env.GOOGLE_ANALYTICS_ID, // Use as fallback if no runtime config is provided
  // },
  fontawesome: {
    icons: {
      solid: [
        "faPlay",
        "faStop",
        "faVolumeDown",
        "faVolumeMute",
        "faShareSquare",
        "faTimes",
        "faCode",
        "faThLarge",
        "faBars",
        "faChevronUp",
        "faChevronDown",
        "faLink",
        "faSearch"
      ],
      brands: ["faWhatsapp", "faTwitter", "faFacebookF"]
    }
  },
  googleFonts: {
    families: {
      Poppins: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    },
    display: "swap",
    download: true,
    overwriting: false
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    }
  },
  publicRuntimeConfig: {
    syokURL: process.env.SYOK_URL,
    baseURL: process.env.BASE_URL,
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  privateRuntimeConfig: {
    JWTRadioStream: process.env.JWT_RADIO_STREAM,
    OIDRadioStream: process.env.OID_RADIO_STREAM,
    syokUsername: process.env.SYOK_USERNAME,
    syokPassword: process.env.SYOK_PASSWORD
  },
  serverMiddleware: [
    { path: "/api", handler: "~/server-middleware/radioAuth.js" }
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
