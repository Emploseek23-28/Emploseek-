import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, FolderOpen, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [clientsResult, contractsResult, offersResult] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact" }),
    supabase.from("contracts").select("id", { count: "exact" }),
    supabase.from("offers").select("id", { count: "exact" }),
  ])

  const stats = [
    {
      title: "Clients",
      value: clientsResult.count || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Contrats",
      value: contractsResult.count || 0,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Offres",
      value: offersResult.count || 0,
      icon: FolderOpen,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  const { data: recentContracts } = await supabase
    .from("contracts")
    .select(`
      id,
      contract_number,
      status,
      created_at,
      clients (
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">
          Vue d'ensemble de votre activite EmploSeek
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contrats recents</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContracts && recentContracts.length > 0 ? (
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{contract.contract_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.clients?.first_name} {contract.clients?.last_name}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      contract.status === "active"
                        ? "bg-accent/10 text-accent"
                        : contract.status === "pending"
                          ? "bg-chart-4/10 text-chart-4"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {contract.status === "active"
                      ? "Actif"
                      : contract.status === "pending"
                        ? "En attente"
                        : contract.status === "expired"
                          ? "Expire"
                          : "Annule"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun contrat pour le moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
