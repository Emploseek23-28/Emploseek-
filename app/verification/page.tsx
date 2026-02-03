"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  FileCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  User,
  Building2,
  Calendar,
  FileText,
  ShieldCheck
} from "lucide-react"

interface ContractResult {
  id: string
  contract_number: string
  status: "active" | "pending" | "expired" | "cancelled"
  start_date: string
  end_date: string | null
  type: string
  client: {
    first_name: string
    last_name: string
    email: string
  }
  offer: {
    title: string
    company: string
    type: string
  } | null
}

const statusConfig = {
  active: { label: "Actif", className: "bg-accent text-accent-foreground", icon: CheckCircle2 },
  pending: { label: "En attente", className: "bg-chart-4 text-foreground", icon: Loader2 },
  expired: { label: "Expire", className: "bg-muted text-muted-foreground", icon: XCircle },
  cancelled: { label: "Annule", className: "bg-destructive text-destructive-foreground", icon: XCircle },
}

export default function VerificationPage() {
  const [contractNumber, setContractNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ContractResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)
    setSearched(true)

    try {
      const response = await fetch(
        `/api/verify?contract_number=${encodeURIComponent(contractNumber)}&email=${encodeURIComponent(email)}`
      )
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue")
      } else {
        setResult(data)
      }
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Verification de contrat</h1>
            <p className="mt-3 text-muted-foreground">
              Verifiez l'authenticite et le statut de votre contrat EmploSeek
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Rechercher votre contrat
              </CardTitle>
              <CardDescription>
                Entrez votre numero de contrat et l'email associe pour verifier son statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract_number">Numero de contrat</Label>
                  <Input
                    id="contract_number"
                    placeholder="Ex: CTR-2024-001234"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email du client</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verification en cours...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verifier le contrat
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && !isLoading && (
            <>
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Contrat non trouve</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <Card className="border-primary/20">
                  <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                          Contrat verifie
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {result.contract_number}
                        </CardDescription>
                      </div>
                      <Badge className={statusConfig[result.status].className}>
                        {statusConfig[result.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User className="mt-0.5 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Client</p>
                            <p className="text-sm text-muted-foreground">
                              {result.client.first_name} {result.client.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{result.client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="mt-0.5 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Type de contrat</p>
                            <p className="text-sm text-muted-foreground capitalize">{result.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {result.offer && (
                          <div className="flex items-start gap-3">
                            <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Offre</p>
                              <p className="text-sm text-muted-foreground">{result.offer.title}</p>
                              <p className="text-sm text-muted-foreground">{result.offer.company}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Periode</p>
                            <p className="text-sm text-muted-foreground">
                              Debut: {formatDate(result.start_date)}
                            </p>
                            {result.end_date && (
                              <p className="text-sm text-muted-foreground">
                                Fin: {formatDate(result.end_date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
