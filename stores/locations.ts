export const useLocationsStore = defineStore('locations', () => {
  // Solo Colombia
  const countries = ref([
    { code: 'CO', name: 'Colombia' }
  ])

  // Departamentos y ciudades de Colombia
  const citiesByCountry = ref<Record<string, string[]>>({
    CO: [
      // Bogotá D.C.
      'Bogotá',
      // Antioquia
      'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Caucasia',
      // Valle del Cauca
      'Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Cartago', 'Buga', 'Jamundí',
      // Atlántico
      'Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga',
      // Bolívar
      'Cartagena', 'Magangué', 'Turbaco',
      // Santander
      'Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja',
      // Cundinamarca
      'Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Fusagasugá', 'Mosquera', 'Madrid', 'Funza',
      // Boyacá
      'Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá',
      // Caldas
      'Manizales', 'La Dorada', 'Chinchiná',
      // Risaralda
      'Pereira', 'Dosquebradas', 'Santa Rosa de Cabal',
      // Quindío
      'Armenia', 'Calarcá', 'Montenegro',
      // Tolima
      'Ibagué', 'Espinal', 'Melgar', 'Honda',
      // Huila
      'Neiva', 'Pitalito', 'Garzón',
      // Nariño
      'Pasto', 'Tumaco', 'Ipiales',
      // Norte de Santander
      'Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario',
      // Meta
      'Villavicencio', 'Acacías', 'Granada',
      // Cauca
      'Popayán', 'Santander de Quilichao',
      // Córdoba
      'Montería', 'Lorica', 'Cereté', 'Sahagún',
      // Sucre
      'Sincelejo', 'Corozal',
      // Cesar
      'Valledupar', 'Aguachica',
      // Magdalena
      'Santa Marta', 'Ciénaga', 'Fundación',
      // La Guajira
      'Riohacha', 'Maicao', 'Uribia',
      // Arauca
      'Arauca',
      // Casanare
      'Yopal',
      // Putumayo
      'Mocoa', 'Puerto Asís',
      // Caquetá
      'Florencia',
      // Amazonas
      'Leticia',
      // Vaupés
      'Mitú',
      // Guainía
      'Inírida',
      // Guaviare
      'San José del Guaviare',
      // Vichada
      'Puerto Carreño',
      // Chocó
      'Quibdó',
      // San Andrés y Providencia
      'San Andrés'
    ]
  })

  function getCitiesByCountry(countryCode: string): string[] {
    return citiesByCountry.value[countryCode] || []
  }

  function getCountryByCode(code: string) {
    return countries.value.find(c => c.code === code)
  }

  function getCountryByName(name: string) {
    return countries.value.find(c => c.name === name)
  }

  return {
    countries,
    citiesByCountry,
    getCitiesByCountry,
    getCountryByCode,
    getCountryByName
  }
})
