import type { Ad } from "@/types/types"
import { initialCategories } from "@/data/categories"
import { countries as countriesData } from "@/data/countries"

// توليد 10 إعلانات لكل تصنيف مع إعطاء أولوية VIP لأول إعلانين
const ADS_PER_CATEGORY = 10

function pickCountryCity(i: number) {
  const countryIdx = i % countriesData.length
  const country = countriesData[countryIdx]
  const city = country.cities[i % country.cities.length]
  return {
    countryAr: country.ar,
    cityAr: city.ar,
  }
}

function phoneFor(i: number) {
  // رقم بسيط للاختبار
  return `+9665${String(10000000 + i).slice(0, 8)}`
}

export const initialAds: Ad[] = initialCategories.flatMap((cat, cIdx) => {
  const ads: Ad[] = []
  for (let i = 0; i < ADS_PER_CATEGORY; i++) {
    const idx = cIdx * ADS_PER_CATEGORY + i
    const loc = pickCountryCity(idx)
    const isVip = i < 2 // أول اثنين VIP
    const ad: Ad = {
      id: `${cat.slug}-${i + 1}`,
      companyName: `${cat.nameAr} ${i + 1}`,
      description: `شركة ${cat.nameAr} رقم ${i + 1} — معلومات وصف مختصر للخدمات المقدّمة.`,
      category: cat.slug,
      country: loc.countryAr,
      city: loc.cityAr,
      image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(cat.nameEn + " cover")}`,
      logo: `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(cat.nameEn + " logo")}`,
      isVip,
      phone: phoneFor(idx),
      whatsapp: phoneFor(idx),
      website: "https://example.com",
      email: `contact+${cat.slug}${i + 1}@example.com`,
      ownerEmail: `owner+${cat.slug}${i + 1}@example.com`,
      status: "approved", // الإعلانات الأولية معتمدة
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // خلال آخر 30 يوم
      reviewedAt: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: "admin@adwell.io",
    }
    ads.push(ad)
  }
  return ads
})
