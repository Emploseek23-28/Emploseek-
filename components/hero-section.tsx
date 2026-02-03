import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, GraduationCap, Globe } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-card py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Trouvez votre prochaine{" "}
            <span className="text-primary">opportunite</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            EmploSeek vous accompagne dans votre recherche de contrats de travail, 
            de stages et de sejours linguistiques. Verifiez vos contrats en toute securite.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une offre..."
                className="h-12 pl-10 pr-4 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Rechercher
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <Link
              href="#offres"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              Offres d'emploi
            </Link>
            <Link
              href="#stages"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              Stages
            </Link>
            <Link
              href="#sejours"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-chart-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10">
                <Globe className="h-5 w-5 text-chart-3" />
              </div>
              Sejours linguistiques
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
