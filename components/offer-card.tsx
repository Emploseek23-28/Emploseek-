import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Building2, ArrowRight } from "lucide-react"

export type OfferType = "emploi" | "stage" | "sejour"

interface OfferCardProps {
  id: string
  title: string
  company: string
  location: string
  type: OfferType
  duration?: string
  description: string
  postedAt: string
}

const typeConfig: Record<OfferType, { label: string; className: string }> = {
  emploi: { label: "Emploi", className: "bg-primary text-primary-foreground" },
  stage: { label: "Stage", className: "bg-accent text-accent-foreground" },
  sejour: { label: "Sejour linguistique", className: "bg-chart-3 text-card" },
}

export function OfferCard({
  title,
  company,
  location,
  type,
  duration,
  description,
  postedAt,
}: OfferCardProps) {
  const config = typeConfig[type]

  return (
    <Card className="group flex flex-col transition-all duration-200 hover:shadow-lg hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {company}
            </div>
          </div>
          <Badge className={config.className}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </span>
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">{postedAt}</span>
        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10">
          Voir l'offre
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
