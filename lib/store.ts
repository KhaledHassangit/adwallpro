import { initialAds } from "@/data/ads"
import { initialCategories } from "@/data/categories"
import type { Ad, Coupon, User, Category, AdStatus } from "@/types/types"

let adsStore: Ad[] = [...initialAds]
let couponsStore: Coupon[] = [{ code: "WELCOME10", percent: 10, active: true }]
let usersStore: User[] = [{ id: "admin1", email: "admin@adwell.io", role: "admin", name: "Admin" }]
let categoriesStore: Category[] = [...initialCategories]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/* Ads */
export function getAllAds() {
  return adsStore
}

export function getApprovedAds() {
  return adsStore.filter((a) => a.status === "approved")
}

export function getPendingAds() {
  return adsStore.filter((a) => a.status === "pending")
}

export function getRejectedAds() {
  return adsStore.filter((a) => a.status === "rejected")
}

export function getAdById(id: string) {
  return adsStore.find((a) => a.id === id) || null
}

export function getAdsByCategory(slug: string) {
  return adsStore
    .filter((a) => a.category === slug && a.status === "approved")
    .sort((a, b) => (a.isVip === b.isVip ? 0 : a.isVip ? -1 : 1))
}

export function getAdsByOwner(ownerEmail: string) {
  return adsStore.filter((a) => a.ownerEmail?.toLowerCase() === ownerEmail.toLowerCase())
}

export function addAd(ad: Omit<Ad, "id" | "status" | "submittedAt">) {
  const newAd: Ad = {
    ...ad,
    id: uid(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  }
  adsStore = [newAd, ...adsStore]

  if (ad.ownerEmail) {
    const exists = usersStore.find((u) => u.email.toLowerCase() === ad.ownerEmail!.toLowerCase())
    if (!exists) {
      usersStore = [
        { id: uid(), email: ad.ownerEmail, role: "advertiser", phone: ad.phone, name: ad.companyName },
        ...usersStore,
      ]
    } else {
      if (!exists.phone) exists.phone = ad.phone
      if (!exists.name) exists.name = ad.companyName
    }
  }
  return newAd
}

export function updateAd(adId: string, data: Partial<Ad>) {
  adsStore = adsStore.map((a) => (a.id === adId ? { ...a, ...data } : a))
  return adsStore.find((a) => a.id === adId) || null
}

export function deleteAd(adId: string) {
  adsStore = adsStore.filter((a) => a.id !== adId)
}

export function approveAd(adId: string, reviewedBy: string) {
  adsStore = adsStore.map((a) =>
    a.id === adId
      ? {
          ...a,
          status: "approved" as AdStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy,
        }
      : a,
  )
  return adsStore.find((a) => a.id === adId) || null
}

export function rejectAd(adId: string, reviewedBy: string, rejectionReason: string) {
  adsStore = adsStore.map((a) =>
    a.id === adId
      ? {
          ...a,
          status: "rejected" as AdStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy,
          rejectionReason,
        }
      : a,
  )
  return adsStore.find((a) => a.id === adId) || null
}

export function setVip(adId: string, isVip: boolean) {
  adsStore = adsStore.map((a) => (a.id === adId ? { ...a, isVip } : a))
  return adsStore.find((a) => a.id === adId) || null
}

/* Users */
export function getUsers() {
  return usersStore
}
export function updateUser(userId: string, data: Partial<User>) {
  usersStore = usersStore.map((u) => (u.id === userId ? { ...u, ...data } : u))
  return usersStore.find((u) => u.id === userId) || null
}
export function deleteUser(userId: string) {
  const user = usersStore.find((u) => u.id === userId)
  if (user) {
    adsStore = adsStore.filter((a) => a.ownerEmail?.toLowerCase() !== user.email.toLowerCase())
  }
  usersStore = usersStore.filter((u) => u.id !== userId)
}

/* Coupons */
export function getCoupons() {
  return couponsStore
}
export function createCoupon(code: string, percent: number) {
  const existing = couponsStore.find((c) => c.code.toLowerCase() === code.toLowerCase())
  if (existing) return existing
  const coupon: Coupon = { code, percent, active: true }
  couponsStore = [coupon, ...couponsStore]
  return coupon
}
export function toggleCoupon(code: string, active: boolean) {
  couponsStore = couponsStore.map((c) => (c.code.toLowerCase() === code.toLowerCase() ? { ...c, active } : c))
  return couponsStore.find((c) => c.code.toLowerCase() === code.toLowerCase())!
}
export function findCoupon(code?: string | null) {
  if (!code) return null
  return couponsStore.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.active) ?? null
}

/* Categories */
export function getCategories() {
  return categoriesStore
}
export function addCategory(cat: Category) {
  const exists = categoriesStore.some((c) => c.slug === cat.slug)
  if (exists) return getCategories()
  categoriesStore = [cat, ...categoriesStore]
  return categoriesStore
}
export function updateCategory(slug: string, data: Partial<Category>) {
  categoriesStore = categoriesStore.map((c) => (c.slug === slug ? { ...c, ...data } : c))
  return categoriesStore.find((c) => c.slug === slug) || null
}

/* Utils */
export function makeId() {
  return uid()
}
