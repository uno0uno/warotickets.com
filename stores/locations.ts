export const useLocationsStore = defineStore('locations', () => {
  // Countries list
  const countries = ref([
    { code: 'CO', name: 'Colombia' },
    { code: 'MX', name: 'México' },
    { code: 'AR', name: 'Argentina' },
    { code: 'PE', name: 'Perú' },
    { code: 'CL', name: 'Chile' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'BR', name: 'Brasil' },
    { code: 'PA', name: 'Panamá' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'HN', name: 'Honduras' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'DO', name: 'República Dominicana' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'CU', name: 'Cuba' },
    { code: 'ES', name: 'España' },
    { code: 'US', name: 'Estados Unidos' }
  ])

  // Cities by country code
  const citiesByCountry = ref<Record<string, string[]>>({
    CO: [
      'Bogotá',
      'Medellín',
      'Cali',
      'Barranquilla',
      'Cartagena',
      'Bucaramanga',
      'Pereira',
      'Santa Marta',
      'Manizales',
      'Cúcuta',
      'Ibagué',
      'Villavicencio',
      'Pasto',
      'Montería',
      'Neiva',
      'Armenia',
      'Valledupar',
      'Popayán',
      'Sincelejo',
      'Tunja'
    ],
    MX: [
      'Ciudad de México',
      'Guadalajara',
      'Monterrey',
      'Puebla',
      'Tijuana',
      'León',
      'Cancún',
      'Mérida',
      'Querétaro',
      'San Luis Potosí'
    ],
    AR: [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'Mendoza',
      'La Plata',
      'San Miguel de Tucumán',
      'Mar del Plata',
      'Salta',
      'Santa Fe',
      'Neuquén'
    ],
    PE: [
      'Lima',
      'Arequipa',
      'Trujillo',
      'Chiclayo',
      'Cusco',
      'Piura',
      'Iquitos',
      'Huancayo',
      'Tacna',
      'Pucallpa'
    ],
    CL: [
      'Santiago',
      'Valparaíso',
      'Concepción',
      'Antofagasta',
      'Viña del Mar',
      'La Serena',
      'Temuco',
      'Rancagua',
      'Puerto Montt',
      'Iquique'
    ],
    EC: [
      'Quito',
      'Guayaquil',
      'Cuenca',
      'Santo Domingo',
      'Machala',
      'Manta',
      'Portoviejo',
      'Ambato',
      'Riobamba',
      'Loja'
    ],
    VE: [
      'Caracas',
      'Maracaibo',
      'Valencia',
      'Barquisimeto',
      'Maracay',
      'Ciudad Guayana',
      'Barcelona',
      'Maturín',
      'Cumaná',
      'Mérida'
    ],
    BR: [
      'São Paulo',
      'Rio de Janeiro',
      'Brasília',
      'Salvador',
      'Fortaleza',
      'Belo Horizonte',
      'Manaus',
      'Curitiba',
      'Recife',
      'Porto Alegre'
    ],
    PA: [
      'Ciudad de Panamá',
      'Colón',
      'David',
      'La Chorrera',
      'Santiago de Veraguas',
      'Chitré',
      'Penonomé',
      'Aguadulce'
    ],
    CR: [
      'San José',
      'Limón',
      'Alajuela',
      'Heredia',
      'Cartago',
      'Puntarenas',
      'Liberia'
    ],
    GT: [
      'Ciudad de Guatemala',
      'Mixco',
      'Villa Nueva',
      'Quetzaltenango',
      'Escuintla',
      'Petapa',
      'San Juan Sacatepéquez'
    ],
    HN: [
      'Tegucigalpa',
      'San Pedro Sula',
      'La Ceiba',
      'Choloma',
      'El Progreso',
      'Comayagua'
    ],
    SV: [
      'San Salvador',
      'Santa Ana',
      'San Miguel',
      'Mejicanos',
      'Santa Tecla',
      'Soyapango'
    ],
    NI: [
      'Managua',
      'León',
      'Masaya',
      'Matagalpa',
      'Chinandega',
      'Granada',
      'Estelí'
    ],
    BO: [
      'La Paz',
      'Santa Cruz de la Sierra',
      'Cochabamba',
      'Sucre',
      'Oruro',
      'Tarija',
      'Potosí'
    ],
    PY: [
      'Asunción',
      'Ciudad del Este',
      'San Lorenzo',
      'Luque',
      'Capiatá',
      'Lambaré',
      'Fernando de la Mora'
    ],
    UY: [
      'Montevideo',
      'Salto',
      'Ciudad de la Costa',
      'Paysandú',
      'Las Piedras',
      'Rivera',
      'Maldonado'
    ],
    DO: [
      'Santo Domingo',
      'Santiago de los Caballeros',
      'Santo Domingo Este',
      'Santo Domingo Norte',
      'San Pedro de Macorís',
      'La Romana',
      'San Cristóbal'
    ],
    PR: [
      'San Juan',
      'Bayamón',
      'Carolina',
      'Ponce',
      'Caguas',
      'Guaynabo',
      'Mayagüez'
    ],
    CU: [
      'La Habana',
      'Santiago de Cuba',
      'Camagüey',
      'Holguín',
      'Santa Clara',
      'Guantánamo',
      'Bayamo'
    ],
    ES: [
      'Madrid',
      'Barcelona',
      'Valencia',
      'Sevilla',
      'Zaragoza',
      'Málaga',
      'Murcia',
      'Palma de Mallorca',
      'Las Palmas',
      'Bilbao'
    ],
    US: [
      'Miami',
      'New York',
      'Los Angeles',
      'Houston',
      'Chicago',
      'Dallas',
      'San Francisco',
      'Orlando',
      'Atlanta',
      'Las Vegas'
    ]
  })

  // Get cities for a specific country
  function getCitiesByCountry(countryCode: string): string[] {
    return citiesByCountry.value[countryCode] || []
  }

  // Get country by code
  function getCountryByCode(code: string) {
    return countries.value.find(c => c.code === code)
  }

  // Get country by name
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
