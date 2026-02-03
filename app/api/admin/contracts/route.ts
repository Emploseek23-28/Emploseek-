import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.user_metadata?.is_admin) {
    return null
  }
  return supabase
}

function generateContractNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0")
  return `CTR-${year}-${random}`
}

export async function GET() {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("contracts")
    .select(`
      *,
      clients (
        id,
        first_name,
        last_name
      ),
      offers (
        id,
        title,
        company
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      contract_number: generateContractNumber(),
      client_id: body.client_id,
      offer_id: body.offer_id,
      type: body.type,
      status: body.status,
      start_date: body.start_date,
      end_date: body.end_date,
      notes: body.notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
