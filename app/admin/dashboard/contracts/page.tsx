"use client"

import React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2, Loader2, FileText, Search } from "lucide-react"

interface Client {
  id: string
  first_name: string
  last_name: string
}

interface Offer {
  id: string
  title: string
  company: string
}

interface Contract {
  id: string
  contract_number: string
  client_id: string
  offer_id: string | null
  type: string
  status: "active" | "pending" | "expired" | "cancelled"
  start_date: string
  end_date: string | null
  notes: string | null
  created_at: string
  clients: Client
  offers: Offer | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusConfig = {
  active: { label: "Actif", className: "bg-accent text-accent-foreground" },
  pending: { label: "En attente", className: "bg-chart-4 text-foreground" },
  expired: { label: "Expire", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "Annule", className: "bg-destructive text-destructive-foreground" },
}

export default function ContractsPage() {
  const { data: contracts, error, isLoading, mutate } = useSWR<Contract[]>("/api/admin/contracts", fetcher)
  const { data: clients } = useSWR<Client[]>("/api/admin/clients", fetcher)
  const { data: offers } = useSWR<Offer[]>("/api/admin/offers", fetcher)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    client_id: "",
    offer_id: "",
    type: "emploi",
    status: "pending",
    start_date: "",
    end_date: "",
    notes: "",
  })

  const resetForm = () => {
    setFormData({
      client_id: "",
      offer_id: "",
      type: "emploi",
      status: "pending",
      start_date: "",
      end_date: "",
      notes: "",
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch("/api/admin/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        offer_id: formData.offer_id || null,
        end_date: formData.end_date || null,
      }),
    })

    if (res.ok) {
      mutate()
      setIsCreateOpen(false)
      resetForm()
    }
    setIsSubmitting(false)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContract) return
    setIsSubmitting(true)

    const res = await fetch(`/api/admin/contracts/${selectedContract.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        offer_id: formData.offer_id || null,
        end_date: formData.end_date || null,
      }),
    })

    if (res.ok) {
      mutate()
      setIsEditOpen(false)
      setSelectedContract(null)
      resetForm()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedContract) return
    setIsSubmitting(true)

    const res = await fetch(`/api/admin/contracts/${selectedContract.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      mutate()
      setIsDeleteOpen(false)
      setSelectedContract(null)
    }
    setIsSubmitting(false)
  }

  const openEdit = (contract: Contract) => {
    setSelectedContract(contract)
    setFormData({
      client_id: contract.client_id,
      offer_id: contract.offer_id || "",
      type: contract.type,
      status: contract.status,
      start_date: contract.start_date,
      end_date: contract.end_date || "",
      notes: contract.notes || "",
    })
    setIsEditOpen(true)
  }

  const openDelete = (contract: Contract) => {
    setSelectedContract(contract)
    setIsDeleteOpen(true)
  }

  const filteredContracts = contracts?.filter(
    (contract) =>
      contract.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clients?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clients?.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contrats</h1>
          <p className="mt-1 text-muted-foreground">Gerez vos contrats clients</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Nouveau contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Creer un contrat</DialogTitle>
              <DialogDescription>Creez un nouveau contrat pour un client</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer_id">Offre (optionnel)</Label>
                <Select
                  value={formData.offer_id}
                  onValueChange={(value) => setFormData({ ...formData, offer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une offre" />
                  </SelectTrigger>
                  <SelectContent>
                    {offers?.map((offer) => (
                      <SelectItem key={offer.id} value={offer.id}>
                        {offer.title} - {offer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emploi">Emploi</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                      <SelectItem value="sejour">Sejour linguistique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="expired">Expire</SelectItem>
                      <SelectItem value="cancelled">Annule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de debut</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes supplementaires..."
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Creer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Liste des contrats
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-destructive">Erreur de chargement</p>
          ) : filteredContracts && filteredContracts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N Contrat</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date debut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-mono text-sm">{contract.contract_number}</TableCell>
                      <TableCell>
                        {contract.clients?.first_name} {contract.clients?.last_name}
                      </TableCell>
                      <TableCell className="capitalize">{contract.type}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[contract.status].className}>
                          {statusConfig[contract.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(contract.start_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(contract)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDelete(contract)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">Aucun contrat trouve</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le contrat</DialogTitle>
            <DialogDescription>Modifiez les informations du contrat</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Offre</Label>
              <Select
                value={formData.offer_id}
                onValueChange={(value) => setFormData({ ...formData, offer_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez une offre" />
                </SelectTrigger>
                <SelectContent>
                  {offers?.map((offer) => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.title} - {offer.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emploi">Emploi</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="sejour">Sejour linguistique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="expired">Expire</SelectItem>
                    <SelectItem value="cancelled">Annule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date de debut</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le contrat ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le contrat sera definitivement supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
