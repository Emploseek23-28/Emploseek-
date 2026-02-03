"use client"

import { OfferCard, type OfferType } from "@/components/offer-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, GraduationCap, Globe } from "lucide-react"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

interface Offer {
  id: string
  title: string
  company: string
  location: string
  type: OfferType
  duration: string | null
  description: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return "Aujourd'hui"
  if (diffInDays === 1) return "Hier"
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
}

function OffersSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-12 w-full" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

function OffersGrid({ offers, type }: { offers: Offer[]; type?: OfferType }) {
  const filteredOffers = type ? offers.filter((o) => o.type === type) : offers

  if (filteredOffers.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Aucune offre disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredOffers.map((offer) => (
        <OfferCard
          key={offer.id}
          id={offer.id}
          title={offer.title}
          company={offer.company}
          location={offer.location}
          type={offer.type}
          duration={offer.duration || undefined}
          description={offer.description}
          postedAt={formatDate(offer.created_at)}
        />
      ))}
    </div>
  )
}

export function OffersSection() {
  const { data: offers, error, isLoading } = useSWR<Offer[]>("/api/offers", fetcher)

  return (
    <section id="offres" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">Nos opportunites</h2>
          <p className="mt-3 text-muted-foreground">
            Decouvrez toutes nos offres d'emploi, stages et sejours linguistiques
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="emploi" className="gap-1">
              <Briefcase className="h-4 w-4 hidden sm:block" />
              Emploi
            </TabsTrigger>
            <TabsTrigger value="stage" className="gap-1">
              <GraduationCap className="h-4 w-4 hidden sm:block" />
              Stage
            </TabsTrigger>
            <TabsTrigger value="sejour" className="gap-1">
              <Globe className="h-4 w-4 hidden sm:block" />
              Sejour
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <OffersSkeleton />
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-destructive">Erreur lors du chargement des offres.</p>
            </div>
          ) : (
            <>
              <TabsContent value="all">
                <OffersGrid offers={offers || []} />
              </TabsContent>
              <TabsContent value="emploi" id="emplois">
                <OffersGrid offers={offers || []} type="emploi" />
              </TabsContent>
              <TabsContent value="stage" id="stages">
                <OffersGrid offers={offers || []} type="stage" />
              </TabsContent>
              <TabsContent value="sejour" id="sejours">
                <OffersGrid offers={offers || []} type="sejour" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </section>
  )
}
