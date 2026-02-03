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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from("contracts")
    .update({
      client_id: body.client_id,
      offer_id: body.offer_id,
      type: body.type,
      status: body.status,
      start_date: body.start_date,
      end_date: body.end_date,
      notes: body.notes || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase.from("contracts").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
