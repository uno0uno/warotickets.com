export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Determinar la URL de la API según el entorno
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.warotickets.com'
    : (config.public.apiBaseUrl || 'http://localhost:8888')

  const siteUrl = config.public.siteUrl || 'https://warotickets.com'
  const today = new Date().toISOString().split('T')[0]

  // URLs dinámicas de eventos públicos
  let eventUrls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = []
  let latestEventDate = today

  try {
    // Obtener eventos públicos activos (máximo 100 por limitación de API)
    const events = await $fetch<Array<{ id: number; slug_cluster: string; start_date: string | null }>>(`${apiUrl}/public/events`, {
      query: { limit: 100 }
    })

    if (events && events.length > 0) {
      // Obtener la fecha más reciente de todos los eventos
      const dates = events
        .filter(e => e.start_date)
        .map(e => new Date(e.start_date!))
      if (dates.length > 0) {
        latestEventDate = new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0]
      }

      eventUrls = events.map(event => ({
        loc: `/eventos/${event.slug_cluster}`,
        lastmod: event.start_date?.split('T')[0] || today,
        changefreq: 'weekly',
        priority: '0.8'
      }))
    }
  } catch (error) {
    console.error('Error fetching events for sitemap:', error)
  }

  // URLs base (home es estática, eventos es dinámica basada en el último evento)
  const baseUrls = [
    { loc: '/', lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: '/eventos', lastmod: latestEventDate, changefreq: 'daily', priority: '0.9' }
  ]

  // Combinar todas las URLs
  const allUrls = [...baseUrls, ...eventUrls]

  // Generar XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${siteUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Establecer headers y devolver XML
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=3600')

  return xml
})
